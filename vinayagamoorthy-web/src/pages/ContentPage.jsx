import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FeaturePageShell from '../components/FeaturePageShell';
import ParchmentCard from '../components/ParchmentCard';
import { listContent } from '../api/client';

const CATEGORY_TITLES = {
  meditation: 'தியானம்', yoga: 'யோகா', diet: 'உணவு',
  ayurveda: 'ஆயுள் வேதம்', vastu: 'வாஸ்து', books: 'புத்தகங்கள்',
};

const CATEGORY_ICONS = {
  meditation: '🧘', yoga: '🕉️', diet: '🍚', ayurveda: '🌿', vastu: '🏠', books: '📖',
};

export default function ContentPage() {
  const { category } = useParams();
  const [articles, setArticles] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    setArticles(null);
    listContent(category)
      .then((res) => setArticles(res.data))
      .catch(() => setError('கட்டுரைகளை ஏற்ற முடியவில்லை.'));
  }, [category]);

  const title = CATEGORY_TITLES[category] || category;
  const icon = CATEGORY_ICONS[category] || '✨';

  return (
    <FeaturePageShell title={`${icon} ${title}`} wide>
      {error && <ParchmentCard><p className="error-text text-center">{error}</p></ParchmentCard>}
      {!articles && !error && <ParchmentCard><p className="text-center opacity-70">ஏற்றுகிறது...</p></ParchmentCard>}
      {articles?.length === 0 && (
        <ParchmentCard><p className="text-center opacity-70">இந்த பகுதியில் இன்னும் கட்டுரைகள் இல்லை.</p></ParchmentCard>
      )}
      {articles?.map((a) => <ArticleCard key={a.id} article={a} />)}
    </FeaturePageShell>
  );
}

function ArticleCard({ article: a }) {
  return (
    <ParchmentCard className="mb-5">
      <h3 className="parchment-heading text-xl mb-3 text-center">{a.title_ta}</h3>
      <p className="text-sm leading-relaxed mb-4 whitespace-pre-line">{a.intro_ta}</p>

      {a.table_rows?.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          {a.table_title_ta && (
            <h4 className="font-semibold text-sm mb-2 flex items-center gap-1">
              <span>📋</span> {a.table_title_ta}
            </h4>
          )}
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr style={{ background: 'rgba(216,180,92,0.35)' }}>
                {a.table_headers.map((h, i) => (
                  <th key={i} className="text-left p-2 border" style={{ borderColor: 'rgba(107,78,46,0.3)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {a.table_rows.map((row, ri) => (
                <tr key={ri} style={{ background: ri % 2 === 0 ? 'rgba(255,255,255,0.15)' : 'transparent' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-2 border align-top" style={{ borderColor: 'rgba(107,78,46,0.2)' }}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {a.sections?.map((s, i) => (
        <div key={i} className="mb-4 rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.2)' }}>
          <h4 className="font-semibold text-sm mb-1.5 flex items-center gap-1">
            <span>✦</span> {s.heading}
          </h4>
          <p className="text-sm whitespace-pre-line leading-relaxed">{s.body}</p>
        </div>
      ))}

      {a.quote_ta && (
        <div
          className="my-4 p-3 rounded-lg text-center italic font-manuscript text-base"
          style={{ background: 'rgba(216,180,92,0.2)', borderLeft: '4px solid var(--gold)' }}
        >
          "{a.quote_ta}"
        </div>
      )}

      {a.safety_note_ta && (
        <div
          className="p-3 rounded-lg text-xs"
          style={{ background: 'rgba(122,35,24,0.12)', border: '1px solid rgba(122,35,24,0.3)' }}
        >
          <span className="font-semibold" style={{ color: 'var(--alert-red)' }}>⚠️ குறிப்பு: </span>
          {a.safety_note_ta}
        </div>
      )}

      {a.reference_links?.length > 0 && (
        <div className="mt-4 pt-3 border-t" style={{ borderColor: 'rgba(107,78,46,0.2)' }}>
          <p className="text-xs font-semibold mb-1">மேலும் அறிய:</p>
          {a.reference_links.map((link, i) => (
            <a key={i} href={link} target="_blank" rel="noopener noreferrer"
               className="text-xs underline block" style={{ color: 'var(--ink-brown)' }}>
              {link}
            </a>
          ))}
        </div>
      )}
    </ParchmentCard>
  );
}
