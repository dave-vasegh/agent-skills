---
name: code-brief
description: Use when the user asks for a well-articulated prompt, brief or spec for Claude Code, or wants Claude Code to build, fix, refactor or review something and needs the instructions written first. Also triggered by /code-brief. Interviews the user to surface assumptions, records intent as a versioned markdown file in the repo with a STRIDE threat model, checks available tools, then either carries out the brief in the current session or returns it as one copy-ready Claude Code prompt, as the user chooses. Not for questions about how Claude Code works, or how to install or configure it.
---

# Code Brief

Turns a rough request into two outputs: an intent record that is committed to the repo, and a Claude Code brief built from it. The user then chooses how the brief is delivered: **Run now** (carry it out in this session) or **Copy** (return it as a single code block to paste or edit). No code is written or changed until the user chooses Run now.

## Principles

- Never invent facts. Verify with the available tools first, and ask only for what can't be checked.
- Facts that change over time (versions, API schemas, prices, quotas, service limits) must be looked up and cited before an assumption that depends on them is finalised. Don't rely on memory for them.
- Surface every assumption explicitly and let the user confirm, change or reject it.
- Never refer to an assumption by ID alone. Whenever you ask the user to confirm, change or reject assumptions, restate each one in that same message. Assumptions that have not been confirmed by the user (in your thinking, in tool calls, in files or in earlier turns) do not count as shown.
- Ambiguity is resolved by asking, not by choosing a default silently.
- The user can override any default. Record each override and its reason.
- Keep the process light, and size it to the change (see Step 0). There is no review gate at this stage.
- Do not start implementation until the user chooses Run now.

## Step 0: Locate the repo, answer first, and size the process

1. **Detect the repo yourself** when the session can read files: the working directory, `git status`, README, `CLAUDE.md` and the folder tree. Ask which repository the work is in, or ask for its structure or a connector, only when you can't read it, for example in a chat without repo access. If the folder isn't a git repository yet, say so and suggest `git init` before the intent record is committed.
2. Check for an existing intent file at `docs/intent/<slug>.md`, where `<slug>` is a short kebab-case name for the change.
3. **Fast path:** If an intent file or a written story with acceptance criteria for the current change already exists, read it. Then ask only about the gaps, and confirm the rest with the user before relying on it.
4. **Answer the question first:** If the request is a question (for example "can I do X?"), give a short answer with sources before the interview, then carry on with the brief.
5. **Size the process:** Propose a mode and let the user confirm it.
   - **Quick mode:** for small, low-risk changes that add no infrastructure, have no security or cost impact, and are easy to revert. Interview only scope, acceptance criteria, the execution boundary and verification. Write the intent record without the security overlay and the STRIDE table, and state `Mode: Quick (not threat-modelled)` in it.
   - **Full mode:** for everything else. Follow every step below.

## Step 1: Tool discovery

Before writing the brief, check what is available:

- List the skills, MCP servers and connectors visible in this chat session.
- Suggest tools that would improve the outcome in Claude Code, such as an MCP server for the repo's cloud provider, a linter or security scanner, or a project skill.
- Separate what is usable now from what the user must install or configure in Claude Code. Do not assume a tool exists in Claude Code because it appears in chat.

## Step 2: Interview

Ask questions in small groups, not all at once. Cover these areas:

1. **Intent:** Who is the change for? What outcome do they need? Why now?
2. **Scope:** What is in scope and what is explicitly out of scope? What else lives in the target environment (account, cluster, database, shared service) that must not be affected?
3. **Acceptance criteria:** How will someone know it works? What is the definition of done?
4. **Priority and constraints:** Deadlines, budget, approved technology, compatibility.
5. **Scale and cost:** Roughly how much will this handle (data volume, users, requests or runs)? Is there a budget or cost ceiling? If there is none, record "none" and move on.
6. **Data and security:** What data is touched and how sensitive is it? Where do secrets live? Who authenticates, and how? Is anything internet-facing? Are there cost guardrails? Is the repo public, or might it become public? Which identifiers (account IDs, emails, domains, internal hostnames) must never be committed?
7. **Execution boundary:** What may the agent run? For example read-only checks, local tests, plan or dry-run, deploy, destroy, or cloud API calls. Who runs the rest, and where?
8. **Reversibility:** How is this rolled back or torn down? What is irreversible, such as data deletion, account closure or burned email addresses? What has to survive a teardown?
9. **Verification:** What tests, checks or manual steps prove it works?

