# Vinayagamoorthy Jothidam — Web Frontend (Step 1)

React (Vite) + Tailwind v4 frontend, built to match your mockup's aged
palm-leaf manuscript theme exactly, and wired to the FastAPI backend from
the earlier steps.

## What's included in this step
- **Design system** (`src/styles/theme.css`): dark vignette background,
  aged-parchment cards, gold ornamental trim, and a twisted-rope divider —
  the signature recurring element, echoing how real palm-leaf manuscripts
  are bound together with cord.
- **API client** (`src/api/client.js`): every backend endpoint from steps
  1–6 already wired up, with JWT auto-attached to requests and automatic
  redirect to `/login` on a 401.
- **Login page** — full auth flow against `/auth/login`.
- **Signup page** — collects name, username, password, gender, email,
  mobile, and birth details (date/time/place). Place selection currently
  uses a small preset list of common cities (`src/data/places.js`) with
  known coordinates, so signup works without needing a paid geocoding API
  key yet — swap this for a real Places autocomplete later if you want
  users to enter any city.
- **Forgot Password page** — two-step OTP flow against `/auth/forgot-password`
  and `/auth/reset-password`.
- **Protected routing** — `/dashboard` (currently a placeholder) redirects
  to `/login` if there's no token.
- Your actual logo (`public/logo.png`) wired in as favicon and on the auth
  pages — not a placeholder image.

## Local setup
```bash
cd vinayagamoorthy-web
npm install
cp .env.example .env   # point VITE_API_BASE_URL at your backend
npm run dev
```
Open http://localhost:5173 — make sure the backend (from the earlier steps)
is running too, e.g. `uvicorn app.main:app --reload` on port 8000.

## Deploying
This is a static site once built (`npm run build` → `dist/`). You can deploy
it to Render as a Static Site (build command `npm run build`, publish
directory `dist`), Vercel, Netlify, or any static host. Set
`VITE_API_BASE_URL` to your deployed backend's Render URL as a build-time
environment variable wherever you host it.

## Design decisions worth knowing about
- **Tailwind v4**: uses the new CSS-first config (no `tailwind.config.js`) —
  theme tokens live in `@theme` inside `theme.css`. If you're used to v3,
  this is different but simpler once you're used to it.
- **Contrast fix already applied**: an early screenshot check caught the
  card headings (light gold on light parchment) being unreadable — fixed
  with a separate `.parchment-heading` class (dark bronze) distinct from
  `.gold-heading` (light gold, only for text on the dark background).
- **Mobile-first sizing**: tested at both a 480px viewport (typical phone
  width) and 1280px desktop — confirmed the top 4-card row collapses to a
  single column on mobile and the 6-button grid becomes 2 columns.
- **Dashboard is live-data, tested end to end**: signed up a real test user
  through the browser and confirmed Profile, Today's panchangam, and the
  chat box all pull real calculated data from the backend (not mocked) —
  including confirming the displayed Rasi/Nakshatra matched the backend's
  own validated output from earlier testing.
