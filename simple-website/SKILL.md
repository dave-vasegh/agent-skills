---
name: simple-website
description: Build and maintain consistent, production-quality simple websites using semantic HTML5, modern vanilla CSS, and progressive-enhancement JavaScript. Use for any HTML/CSS/JS website, portfolio, documentation, article, landing page, or multi-page static site — and whenever scaffolding, styling, or extending plain web pages where consistency, accessibility, responsive design, dark mode, browser reading experiences, or maintainable structure matter. Apply this even when the user doesn't say "vanilla" or name this skill, as long as the work is framework-free web. Do NOT use for React/Vue/Svelte or other framework projects.
---

# Simple Website Engineering Standard

## Purpose

Create cohesive, maintainable websites with plain HTML, CSS and JavaScript unless the user explicitly requests a framework.

This skill is intentionally opinionated. Prefer a small, understandable architecture and browser-native capabilities over unnecessary dependencies.

## Quick Start: Choose Your Tier

### Tier 1: Inline Prototype (Quick mockup)
Single `index.html` with `<style>` and `<script>` tags. Preserves design system but in one file for rapid prototyping.

### Tier 2: Minimal (Single page, simple landing page)
Generate a single HTML file with external CSS (single file) and optional lightweight JavaScript. No responsive navigation or theme toggle unless explicitly requested.

### Tier 3: Standard (Small site, 2-10 pages)
Full scaffolding with semantic structure, modular CSS (variables, base, layout, components, print), responsive navigation, dark mode toggle, and progressive enhancement.

### Tier 4: Custom (Feature pick-and-choose)
Specify which features you need:
- Dark mode toggle? (yes/no)
- Responsive navigation? (yes/no)
- Print stylesheet? (yes/no)
- Design tokens system? (yes/no)

Files are generated inline based on your requirements. No manual copying needed.

## How Files Are Generated

When you request a new site or page, files are generated inline in your project directory based on the tier and features you need. There is no manual copying required. All generated files follow the same quality standards and patterns regardless of tier.

**Standard Tier Structure** (used as template foundation for all tiers):

```
/
├── index.html
├── about.html (if multi-page)
├── css/
│   ├── variables.css    (design tokens)
│   ├── base.css         (element defaults)
│   ├── layout.css       (page shell, responsive)
│   ├── components.css   (reusable UI patterns)
│   └── print.css        (print stylesheet)
├── js/
│   ├── main.js          (entry point)
│   ├── theme.js         (dark mode toggle)
│   └── navigation.js    (responsive nav)
└── assets/
    ├── images/
    ├── icons/
    └── fonts/
```

For Tier 1 (inline prototypes) or Tier 2 (minimal), CSS and JS are simplified or inlined. For Tier 3 (standard), all modules are used. For Tier 4 (custom), files are generated based on which features are selected.

## Core principles

1. Semantic HTML first.
2. CSS is responsible for presentation; JavaScript is responsible for behaviour.
3. Progressive enhancement: core content and navigation must work without JavaScript.
4. Accessibility is a requirement, not a final polish step.
5. Design tokens control typography, colour, spacing, sizing and component behaviour.
6. Reuse patterns rather than duplicating page-specific styling.
7. Respect user preferences such as dark mode and reduced motion.
8. Optimise for reading, navigation, performance and maintainability.
9. Do not introduce a framework or build system unless explicitly requested or already present.
10. Do not use inline CSS or inline JavaScript unless there is a documented technical reason (the pre-paint theme guard in `<head>` is the one sanctioned exception).

## Project Structure Guidance

For larger sites with more than 10 HTML pages, use `<category-name>/` to categorise the pages. Keep HTML, CSS and JavaScript concerns separated.

Example: `/blog/`, `/projects/`, `/docs/` at the top level, each with their own index.html. All pages share the same CSS and JS from the root.

## HTML standard

Use semantic elements wherever possible:

- `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`
- `figure`, `figcaption`, `time`
- `button`, `a`
- `form`, `label`, `input`, `textarea`, `select`

