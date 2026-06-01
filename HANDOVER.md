# Run Capital Partners — Website Handover Document

**Original date:** May 4, 2026  
**Last updated:** May 11, 2026  
**Prepared for:** Alice (RCP Assistant) and any IT person taking over

---

## 1. What This Is

This is the complete source code for the Run Capital Partners website at **https://runcapital.partners**. It is a static HTML/CSS website — no backend, no database, no build step. You edit HTML files directly and deploy.

---

## 2. Where Everything Lives

| What | Where |
|---|---|
| **Source Code** | GitHub: `https://github.com/lisatyshchenko95/runcapital-redesign` |
| **Hosting** | Vercel: `https://vercel.com` (project: `runcapital-redesign`) |
| **Domain DNS** | Squarespace (DNS managed via Google Cloud DNS) |
| **Live Site** | `https://runcapital.partners` |
| **Backup URL** | `https://runcapital-redesign-zeta.vercel.app` |

---

## 3. Tech Stack

- **Pure HTML/CSS** — no framework, no React, no build tools
- **Fonts:** Google Fonts (Playfair Display, Inter, Cinzel, Cormorant Garamond)
- **Hosting:** Vercel (free tier, static files)
- **Version Control:** Git + GitHub
- **No database, no server, no backend**

---

## 4. Project Structure

```
runcapital-redesign/
├── index.html                  # Homepage
├── style.css                   # Main shared CSS
├── opening.css                 # Homepage-specific CSS
├── amc-style.css               # CSS for service pages
├── video-fallback.js           # iOS video autoplay fix
├── contact-modal.js            # Contact modal
├── favicon.png                 # Browser tab icon (RCP logo)
│
├── # SERVICE PAGES
├── asset-management.html
├── amc-securitization.html
├── structured-products.html
├── funds-distribution.html
├── direct-deals.html
├── wealth-advisory.html
├── sport-wealth.html
├── nasdaq-listings.html
├── wealth-management.html
├── certificate-issuance.html
│
├── # GROUP ENTITY PAGES
├── rcp-global-markets.html     # London
├── run-am.html                 # Luxembourg
├── rcp-srl.html                # Italy
│
├── # TEAM BIO PAGES (1 per person)
├── ceo.html                    # Luca Padovan
├── cesare-trebeschi.html
├── enrico-fiore.html           # Enrico Fiore
├── enrico-caporin.html
├── enrico-de-angelis.html
├── michele-furlan.html
├── matteo-bodini.html
├── giordano-tomasini.html      # Giordano Tomasini
├── giovanni-randazzo.html
├── giovanni-campodallorto.html
├── stefano-giuffra.html
├── danilo-carolini.html
├── massimo-bocci.html
├── denis-rondanini.html
├── patrizio-caringi.html
├── riccardo-perrone.html
├── alice-pozzobon.html
├── sara-longo.html
├── lara-covre.html
├── mario-fama.html
├── davide-de-luca.html
├── elena-bernardi.html
│
├── # INSIGHT ARTICLES
├── insights.html
├── insight-eterna-iii.html
├── insight-american-economy.html
├── insight-doughnut-model.html
│
├── # LEGAL PAGES
├── privacy-policy.html
├── cookie-policy.html
├── terms-of-service.html
├── regulatory-disclosures.html
│
├── # OTHER
├── linkedin-banner.html        # LinkedIn banner generator
│
├── # IMAGES & ASSETS
├── images/                     # Subfolder images
├── logos/                      # Institutional-partner logos (white silhouettes + originals)
├── videos/                     # Hero videos
├── *.jpg                       # Team photos (root level)
├── og-*.png, og-*.jpg          # Open Graph preview images
├── rcp-logo.png                # RCP logo
├── cambridge.jpg, trento.jpg, lse.jpg  # University photos
└── ...
```

---

## 5. How to Make Changes

### Simple text/content changes:
1. Open the `.html` file in any text editor (VS Code recommended)
2. Find the text you want to change
3. Edit and save
4. Deploy (see section 6)

### Adding a new team member:
1. Copy an existing bio page (e.g., `denis-rondanini.html`)
2. Replace name, title, photo, summary, expertise, career, contact email
3. Add their photo as `firstname-lastname.jpg` in the root folder
4. Add a link to them on `index.html` (team section) and relevant service pages
5. Deploy

