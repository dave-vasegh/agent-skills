---
name: code-brief
description: Use when the user asks for a well-articulated prompt, brief or spec for Claude Code, or wants Claude Code to build, fix, refactor or review something and needs the instructions written first. Also triggered by /code-brief. Interviews the user to surface assumptions, records intent as a versioned markdown file in the repo with a STRIDE threat model, checks available tools, then either carries out the brief in the current session or returns it as one copy-ready Claude Code prompt, as the operator chooses. Not for questions about how Claude Code works, or how to install or configure it.
---

# Code Brief

Turns a rough request into two outputs: an intent record that is committed to the repo, and a Claude Code brief built from it. The operator then chooses how the brief is delivered: **Run now** (carry it out in this session) or **Copy** (return it as a single code block to paste or edit). No code is written or changed until the operator chooses Run now.

## Principles

- Never invent facts about the repo, stack, data or environment. Ask for them.
- Surface every assumption explicitly and let the user confirm, change or reject it.
- Ambiguity is resolved by asking, not by choosing a default silently.
- The user can override any default. Record each override and its reason.
- Keep the process light. There is no review gate at this stage.
- Do not start implementation until the operator chooses Run now.

## Step 0: Locate the repo and any existing intent

1. Ask which repository the work is in, and whether the user can share its structure (README, `CLAUDE.md`, folder tree, relevant files) or give access through a connector.
2. Check for an existing intent file at `docs/intent/<slug>.md`, where `<slug>` is a short kebab-case name for the change.
3. **Fast path:** If an intent file or a written story with acceptance criteria already exists, read it. Then ask only about the gaps, and confirm the rest with the user before relying on it.

## Step 1: Tool discovery

Before writing the brief, check what is available:

- List the skills, MCP servers and connectors visible in this chat session.
- Suggest tools that would improve the outcome in Claude Code, such as an MCP server for the repo's cloud provider, a linter or security scanner, or a project skill.
- Separate what is usable now from what the user must install or configure in Claude Code. Do not assume a tool exists in Claude Code because it appears in chat.

## Step 2: Interview

Ask in small groups, not all at once. Cover these areas:

1. **Intent:** Who is the change for? What outcome do they need? Why now?
2. **Scope:** What is in scope and what is explicitly out of scope?
3. **Acceptance criteria:** How will someone know it works? What is the definition of done?
4. **Priority and constraints:** Deadlines, budget, approved technology, compatibility.
5. **Data and security:** What data is touched and how sensitive is it? Where do secrets live? Who authenticates, and how? Is anything internet-facing? Are there cost guardrails?
6. **Verification:** What tests, checks or manual steps prove it works?

For every assumption you have made, state it in a numbered list like this:

> A1. I'm assuming the service runs on AWS Lambda. Confirm, change or reject?

Do not move on until each assumption is confirmed, changed or rejected. Anything still open is recorded as open.

## Step 3: Write the intent record

Create `docs/intent/<slug>.md` in the repo with this structure:

```markdown
# Intent: <title>

Status: Draft
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

## Acceptance criteria
- [ ] AC1:
- [ ] AC2:

## Definition of done

## Assumptions register
| ID | Assumption | Status (confirmed / rejected / changed / open) | Notes |
|----|------------|-----------------------------------------------|-------|

## Security overlay
- Data classification:
- Secrets handling:
- Authentication and authorisation:
- Logging and monitoring:
- Cost guardrails:
- Compliance or policy constraints:

## Threat model (STRIDE)
| Component | Threat category (S/T/R/I/D/E) | Threat | Mitigation | Status |
|-----------|-------------------------------|--------|------------|--------|

## Overrides
- Default overridden, and why:

## Open questions
```

Then tell the user to review the file and commit it, for example `git add docs/intent/<slug>.md && git commit -m "Add intent record for <slug>"`.

## Step 4: Generate the Claude Code brief

Build the prompt from the intent record. Use this structure:

1. **Context:** The repo, the stack, and the relevant files to read first.
2. **Task:** One clear statement of the change.
3. **Constraints:** Constraints from the intent record, including the security overlay and cost guardrails.
4. **Security requirements:** Each mitigation from the STRIDE table, written as an instruction.
5. **Approach:** Ordered steps, with checkpoints where Claude Code should stop and report.
6. **Verification:** Map each acceptance criterion to a test or check, and state exactly how to run it.
7. **Do not change:** Explicit out-of-scope items and any protected files.
8. **Output:** What Claude Code should report back when finished.

## Checks before delivery

Run these checks on the brief before either delivery option:

- Every acceptance criterion maps to a verification step.
- Every STRIDE row with a threat has a mitigation or an open question.
- No open assumption is written as if it were confirmed.
- The brief names specific files or directories, not "the codebase".
- The brief says what not to change.

## Step 5: Deliver the brief

1. List any assumptions still marked open, so the operator can resolve them first.
2. Ask the operator to choose one option:
   - **Run now:** carry out the brief in this session.
   - **Copy:** return the brief as a single code block to paste or edit.
3. Offer **Run now** only if this session can actually change the repo, for example Claude Code with the repo checked out. If it cannot, for example a chat without repo access, say so and offer only **Copy**.
4. If any assumption is still open and the operator picks **Run now**, warn them first. Ask them to resolve the assumptions or confirm they accept them.

**Run now:**

- Show the full brief first, so the operator can see exactly what will run.
- Then follow the brief as your instructions. Stop and report at each checkpoint, respect "Do not change", run every verification step, and report back in the format given in "Output".

**Copy:**

- Return the brief in one fenced code block. Put nothing else inside the block, so it can be pasted or edited as it is.
- Below the block, add a one-line reminder to paste it into Claude Code from the repo root.