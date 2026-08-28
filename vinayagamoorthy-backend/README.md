# Vinayagamoorthy Jothidam — Backend (Step 1)

Python/FastAPI backend with MongoDB, built to serve **both** the future web
app and mobile app from one API.

## What's included so far
- Project structure (`app/core`, `app/db`, `app/models`, `app/routers`, `app/services`)
- MongoDB connection (Motor, async driver) with index setup
- Auth: signup, login (JWT), forgot-password + OTP, reset-password
- **Core astrology engine** (`app/services/astro.py`) using the Swiss Ephemeris
  (Lahiri ayanamsa — standard for Tamil/Vedic charts). Validated against your
  sample profile (Rasi: Rishabam, Nakshatram: Rohini — matched exactly).
- `/jathagam/me` endpoint — auto-generates a user's chart from their saved
  birth details, caches it in MongoDB so it isn't recomputed every time.
- **Panchangam engine** (`app/services/panchangam.py`) — tithi, nakshatra,
  yoga, karana, vaaram, sunrise/sunset, and the three inauspicious periods
  (Rahu Kalam, Yamagandam, Gulika Kalam). Verified against known real-world
  sunrise times and standard Rahu Kalam / Yamagandam tables for Chennai.
- `/panchangam/today` endpoint — location-aware (defaults to the user's birth
  place, overridable), cached per day+location so it's computed once daily
  rather than per request.
- **Matching engine expanded to the full 22-porutham report** the client
  requested. The original 11 (validated earlier) are unchanged; 11 new
  checks added: Vruksha, Lagna, Ayul, Linga, Kendra, Varna, Pakshi
  (Panchapakshi), Naadu, Sevaka, Koodali, and a 22nd composite "additional
  horoscope" check based on Sun-rasi lordship. Each check carries the
  client's own one-line description, shown in the report. Honesty note:
  Varna and the house-distance checks (Lagna/Kendra/Sevaka/Koodali) use
  real, defensible classical logic; Vruksha and Pakshi are documented
  in-code as simplified proxies since no single universal source exists
  for computing them the way Dina/Gana/Rajju/Vedha/Nadi are standardized.
- **`POST /matching/check` now also returns `girl_birth`/`boy_birth`** (full
  birth detail objects for both people) alongside the existing chart data,
  so the frontend report can populate detail boxes for both the groom and
  bride, not just their chart-derived facts.
- `/matching/check` endpoint — takes the logged-in user's own saved chart plus
  a partner's birth details (as your spec's dialog box describes), returns
  the full porutham breakdown, and logs the match to history.
- **Lucky Notes** (`app/services/lucky_notes.py`) — per-rasi (Janma Rasi)
  lucky color/number/day/gemstone/metal/friendly-rasis, plus a matching
  "unfavorable" section, per your mockup's two-panel layout.
- **Dosha report** (`app/services/dosha.py`) — detects Kuja Dosham (Mars in
  houses 1/2/4/7/8/12 from Lagna or Moon), Grahan Dosham (Rahu/Ketu conjunct
  Sun or Moon), and Sade Sati (current Saturn transit vs. natal Moon rasi),
  each with traditional remedies.
- `/lucky-notes/me` and `/dosha/me` endpoints.
- **Temples & Pujas** — a proper content module, not live Wikipedia scraping
  (better for both copyright and reliability). Seeded with the complete set
  of 9 Navagraha temples (one per planet) plus a few major temples, all
  written fresh for this app. `/temples/for-my-doshas` connects directly to
  the dosha report — if someone has active Kuja Dosham, it surfaces
  Vaitheeswaran Koil automatically, and so on for Rahu/Ketu/Saturn.
- **Admin role**: `is_admin` on the user record (never settable via public
  signup — only by editing the database directly, e.g. in MongoDB Atlas).
  Admins can add/edit/remove temples through the API; everyone else has
  read-only access.
- **Chat with Vinayagamoorthy** (`app/services/chat.py`) — an AI assistant
  powered by the **Gemini API** (free tier via Google AI Studio), grounded in
  the user's actual chart (rasi, nakshatra, lagna, all planet positions,
  lucky notes, and active doshas) rather than answering generically. It's
  told explicitly not to invent planetary positions of its own — the real
  astrology math always comes from our own engine, Gemini's job is just
  conversing about it naturally. Conversation history is stored per-user and
  the last 10 turns are replayed as context on each new message.
- **`GET /users/me` and `PUT /users/me`** — profile read/update. Birth
  details are intentionally NOT editable through this endpoint, since
  changing them would invalidate every cached chart-derived feature in the
  app; treat that as a deliberate, separate flow if you build it later.
