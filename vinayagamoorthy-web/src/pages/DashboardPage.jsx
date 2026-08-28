import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import ParchmentCard from '../components/ParchmentCard';
import RopeDivider from '../components/RopeDivider';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getMyProfile, getMyJathagam, getTodayPanchangam,
  sendChatMessage, getChatHistory,
} from '../api/client';

const QUICK_START_ITEMS = [
  { key: 'meditation', tKey: 'quick.meditation' },
  { key: 'yoga', tKey: 'quick.yoga' },
  { key: 'diet', tKey: 'quick.diet' },
  { key: 'ayurveda', tKey: 'quick.ayurveda' },
  { key: 'dosha', tKey: 'quick.dosha', route: '/dosha' },
  { key: 'vastu', tKey: 'quick.vastu', route: '/vastu' },
  { key: 'books', tKey: 'quick.books' },
];

const FEATURE_GRID = [
  { key: 'jathagam', tKey: 'feat.jathagam', subKey: 'feat.jathagam.sub', route: '/jathagam' },
  { key: 'matching', tKey: 'feat.matching', subKey: 'feat.matching.sub', route: '/matching' },
  { key: 'lucky', tKey: 'feat.lucky', subKey: 'feat.lucky.sub', route: '/lucky-notes' },
  { key: 'temples', tKey: 'feat.temples', subKey: 'feat.temples.sub', route: '/temples' },
  { key: 'panchangam', tKey: 'feat.panchangam', subKey: 'feat.panchangam.sub', route: '/panchangam' },
  { key: 'transit', tKey: 'feat.transit', subKey: 'feat.transit.sub', route: '/transit' },
];

export default function DashboardPage() {
  const { t, adoptFromProfile } = useLanguage();
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
        adoptFromProfile(profileRes.data.preferred_language);
        setChart(chartRes.data);
        setPanchangam(panchangamRes.data);
        setChatMessages(historyRes.data);
      } catch {
        setLoadError(t('common.loadError'));
      }
    }
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    } catch {
      setChatMessages((m) => [...m, { role: 'assistant', content: t('dash.chatError') }]);
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
          <h3 className="parchment-heading text-lg mb-3 text-center">{t('dash.profile')}</h3>
          <div className="flex justify-center mb-3">
            <div className="w-20 h-20 rounded-full bg-ink-brown/20 border-2 border-gold flex items-center justify-center text-3xl">
              👤
            </div>
          </div>
          {profile ? (
            <div className="text-sm space-y-1">
              <Row label={t('field.name')} value={profile.name} />
              <Row label={t('field.birthDate')} value={profile.birth.date} />
              <Row label={t('field.birthTime')} value={profile.birth.time} />
              <Row label={t('field.birthPlace')} value={profile.birth.place} />
              <Row label={t('field.nakshatra')} value={chart?.nakshatra} />
              <Row label={t('field.rasi')} value={chart?.rasi} />
              <Row label={t('field.lagna')} value={chart?.ascendant?.rasi_name_ta} />
            </div>
          ) : (
            <p className="text-center text-sm opacity-70">{t('common.loading')}</p>
          )}
          <Link to="/profile" className="btn-gold block text-center mt-4 !py-1.5 text-sm">
            {t('common.viewEditProfile')}
          </Link>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-3 text-center">{t('dash.quickStart')}</h3>
          <div className="space-y-2">
            {QUICK_START_ITEMS.map((item) => (
              <Link
                key={item.key}
                to={item.route || `/content/${item.key}`}
                state={!item.route ? { title: t(item.tKey) } : undefined}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium"
                style={{ background: 'rgba(255,255,255,0.25)', border: '1px solid rgba(107,78,46,0.3)' }}
              >
                {t(item.tKey)} <span>›</span>
              </Link>
            ))}
          </div>
        </ParchmentCard>

        <ParchmentCard>
          <h3 className="parchment-heading text-lg mb-1 text-center">{t('dash.today')}</h3>
          {panchangam ? (
            <>
              <p className="text-center text-xs opacity-70 mb-2">
                {panchangam.date} · {panchangam.vaaram}
              </p>
              <div className="text-sm space-y-1">
                <Row label={t('field.tithi')} value={`${panchangam.tithi.name_ta} (${panchangam.tithi.paksha})`} />
                <Row label={t('field.nakshatra')} value={`${panchangam.nakshatra.name_ta} ${t('field.pada')} ${panchangam.nakshatra.pada}`} />
                <Row label={t('field.yoga')} value={panchangam.yoga.name_ta} />
                <Row label={t('field.karana')} value={panchangam.karana.name_ta} />
                <Row label={t('field.sunrise')} value={panchangam.sunrise} />
                <Row label={t('field.sunset')} value={panchangam.sunset} />
                <Row label={t('field.rahuKalam')} value={`${panchangam.rahu_kalam.start} - ${panchangam.rahu_kalam.end}`} />
              </div>
            </>
          ) : (
            <p className="text-center text-sm opacity-70">{t('common.loading')}</p>
          )}
          <Link to="/panchangam" className="btn-gold block text-center mt-4 !py-1.5 text-sm">
            {t('dash.fullPanchangam')}
          </Link>
        </ParchmentCard>

        <ParchmentCard className="flex flex-col">
          <h3 className="parchment-heading text-lg mb-2 text-center">{t('dash.chatTitle')}</h3>
          <div
            className="flex-1 overflow-y-auto rounded-lg p-2 mb-2 text-sm space-y-2"
            style={{ background: 'rgba(0,0,0,0.12)', minHeight: '180px', maxHeight: '220px' }}
          >
            {chatMessages.length === 0 && (
              <p className="text-center opacity-60 italic mt-6">{t('dash.chatEmpty')}</p>
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
            {chatLoading && <p className="text-center opacity-60 text-xs">{t('dash.chatTyping')}</p>}
            <div ref={chatBottomRef} />
          </div>
          <form onSubmit={handleSendChat} className="flex gap-2">
            <input
              className="input-manuscript flex-1 !py-1.5 text-sm"
              placeholder={t('dash.chatPlaceholder')}
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
              <p className="font-semibold">{t(f.tKey)}</p>
              <p className="text-xs opacity-70 mt-1">{t(f.subKey)}</p>
            </ParchmentCard>
          </Link>
        ))}
      </div>

      <p className="text-center text-xs opacity-60 pb-4" style={{ color: 'var(--gold)' }}>
        {t('dash.footer')}
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