### Updating the footer:
The footer is duplicated in every HTML file. To change it, you must update it in **all** HTML files.

### CSS:
- **Global styles:** `style.css`
- **Homepage:** `opening.css`
- **Service pages:** `amc-style.css`
- **Bio pages:** each has inline `<style>` in the `<head>`

---

## 6. How to Deploy

### Option A: Vercel CLI
```bash
cd runcapital-redesign
vercel --prod
```

### Option B: Git push (then deploy from Vercel)
```bash
git add .
git commit -m "your change description"
git push
vercel --prod
```

### Option C: Vercel Dashboard
1. Go to https://vercel.com
2. Find project `runcapital-redesign`
3. Click "Deployments" > "Redeploy"

---

## 7. How to Get the Files (Backup / ZIP)

### Download as ZIP:
1. Go to https://github.com/lisatyshchenko95/runcapital-redesign
2. Click the green **"Code"** button
3. Click **"Download ZIP"**

### Or clone via Git:
```bash
git clone https://github.com/lisatyshchenko95/runcapital-redesign.git
```

---

## 8. Domain & DNS Configuration

| Setting | Value |
|---|---|
| **Domain** | `runcapital.partners` |
| **DNS Provider** | Squarespace / Google Cloud DNS |
| **A Record** | `@` → `216.198.79.1` (Vercel) |
| **CNAME** | `www` → `69a14985654c6807.vercel-dns-O17.com.` |
| **TXT** | `_vercel` → verification string |

If the site goes down, check these DNS records in Squarespace are still pointing to Vercel.

---

## 9. Accounts Needed

| Service | What For | Who Has Access |
|---|---|---|
| **GitHub** (`lisatyshchenko95`) | Source code repository | Lisa |
| **Vercel** | Hosting & deployment | Isaiah / project team |
| **Squarespace** | Domain DNS management | Luca / Lisa |

---

## 10. Important Notes

- **No build step** — all HTML/CSS/JS files are served exactly as they are, including `api/contact.js`, which uses Node's built-in `fetch` and has **zero npm dependencies** (no `package.json`).
- **Contact form → EU serverless function.** The homepage form posts JSON to `/api/contact` (a Vercel Serverless Function), **not** to a third-party form service. The function is pinned to Vercel's **Frankfurt region (`fra1`, set in `vercel.json`)** so submitted personal data is received inside the EU, then delivered by email to `info@runcapital.partners` via **Resend (EU region)**. This was a GDPR requirement — FormSubmit.co (US, no DPA/SCC) was removed. Resend was chosen over Google-Workspace SMTP because it needs only an API key we control, with no dependency on RCP's Google admin settings.
  - **Required Vercel env var** (Project → Settings → Environment Variables): `RESEND_API_KEY` = a Resend API key (create the Resend account in the **EU region**). Optional: `MAIL_TO` (default `info@runcapital.partners`), `MAIL_FROM` (default `Run Capital Partners <noreply@runcapital.partners>` — must be an address on a domain verified in Resend).
  - **One-time Resend setup:** create a Resend account (EU region), verify the `runcapital.partners` domain by adding the DNS records Resend provides (SPF/DKIM, added in Squarespace / Google Cloud DNS), then generate the API key.
  - Without the API key the form returns a 500 and the user is told to email directly. Set it before/right after deploy.
- **Mobile responsive** — all pages work on desktop and mobile.
- **EN/IT language toggle** — built into pages using `data-en` / `data-it` attributes.
- **Footer** — same across all pages, must be updated in each file individually.
- **OG meta tags** — each page has Open Graph tags for link preview images (WhatsApp, LinkedIn).
- **Videos** — hero videos autoplay silently. `video-fallback.js` handles iOS.
- **Future changes via Claude Code** — this project can continue to be maintained using Claude Code. Open the project folder and describe what you need.

---

## 11. Emergency: Site Down?

1. Check if `https://runcapital-redesign-zeta.vercel.app` works (bypasses DNS)
2. If yes → DNS issue. Check Squarespace DNS records match section 8 above.
3. If no → Vercel issue. Log into Vercel and check deployment status.
4. To quickly restore → redeploy from Vercel dashboard.

---

## 12. Recent Updates (since first handover, May 4 2026)

