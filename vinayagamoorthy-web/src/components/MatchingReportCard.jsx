import { forwardRef } from 'react';
import '../styles/matchingReport.css';

// Icons in the exact same order as the backend's calculate_porutham() check
// list (Dina, Gana, Mahendra, Stree Deergha, Yoni, Rasi, Rasi Adhipathi,
// Vasiya, Rajju, Vedha, Nadi, Vruksha, Lagna, Ayul, Linga, Kendra, Varna,
// Pakshi, Naadu, Sevaka, Koodali, Additional) — provided by the client.
const PORUTHAM_ICONS = [
  '🌸', '💬', '🌿', '💍', '❤️', '🌙', '🍂', '🤝', '🧿', '⚡', '🌱',
  '🌳', '🏠', '⌛', '🔱', '🔴', '👑', '🦩', '🌍', '🟠', '👫', '📜',
];

function verdictFor(percent) {
  if (percent >= 75) return 'மிகவும் சிறந்த பொருத்தம்';
  if (percent >= 55) return 'நல்ல பொருத்தம்';
  return 'கவனமாக ஆலோசிக்கவும்';
}

function starsFor(percent) {
  const filled = Math.round((percent / 100) * 5);
  return '★'.repeat(filled) + '☆'.repeat(5 - filled);
}