- **Transit Predictions** (`app/services/transit.py`) — Gochara: compares
  each planet's current position against the natal Moon rasi, using the
  classical "favorable houses from Moon" rule per planet. Uses the same
  astro.py engine as everything else, just a different lens on the same
  real planetary data.
- **Content Library rewritten with your real content** — Meditation, Yoga,
  Diet, Ayurveda, and Books now use the exact structured content you
  provided (tables, benefit sections, quotes, safety notes), not generic
  placeholder text. The content model itself changed shape to support this
  — see the schema-change note below.
- **⚠️ SCHEMA CHANGE**: `ContentArticleIn` replaced the old flat `body_ta`
  field with structured `intro_ta` / `table_headers` / `table_rows` /
  `sections` / `quote_ta` / `safety_note_ta` fields. **If you already have
  a `content_articles` collection in MongoDB Atlas from an earlier version,
  drop it before restarting the backend** so the seed can insert cleanly in
  the new shape — otherwise old and new documents will have mismatched
  fields.
- **Temples enhanced** with two new fields: `special_note` (a highlighted
  one-line callout, matching the "Special:" notes in your spec) and
  `visiting_hours`, populated for all 9 Navagraha temples.
- **Real OTP email delivery** (`app/services/email_service.py`) — plain
  SMTP, so a free Gmail account with an App Password works; no paid
  transactional email service required to get started. Fails gracefully
  (returns `False`, never raises) if unconfigured, so forgot-password still
  works in dev without breaking — it just won't actually deliver an email
  until you add SMTP credentials.
- **Palm photo upload** (`app/services/photo_upload.py`, `POST
  /users/me/palm-photo`) — via Cloudinary's free tier, since Render's
  filesystem is ephemeral and doesn't survive redeploys, so files can't be
  stored locally. Validates file type (JPEG/PNG/WEBP) and size (5MB max),
  returns a clean 503 with setup instructions if Cloudinary isn't
  configured yet, rather than crashing.
- `render.yaml` — one-click Render deployment blueprint.

## Local setup
```bash
cd vinayagamoorthy-backend
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in your MongoDB URI (Atlas free tier works fine)
uvicorn app.main:app --reload
```
Visit `http://localhost:8000/docs` for interactive API docs (auto-generated by FastAPI).

## Deploying to Render
1. Push this folder to a GitHub repo.
2. In Render: New → Blueprint → point at the repo (it will read `render.yaml`).
3. Set `MONGODB_URI` in the Render dashboard to your MongoDB Atlas connection string.
4. Deploy. `JWT_SECRET` is auto-generated by Render.

## API endpoints so far
| Method | Path | Purpose |
|---|---|---|
| POST | `/auth/signup` | Create account with birth details |
| POST | `/auth/login` | Get JWT access token |
| POST | `/auth/forgot-password` | Send OTP to email/mobile |
| POST | `/auth/reset-password` | Reset password with OTP |
| GET | `/jathagam/me` | Get (or generate) the logged-in user's full chart |
| GET | `/panchangam/today` | Today's panchangam (tithi, nakshatra, yoga, karana, rahu kalam, etc.) |
| POST | `/matching/check` | Porutham compatibility report vs. a partner's birth details |
| GET | `/lucky-notes/me` | Lucky color/number/day/stone/metal + unfavorable rasis/planets |
| GET | `/dosha/me` | Kuja Dosham, Grahan Dosham, Sade Sati detection + remedies |
| GET | `/temples` | List temples (filter by `state`, `planet`, `dosha`) |
| GET | `/temples/for-my-doshas` | Temples matching the user's currently-active doshas |
| GET | `/temples/{id}` | Single temple detail |
| POST/PUT/DELETE | `/temples` | Admin-only content management |
| POST | `/chat/message` | Send a message to Vinayagamoorthy (chart-aware AI reply) |
| GET | `/chat/history` | Retrieve the user's chat history |
| GET | `/users/me` | Get the logged-in user's profile |
| PUT | `/users/me` | Update name/email/mobile/preferred_language |
| GET | `/transit/me` | Current planetary transits vs. natal Moon rasi |
| GET | `/content` | List content articles (filter by `category`) |
| GET | `/content/{id}` | Single article detail |
| POST/PUT/DELETE | `/content` | Admin-only content management |
| POST | `/users/me/palm-photo` | Upload/replace palm photo (multipart form) |
| GET | `/health` | Health check |

