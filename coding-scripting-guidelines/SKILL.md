---
name: coding-scripting-guidelines
description: Behavioural guidelines to reduce common LLM coding and scripting mistakes. Use when writing, reviewing, or refactoring code to avoid overcomplication, make surgical changes, surface assumptions, and define verifiable success criteria.
license: MIT
---

# Coding and Scripting Guidelines

Behavioural guidelines to reduce common LLM coding and scripting mistakes.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated or over-engineered?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

## 5. Tool Selection and File Operations

**Use the right tool. Read before you change.**

- Prefer dedicated tools over Bash: use Read instead of `cat`/`head`/`tail`, Edit instead of `sed`, Write for file creation.
- Always Read files before editing them. Never re-read immediately after Edit (the tool reports errors if it fails).
- Use absolute paths in multi-step workflows to avoid breaking between commands.
- Batch independent tool calls in a single response for efficiency.
- Don't use Bash flags that require interaction (`-i` with git, editors, etc.).

## 6. Testing Philosophy

**Write the test that proves it works. Then make it pass.**

- Test-first for bugs: write a test that reproduces the bug, then make it pass.
- Test-first for validation: write tests for invalid inputs, then implement validation.
- Focus tests on boundaries and error cases, not on implementation details.
- Don't test trivial code (getters/setters with no logic).
- Run tests to verify success criteria, not as a ritual.

## 7. Error Handling Approach

**Validate at boundaries. Trust internal code.**

- Validate inputs at system boundaries only: user input, external APIs, file I/O.
- Trust internal code between components. No defensive checks for impossible scenarios.
- Fail fast with clear error messages that explain what went wrong and why.
- Catch only errors you can handle meaningfully. Let others propagate.
- Don't wrap errors just to re-throw them.

## 8. Comments and Documentation

**Document "why", not "what". Minimize by default.**

- Default to writing no comments. Code should be self-documenting.
- Comment the "why" for non-obvious decisions: hidden constraints, subtle invariants, workarounds, or surprising behavior.
- Remove outdated comments immediately—they rot faster than code and mislead.
- Don't add comments to explain what obvious code does.
- Don't create documentation files unless explicitly requested. Match existing project documentation style.

## 9. Git Workflow Mindset

**Safety first. Deliberate commits. Clear messages.**

- Before committing, run `git status`, `git diff`, and `git log` to understand what's changing.
- Stage specific files by name, never use `git add -A` or `git add .` (risks accidentally staging secrets).
- Check for sensitive files (.env, credentials.json, private keys) before staging anything.
- After pre-commit hook failures, create NEW commits—never use `--amend`. Hook failure means the commit didn't happen.
- Never skip hooks with `--no-verify` or force-push to protected branches unless explicitly requested.
- Review all commits in the branch (not just the latest) when creating pull requests.

## 10. Safety and Configuration

**Preserve structure. Validate syntax. Protect secrets.**

- Never commit credentials, API keys, tokens, or secrets. Warn the user if they explicitly request it.
- Validate configuration file syntax before writing (JSON/YAML/TOML).
- Preserve formatting, structure, and comments when editing config files.
- Ask before destructive operations: deleting files/branches, force-push, `git reset --hard`, `rm -rf`.
- For risky actions visible to others (pushing code, modifying shared infrastructure), confirm first unless explicitly authorized.
- When in doubt about a destructive operation, prefer reversible alternatives (rename, move, stash) over deletion.