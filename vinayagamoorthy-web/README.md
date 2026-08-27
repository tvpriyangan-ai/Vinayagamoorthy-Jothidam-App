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
- **Mobile-first sizing**: tested at a 480px viewport (typical phone width)
  since this app will eventually also ship as a mobile app reusing the same
  backend — worth continuing to check both mobile and desktop as more pages
  are built.

## Roadmap (next steps, in order)
1. ~~Project scaffold, design system, auth pages~~ ✅ (this step)
2. Full Dashboard matching your mockup (Profile, Today, Chat, 6-button grid)
3. Feature pages: Jathagam, Matching, Lucky Notes, Temples, Panchangam, Dosha
4. Chat interface
5. React Native mobile app (reusing the same backend API)