For every assumption you have made, state it in a numbered list, each starting with its status `Open`:

> A1. **Open:** I'm assuming the service runs on AWS Lambda. Confirm, change or reject?

Assumption lifecycle:

- New assumptions are presented with the status `Open`.
- When the user answers Confirm, Change or Reject, the assumption becomes `Finalised`. Record the resolution (Confirmed, Changed or Rejected) in the register, and for Changed, record the new value in Notes.
- If the user asks a question about an assumption, or asks for alternatives, it stays `Open`. Answer the question, then restate the assumption and its options in full.
- An assumption that depends on a fact that changes over time stays `Open` until the fact is looked up. Cite the source when you restate it.
- If two assumptions contradict each other, whatever their status, set both back to `Open`. Restate both in full in the same message and explain the conflict.

Rules for presenting assumptions:

- Write the list in the visible reply text of the same message that asks for approval. Do not put it only in your thinking, a tool call or the intent file, and do not rely on a list from an earlier turn.
- Present small numbers of assumptions at a time, so each batch covers the relevant high priority topics.
- Present each critical assumption on its own: one that changes the architecture, security posture, cost or scope.
- Bundle closely related defaults that belong to the same decision (for example log retention, log format and log encryption) into one question. If the bundle can not be accepted, restate every default in the bundle in full, and let the user accept or change individual items. Never bundle unrelated defaults, or a critical assumption with defaults.
- If you use a question tool such as `AskUserQuestion`, the user may see only the dialog. Put the full assumption text inside each question (one question per critical assumption or per bundle of related defaults, with Confirm / Change / Reject options). Never ask something like "approve A1–A7?" when the text is shown somewhere else.

Do not move on until every assumption is `Finalised`. Anything still `Open` is recorded as open.

## Step 3: Write the intent record

Create `docs/intent/<slug>.md` in the repo with this structure:

```markdown
# Intent: <title>

Status: Draft
Mode: Full
Owner: <name>
Date: <YYYY-MM-DD>

## Intent
- Who: 
- Outcome:
- Why it matters:
- Priority:

## Scope
- In scope:
- Out of scope:
- Must not be affected (resources outside the repo):

## Acceptance criteria
- [ ] AC1:
- [ ] AC2:

## Definition of done

## Assumptions register
| ID | Assumption | Status (Open / Finalised) | Resolution (Confirmed / Changed / Rejected) | Notes |
|----|------------|---------------------------|----------------------------------------------|-------|

## Execution boundary
- Agent may run:
- Agent must not run:
- Run by the owner (where):

## Reversibility
- Rollback or teardown:
- Irreversible actions:
- Must survive a teardown:

## Security overlay
- Data classification:
- Secrets handling:
- Authentication and authorisation:
- Logging and monitoring:
- Cost guardrails:
- Compliance or policy constraints:
- Private identifiers (kept out of git):

## Threat model (STRIDE)
| Component | Threat category (S/T/R/I/D/E) | Threat | Mitigation | Status (Open / Mitigated / Accepted) |
|-----------|-------------------------------|--------|------------|--------|

## Overrides
- <YYYY-MM-DD> · What changed (default, AC or assumption) · Why · Evidence or source · Approved by:

## Open questions
```

Intent status lifecycle:

- `Draft`: when the record is first written.
- `Agreed`: when every assumption is `Finalised` and the user chooses Run now or Copy.
- `Implemented`: when Run now finishes the approach steps.
- `Verified`: when every acceptance criterion has passed and is ticked.