Use one logical `h1` for the primary page subject and maintain a sensible heading hierarchy.

Do not use `div` or `span` when a semantic element is appropriate.

Use real links for navigation and real buttons for actions. Never make a non-interactive element behave like a button when a native button can be used.

## CSS Architecture

**For Tier 3 Standard and Tier 4 Custom:** Use external CSS files, loaded in cascade order:

1. `variables.css` — design tokens and theme values
2. `base.css` — reset, typography and element defaults
3. `layout.css` — containers, grids, responsive layout
4. `components.css` — reusable UI components
5. `print.css` — loaded with `media="print"` (only if needed)

**For Tier 1 and Tier 2:** Combine into a single CSS file or keep inline.

**General CSS guidance:**

Prefer classes and low-specificity selectors. Avoid deeply nested selectors and excessive specificity.

Do not scatter arbitrary values throughout the stylesheet. If a value is reused, promote it to a design token.

Use modern CSS where appropriate: custom properties, `clamp()`, logical properties, container queries when useful, CSS Grid, Flexbox, `:is()`/`:where()`, `light-dark()`, and cascade layers when useful.

Prefer `rem`, `em`, `%`, viewport/container units and other relative units over hard-coded pixels for typography and layout.

## Design tokens

Define a central token system for: font families, font sizes, font weights, line heights, colours, spacing, border radii, shadows, content widths, control heights and transition durations.

Example categories (see `variables.css` for the full set):

    --font-body / --font-heading
    --text-xs … --text-3xl
    --space-1 … --space-8
    --content-width / --reading-width
    --radius-sm … --radius-lg
    --duration-fast / --duration-normal

Use tokens consistently across pages.

## Typography

Prioritise readability over novelty. Define body and heading typography centrally and use a deliberate typographic scale rather than page-specific font sizes.

Use `clamp()` for responsive display headings. Body text should have a comfortable line height and a constrained reading width. Do not justify long-form body text. Avoid excessive all-caps. Ensure sufficient contrast.

Do not hard-set `html { font-size }` — let the type scale inherit the user's browser preference so zoom and accessibility settings work.

If a project has an established brand font, preserve it. Otherwise choose a readable, appropriately licensed option rather than defaulting to a trendy font.

## Colour and Dark Mode

**If dark mode is included** (Tier 3 Standard or selected in Tier 4 Custom):

Dark mode is a first-class feature. The implementation must:

1. respect `prefers-color-scheme` by default;
2. allow an explicit user override;
3. persist the user's choice;
4. avoid a visible theme flash where practical;
5. keep text, controls, borders, focus indicators and imagery usable in both themes.

**Recommended implementation:**

- Set `color-scheme: light dark` on `:root` and add `<meta name="color-scheme" content="light dark">` so native controls adapt.
- Define every colour once with `light-dark()`: `--color-bg: light-dark(#fff, #16181c)`. It resolves against the active `color-scheme`.
- Drive the manual override by forcing the scheme via a `data-theme` attribute. Flipping the scheme flips every token at once.
- Prevent the flash with a tiny inline `<head>` script that reads the stored choice and sets `data-theme` before first paint. The theme module handles toggle and persistence afterwards.

Use semantic colour tokens (`--color-bg`, `--color-surface`, `--color-text`, `--color-text-muted`, `--color-border`, `--color-link`, `--color-accent`, `--color-focus`). Do not hard-code separate colours throughout components.

**If dark mode is not needed** (Tier 2 Minimal or not selected in Tier 4 Custom):

Use semantic colour tokens in a single `color-scheme`. Keep the same token structure but define values once for the selected theme.

## Links

Links must be recognisable as links, with consistent default, hover, visited (where appropriate), `focus-visible` and active states.

Internal navigation uses normal anchors. Distinguish external URLs visually only when it aids understanding — apply the indicator deliberately, not to every outbound link. Do not use JavaScript navigation when an anchor can do the job.

