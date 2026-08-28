import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ParchmentCard from '../components/ParchmentCard';
import RopeDivider from '../components/RopeDivider';
import {
  getMyProfile, getMyJathagam, getTodayPanchangam,
  sendChatMessage, getChatHistory,
} from '../api/client';

const QUICK_START_ITEMS = [
  { key: 'meditation', label: 'தியானம்' },
  { key: 'yoga', label: 'யோகா' },
  { key: 'diet', label: 'உணவு' },
  { key: 'ayurveda', label: 'ஆயுர்வேதம்' },
  { key: 'dosha', label: 'தோஷ பரிகாரங்கள்', route: '/dosha' },
  { key: 'vastu', label: 'வாஸ்து' },
  { key: 'books', label: 'புத்தகங்கள்' },
];

const FEATURE_GRID = [
  { key: 'jathagam', label: 'Full Jathagam', sub: 'Create & View', route: '/jathagam' },
  { key: 'matching', label: 'Matching & Advices', sub: 'Compatibility Analysis', route: '/matching' },
  { key: 'lucky', label: 'Lucky Notes', sub: 'Personalized Notes', route: '/lucky-notes' },
  { key: 'temples', label: 'Temples & Pujas', sub: 'Pariharam & Pujas', route: '/temples' },
  { key: 'panchangam', label: 'Panchangam', sub: 'Daily Panchangam', route: '/panchangam' },
  { key: 'transit', label: 'Transit Predictions', sub: 'Planet Movements', route: '/transit' },
];

export default function DashboardPage() {
  const [profile, setProfile] = useState(null);
  const [chart, setChart] = useState(null);
  const [panchangam, setPanchangam] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    async function loadAll() {
      try {
        const [profileRes, chartRes, panchangamRes, historyRes] = await Promise.all([
          getMyProfile(), getMyJathagam(), getTodayPanchangam(), getChatHistory(),
        ]);
        setProfile(profileRes.data);
        setChart(chartRes.data);
        setPanchangam(panchangamRes.data);
        setChatMessages(historyRes.data);
      } catch (err) {
        setLoadError('தகவல்களை ஏற்றுவதில் சிக்கல். மீண்டும் முயற்சிக்கவும்.');
      }
    }
    loadAll();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  async function handleSendChat(e) {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages((m) => [...m, { role: 'user', content: userText }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const { data } = await sendChatMessage(userText);
      setChatMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages((m) => [...m, {
        role: 'assistant',
        content: 'மன்னிக்கவும், தற்போது பதிலளிக்க முடியவில்லை. பின்னர் முயற்சிக்கவும்.',
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="app-shell px-4 py-4 max-w-7xl mx-auto">
      <AppHeader userName={profile?.name} />

      {loadError && (
        <p className="error-text text-center mb-4" style={{ color: 'var(--gold-bright)' }}>{loadError}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">PROFILE</h3>
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-ink-brown/20 border-2 border-gold flex items-center justify-center text-3xl">
              👤
            </div>
          </div>
          {profile ? (
            <div className="text-sm space-y-1">
              <Row label="பெயர்" value={profile.name} />
              <Row label="பிறந்த தேதி" value={profile.birth.date} />
              <Row label="பிறந்த நேரம்" value={profile.birth.time} />
              <Row label="பிறந்த இடம்" value={profile.birth.place} />
              <Row label="நட்சத்திரம்" value={chart?.nakshatra} />
              <Row label="ராசி" value={chart?.rasi} />
              <Row label="லக்கனம்" value={chart?.ascendant?.rasi_name_ta} />
            </div>
          ) : (
            <p className="text-center text-sm opacity-70">ஏற்றுகிறது...</p>
          )}
          <Link to="/profile" className="btn-gold block text-center mt-4 !py-1.5 text-sm">
            View / Edit Profile
          </Link>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">உடனே ஆரம்பிக்கவும்</h3>
          <div className="space-y-2">
            {QUICK_START_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.route || `/content/${item.key}`}
                state={!item.route ? { title: item.label } : undefined}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(107,78,46,0.3)' }}
              >
                {item.label} <span>›</span>
              </Link>
            ))}
          </div>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-1 text-center">TODAY</h3>
          {panchangam ? (
            <>
              <p className="text-center text-xs opacity-70 mb-2">
                {panchangam.date} · {panchangam.vaaram}
              </p>
              <div className="text-sm space-y-1">
                <Row label="திதி" value={`${panchangam.tithi.name_ta} (${panchangam.tithi.paksha})`} />
                <Row label="நட்சத்திரம்" value={`${panchangam.nakshatra.name_ta} பாதம் ${panchangam.nakshatra.pada}`} />
                <Row label="யோகம்" value={panchangam.yoga.name_ta} />
                <Row label="கரணம்" value={panchangam.karana.name_ta} />
                <Row label="சூரிய உதயம்" value={panchangam.sunrise} />
                <Row label="சூரிய அஸ்தமனம்" value={panchangam.sunset} />
                <Row label="ராகு காலம்" value={`${panchangam.rahu_kalam.start} - ${panchangam.rahu_kalam.end}`} />
              </div>
            </>
          ) : (
            <p className="text-center text-sm opacity-70">ஏற்றுகிறது...</p>
          )}
          <Link to="/panchangam" className="btn-gold block text-center mt-4 !py-1.5 text-sm">
            முழு பஞ்சாங்கம்
          </Link>
        </ParchmentCard>

        <ParchmentCard className="flex flex-col">
          <h3 className="parchment-heading text-lg mb-2 text-center">CHAT WITH VINAYAGAMOORTHY!</h3>
          <div
            className="flex-1 overflow-y-auto rounded-lg p-2 mb-2 text-sm space-y-2"
            style={{ background: 'rgba(0,0,0,0.12)', minHeight: '180px', maxHeight: '220px' }}
          >
            {chatMessages.length === 0 && (
              <p className="text-center opacity-60 italic mt-6">உங்கள் ஜாதகம் பற்றி எதுவும் கேளுங்கள்...</p>
            )}
            {chatMessages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="px-3 py-1.5 rounded-lg max-w-[85%]"
                  style={{
                    background: m.role === 'user' ? 'var(--gold)' : 'rgba(255,255,255,0.5)',
                    color: 'var(--ink-brown)',
                  }}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {chatLoading && <p className="text-center opacity-60 text-xs">தட்டச்சு செய்கிறது...</p>}
            <div ref={chatBottomRef} />
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              className="input-manuscript flex-1 !py-1.5 text-sm"
              placeholder="Type here..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button type="submit" className="btn-gold !py-1.5 !px-3" disabled={chatLoading}>➤</button>
          </form>
        </ParchmentCard>
      </div>

      <RopeDivider knots={4} />

      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4 mt-4 mb-8">
        {FEATURE_GRID.map((f) => (
          <Link key={f.key} to={f.route}>
            <ParchmentCard className="text-center h-full flex flex-col items-center justify-center py-6">
              <p className="font-semibold">{f.label}</p>
              <p className="text-xs opacity-70 mt-1">{f.sub}</p>
            </ParchmentCard>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs opacity-60 pb-4" style={{ color: 'var(--gold)' }}>
        © 2026 Vinayagamoorthy Jothidam. All Rights Reserved. TVP Creations
      </p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-2">
      <span className="opacity-70">{label}:</span>
      <span className="font-semibold text-right">{value || '—'}</span>
    </div>
  );
}