## Design decisions worth knowing about
- **Swiss Ephemeris + Lahiri ayanamsa**: industry standard for sidereal Vedic
  charts. All other features (matching, panchangam, transits, lucky notes)
  should call into `app/services/astro.py` rather than recalculating anything
  — one source of truth for chart math.
- **API-first**: no HTML is served here. This lets the React web app and the
  mobile app (React Native, sharing the same JWT auth flow) both consume the
  same endpoints without duplicating any business logic.
- **Matching is a simplified classical implementation.** The 10-porutham
  tables used here are the widely-published versions most matching software
  uses; a professional astrologer may apply additional nuance (pada-level
  Rajju sub-rules, exact half-sign Vasiya boundaries). The API response
  includes a note to that effect — worth surfacing in the UI too, given how
  much weight people place on this feature.
- **Dosha remedies are cultural/religious guidance, not medical advice.**
  Every dosha response carries a note recommending consultation with a
  priest or professional astrologer before acting on remedies — keep that
  visible in the UI, not buried.
- **Making the first admin**: there's no signup flag for this on purpose (so
  no one can grant themselves admin through the API). Sign up normally, then
  in MongoDB Atlas → Browse Collections → `users`, edit that document and set
  `is_admin: true`.
- **Getting a Gmail App Password for SMTP**: Google Account → Security →
  2-Step Verification (must be enabled first) → App Passwords → generate
  one for "Mail". Use that 16-character password as `SMTP_PASSWORD`, not
  your real Gmail password.
- **SMS OTP delivery is NOT included** — only email. SMS always requires a
  paid provider (Twilio, MSG91, etc.); there's no free universal option
  worth building against speculatively. Add it later if/when you pick a
  provider.
- **Chat needs your own free Gemini API key**: get one at
  aistudio.google.com/app/apikey (no credit card required), set
  `GEMINI_API_KEY` in `.env` locally or in the Render dashboard for
  production. Without it, `/chat/message` returns a clean 502 with a message
  pointing straight at the fix, rather than crashing (tested).
  `GEMINI_MODEL` defaults to `gemini-2.5-flash-lite`, a free-tier-eligible
  model — check aistudio.google.com for current model availability, since
  Google's free-tier model lineup shifts over time.
- **Free tier has real limits**: roughly 1,000-1,500 requests/day and a low
  requests-per-minute cap as of writing. Fine for development and early
  users; if you outgrow it, enable billing on the Google Cloud project tied
  to your API key — no code changes needed, the same key keeps working.
- **Switching providers later** (e.g. to Claude, or a different Gemini
  model) only means editing `app/services/chat.py` — the grounding approach
  (feeding it your calculated chart data, instructing it never to invent
  facts) and every other module stay identical regardless of which AI
  provider sits behind the chat feature.
- **Chat cost awareness**: every message replays up to the last 10 turns of
  history plus the chart context as system prompt tokens. This is normal for
  chat apps but worth knowing before high-volume production traffic — token
  usage (and therefore cost, once past the free tier) scales with
  conversation length.
- **Shared chart caching**: `app/services/chart_service.py` is now the one
  place that fetches-or-generates a user's chart. Jathagam, Matching, Lucky
  Notes, Dosha, and Chat all read through it — keeps caching behavior
  consistent as more features get added.
- **OTP delivery is stubbed**: `/auth/forgot-password` generates and stores an
  OTP but doesn't yet send an email/SMS. Needs a provider (e.g. SendGrid for
  email, Twilio/MSG91 for SMS) — a good next decision once you're ready.
- **Palm photo**: field exists on signup (`palm_photo_url`) but actual file
  upload/storage (e.g. to S3 or Cloudinary) isn't wired up yet — that's a
  separate small module.

## Roadmap (next steps, in order)
1. ~~Project scaffolding, auth, chart engine~~ ✅
2. ~~Panchangam service~~ ✅
3. ~~Matching & Advices (porutham)~~ ✅
4. ~~Lucky Notes + Dosha remedies~~ ✅
5. ~~Temples & Pujas~~ ✅
6. ~~Chat with Vinayagamoorthy~~ ✅
7. ~~Profile update + Transit Predictions (Gochara)~~ ✅
8. ~~Content Library backend~~ ✅
9. ~~Real OTP email delivery + palm photo upload~~ ✅ (this step)
10. React web frontend — feature-complete, see the web repo
11. React Native mobile app — feature-complete code, needs real device testing
12. SMS OTP delivery (needs a paid provider — Twilio/MSG91), polish