Update the `Status` line at each change. The intent record is committed, so never write an identifier the user marked as private into it. Use placeholders instead (for example `123456789012` or `user@example.com`) and say where the real values live: git-ignored files such as `*.tfvars`, `.env` or a backend config.

Then tell the user to review the file and commit it, for example `git add docs/intent/<slug>.md && git commit -m "Add intent record for <slug>"`.

## Step 4: Generate the Claude Code brief

Build the prompt from the intent record. Use this structure:

1. **Context:** The repo, the stack, and the relevant files to read first.
2. **Task:** One clear statement of the change.
3. **Constraints:** Constraints from the intent record, including the security overlay and cost guardrails.
4. **Security requirements:** Each mitigation from the STRIDE table, written as an instruction.
   Also include the reversibility requirements: how to roll back or tear down, and a guard (for example a confirmation, a dry-run default or `prevent_destroy`) on every irreversible action.
5. **Approach:** Ordered steps, with checkpoints where Claude Code should stop and report. Include this deviation rule: if any step finds a fact that contradicts an acceptance criterion, assumption or constraint, stop. Report the deviation, the evidence with its source, and the proposed change. Wait for approval, then record it under Overrides in the intent record and update the affected acceptance criterion before continuing.
6. **Verification:** Map each acceptance criterion to a test or check, and state exactly how to run it.
7. **Do not change or run:** Explicit out-of-scope items, any protected files, the resources outside the repo that must not be affected, and every command or action outside the execution boundary.
8. **Output:** What Claude Code should report back when finished.

## Checks before delivery

Run these checks on the brief before either delivery option:

- Every acceptance criterion maps to a verification step.
- Every STRIDE row with a threat has a mitigation or an open question.
- No open assumption is written as if it were finalised.
- No two assumptions contradict each other. Any contradiction, whatever the status, is set back to `Open` and restated in full.
- Every fact that changes over time (versions, API schemas, prices, quotas) is cited with a source, or the brief tells Claude Code to look it up first.
- The brief contains the deviation rule.
- The brief names specific files or directories, not "the codebase".
- The brief says what not to change, and what not to run, matching the execution boundary.
- The intent record and the brief contain no identifier the user marked as private. The brief tells Claude Code to keep real values in git-ignored files only.
- Every assumption the user is asked about appears in full in the same message as the question.

## Step 5: Deliver the brief

1. List any assumptions still marked open, each written out in full with its ID (not just the IDs), so the user can resolve them first.
2. Ask the user to choose one option:
   - **Run now:** carry out the brief in this session.
   - **Copy:** return the brief as a single code block to paste or edit.
3. For Run now, also ask for the checkpoint mode:
   - **Stop at every checkpoint** (default).
   - **Stop only on deviations or failures:** report at each checkpoint and carry on unless the deviation rule applies or a check fails.
4. Offer **Run now** only if this session can actually change the repo, for example Claude Code with the repo checked out. If it cannot, for example a chat without repo access, say so and offer only **Copy**.
5. If any assumption is still open and the user picks **Run now**, warn them first. Restate each open assumption in full in the warning, then ask them to resolve it or confirm they accept it.

**Run now:**

- Show the full brief first, so the user can see exactly what will run.
- Set the intent record's status to `Agreed`.
- Then follow the brief as your instructions. Apply the deviation rule whenever a fact contradicts the intent record. Stop and report at each checkpoint according to the chosen checkpoint mode, respect "Do not change or run", run every verification step, and report back in the format given in "Output".
- When the steps are done, set the status to `Implemented`, and to `Verified` once every acceptance criterion has passed and is ticked.

**Copy:**

- Set the intent record's status to `Agreed`.
- Return the brief in one fenced code block. Put nothing else inside the block, so it can be pasted or edited as it is.
- Below the block, add a one-line reminder to paste it into Claude Code from the repo root.