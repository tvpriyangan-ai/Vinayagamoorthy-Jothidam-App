import { forwardRef } from 'react';

const COLORS = {
  inkBlack: '#150d07',
  emberBrown: '#2c1c0f',
  parchmentLight: '#f3e2bd',
  gold: '#d8b45c',
  goldBright: '#f0d68a',
  inkBrown: '#3a2812',
  successGreen: '#1f6b3a',
  alertRed: '#7a2318',
};

function StatBox({ title, name, birth, chart, isGroom }) {
  return (
    <div style={{
      flex: 1, background: 'rgba(255,255,255,0.06)', border: `1.5px solid ${COLORS.gold}`,
      borderRadius: 10, padding: '12px 16px', color: COLORS.goldBright,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13,
        marginBottom: 8, color: COLORS.gold,
      }}>
        <span>{isGroom ? '\u{1F935}' : '\u{1F470}'}</span> {title}
      </div>
      <FieldRow label="பெயர்" value={name} />
      <FieldRow label="பிறந்த தேதி" value={birth?.date} />
      <FieldRow label="பிறந்த நேரம்" value={birth?.time} />
      <FieldRow label="பிறந்த இடம்" value={birth?.place} />
      <FieldRow label="நட்சத்திரம்" value={chart?.nakshatra} />
      <FieldRow label="ராசி" value={chart?.rasi} />
    </div>
  );
}

function FieldRow({ label, value }) {
  return (
    <div style={{ display: 'flex', fontSize: 11.5, marginBottom: 4, color: '#f5e6c8' }}>
      <span style={{ width: 78, opacity: 0.75, flexShrink: 0 }}>{label}</span>
      <span>: {value || '—'}</span>
    </div>
  );
}

function StarRating({ percent }) {
  const starCount = Math.round((percent / 100) * 5 * 2) / 2; // supports half-stars
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (starCount >= i) stars.push('\u2605');
    else if (starCount >= i - 0.5) stars.push('\u2BE8');
    else stars.push('\u2606');
  }
  return <div style={{ fontSize: 18, color: COLORS.gold, letterSpacing: 2 }}>{stars.join('')}</div>;
}