Do not use `target="_blank"` by default. If genuinely needed, pair it with `rel="noopener noreferrer"` and make the behaviour clear.

## Buttons and controls

Buttons are for actions; anchors are for navigation. All interactive controls need keyboard accessibility, visible focus, an adequate hit area, a clear disabled/loading state where applicable, and consistent typography and spacing.

Do not make a control look like it does one thing while doing another. Keep primary, secondary and destructive styles consistent across the site.

## Navigation

**If responsive navigation is included** (Tier 3 Standard or selected in Tier 4 Custom):

Navigation must work with keyboard and without JavaScript. For responsive navigation:

- use semantic navigation markup;
- provide a real button for opening/closing the mobile menu;
- expose state through `aria-expanded`;
- manage focus sensibly and allow `Escape` to close overlays;
- for full-screen overlay menus, apply `inert` to the rest of the page while open so focus can't leak behind it;
- avoid trapping users unnecessarily.

Keep the primary nav visible without JS and let script collapse it — don't hide primary navigation from screen readers merely to simplify mobile styling.

**If navigation is not included** (Tier 2 Minimal or not selected in Tier 4 Custom):

Use simple `<nav>` with `<a>` links. No JavaScript toggle needed.

## Accessibility

Follow WCAG-aligned practices. At minimum: semantic HTML, keyboard navigation, visible `:focus-visible`, sufficient contrast, meaningful accessible names, form labels, useful alt text, no colour-only communication, respected reduced motion, logical focus order, and no inaccessible custom controls.

Use ARIA only when native HTML semantics cannot provide the behaviour.

## Motion

Motion should communicate state or give subtle feedback. Respect `@media (prefers-reduced-motion: reduce)` — minimise or remove non-essential animation, and gate `scroll-behavior: smooth` behind it. Prefer CSS transitions for simple interactions; don't animate everything just because you can.

## Reading and immersive-browser support

There is no API to switch on a browser's Reader/Reading Mode (Firefox Reader View, Chrome Reading mode, Edge Immersive Reader) — each extracts the primary content heuristically. Structure documents so that extraction succeeds:

- use a semantic `<article>` with a meaningful `<h1>` and logical headings;
- keep article content in a clean DOM subtree — not injected by JS on load, not buried in deep non-semantic nesting;
- use real paragraphs, lists, tables, figures and block quotes;
- use `<time datetime="">`, meaningful image `alt`, and `<figure>`/`<figcaption>`;
- keep the reading column at roughly 60–80 characters where practical;
- for collapsible content that should stay findable and extractable, prefer `hidden="until-found"` over display:none;
- minimise intrusive sticky UI around article content;
- provide a print stylesheet.

If a site provides its own reading mode, it must be an enhancement, not a prerequisite for reading the content.

## Responsive design

Use a mobile-first approach unless the project clearly follows another convention. Avoid designing only around named device breakpoints; prefer fluid layout and content-driven breakpoints. Test narrow mobile, large mobile/tablet, desktop and wide desktop. Content must not overflow horizontally without a deliberate reason.

## Forms

Use native form controls unless a custom control is genuinely required. Every field needs an accessible label. Validation should be understandable and associated with the relevant field; do not rely on colour alone. Preserve entered data when validation fails.

## Images and media

Use meaningful `alt` for informative images and `alt=""` for decorative ones. Use `loading="lazy"` for suitable below-the-fold images and explicit dimensions or `aspect-ratio` to reduce layout shift. Don't let decorative imagery compete with primary content.

## JavaScript

JavaScript enhances the document rather than defining it. Keep scripts in `js/`.

Use ES modules (`<script type="module" src="js/main.js">`) — they are deferred by default, so no separate `defer` is needed and the DOM is ready on execution. Prefer small, focused modules; avoid globals; use event delegation where appropriate; and don't duplicate behaviour that a shared module can provide.

Do not add a dependency for functionality that is trivial with browser APIs. Use feature detection before relying on optional capabilities.

## URL and navigation consistency

