import { forwardRef } from 'react';
import { useT } from '../i18n/LanguageContext';
import '../styles/matchingReport.css';

// Small glyph per porutham, in the backend's check-list order.
const PORUTHAM_ICONS = [
  '🌸', '💬', '🌿', '💍', '❤', '🌙', '🍂', '🤝', '🧿', '⚡', '🌱',
  '🌳', '🏠', '⌛', '🔱', '⚥', '👑', '🦚', '🌍', '⚙', '👫', '📜',
];
const ZODIAC = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// <img> that quietly removes itself if the asset file isn't present yet.
function DecoImg({ src, className, alt = '' }) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="eager"
      onError={(e) => { e.currentTarget.style.display = 'none'; }}
    />
  );
}

const MatchingReportCard = forwardRef(function MatchingReportCard({ result }, ref) {
  const t = useT();
  const percent = Math.round((result.matched_count / result.total_count) * 100);
  const filled = Math.max(1, Math.round((percent / 100) * 5));

  const verdictKey = percent >= 75 ? 'mr.verdictVeryGood' : percent >= 55 ? 'mr.verdictGood' : 'mr.verdictConsider';
  const good = percent >= 55;

  const groomZ = ZODIAC[result.boy_full_chart?.planets?.Moon?.rasi_index] || '';
  const brideZ = ZODIAC[result.girl_full_chart?.planets?.Moon?.rasi_index] || '';

  return (
    <div className="report" ref={ref}>
      <main className="report-page">
        <div className="outer-border">
          <div className="inner-border">

            <header className="report-header">
              <DecoImg className="deco-ganesha" src="/assets/report-ganesha.png" />
              <DecoImg className="deco-kalasam" src="/assets/report-kalasam.png" />
              <DecoImg className="deco-lamp-hang" src="/assets/report-lamp.png" />

              <div className="mantra">ॐ ॥ ஸ்ரீ கணபதயே நம: ॥ ॐ</div>
              <div className="top-label">{t('mr.topLabel')}</div>
              <div className="header-title">
                <h1>{t('mr.title')}</h1>
                <div className="subtitle">{result.boy_name} &amp; {result.girl_name}</div>
              </div>
              <div className="om-sep" aria-hidden="true">ॐ</div>
            </header>

            <section className="hero-grid">
              <DetailCard t={t}
                title={t('mr.groomDetails')} zodiac={groomZ}
                name={result.boy_name} birth={result.boy_birth} chart={result.boy}
                lagna={result.boy_full_chart?.ascendant?.rasi_name_ta} />

              <section className="score-card">
                <div className="score-coin">
                  <div className="cap">{t('mr.totalCompat')}</div>
                  <div className="pct">{percent}<span>%</span></div>
                  <div className="stars">{'★'.repeat(filled)}<b>{'★'.repeat(5 - filled)}</b></div>
                </div>
                <div className={`verdict-pill${good ? ' good' : ''}`}>{t(verdictKey)}</div>
              </section>

              <DetailCard t={t}
                title={t('mr.brideDetails')} zodiac={brideZ}
                name={result.girl_name} birth={result.girl_birth} chart={result.girl}
                lagna={result.girl_full_chart?.ascendant?.rasi_name_ta} />
            </section>

            <div className="section-title">
              <span />
              <h2>{t('mr.matchesHeading')} — {result.matched_count} / {result.total_count}</h2>
              <span />
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>{t('mr.colFactor')}</th>
                    <th>{t('mr.colExplanation')}</th>
                    <th>{t('mr.colResult')}</th>
                  </tr>
                </thead>
                <tbody>
                  {result.poruthams.map((p, i) => (
                    <tr key={p.name}>
                      <td className="number">{i + 1}</td>
                      <td className="factor">
                        <span className="factor-icon" aria-hidden="true">{PORUTHAM_ICONS[i]}</span> {p.name}
                      </td>
                      <td>{p.description}</td>
                      <td>
                        <span className={`result-mark ${p.matched ? 'yes' : 'no'}`}>
                          <span className="dot">{p.matched ? '✓' : '✕'}</span>
                          {p.matched ? t('mr.match') : t('mr.noMatch')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <section className="bottom-grid">
              <div className="couple-art">
                <div className="frame">
                  <DecoImg src="/assets/report-couple.png" alt="" />
                  <div className="couple-emoji" aria-hidden="true">
                    <span>🤵</span><span className="fire">🔥</span><span>👰</span>
                  </div>
                </div>
              </div>

              <div className="note-card">
                <div className="lotus" aria-hidden="true">🪷</div>
                <h3>{t('mr.noteTitle')}</h3>
                <p>{result.note}</p>
                <p>{t('mr.noteCount', { n: result.matched_count, total: result.total_count })}</p>
              </div>
            </section>

            <footer className="report-footer">
              <DecoImg className="deco-footer" src="/assets/report-peacock.png" />
              <DecoImg className="deco-footer-left" src="/assets/report-manuscript.png" />
              <div className="calc">{t('mr.calculatedBy')}</div>
              <div className="brand">VINAYAGAMOORTHY JOTHIDAM — TVP CREATIONS</div>
              <div className="mail">✉ vinayagamoorthyjothidam@gmail.com</div>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
});

function DetailCard({ t, title, name, birth, chart, lagna, zodiac }) {
  const rows = [
    [t('field.name'), name],
    [t('field.birthDate'), birth?.date],
    [t('field.birthTime'), birth?.time],
    [t('field.birthPlace'), birth?.place],
    [t('field.nakshatra'), chart?.nakshatra],
    [t('field.rasi'), chart?.rasi],
    [t('field.lagna'), lagna],
  ];
  return (
    <section className="detail-card">
      <div className="ribbon">{title}</div>
      <div className="details">
        {rows.map(([label, value]) => (
          <div className="detail-row" key={label}>
            <strong>{label}</strong>
            <span className="colon">:</span>
            <span className="val">{value || '—'}</span>
          </div>
        ))}
      </div>
      {zodiac && <div className="zodiac" aria-hidden="true">{zodiac}</div>}
    </section>
  );
}

export default MatchingReportCard;