### New offices
- **Rome office** added to the footer of all 44 pages: *Via Leonida Bissolati 54, 00187*
- Hero locations pill on the homepage now includes **Rome / Roma**

### Homepage
- Institutional Partners marquee rebuilt with current partners: **Actarus Renewables, Eterna Capital, BBVA, Vontobel, Leonteq, UBS, Marex, J. Safra Sarasin, Goldman Sachs**
- New `logos/` folder holds the original brand PNGs and the **white-silhouette** versions (`*-white.png`) actually rendered in the marquee
- Italian hero title changed: *"Il Tuo Percorso Patrimoniale"* → *"La Tua Boutique Finanziaria"* (EN unchanged)
- Marquee gap, ordering and per-logo size/position tuned (small inline `transform:` styles on a few entries — Leonteq, Marex, Goldman, Eterna)

### Team
- **Index team grid** re-ordered. Leadership tier: Luca Padovan · Cesare Trebeschi · Enrico Fiore · **Giovanni Randazzo** (promoted from full team) · Enrico Caporin. Michele Furlan moved to the full team.
- **Wealth Advisory page** team grid expanded to 4 members: Luca Padovan, Riccardo Perrone, **Patrizio Caringi**, **Enrico Caporin**. Layout is 4 in a row on desktop, 2 per row on mobile.
- Contact CTA on Wealth Advisory now mails `r.perrone@runcapital.partners`

### Title changes (applied across all pages where the person appears)
- **Riccardo Perrone**: `Relationship Manager` → **`Family Officer`** (EN + IT)
- **Enrico De Angelis**: `Business Development` → **`Director, Run AM`** on the index, his bio, and `run-am.html`. Stays `Director` / `Direttore` on `asset-management.html`.
- **Mario Famà** timeline (American Express role): IT label `Agente Commerciale` → `Sales Agent` (matches EN, no translation toggle for this term)

### Bio page rewrites
- **Giovanni Randazzo** — full rewrite from CV. New title direction (V. President RCP + Director RRCAPITAL Luxembourg), 25+ years experience, real career timeline (Run Capital Partners, SerendiEquity, Prisma SGR, Gruppo KGS, MIPAAF Technical Secretariat, Compagnia Fondiaria Nazionale, Gruppo Managest), real credentials (Univ. of Palermo Economics & Commerce 1996, Chartered Accountant 1994, IVASS Section E No. 00546121)
- **Danilo Carolini** — rewritten to highlight his international career. Title is now **Head of Alternative Investments**. 7-entry timeline (Run Capital Partners, otala.markets London, Gold Grain Capital VP→Head, BZH Capital Partners NY, Collins Dale Capital Partners London, Macrobond Financial NY intern, Capvision Shanghai intern). Meta items: Based in London · Markets London · New York · Shanghai · Focus Alternative Investments
- **Riccardo Perrone** — added a new credential card "Professional Registered with the Ministry" / *"Professionista nel Registro del Ministero"* (license authorising advisory to family offices)
- **Enrico De Angelis** — removed the Finexia Capital Sarl timeline entry

### Assets
- **Sara Longo** — new portrait (`sara-longo.jpg` replaced; cache-busted via `?v=3`)
- **Sport & Wealth page** — tennis-cliff pane removed from the cinematic band (now shows only the forest pitch). New og:image for `/sport-wealth` is `images/sport/forest-pitch-overhead.jpg`

### Mobile / iOS fixes
- Wealth Advisory team grid: 4-columns desktop, 2-columns mobile
- Hero locations pill on mobile: **Rome** centered on its own row (5 pills total)
- Danilo Carolini bio meta items: **Focus** now wraps to its own line on mobile so "Alternative Investments" isn't clipped
- Giovanni Randazzo bio: `<meta name="format-detection" content="telephone=no">` added so iOS Safari no longer auto-links the IVASS registration number `00546121` as a phone number

### Filename changes
- `enrico.html` → `enrico-fiore.html`
- `giordano.html` → `giordano-tomasini.html`
- `fund.html` → `funds-distribution.html`

---

## 13. Future Development

- Changes can be made by any developer with access to the GitHub repo
- Claude Code can be used for AI-assisted changes — just open the project and describe what you need
- No special environment setup needed — just a text editor and Git