Use real URLs that remain meaningful with JavaScript disabled. Prefer `/`, `/about/`, `/projects/`, `/contact/` or the established project convention. Don't invent inconsistent URL patterns. Don't encode UI state into URLs unless it's useful to navigation, sharing or history. Use normal browser history behaviour.

## SEO and document metadata

Every page should have a unique `<title>`, a useful meta description where appropriate, viewport metadata, a canonical URL where the deployment model requires it, and appropriate Open Graph metadata for public-facing pages. Use semantic content rather than keyword stuffing.

## Performance

Prefer browser-native capabilities and minimal JavaScript. Avoid unnecessary dependencies and render-blocking scripts. Use `defer` or modules appropriately. Avoid large client-side bundles for simple static sites. Don't load fonts, images or libraries that aren't used.

## Print

**If print stylesheet is included** (Tier 3 Standard for content-rich sites, or selected in Tier 4 Custom):

Provide a print stylesheet. Printing should remove navigation and unnecessary controls, preserve article content, use readable typography, avoid dark backgrounds, and avoid breaking content unnecessarily across pages.

**If print stylesheet is not needed** (Tier 2 Minimal, landing pages, or not selected in Tier 4 Custom):

Browser defaults are usually sufficient. Add `@media print { ... }` rules only if needed.

## Security

Do not inject untrusted HTML. Avoid `innerHTML` when `textContent` or DOM APIs suffice. Treat any external content as untrusted. Do not expose secrets or credentials in client-side files.

## Quality Gate

Before completing work, inspect the implementation against this tier-specific checklist:

### All Tiers

- [ ] HTML is semantic and valid in structure.
- [ ] No essential content depends on JavaScript.
- [ ] No unnecessary framework or dependency was introduced.
- [ ] Images have appropriate alternative text.
- [ ] No obvious horizontal overflow exists.
- [ ] No secrets or credentials are present.
- [ ] Links behave consistently.
- [ ] Buttons behave consistently.
- [ ] Keyboard navigation works.
- [ ] Focus states are visible.
- [ ] Reduced-motion preference is respected.
- [ ] URLs follow one consistent convention.
- [ ] Repeated UI patterns have been consolidated.

### Tier 1: Inline Prototype (add these to All Tiers)

- [ ] HTML is valid and self-contained with inline styles/scripts.
- [ ] Single `index.html` file with `<style>` and `<script>` tags.
- [ ] Responsive design works at narrow and wide sizes.
- [ ] No unnecessary features included.

### Tier 2: Minimal (add these to All Tiers)

- [ ] HTML is semantic with essential structure.
- [ ] CSS (single external file or inline) covers layout and typography.
- [ ] JavaScript only if essential to functionality.
- [ ] Responsive design works at narrow and wide sizes.
- [ ] No unnecessary features included.

### Tier 3: Standard (add these to the above)

- [ ] CSS and JS are externalised into separate files.
- [ ] No unnecessary inline styles or scripts (except FOUC guard).
- [ ] Design tokens are used consistently.
- [ ] Typography is centrally defined in variables.css.
- [ ] Light and dark themes work (if included).
- [ ] System theme preference is respected (if dark mode included).
- [ ] Theme preference can be overridden and persisted (if dark mode included).
- [ ] No visible theme flash on load (if dark mode included).
- [ ] Responsive layout works at narrow and wide sizes.
- [ ] Article/content pages are reader-friendly.
- [ ] Print output is sensible for content pages (if print.css included).

### Tier 4: Custom (add these to the above)

- [ ] All selected features are implemented correctly.
- [ ] Unselected features are not included.
- [ ] Quality matches Tier 3 for included features.

## Template Reference Patterns

These are the patterns used when generating files. Adapt them based on tier and selected features.

### Design Token Categories (for Tier 3 Standard and Tier 4 Custom with tokens)

