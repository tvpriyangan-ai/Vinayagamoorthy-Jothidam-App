# Vinayagamoorthy Jothidam — Mobile App (Step 1)

React Native (Expo) app, reusing the exact same FastAPI backend as the web
app — no duplicated business logic, just a native client hitting the same
endpoints.

## What's included in this step
- **Design system** (`src/theme/theme.js`): same palette and typography
  language as the web app (Cinzel for headings, Catamaran for Tamil-capable
  body text, Cormorant Garamond italic for manuscript flavor text) —
  React Native has no CSS, so gradients use `expo-linear-gradient` and the
  parchment card/rope-divider are built as native components instead of
  CSS classes.
- **API client** (`src/api/client.js`): every backend endpoint through
  Step 9 already wired up, using `AsyncStorage` for token persistence
  (the RN equivalent of the web app's `localStorage`).
- **Login, Signup, Forgot Password screens** — full auth flow, matching
  the web app's fields (name, username, password, gender, email, mobile,
  birth date/time/place via native date/time pickers).
- **Auth-aware navigation**: `AuthContext` + React Navigation automatically
  switches between the auth stack and the app stack based on login state —
  no manual "navigate to dashboard" calls needed after login/signup.

## ⚠️ Important limitation of this development environment
I built this without access to a phone simulator or physical device, so I
could **not** visually screenshot-test these screens the way I did for the
web app. What I verified instead:
- The entire app bundles successfully via Metro (`expo export`) — 927
  modules, zero errors. This catches any broken import, typo, or structural
  JSX problem.
- **A real bug was caught and fixed through direct testing, not just
  review**: the birth-date picker was using `.toISOString()` to format the
  date, which converts to UTC first — for anyone in a positive-UTC-offset
  timezone (India included, this app's actual audience), this silently
  shifts the selected date back by one day. Confirmed the bug by simulating
  an `Asia/Kolkata` device timezone, then fixed it to read local calendar
  fields directly, and re-verified the fix produces the correct date.
- What I have **not** been able to verify: actual visual layout on a real
  screen, touch interactions, keyboard behavior, or platform-specific
  quirks (iOS vs Android date picker differences, safe-area insets on
  notched devices, etc.). Please test on a real device or simulator before
  relying on this, and let me know what you find — I can fix issues once
  you report them, I just can't discover visual-only issues myself here.
- **Dashboard chat box IS now scrollable and clipped** — an earlier version
  used a plain `View` with `maxHeight`, which doesn't clip overflow in React
  Native. On a real device this caused chat replies to visibly spill out of
  their box into the card below. Fixed by using a nested `ScrollView` with
  `overflow: 'hidden'` and auto-scroll-to-bottom on new messages. Found via
  actual device testing — exactly the kind of bug that can't be caught by
  bundling/compiling alone.
- **Fixed: header overlapping the phone's status bar.** The app wasn't
  accounting for safe-area insets (notch, status bar, home indicator).
  Fixed at the single shared root — `AppBackground` (used by every screen)
  now applies `useSafeAreaInsets()` padding, wrapped in a `SafeAreaProvider`
  at the app root. This fixes the issue everywhere at once, not just on
  the Dashboard.
- **South Indian chart on mobile**: React Native has no CSS grid-span, so
  the fixed-position rasi chart (same layout as the web app) is built with
  nested flexbox rows/columns instead — a left column (2 stacked cells), a
  tall center cell for the Lagna label, and a right column (2 stacked
  cells), sandwiched between a plain top row and bottom row. Visually this
  should match the web version's layout; genuinely can't confirm without a
  device.
- **All 8 feature screens reuse the exact same data shapes as the web app**
  (same API responses, same field names) — if the web version's numbers are
  correct for a given user, the mobile version's should be too, since both
  read from the identical backend endpoints.

## Local setup
```bash
cd vinayagamoorthy-mobile
npm install
npx expo start
```
Scan the QR code with the Expo Go app (iOS/Android) to run it on your phone,
or press `a`/`i` in the terminal for an Android/iOS simulator if you have
one set up locally.

## Connecting to your backend
Edit `API_BASE_URL` in `src/api/client.js`:
- **Android emulator**: `http://10.0.2.2:8000` (already set as the default —
  this is a special alias Android emulators use to reach your computer's
  `localhost`)
- **Physical phone via Expo Go**: your computer's LAN IP, e.g.
  `http://192.168.1.42:8000` — phone and computer must be on the same WiFi
- **iOS simulator**: `http://localhost:8000` works directly
- **Deployed backend**: your Render URL, e.g.
  `https://your-app.onrender.com`

## Design decisions worth knowing about
- **Fonts load via `@expo-google-fonts` packages**, not a CSS `@import` —
  the app shows nothing (splash screen stays up) until fonts finish loading,
  matching how the web app's fonts block render via the `<link>` tag.
- **Common-places picker for signup**, same as the web app — no paid
  geocoding API wired up yet. Swap `src/data/places.js` for a real
  autocomplete later if needed.
- **`10.0.2.2` default**: this will NOT work untouched on a physical device
  or iOS simulator — see "Connecting to your backend" above.

## Roadmap (next steps, in order)
1. ~~Project scaffold, design system, auth screens~~ ✅
2. ~~Full Dashboard (Profile, Quick-Start, Today, Chat, feature grid)~~ ✅
3. ~~Feature screens: Jathagam, Matching, Lucky Notes, Temples, Panchangam, Dosha, Transit, Profile~~ ✅ (this step)
4. Real device/simulator testing pass — please report anything visually off
5. App store preparation (icons, splash screen art, store listings)
6. Content library (Meditation/Yoga/Diet/Ayurveda/Vastu/Books) — still placeholder, matches web app's current state