const MatchingResultCard = forwardRef(function MatchingResultCard(
  { result, onDownloaded }, ref
) {
  const percent = Math.round((result.matched_count / result.total_count) * 100);
  const verdict = percent >= 75 ? 'மிகவும் சிறந்த பொருத்தம்'
    : percent >= 55 ? 'நல்ல பொருத்தம்'
    : 'கவனமாக ஆலோசிக்கவும்';
  const verdictColor = percent >= 55 ? COLORS.successGreen : COLORS.alertRed;

  return (
    <div
      ref={ref}
      style={{
        width: 760, background: `linear-gradient(160deg, ${COLORS.emberBrown} 0%, ${COLORS.inkBlack} 100%)`,
        border: `4px solid ${COLORS.gold}`, borderRadius: 14, padding: '24px 30px', position: 'relative',
        fontFamily: "'Catamaran', sans-serif", color: COLORS.parchmentLight,
      }}
    >
      <div style={{ position: 'absolute', top: 8, left: 12, fontSize: 20, color: COLORS.gold }}>&#10047;&#10047;</div>
      <div style={{ position: 'absolute', top: 8, right: 12, fontSize: 20, color: COLORS.gold }}>&#10047;&#10047;</div>

      <h1 style={{
        fontFamily: "'Cinzel', serif", textAlign: 'center', fontSize: 30, letterSpacing: 1,
        background: `linear-gradient(180deg, ${COLORS.goldBright}, ${COLORS.gold})`,
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 2,
      }}>
        திருமணப் பொருத்த அறிக்கை
      </h1>
      <div style={{ textAlign: 'center', fontSize: 12.5, color: COLORS.goldBright, opacity: 0.9, marginBottom: 16 }}>
        ஜாதக அடிப்படையிலான 22 பொருத்த மதிப்பீடு
      </div>

      <div style={{ display: 'flex', gap: 14, alignItems: 'stretch', marginBottom: 18 }}>
        <StatBox title="மாப்பிள்ளை விவரம்" name={result.boy_name} birth={result.boy_birth} chart={result.boy} isGroom />
        <div style={{
          width: 150, flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', border: `2px solid ${COLORS.gold}`, borderRadius: '50%',
          aspectRatio: '1', background: 'radial-gradient(circle, rgba(216,180,92,0.15), transparent)',
        }}>
          <div style={{ fontSize: 11, color: COLORS.goldBright, opacity: 0.85 }}>மொத்த பொருத்தம்</div>
          <div style={{
            fontFamily: "'Cinzel', serif", fontSize: 34, fontWeight: 800, color: COLORS.goldBright,
            lineHeight: 1.1,
          }}>
            {percent}%
          </div>
          <StarRating percent={percent} />
        </div>
        <StatBox title="மணமகள் விவரம்" name={result.girl_name} birth={result.girl_birth} chart={result.girl} />
      </div>

      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <span style={{
          background: verdictColor, color: '#fff3d6', fontSize: 12, fontWeight: 700,
          padding: '5px 16px', borderRadius: 20, border: `1px solid ${COLORS.gold}`,
        }}>
          {verdict}
        </span>
      </div>

      <div style={{
        textAlign: 'center', background: 'rgba(216,180,92,0.15)', border: `1px solid ${COLORS.gold}`,
        borderRadius: 8, padding: '6px 0', marginBottom: 4, fontWeight: 700, fontSize: 16,
        color: COLORS.goldBright, letterSpacing: 1,
      }}>
        22 திருமணப் பொருத்தங்கள் — {result.matched_count} / {result.total_count}
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11.5, marginTop: 8 }}>
        <thead>
          <tr style={{ background: 'rgba(216,180,92,0.2)', color: COLORS.goldBright }}>
            <th style={cellStyle(true)}>#</th>
            <th style={{ ...cellStyle(true), textAlign: 'left' }}>பொருத்தம்</th>
            <th style={{ ...cellStyle(true), textAlign: 'left' }}>எளிய விளக்கம்</th>
            <th style={cellStyle(true)}>நிலை</th>
          </tr>
        </thead>
        <tbody>
          {result.poruthams.map((p, i) => (
            <tr key={p.name} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'transparent' }}>
              <td style={cellStyle()}>{i + 1}</td>
              <td style={{ ...cellStyle(), textAlign: 'left', fontWeight: 600 }}>{p.name}</td>
              <td style={{ ...cellStyle(), textAlign: 'left', opacity: 0.85 }}>{p.description}</td>
              <td style={cellStyle()}>
                <span style={{
                  display: 'inline-block', padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700,
                  background: p.matched ? 'rgba(46,139,87,0.25)' : 'rgba(178,34,34,0.25)',
                  color: p.matched ? '#8fd9a8' : '#f0a3a3',
                }}>
                  {p.matched ? '\u2713 பொருத்தம்' : '\u2717 இல்லை'}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{
        marginTop: 18, paddingTop: 12, borderTop: `1px solid ${COLORS.gold}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10.5,
      }}>
        <div style={{ maxWidth: 380, opacity: 0.8, fontStyle: 'italic' }}>
          இந்த கணிப்புகள் பாரம்பரிய ஜோதிட நூல்களை வைத்து கணக்கிடப்பட்டுள்ளன. இறுதி முடிவுக்கு முன் ஒரு
          அனுபவமிக்க ஜோதிடரிடம் ஆலோசனை பெறவும்.
        </div>
        <div style={{ textAlign: 'right', color: COLORS.goldBright }}>
          <div style={{ fontWeight: 700 }}>CALCULATED BY</div>
          <div style={{ fontFamily: "'Cinzel', serif", fontSize: 13 }}>VINAYAGAMOORTHY JOTHIDAM</div>
          <div style={{ opacity: 0.85 }}>— TVP Creations —</div>
        </div>
      </div>
    </div>
  );
});

function cellStyle(isHeader) {
  return {
    padding: '5px 8px',
    textAlign: 'center',
    border: '1px solid rgba(216,180,92,0.25)',
    fontWeight: isHeader ? 700 : 400,
  };
}

export default MatchingResultCard;
