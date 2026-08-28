import { useCallback, useEffect, useState } from 'react';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import Loading from '../components/Loading';
import { useLanguage } from '../i18n/LanguageContext';
import { getMyVastuReport } from '../api/client';

export default function VastuPage() {
  const { t, language } = useLanguage();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openKey, setOpenKey] = useState(null);

  const load = useCallback(
    async (refresh = false) => {
      setLoading(true);
      try {
        const res = await getMyVastuReport(language, refresh);
        setData(res.data);
        setOpenKey(res.data?.report?.sections?.[0]?.key ?? null);
      } catch {
        setData({ available: false, detail: t('vastu.unavailable') });
      } finally {
        setLoading(false);
      }
    },
    [language, t],
  );

  useEffect(() => { load(false); }, [load]);

  return (
    <FeaturePageShell title={t('vastu.title')} wide>
      {loading && (
        <ParchmentCard>
          <Loading text={t('vastu.loading')} />
        </ParchmentCard>
      )}

      {!loading && !data?.available && (
        <ParchmentCard>
          <p className="text-center opacity-80 text-sm py-3">{t('vastu.unavailable')}</p>
          {data?.detail && <p className="text-center opacity-50 text-xs">{data.detail}</p>}
          <div className="text-center mt-3">
            <button onClick={() => load(true)} className="btn-gold !py-1.5 !px-4 text-sm">
              {t('vastu.regenerate')}
            </button>
          </div>
        </ParchmentCard>
      )}

      {!loading && data?.available && (
        <ParchmentCard>
          <h3 className="parchment-heading text-xl mb-1 text-center">
            {data.report.title || t('vastu.title')}
          </h3>
          {data.report.intro && (
            <p className="text-sm text-center opacity-80 mb-4 font-manuscript italic">{data.report.intro}</p>
          )}

          <div className="space-y-2">
            {data.report.sections.map((s) => {
              const open = openKey === s.key;
              return (
                <div key={s.key} className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(40,24,10,0.3)' }}>
                  <button
                    onClick={() => setOpenKey(open ? null : s.key)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-semibold text-sm"
                    style={{ background: 'rgba(255,255,255,0.28)' }}
                  >
                    <span>{s.heading}</span>
                    <span aria-hidden="true">{open ? '−' : '+'}</span>
                  </button>
                  {open && (
                    <p className="px-3 py-3 text-sm leading-relaxed" style={{ background: 'rgba(255,255,255,0.12)' }}>
                      {s.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {data.report.disclaimer && (
            <p className="text-xs opacity-60 mt-4 text-center">{data.report.disclaimer}</p>
          )}
          <div className="flex items-center justify-between mt-3 gap-2">
            <p className="text-[11px] opacity-45">{t('vastu.aiNote')}</p>
            <button onClick={() => load(true)} className="btn-gold !py-1 !px-3 text-xs shrink-0">
              {t('vastu.regenerate')}
            </button>
          </div>
        </ParchmentCard>
      )}
    </FeaturePageShell>
  );
}
