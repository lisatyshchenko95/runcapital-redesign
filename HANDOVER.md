# Run Capital Redesign — Handover

Lisa → Ice. Project is live, no blockers. This doc covers what matters day one.

## What's deployed

- **Production:** https://runcapital-redesign.vercel.app
- **Host:** Vercel (lisa-tyshchenkos-projects team, project `runcapital-redesign`)
- **Deploy:** `vercel --prod --yes` from the project root. No build step — it's static HTML/CSS/JS.

## Stack

Static site. No framework, no bundler.
- **45 HTML pages** (homepage, 8 services, 8 group entities, team bios, insights, policies)
- **style.css** — 3000+ lines, all shared styles
- **opening.css, amc-style.css** — page-specific overrides
- **contact-modal.js** — global mailto interceptor, shows a universal modal so people without a mail app can copy `info@runcapital.partners`
- **video-fallback.js** — captures frame 0 of hero videos as poster for iOS Low Power Mode (no ffmpeg needed, pure canvas)
- **lang-switch.js** — EN/IT language toggle. Reads `data-en` / `data-it` attributes on any element and swaps `textContent`. State persisted in `localStorage` under `rcp_lang`. See "Translation convention" below.

All three JS files are injected into every HTML page via `<script defer src="...">` before `</body>`.

## Translation convention (EN → IT)

The site is bilingual. The toggle button (`#langSwitch`, top-right of nav) is on every page and the shared `lang-switch.js` handles the rest.

**To translate any string, add the IT counterpart on the same element:**

```html
<!-- Plain text (most common) -->
<h2 data-en="Capabilities" data-it="Competenze">Capabilities</h2>

<!-- Element contains nested HTML (italic, gold spans, etc.) -->
<h2 data-en-html="Have <em>questions</em>?" data-it-html="Hai <em>domande</em>?">Have <em>questions</em>?</h2>

<!-- Form placeholders -->
<input data-en-placeholder="Your email" data-it-placeholder="La tua email">
```

The script auto-discovers any element with `data-en*` attributes on page load — no JS edits needed when adding new content. **Always add `data-it` at the same time you add new English copy** (otherwise the page partly translates and looks broken when IT is selected).

`rcp-global-markets.html` is the canonical reference page — fully translated, copy patterns from there.

A page-by-page audit of remaining gaps lives in `TRANSLATION_AUDIT.md` (regenerate with the script in that file's footer).

**Do not** add inline `<script>` blocks that duplicate `lang-switch.js`. Some older pages still have minified inline copies — they're idempotent so they don't break anything, but new pages should rely on the shared file only.

## Key conventions

- **CSS vars:** `--gold`, `--gold-light`, `--gold-dark`, `--cream`, `--dark`, `--white`, `--font-serif` (Playfair Display), `--font-sans` (Inter), `--ease-out-expo`
- **"Get in Touch" nav button (top-right):** on EVERY page links to `index.html#contact` — the homepage contact form. Do not change this per-page; it's intentionally unified.
- **Contact modal (`contact-modal.js`):** auto-catches any `<a href="mailto:...">` click and shows a modal with copy-to-clipboard. To bypass it (e.g., for the modal's own "Open in Email App" button or the footer email link), add `data-rcp-skip` to the anchor.
- **Contact form (on index.html):** submits to FormSubmit.co AJAX at `https://formsubmit.co/ajax/info@runcapital.partners`. FormSubmit requires a one-time activation click the first time; if form submissions stop working, check the confirmation email.

## Pages worth knowing

- `index.html` — homepage. Contact form lives at `#contact` (anchor at the bottom).
- `asset-management.html` — reference for the "Luxembourg Team" circular-portrait section. Photos in `images/team/`.
- `sport-wealth.html` — has its own team section (Luca + Massimo, inline styles `.sw-team*`). Massimo has no photo yet — shows gold "MB" initials. Drop `images/team/massimo-bocci.jpg` and swap the `<span class="sw-member__initials">MB</span>` for `<img src="images/team/massimo-bocci.jpg" alt="Massimo Bocci">` to activate.
- `insight-*.html` (3 pages) — article layout. Recently widened to 1140px content / 860px prose; SVG illustrations removed per request.
- `rcp-global-markets.html`, `rcp-srl.html`, `run-am.html`, `fund.html`, `ceo.html`, `direct-deals.html`, `amc-securitization.html`, `3dots.html` — group entity pages.

## Team photos

Located in `images/team/`:
- `luca-padovan.jpg`, `giordano-tomasini.jpg`, `enrico-de-angelis.jpg`, `giovanni-campodallorto.jpg`, `stefano-giuffra.jpg`

Missing (fallback to initials on bylines/team cards):
- `massimo-bocci.jpg` — Sport & Wealth page shows "MB"
- `davide-de-luca.jpg` — insight-american-economy.html and insight-doughnut-model.html bylines show "DD"

## Recent behavior changes (context, not code)

- All `<a class="nav__cta">Get in Touch</a>` point to `index.html#contact` (done across 43 pages).
- `article-hero__visual` SVG illustrations deleted from all 3 insight pages — title now spans full width.
- IVASS registration paragraph removed from overview section of `rcp-srl.html` (stat badges and footer regulatory line still reference it — intentional).
- "For advisory, distribution, and sport & wealth mandates..." line removed from `rcp-global-markets.html` contact section.
- RCP Global Markets CTA button was "Speak with London" → now just "Contact Us".

## How to deploy

```bash
cd /Users/lisatyshchenko/runcapital-redesign
vercel --prod --yes
```

That's it. No build, no tests. Takes ~10 seconds.

## Open items / nice-to-haves

1. **Massimo Bocci photo** — drop `images/team/massimo-bocci.jpg` and swap the span in `sport-wealth.html` (~line 230ish of the new sw-team block).
2. **Davide De Luca photo** — same pattern for `insight-american-economy.html` and `insight-doughnut-model.html` bylines (currently show "DD" gold circle via `.author-avatar--lg`).
3. **Giovanni byline photo** — `giovanni-campodallorto.jpg` exists but `insight-eterna-iii.html` still shows "GC" initials. Swap `<span class="author-avatar author-avatar--lg">GC</span>` for `<img>` and wrap the byline in `<a href="giovanni-campodallorto.html">` to link to his profile.
4. **FormSubmit activation** — if the contact form on index.html has never received a submission, the first one will bounce an activation email to `info@runcapital.partners`. Someone needs to click the link in that email once.

## Don't touch

- `contact-modal.js` and `video-fallback.js` — they work. Any change needs to be tested on iOS Safari Low Power Mode + a phone without a mail client configured.
- The `data-rcp-skip` attribute pattern — removing it will cause infinite modal loops.

## Contact

- Email everything goes to: `info@runcapital.partners`
- Vercel dashboard: https://vercel.com/lisa-tyshchenkos-projects/runcapital-redesign

---

Good luck. Ping Lisa if anything is on fire.
