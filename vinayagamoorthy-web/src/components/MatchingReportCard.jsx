import { forwardRef } from 'react';
import { useT } from '../i18n/LanguageContext';
import '../styles/matchingReport.css';

// Icons in the same order as the backend's calculate_porutham() check list.
const PORUTHAM_ICONS = [
  '🌸', '💬', '🌿', '💍', '❤️', '🌙', '🍂', '🤝', '🧿', '⚡', '🌱',
  '🌳', '🏠', '⌛', '🔱', '🔴', '👑', '🦩', '🌍', '🟠', '👫', '📜',
];

function starsFor(percent) {
  const filled = Math.max(1, Math.round((percent / 100) * 5));
  return { filled, empty: 5 - filled };
}

const MatchingReportCard = forwardRef(function MatchingReportCard({ result }, ref) {
  const t = useT();
  const percent = Math.round((result.matched_count / result.total_count) * 100);
  const { filled, empty } = starsFor(percent);

  const verdictKey = percent >= 75 ? 'mr.verdictVeryGood' : percent >= 55 ? 'mr.verdictGood' : 'mr.verdictConsider';
  const isGood = percent >= 55;

  return (
    <div className="report" ref={ref}>
      <main className="report-page">
        <div className="outer-border">
          <div className="inner-border">

            <header className="report-header">
              <div className="top-label">{t('mr.topLabel')}</div>
              <Ornament side="left" />
              <Ornament side="right" />
              <div className="header-ganesha">ॐ</div>
              <div className="header-title">
                <h1>{t('mr.title')}</h1>
                <div className="subtitle">◆ {result.boy_name} &amp; {result.girl_name} ◆</div>
              </div>
              <div className="header-kalasam">🪔</div>
            </header>

            <section className="hero-grid">
              <DetailCard
                t={t}
                title={t('mr.groomDetails')}
                symbol="🤵"
                name={result.boy_name}
                birth={result.boy_birth}
                chart={result.boy}
                lagna={result.boy_full_chart?.ascendant?.rasi_name_ta}
              />

              <section className="score-card">
                <div className="score-caption">{t('mr.totalCompat')}</div>
                <div className="score-ring">
                  <div className="score">{percent}<span>%</span></div>
                  <div className="stars">
                    {'★'.repeat(filled)}<b>{'★'.repeat(empty)}</b>
                  </div>
                </div>
                <div className={`good-badge${isGood ? '' : ' warn'}`}>{t(verdictKey)}</div>
              </section>

              <DetailCard
                t={t}
                title={t('mr.brideDetails')}
                symbol="👰"
                name={result.girl_name}
                birth={result.girl_birth}
                chart={result.girl}
                lagna={result.girl_full_chart?.ascendant?.rasi_name_ta}
              />
            </section>

            <section className="table-section">
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
                          <span className="factor-icon">{PORUTHAM_ICONS[i]}</span><b>{p.name}</b>
                        </td>
                        <td>{p.description}</td>
                        <td>
                          <span className={`result ${p.matched ? 'yes' : 'no'}`}>
                            <span className="result-dot">{p.matched ? '✓' : '×'}</span>
                            {p.matched ? t('mr.match') : t('mr.noMatch')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="couple-art">
                <div className="art-frame">
                  <div className="mandala">☸</div>
                  <div className="couple">
                    <div className="person groom"><span>🤵</span><em>👑</em></div>
                    <div className="fire">🪔<strong>🔥</strong>🪔</div>
                    <div className="person bride"><span>👰</span><em>🌸</em></div>
                  </div>
                  <div className="lotus">🪷</div>
                </div>
              </div>

              <SummaryCard title={t('mr.summary')} icon="◆">
                {result.note}
              </SummaryCard>

              <SummaryCard title={t('mr.recommendation')} icon="ॐ">
                {t('mr.recommendationBody')}
              </SummaryCard>
            </section>

            <footer className="report-footer">
              <div className="footer-rule">◆ ━━━━━━━━━━ ◆</div>
              <div className="calculated">{t('mr.calculatedBy')}</div>
              <div className="brand">VINAYAGAMOORTHY JOTHIDAM — TVP CREATIONS</div>
              <div className="email">✉ vinayagamoorthyjothidam@gmail.com</div>
              <div className="footer-rule">◆ ━━━━━━━━━━ ◆</div>
            </footer>

          </div>
        </div>
      </main>
    </div>
  );
});

function Ornament({ side }) {
  return (
    <div className={`ornament ornament-${side}`} aria-hidden="true">
      <span>✦</span><i>◆</i><span>✦</span>
    </div>
  );
}

function DetailCard({ t, title, symbol, name, birth, chart, lagna }) {
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
      <div className="detail-inner">
        <div className="detail-symbol" aria-hidden="true">{symbol}</div>
        <div className="details">
          {rows.map(([label, value]) => (
            <div className="detail-row" key={label}>
              <strong>{label}</strong>
              <span className="leader" />
              <span>{value || '—'}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SummaryCard({ title, children, icon }) {
  return (
    <section className="summary-card">
      <div className="summary-corner" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      <div className="summary-rule">◆ ━━━━━ ◆</div>
      <p>{children}</p>
    </section>
  );
}

export default MatchingReportCard;
