# Agent Skills

A personal toolkit of Agent SKILLs for DevSecOps fundamentals and project management. Built to help AI Agents plan clearly, code cleanly and ship securely.

## Skills Included

**code-brief:** Generate project intent and well articulated initial prompt

**coding-scripting-guidelines:** Code quality guidelines

**simple-website:** Static website engineering standard

### Code Brief

**Directory:** `code-brief/`

Turns a rough request into a versioned intent record and a Claude Code brief. The operator then chooses to run the brief straight away in the current session, or to get it as a single copy-ready code block to paste or edit. No code is changed unless the operator chooses to run it. It covers:

- **Repo and intent discovery:** Finds any existing intent file or story with acceptance criteria and asks only about the gaps
- **Tool discovery:** Lists the skills, MCP servers and connectors available now, and suggests ones to install or configure in Claude Code
- **Structured interview:** Intent, scope, acceptance criteria, constraints, data and security, and verification, asked in small groups
- **Assumptions register:** Lists every assumption for the user to confirm, change or reject, and records any still open
- **Intent record:** Writes `docs/intent/<slug>.md` with a security overlay, a STRIDE threat model, overrides and open questions
- **Claude Code brief:** One prompt with context, task, constraints, security requirements, ordered steps with checkpoints, verification mapped to each acceptance criterion, what not to change, and what to report back
- **Delivery choice:** Run the brief now in the current session (when it has repo access), or copy it as one code block

Use this for: writing a prompt, brief or spec before asking Claude Code to build, fix, refactor or review something. Trigger it with `/code-brief`. It is not for questions about how Claude Code works or how to set it up.

### Coding and Scripting Guidelines

**Directory:** `coding-scripting-guidelines/`

Behavioral guidelines to reduce common LLM coding and scripting mistakes. Covers principles for clean, maintainable implementations.

### Simple Website

**Directory:** `simple-website/`

Build and maintain production-quality static websites using semantic HTML5, modern vanilla CSS, and progressive-enhancement JavaScript. This skill covers:

- **Tier-based scaffolding:** Choose between inline prototypes, minimal sites, standard multi-page sites, or custom configurations
- **Semantic HTML:** Standards-compliant markup with accessibility built-in
- **Modular CSS:** Organized stylesheets with design tokens, responsive layout, and dark mode support
- **Progressive JavaScript:** Enhancements that work without client-side dependencies
- **Responsive design:** Mobile-first approach with content-driven breakpoints
- **Dark mode:** System preference detection with user override and persistence
- **Print-friendly:** Optimized output for printing and reading modes
- **Accessibility:** WCAG-aligned practices, keyboard navigation, and semantic structure

Use this for: landing pages, portfolios, documentation sites, blogs, multi-page static sites, and any framework-free web projects where consistency and maintainability matter.

## How to Use

Each skill is self-contained in its own directory with a `SKILL.md` file that describes:

1. **Purpose** — what the skill is for and when to use it
2. **Quick start** — how to begin with different complexity levels
3. **Core principles** — guiding philosophy and best practices
4. **Reference patterns** — templates and examples
5. **Quality gates** — checklists to ensure work meets standards
