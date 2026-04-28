# EN→IT Translation Audit — 2026-04-28

Generated automatically. Counts the visible body strings (h1-h4, p, a, li, span, button) on each
page that do NOT have a `data-en`/`data-it` attribute. Numbers are approximate (a regex audit; some
strings are intentionally untranslated like brand names, IDs, FCA numbers).

## How translation works

- Switcher button `#langSwitch` lives in the nav on every page.
- Shared script: `lang-switch.js` (loaded on all 45 pages). Reads `data-en` / `data-it` attributes
  and swaps `textContent` (or `innerHTML` via `data-en-html` / `data-it-html`).
- State persisted in `localStorage` under key `rcp_lang`.
- **To translate a string:** add `data-en="English"` and `data-it="Italiano"` to the element.
  No JS changes needed — the shared script auto-picks up new attributes on next page load.
- For elements with nested HTML (italic, gold spans), use `data-en-html` / `data-it-html` instead.
- For form placeholders, use `data-en-placeholder` / `data-it-placeholder`.

## Reference page

`rcp-global-markets.html` is fully translated as of this audit — use it as a copy-paste template
for hero, capability cards, regulatory panel, and CTA sections.

## Pages by untranslated body-string count (highest first)

| Page | Untranslated | Has lang-switch.js |
|------|--------------|--------------------|
| `index.html` | 125 | Yes |
| `ceo.html` | 113 | Yes |
| `nasdaq-listings.html` | 96 | Yes |
| `direct-deals.html` | 91 | Yes |
| `riccardo-perrone.html` | 90 | Yes |
| `enrico.html` | 82 | Yes |
| `giovanni-randazzo.html` | 82 | Yes |
| `rcp-srl.html` | 82 | Yes |
| `enrico-de-angelis.html` | 81 | Yes |
| `giordano.html` | 80 | Yes |
| `run-am.html` | 80 | Yes |
| `matteo-bodini.html` | 77 | Yes |
| `cesare-trebeschi.html` | 76 | Yes |
| `enrico-caporin.html` | 75 | Yes |
| `danilo-carolini.html` | 70 | Yes |
| `privacy-policy.html` | 70 | Yes |
| `asset-management.html` | 69 | Yes |
| `structured-products.html` | 65 | Yes |
| `terms-of-service.html` | 63 | Yes |
| `certificate-issuance.html` | 62 | Yes |
| `mario-fama.html` | 62 | Yes |
| `sport-wealth.html` | 62 | Yes |
| `wealth-management.html` | 61 | Yes |
| `cookie-policy.html` | 60 | Yes |
| `patrizio-caringi.html` | 60 | Yes |
| `regulatory-disclosures.html` | 60 | Yes |
| `michele-furlan.html` | 58 | Yes |
| `alice-pozzobon.html` | 55 | Yes |
| `massimo-bocci.html` | 55 | Yes |
| `giovanni-campodallorto.html` | 54 | Yes |
| `denis-rondanini.html` | 53 | Yes |
| `elena-bernardi.html` | 53 | Yes |
| `lara-covre.html` | 53 | Yes |
| `sara-longo.html` | 53 | Yes |
| `stefano-giuffra.html` | 52 | Yes |
| `wealth-advisory.html` | 50 | Yes |
| `davide-de-luca.html` | 49 | Yes |
| `insight-american-economy.html` | 48 | Yes |
| `amc-securitization.html` | 47 | Yes |
| `fund.html` | 46 | Yes |
| `insight-eterna-iii.html` | 46 | Yes |
| `insights.html` | 46 | Yes |
| `insight-doughnut-model.html` | 44 | Yes |
| `rcp-global-markets.html` | 43 | Yes |
| `3dots.html` | 1 | Yes |

**Total untranslated body strings:** 2900

## Recommended priority

1. **High traffic, high content** — service pages: `asset-management.html`, `direct-deals.html`,
   `structured-products.html`, `wealth-advisory.html`, `fund.html`, `amc-securitization.html`,
   `nasdaq-listings.html`, `certificate-issuance.html`, `wealth-management.html`, `sport-wealth.html`.
2. **Group entity pages** — `rcp-srl.html`, `run-am.html`, `ceo.html`, `3dots.html`
   (`rcp-global-markets.html` already done as the reference).
3. **Team bio pages** — Lisa noted these will be edited in the next 2 days, so they may be
   restructured. When editing, follow the convention from `rcp-global-markets.html`.
4. **Insights and policies** — lower priority; can be batched later.

## Convention reminder for future edits

Whenever you add visible text to a page, add the IT counterpart at the same time:

```html
<!-- Plain text -->
<h2 data-en="Hello" data-it="Ciao">Hello</h2>

<!-- HTML/inline tags -->
<h2 data-en-html="Have <em>questions</em>?" data-it-html="Hai <em>domande</em>?">Have <em>questions</em>?</h2>

<!-- Form placeholders -->
<input type="email" data-en-placeholder="Your email" data-it-placeholder="La tua email">
```

Do **not** add new inline `<script>` blocks duplicating `lang-switch.js`. The shared file is
loaded on every page via `<script defer src="lang-switch.js">`.
