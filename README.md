```
██╗███╗   ██╗████████╗███████╗██████╗ ███╗   ██╗██████╗ ██╗  ██╗██╗███████╗██╗  ██╗
██║████╗  ██║╚══██╔══╝██╔════╝██╔══██╗████╗  ██║██╔══██╗██║  ██║██║██╔════╝██║  ██║
██║██╔██╗ ██║   ██║   █████╗  ██████╔╝██╔██╗ ██║██████╔╝███████║██║███████╗███████║
██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██║╚██╗██║██╔═══╝ ██╔══██║██║╚════██║██╔══██║
██║██║ ╚████║   ██║   ███████╗██║  ██║██║ ╚████║██║     ██║  ██║██║███████║██║  ██║
╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚═╝  ╚═╝
```

<div align="center">

<!-- LOGO PLACEHOLDER -->
<!-- <img src="assets/logo.png" alt="InternPhish Logo" width="120" /> -->

<!-- BANNER PLACEHOLDER -->
<!-- <img src="assets/banner.png" alt="InternPhish Banner" width="100%" /> -->

**Fake Internships hurt for real. Report them.**

[![Status](https://img.shields.io/badge/status-active-brightgreen?style=flat-square&labelColor=0a0a0a&color=2ea043)](/)
[![Stack](https://img.shields.io/badge/stack-HTML5%20·%20CSS3%20·%20Vanilla%20JS-white?style=flat-square&labelColor=0a0a0a)](/)
[![License](https://img.shields.io/badge/license-MIT-white?style=flat-square&labelColor=0a0a0a)](LICENSE)
[![Contributions](https://img.shields.io/badge/contributions-open-white?style=flat-square&labelColor=0a0a0a)](CONTRIBUTING.md)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-white?style=flat-square&labelColor=0a0a0a)](/)

</div>

---

## ` ` THE PROBLEM

Every day, students across India receive messages like this:

> *"Congratulations! You are selected for our internship program. No interview required. Pay ₹1,999 to confirm your slot. Certificate + LOR guaranteed. Hurry — only 3 seats left."*

These scams are not random. They are **templated, repeatable, and scalable.** They target students who are desperate for resume lines — and they work because there is no reference point to verify against.

The real problem isn't the scam. It's **pattern blindness.**

---

## ` ` THE SOLUTION

InternPhish is a minimal, high-trust platform that does three things:

1. **Trains** users to recognize scam patterns through guided dissection
2. **Stores** crowdsourced reports in a structured, searchable database
3. **Creates** a feedback loop — every report improves detection for the next student

```
recognition → verification → contribution → awareness spreads
```

No login. No tracking. No ads. Just truth.

---

## ` ` CORE ARCHITECTURE

```
internphish/
├── index.html              # Landing — hero, scam preview, CTA
├── breakdown.html          # Scam anatomy — pattern dissection UI
├── reports.html            # Database — searchable report index
├── submit.html             # Contribution — report submission workflow
├── report-detail.html      # Analysis node — per-report deep dive
├── about.html
├── privacy.html
├── terms.html
│
├── css/
│   ├── styles.css          # Global tokens — typography, reset, variables
│   └── pages.css           # Per-page layout overrides
│
└── js/
    ├── breakdown.js        # Phrase tagging + pattern visualization engine
    ├── report-detail.js    # Red-flag highlight + similarity analysis
    └── submit.js           # Form logic + auto-tag detection
```

<details>
<summary><strong>[ EXPAND ] Full File Architecture + Responsibilities</strong></summary>

<br>

| File | Responsibility |
|------|----------------|
| `index.html` | Renders floating ghost phrases (JS-animated), scam message preview, stats pulled from backend |
| `breakdown.html` | Static scam anatomy layout — phrase cards with toggle-expand explanations |
| `reports.html` | Search input → filtered card grid, report count stats, click-to-detail navigation |
| `submit.html` | Form: org name, message, fee, notes. Auto-tag detection on message content. No login required |
| `report-detail.html` | Full report view with programmatic red-flag word highlighting, pattern tag display, similar report count |
| `privacy.html` | Data handling disclosure — no personal data collected, no IP logging |
| `terms.html` | Legal disclaimer — crowdsourced data, accuracy not guaranteed, dispute pathway |
| `css/styles.css` | Global CSS custom properties, typography scale, color tokens, monochrome base |
| `css/pages.css` | Page-specific layout rules, component overrides, responsive adjustments |
| `js/breakdown.js` | Phrase card toggle logic, pattern categorization, scam taxonomy data |
| `js/report-detail.js` | Keyword scan + DOM highlight injection, similarity scoring, tag rendering |
| `js/submit.js` | Form validation, auto-tag detection from message text, submission handler, success state |

</details>

---

## ` ` PHISH ANALYSIS ENGINE

### `breakdown.js` — Pattern Dissection

The breakdown module maintains a static taxonomy of scam phrases mapped to psychological manipulation categories:

```
"No interview required"     → NO_SELECTION_PROCESS
"Pay ₹xxx to confirm"       → PAYMENT_BARRIER
"Hurry! Only 3 slots left"  → ARTIFICIAL_URGENCY
"Certificate guaranteed"    → FAKE_DELIVERABLE
"Congratulations!"          → FALSE_VALIDATION
"Huge stipend WFH"          → UNVERIFIABLE_PROMISE
```

Each phrase card is independently expandable. The breakdown page does not explain — it **recreates the recognition moment**, then walks the user through the mechanism.

### `report-detail.js` — Incident Analysis

When a report page loads, `report-detail.js` does the following:

1. **Scans** the submitted message text against a keyword dictionary
2. **Injects** `<span class="highlight">` wrappers around matched terms in the DOM
3. **Renders** extracted pattern tags beneath the message
4. **Queries** the database for reports sharing ≥2 matching tags
5. **Displays** a similarity count — transforming *"I think this is a scam"* into *"This exact pattern has been reported 47 times"*

That shift is the product's core value proposition.

### `submit.js` — Auto-Tag Detection

On form submission, the message field is scanned client-side before sending:

```js
// Simplified detection logic
const TAG_RULES = {
  'NO_INTERVIEW'    : ['no interview', 'without interview'],
  'PAYMENT_REQ'     : ['pay', 'registration fee', 'payment', 'deposit'],
  'URGENCY'         : ['hurry', 'urgent', 'limited seats', 'only', 'slots'],
  'FAKE_CERT'       : ['certificate', 'lor', 'letter of recommendation'],
  'FALSE_VALID'     : ['congratulations', 'selected', 'shortlisted'],
  'FALSE_PROMISE'   : ['stipend', 'earn', 'work from home']
};
```

Detected tags are attached to the report payload, enabling pattern clustering without manual moderation.

---

## ` ` CSS ARCHITECTURE

InternPhish uses a **two-file modular CSS approach**:

**`styles.css`** — Global layer
- CSS custom properties (color tokens, typography scale, spacing units)
- Base reset and body defaults
- Reusable component classes (`.btn`, `.tag`, `.report-card`, `.phrase-card`)
- The monochrome brutalist visual language lives entirely here

**`pages.css`** — Page layer
- Layout rules scoped to individual pages
- Overrides for page-specific component variants
- Responsive breakpoints per page context

This separation means: **changing the global aesthetic requires touching one file.** Page layouts are isolated. Components are portable.

---

## ` ` GETTING STARTED

### Prerequisites

```bash
# No build tools required. Pure HTML/CSS/JS.
# You need: a browser + a local server (any)
```

### Local Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/internphish.git
cd internphish

# Option 1 — Python (zero dependencies)
python -m http.server 8000

# Option 2 — Node
npx serve .

# Option 3 — VS Code
# Install "Live Server" extension → right-click index.html → Open with Live Server
```

Open `http://localhost:8000` in your browser.

### No Build Step

There is no bundler, no transpiler, no package manager. This is intentional. The stack is:

```
HTML5  ·  CSS3 (custom properties)  ·  Vanilla JS (ES6+)
```

Deployable to any static host — GitHub Pages, Netlify, Vercel, Cloudflare Pages — with zero configuration.

---

## ` ` DEPLOYMENT

```bash
# GitHub Pages
# Push to main → Settings → Pages → Source: main / root

# Netlify
# Connect repo → Build command: (none) → Publish directory: /

# Vercel
vercel --prod
```

No environment variables. No secrets. No server required for the frontend.

---

## ` ` USER FLOW

```
┌─────────────────────────────────────────────────────┐
│  LAND on index.html                                 │
│  → See familiar scam message                        │
│  → "Looks normal. That's the problem."              │
└──────────────────────┬──────────────────────────────┘
                       │
          ┌────────────▼────────────┐
          │  breakdown.html         │
          │  Guided pattern dissect │
          │  "Now I understand why" │
          └────────────┬────────────┘
                       │
          ┌────────────▼────────────┐
          │  reports.html           │
          │  Search database        │
          │  Verify suspicion       │
          └───────┬─────────┬───────┘
                  │         │
       ┌──────────▼──┐  ┌───▼──────────────┐
       │  AVOID scam │  │  submit.html      │
       │             │  │  Report new scam  │
       └─────────────┘  └──────────────────┘
```

---

## ` ` CONTRIBUTING

Contributions are welcome. This project is intentionally simple — keep it that way.

**What to contribute:**
- New scam phrase patterns for `breakdown.js`
- Additional tag detection rules in `submit.js`
- Accuracy improvements to `report-detail.js` keyword matching
- Accessibility improvements
- Verified real-world scam reports (via the submission form)

**What not to contribute:**
- Build systems, bundlers, or frameworks
- External dependencies
- UI redesigns (the aesthetic is intentional)

<details>
<summary><strong>[ EXPAND ] Contribution Guidelines</strong></summary>

<br>

1. Fork the repository
2. Create a branch: `git checkout -b feature/your-feature-name`
3. Make changes — keep JS functions small and single-purpose
4. Test in a clean browser (no cached assets)
5. Open a PR with a clear description of what changed and why

Code style: no linter config. Use 2-space indentation, descriptive variable names, and comments only where logic is non-obvious.

</details>

---

## ` ` REPORTING FALSE POSITIVES

If your organization has been incorrectly reported, contact the site owner with:

- Organization name as it appears in the report
- Verifiable evidence of legitimacy (registration docs, website, contact info)
- The report ID if available

False reports are reviewed and removed. The dispute pathway exists by design — crowdsourced systems require accountability.

---

## ` ` LEGAL

<details>
<summary><strong>[ EXPAND ] Terms of Use</strong></summary>

<br>

InternPhish is a public awareness tool. All reports are user-submitted and crowdsourced.

- We do not guarantee the accuracy of individual reports
- Information is provided for awareness purposes only
- We are not liable for decisions made based on data on this platform
- False or malicious reports may be removed without notice
- By submitting a report, you confirm it reflects your genuine experience

Full terms: [`terms.html`](terms.html)

</details>

<details>
<summary><strong>[ EXPAND ] Privacy Policy</strong></summary>

<br>

- No personal data is collected from reporters
- No login or account required to submit
- No IP address logging
- No third-party analytics or tracking
- Submitted reports may include: organization name, fee amounts, message content
- Report data is stored and made publicly searchable

Full policy: [`privacy.html`](privacy.html)

</details>

---

## ` ` ROADMAP

```
[✓] Core report submission
[✓] Searchable database
[✓] Pattern breakdown page
[✓] Auto-tag detection
[ ] Backend API + persistent database
[ ] Report verification layer
[ ] Pattern clustering (group by tag similarity)
[ ] Browser extension (passive detection)
[ ] Automated scam phrase classifier (ML, future scope)
[ ] Public API for third-party integrations
```

---

<div align="center">

```
No login. No nonsense. Just truth.
```

Made with ♥ for the fake ones who gave hope to real, yearning learners.

*Think your internship is genuine but was reported?*
[Contact the site owner →](mailto:lalityadodla@gmail.in)

---

© InternPhish · [MIT License](LICENSE) · [Privacy](privacy.html) · [Terms](terms.html)

</div>