```
--font-body / --font-heading / --font-mono
--weight-normal / --weight-medium / --weight-bold
--leading-tight / --leading-normal
--text-xs / --text-sm / --text-base / --text-lg / --text-xl / --text-2xl / --text-3xl
--space-1 through --space-8 (0.25rem base)
--radius-sm / --radius-md / --radius-lg
--border-hairline / --shadow-sm
--content-width (72rem) / --reading-width (68ch) / --control-height (2.75rem)
--duration-fast (120ms) / --duration-normal (220ms)
--color-bg / --color-surface / --color-text / --color-text-muted / --color-border
--color-link / --color-link-hover / --color-accent / --color-on-accent
--color-danger / --color-focus
```

### CSS File Organization (Tier 3 Standard)

**variables.css**: Design tokens only. Single definition per color using `light-dark()` if theme support needed.

**base.css**: Global reset, element defaults, typography, links, buttons, focus styles, reduced-motion rules.

**layout.css**: Page shell (.wrapper), header, nav, article container, footer, responsive breakpoints.

**components.css**: Reusable patterns (.button--primary, .button--secondary, .card, .byline, etc.).

**print.css**: Media queries for print, hide nav/controls, preserve content, optimize typography.

### HTML Structure Essentials (Tier 3 Standard)

```html
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light dark">
  <!-- FOUC guard for theme (if dark mode included) -->
  <script>
    (function () {
      try {
        var t = localStorage.getItem("theme");
        if (t === "light" || t === "dark") {
          document.documentElement.setAttribute("data-theme", t);
        }
      } catch (e) {}
    })();
  </script>
  <link rel="stylesheet" href="css/variables.css">
  <link rel="stylesheet" href="css/base.css">
  <link rel="stylesheet" href="css/layout.css">
  <link rel="stylesheet" href="css/components.css">
  <link rel="stylesheet" href="css/print.css" media="print">
</head>
<body>
  <a class="visually-hidden" href="#main">Skip to content</a>
  <div class="wrapper">
    <header class="site-header">
      <!-- Site branding and navigation -->
    </header>
    <main id="main">
      <!-- Page content -->
    </main>
    <footer class="site-footer">
      <!-- Footer -->
    </footer>
  </div>
  <script type="module" src="js/main.js"></script>
</body>
</html>
```

### JavaScript Modules (Tier 3 Standard)

**main.js**: Imports and coordinates other modules. Handles external link hardening, year auto-fill.

**theme.js**: Respects `prefers-color-scheme`, manages `data-theme` attribute, persists to localStorage, syncs button.

**navigation.js**: Progressive enhancement for responsive nav, handles media query changes, keyboard escape, focus management.

## Conflict Resolution

When requirements conflict, apply this priority order:

1. User requirements
2. Existing project architecture and brand/design system
3. Accessibility and browser-native semantics
4. This skill
5. Visual novelty

Do not redesign an established project merely to make it look different. Preserve an existing design language unless the user asks for a redesign.

## Output Expectations

When creating a new site:

1. **Ask about tier/features** (if not obvious):
   - "Is this for rapid prototyping?" → Tier 1 Inline Prototype
   - "How many pages?" → Tier 2 Minimal for 1, Tier 3 Standard for 2-10, Tier 4 Custom for specific needs
   - "Do you need dark mode?" → Feature selection for Tier 4 Custom
   - "Is this content-heavy?" → Determines if print stylesheet needed (Tier 3+)
   - "Mobile-first or simple?" → Determines layout complexity

2. **Establish purpose, audience, structure, hierarchy, visual direction, typography, and responsive strategy.**

3. **Generate appropriate files** based on tier:
   - Tier 1: Single `index.html` with inline styles/scripts
   - Tier 2: Lean HTML + single external CSS file
   - Tier 3: Full 10-file scaffold with modular CSS/JS
   - Tier 4: Tailored to selected features

4. **Implement consistently** following the core principles.

When modifying an existing site, inspect the existing structure and preserve conventions unless they conflict with explicit requirements.

The finished result should look intentionally designed, but the implementation should remain understandable to another engineer.