- **Chat lives directly on the Dashboard** (matching your mockup's layout)
  rather than a separate page — it's fully wired to `/chat/message` and
  `/chat/history` already, including a graceful in-chat error bubble if the
  AI provider is unreachable or not yet configured (tested).
- **Feature pages are placeholders for now** (`ComingSoonPage`): clicking
  any of the 6 bottom buttons or most Quick-Start items navigates correctly
  but shows "coming soon" rather than 404ing — honest about what's built
  vs. not, and the routes are already wired up for the next step to fill in.
- **New backend endpoint added**: `GET /users/me` (returns profile fields
  the Dashboard needed that `/jathagam/me` didn't have, like name and raw
  birth details) — see the updated backend zip.
- **All 6 feature pages tested end-to-end with real backend data**, not
  just visually reviewed: signed up a real test user through the browser
  for each one and cross-checked the displayed values against the backend's
  own earlier-validated output. Notably: the Jathagam page's South Indian
  chart grid was checked planet-by-planet against the data table (Mars in
  Mesham, Moon in Rishabam, Sun/Jupiter/Venus/Ketu correctly grouped in
  Kadagam, Lagna marker on Thulam — all correct); the Dosha page's temple
  recommendations were confirmed to match the exact temples validated back
  in backend Step 5 testing; and the Matching page was confirmed to give
  gender-direction-sensitive results correctly (swapping which party is
  "boy" vs "girl" changes the Dina/Mahendra/Stree-Deergha results, as it
  should per the traditional calculation).
- **South Indian chart style**: rasi boxes are fixed to positions (unlike
  North Indian style where houses rotate with the ascendant) — this is
  standard for Tamil astrology software. The Lagna is marked with "ல" and a
  gold highlight on whichever box holds the ascendant's rasi.
- **Temples page uses expand/collapse cards** rather than a separate detail
  route, to keep this step's scope manageable — revisit as a dedicated
  `/temples/:id` page later if the description content grows longer.
- **Matching result rebuilt as a full formal report** matching the client's
  exact reference design — groom/bride detail boxes (name, birth date/time/
  place, nakshatra, rasi), a circular percentage + 5-star rating, a verdict
  badge, and the full 22-porutham table with each check's description and
  a colored pass/fail status pill. `html2canvas` still captures it into a
  real downloadable JPEG — tested end-to-end with an actual file download
  and visual review of the resulting image.
- **Matching report is now the client's own provided design**, ported
  faithfully from their `index.html`/`style.css`/`script.js` into
  `MatchingReportCard.jsx` + `src/styles/matchingReport.css` (scoped under
  `.report` to avoid clashing with the rest of the app), driven by real
  computed data instead of the static placeholders in their template. Uses
  the client's provided wedding-couple illustration
  (`public/assets/couple-wedding.jpg`).
  **⚠️ That image is the Adobe Stock preview/comp version — it has a visible
  watermark and preview ID. A licensed clean copy is needed before this
  goes live.**
  Verified end-to-end: real downloaded JPEG confirms the CSS
  `conic-gradient` score circle, ornamental corners, and full 22-row table
  all render correctly through `html2canvas` — not something to assume,
  since `conic-gradient` support in canvas-capture libraries is often
  incomplete.
- **Header and bottom section enhanced to match the client's actual
  reference image** (their sample had richer decoration than their own
  code files initially specified): added hanging floral garlands
  (thoranam) at both top corners, a correct gold twin-pendant mangalsutra/
  thali SVG graphic above the wedding photo (replacing an earlier 🔱
  trishul emoji, which was thematically wrong — trishul is a Shiva symbol,
  not a marriage one), two lit oil lamp (🪔) icons flanking the photo, and
  lotus flower accents on the note panel. Verified in an actual downloaded
  JPEG, not just the live page — cropped and zoomed into the file itself to
  confirm the SVG mangalsutra and lamp icons render correctly through
  html2canvas.
- **Photos are session-only, not uploaded anywhere** — `URL.createObjectURL`
  on the selected file, used only to render the image locally for the
  download. No new backend storage needed for this feature specifically
  (separate from the existing profile palm-photo upload).
- **Real bug caught and fixed via live testing**: FastAPI validation errors
  arrive as an array of objects, not a plain string — five pages (Login,
  Signup, Forgot Password, Matching, Profile) were rendering that array
  directly, which crashes React ("Objects are not valid as a React child").
  Fixed with a shared `extractErrorMessage()` helper in `api/client.js` that
  every page now uses — this is exactly the kind of bug that only surfaces
  when you actually trigger a validation error, not from visual review.
- **Transit Predictions (Gochara)**: shows each planet's current position
  and whether it's traditionally favorable relative to the natal Moon sign,
  using the same backend engine as everything else.
- **Profile page** deliberately keeps birth details read-only — changing
  them would invalidate every chart-derived feature in the app, so that's
  flagged as a separate, more deliberate flow to build later rather than a
  simple edit field.
- **Photo upload UI is live** — Profile page now has a working "add/change
  photo" flow calling the backend's Cloudinary-backed upload endpoint.
  Tested end-to-end through a real browser: signed up, navigated to
  Profile, uploaded a test image, confirmed the button text updates and
  the new photo persists.
- **Content Library is real now, not placeholder**: `ContentPage.jsx` reads
  the `:category` URL param and fetches matching articles from the backend.
  The Quick-Start menu's item keys already matched the backend's category
  slugs exactly (`meditation`, `yoga`, `diet`, `ayurveda`, `vastu`, `books`)
  — no changes needed there, just pointing the route at a real page.
  Tested live: clicked through from the Dashboard's Quick-Start menu,
  confirmed category filtering and expand/collapse both work correctly.

## Roadmap (next steps, in order)
1. ~~Project scaffold, design system, auth pages~~ ✅
2. ~~Full Dashboard matching your mockup~~ ✅
3. ~~Feature pages: Jathagam, Matching, Lucky Notes, Temples, Panchangam, Dosha~~ ✅
4. ~~Transit Predictions + Profile view/edit~~ ✅
5. ~~Content Library (Meditation/Yoga/Diet/Ayurveda/Vastu/Books)~~ ✅ (this step)
6. React Native mobile app — feature-complete code, needs real device testing