const MatchingReportCard = forwardRef(function MatchingReportCard({ result }, ref) {
  const percent = Math.round((result.matched_count / result.total_count) * 100);

  return (
    <div className="report" ref={ref}>
      <div className="ornament ornament-tl">❧</div>
      <div className="ornament ornament-tr">❧</div>
      <div className="ornament ornament-bl">❧</div>
      <div className="ornament ornament-br">❧</div>

      <div className="thoranam thoranam-left">
        <span>🌼</span><div className="thoranam-chain" /><span>🌸</span><div className="thoranam-chain" /><span>🌺</span>
      </div>
      <div className="thoranam thoranam-right">
        <span>🌼</span><div className="thoranam-chain" /><span>🌸</span><div className="thoranam-chain" /><span>🌺</span>
      </div>

      <header className="header">
        <div className="header-small">ஜோதிட அடிப்படையிலான 22 பொருத்த மதிப்பீடு</div>
        <h1>திருமணப் பொருத்தம்</h1>
        <div className="header-subtitle">
          {result.boy_name} &amp; {result.girl_name} — திருமணப் பொருத்த அறிக்கை
        </div>
        <div className="gold-divider"><span>✦</span></div>
      </header>

      <section className="people-section">
        <div className="person-card">
          <div className="person-ribbon">மாப்பிள்ளை விவரம்</div>
          <PersonFields name={result.boy_name} birth={result.boy_birth} chart={result.boy} />
        </div>

        <div className="score-area">
          <div className="score-circle">
            <div className="score-caption">மொத்த பொருத்தம்</div>
            <div className="score">{percent}%</div>
            <div className="stars">{starsFor(percent)}</div>
          </div>
          <div className="result-badge">{verdictFor(percent)}</div>
        </div>

        <div className="person-card">
          <div className="person-ribbon">மணமகள் விவரம்</div>
          <PersonFields name={result.girl_name} birth={result.girl_birth} chart={result.girl} />
        </div>
      </section>

      <section className="poruththam-section">
        <div className="section-heading">
          <span>22 திருமணப் பொருத்தங்கள் — {result.matched_count} / {result.total_count}</span>
        </div>

        <div className="table-shell">
          <table>
            <thead>
              <tr>
                <th className="number-column">#</th>
                <th className="name-column">பொருத்தம்</th>
                <th>எளிய விளக்கம்</th>
                <th className="status-column">பொருத்தம்</th>
              </tr>
            </thead>
            <tbody>
              {result.poruthams.map((p, i) => (
                <tr key={p.name}>
                  <td className="number-column">{i + 1}</td>
                  <td>
                    <span className="poruththam-name">{PORUTHAM_ICONS[i]} {p.name}</span>
                  </td>
                  <td>{p.description}</td>
                  <td className="status-column">
                    <span className={`match ${p.matched ? '' : 'no'}`}>
                      <span className="match-icon">{p.matched ? '✓' : '×'}</span>
                      {p.matched ? 'பொருத்தம்' : 'பொருத்தமில்லை'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="bottom-section">
        <div className="wedding-panel">
          <img src="/assets/couple-wedding.jpg" alt="திருமண தம்பதி" />
          <div className="mangalsutra-wrap">
            <MangalsutraGraphic />
          </div>
          <div className="oil-lamp oil-lamp-left">🪔</div>
          <div className="oil-lamp oil-lamp-right">🪔</div>
        </div>

        <div className="traditional-note">
          <div className="lotus-decor lotus-tl">🪷</div>
          <div className="lotus-decor lotus-br">🪷</div>
          <div className="note-decoration">❈</div>
          <h2>குறிப்பு</h2>
          <p>
            இந்தக் கணிப்புகள் பழமையான ஜோதிடப் புத்தகங்கள்
            மற்றும் வேத நூல்களை வைத்து நுணுக்கமாக
            22 பொருத்தங்களும் கணிக்கப்பட்டுள்ளன.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-line"></div>
        <div className="calculated">CALCULATED BY</div>
        <div className="brand">VINAYAMOORTHY JOTHIDAM - T.V.P Creations</div>
        <div className="email">✉ vinayagamoorthyjothidam@gmail.com</div>
      </footer>
    </div>
  );
});

function PersonFields({ name, birth, chart }) {
  return (
    <div className="person-fields">
      <div><b>பெயர்</b><span>:</span><em>{name}</em></div>
      <div><b>பிறந்த தேதி</b><span>:</span><em>{birth?.date}</em></div>
      <div><b>பிறந்த நேரம்</b><span>:</span><em>{birth?.time}</em></div>
      <div><b>பிறந்த இடம்</b><span>:</span><em>{birth?.place}</em></div>
      <div><b>நட்சத்திரம்</b><span>:</span><em>{chart?.nakshatra}</em></div>
      <div><b>ராசி</b><span>:</span><em>{chart?.rasi}</em></div>
    </div>
  );
}

// A simple gold twin-pendant mangalsutra/thali graphic — the correct
// traditional wedding symbol (the earlier trishul emoji was thematically
// wrong; trishul is a Shiva symbol, not a marriage one).
function MangalsutraGraphic() {
  return (
    <svg width="110" height="90" viewBox="0 0 110 90">
      <defs>
        <linearGradient id="goldFill" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff2b0" />
          <stop offset="45%" stopColor="#e0a716" />
          <stop offset="100%" stopColor="#8b5a04" />
        </linearGradient>
      </defs>
      {/* chain */}
      <path d="M 40 0 Q 40 20 45 30" stroke="url(#goldFill)" strokeWidth="2.5" fill="none" />
      <path d="M 70 0 Q 70 20 65 30" stroke="url(#goldFill)" strokeWidth="2.5" fill="none" />
      {/* left disc */}
      <circle cx="42" cy="45" r="22" fill="url(#goldFill)" stroke="#5c3a02" strokeWidth="1.5" />
      <circle cx="42" cy="45" r="15" fill="none" stroke="#7a1515" strokeWidth="2" opacity="0.7" />
      <circle cx="42" cy="45" r="6" fill="#7a1515" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={42 + 15 * Math.cos((angle * Math.PI) / 180)}
          cy={45 + 15 * Math.sin((angle * Math.PI) / 180)}
          r="2.2" fill="#fff2b0"
        />
      ))}
      {/* right disc */}
      <circle cx="68" cy="45" r="22" fill="url(#goldFill)" stroke="#5c3a02" strokeWidth="1.5" />
      <circle cx="68" cy="45" r="15" fill="none" stroke="#7a1515" strokeWidth="2" opacity="0.7" />
      <circle cx="68" cy="45" r="6" fill="#7a1515" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <circle
          key={angle}
          cx={68 + 15 * Math.cos((angle * Math.PI) / 180)}
          cy={45 + 15 * Math.sin((angle * Math.PI) / 180)}
          r="2.2" fill="#fff2b0"
        />
      ))}
    </svg>
  );
}

export default MatchingReportCard;
