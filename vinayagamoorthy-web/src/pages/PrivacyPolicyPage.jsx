import { Link } from 'react-router-dom';
import ParchmentCard from '../components/ParchmentCard';
import SiteFooter from '../components/SiteFooter';

const EFFECTIVE_DATE = '4 September 2026';
const CONTACT_EMAIL = 'vinayagamoorthyjothidam@gmail.com';
const DELETE_URL = 'https://vinayagamoorthy-jothidam-app.tvpriyangan.workers.dev/delete-account';

function Section({ id, title, children }) {
  return (
    <ParchmentCard id={id} className="mb-4 scroll-mt-4">
      <h2 className="parchment-heading text-lg mb-3">{title}</h2>
      <div className="text-sm space-y-2 opacity-90">{children}</div>
    </ParchmentCard>
  );
}

// Public page — no login required. Kept in plain English throughout (like
// /delete-account) since this is a legal/compliance document referenced
// from Google Play's Data Safety section, not a localised in-app screen.
export default function PrivacyPolicyPage() {
  return (
    <div className="app-shell px-4 py-10">
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <div className="flex flex-col items-center mb-6">
          <img
            src="/logo.png"
            alt="Vinayagamoorthy Jothidam"
            className="w-20 h-20 rounded-full border-2 border-gold shadow-lg mb-3"
          />
          <h1 className="brand-wordmark text-2xl text-center">VINAYAGAMOORTHY</h1>
          <p className="gold-heading text-xs tracking-[0.3em] mt-1">JOTHIDAM</p>
        </div>

        <ParchmentCard className="mb-4">
          <h1 className="parchment-heading text-xl text-center mb-2">Privacy Policy</h1>
          <p className="text-xs text-center opacity-70">
            Vinayagamoorthy Jothidam · Developed by TVP Creations
            <br />
            Effective date: {EFFECTIVE_DATE}
          </p>
          <p className="text-sm mt-4 opacity-90">
            This Privacy Policy explains what information Vinayagamoorthy Jothidam ("the app",
            "we", "us") collects when you create an account and use the app, how it is used and
            stored, and the choices you have — including deleting your account and data at any
            time.
          </p>
        </ParchmentCard>

        <Section title="1. Information We Collect">
          <p>When you create an account and use the app, we collect:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Name</strong></li>
            <li><strong>Username</strong> and <strong>password</strong> (stored as a one-way hash — we never store or can see your actual password)</li>
            <li><strong>Email address</strong> (optional)</li>
            <li><strong>Phone number</strong> (optional — never verified by SMS/OTP)</li>
            <li><strong>User ID</strong> — an internal account identifier generated automatically when you sign up</li>
            <li><strong>Gender</strong> and <strong>preferred language</strong> — used for chart calculation and to show the app in your chosen language</li>
            <li><strong>Date of birth</strong>, <strong>birth time</strong>, and <strong>birth place</strong> — required to calculate your Vedic astrology chart (jathagam). Birth place is chosen from a fixed list of cities built into the app — we do not access your device's live location or GPS.</li>
            <li><strong>Palm photo</strong> (optional) — only if you choose to upload one on your Profile page</li>
          </ul>
          <p className="mt-2">
            When you use specific features, we also store the data those features naturally
            produce: your generated birth chart, your chat messages with the in-app AI astrologer
            and its replies, the partner details you enter for a compatibility (matching) check,
            and your AI-generated jathagam reading / Vastu report.
          </p>
        </Section>

        <Section title="2. How Your Data Is Collected and Used">
          <p>Your data is used only to operate the app's features:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Creating and securing your account, and signing you in (via a session token)</li>
            <li>Calculating your birth chart, panchangam, dosha report, lucky notes, and transit predictions from your birth details</li>
            <li>Generating your personalised AI jathagam reading, Vastu report, and answering your questions in the in-app chat, based on your own chart</li>
            <li>Calculating marriage compatibility (matching) reports between your chart and a partner's details you enter</li>
            <li>Sending a one-time password (OTP) to your email if you use "Forgot Password" to reset your password</li>
            <li>Showing the app and its content in your preferred language</li>
          </ul>
          <p className="mt-2">We do not use your data for advertising, and the app contains no advertising or analytics SDKs.</p>
        </Section>

        <Section title="3. Data Storage and Security">
          <ul className="list-disc pl-5 space-y-1">
            <li>Your data is stored in <strong>MongoDB Atlas</strong>, a managed cloud database.</li>
            <li>Your password is never stored in plain text — it is hashed with bcrypt before saving.</li>
            <li>Account access uses a signed session token (JWT), and every request that reads or changes your data is checked against your own token — no other user's data is accessible through your account.</li>
            <li>The app is served over HTTPS.</li>
          </ul>
        </Section>

        <Section title="4. Data Sharing">
          <p>We do not sell your data, and we do not share it for advertising or marketing purposes. Your data is only sent to the following services, strictly to operate the features you use:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Google Gemini API</strong> — to generate your AI jathagam reading, Vastu report, and in-app astrologer chat replies, your name, gender, birth date/time/place, and calculated chart details (rasi, nakshatra, planetary positions, current dasha/transits) are sent to Google's Gemini API as context for that one response. Your email, phone number, and password are never sent to Gemini.</li>
            <li><strong>Cloudinary</strong> — if you choose to upload a palm photo, it is stored with Cloudinary, an image hosting service.</li>
            <li><strong>Email delivery (SMTP)</strong> — if you request a password reset, the OTP is emailed to you through our email sending provider.</li>
            <li><strong>Hosting providers</strong> — the app's backend runs on Render and the web app is served via Cloudflare Workers; both process data only to run and deliver the app.</li>
          </ul>
        </Section>

        <Section title="5. Data Retention">
          <p>
            We keep your account and associated data for as long as your account exists, so the
            app can keep showing your chart, readings, and history without recalculating them
            every time. Password-reset OTPs are temporary and expire automatically a short time
            after they're issued. When you delete your account (see below), your data is deleted
            — see the exact deletion steps in Section 6.
          </p>
        </Section>

        <Section title="6. Account Deletion">
          <p>You can permanently delete your account and all associated data at any time:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>In the app:</strong> Profile → Delete Account → confirm.</li>
            <li>
              <strong>On the web, without the app:</strong>{' '}
              <a href={DELETE_URL} className="underline font-semibold break-all" style={{ color: 'var(--ink-brown)' }}>
                {DELETE_URL}
              </a>
            </li>
          </ul>
          <p className="mt-2">
            Deleting your account immediately and permanently removes your profile, birth chart,
            jathagam reading, matching/compatibility history, chat history, Vastu report, and
            uploaded palm photo from our database. This action cannot be undone.
          </p>
        </Section>

        <Section title="7. Your Rights and Control">
          <ul className="list-disc pl-5 space-y-1">
            <li>You can view and edit your profile details (name, email, mobile, preferred language) any time from the Profile page.</li>
            <li>You can replace or remove your palm photo from the Profile page.</li>
            <li>You can permanently delete your account and data at any time (Section 6).</li>
            <li>To ask what data we hold about you, or for any other privacy request, contact us using the details in Section 10.</li>
          </ul>
        </Section>

        <Section title="8. Children's Privacy">
          <p>
            Vinayagamoorthy Jothidam is not directed at children and is not intended for use by
            anyone under 13 years of age. We do not knowingly collect personal information from
            children under 13. If you believe a child has created an account or provided personal
            information without appropriate parental consent, please contact us using the details
            in Section 10 and we will delete the associated account and data.
          </p>
        </Section>

        <Section title="9. Changes to This Privacy Policy">
          <p>
            We may update this Privacy Policy from time to time — for example, if we add a new
            feature that uses your data differently. The "Effective date" at the top of this page
            will always reflect the latest version. We encourage you to review this page
            periodically.
          </p>
        </Section>

        <Section title="10. Contact Us">
          <p>
            If you have questions about this Privacy Policy or how your data is handled, contact
            us at:
          </p>
          <p>
            <a
              href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Privacy Policy Enquiry')}`}
              className="font-semibold underline break-all"
              style={{ color: 'var(--ink-brown)' }}
            >
              {CONTACT_EMAIL}
            </a>
          </p>
        </Section>

        <div className="text-center mt-2 mb-2">
          <Link to="/login" className="text-xs underline" style={{ color: 'var(--gold)' }}>
            ← Back to Login
          </Link>
        </div>

        <SiteFooter className="!py-3" />
      </div>
    </div>
  );
}
