/*
  Engraved line-art motifs — traditional over generic icon-font glyphs.
  Stroke-only, currentColor, so CSS controls size and tint.
  <Motif name="jathagam" />
*/
const P = {
  // ── service tablets ──────────────────────────────────────────
  jathagam: <><rect x="3" y="3" width="18" height="18" rx="1" /><path d="M3 9h18M3 15h18M9 3v18M15 3v18" /><path d="M12 10.5l.8 1.7 1.7.2-1.25 1.2.3 1.7L12 14.7l-1.55.8.3-1.7L9.5 12.4l1.7-.2z" /></>,
  matching: <><circle cx="9" cy="12" r="5" /><circle cx="15" cy="12" r="5" /><path d="M12 8.2c.9 1 1.4 2.4 1.4 3.8S12.9 14.8 12 15.8" /></>,
  lucky: <><path d="M5 19c6-1 11.5-6.5 13.5-15C10 6 4.5 11.5 5 19z" /><path d="M5 19l3.5-3.5M9.5 13.5c1.5-.4 3-.6 4.5-.6M11 10.5c1.3-.2 2.6-.2 3.9 0" /></>,
  temples: <><path d="M3 21h18M5 21v-3h14v3M7 18l1.5-3h7L17 18M9 15l1-3h4l1 3M11 12V9h2v3M9.5 9L12 5.5 14.5 9M12 3.2v1.6" /></>,
  panchangam: <><circle cx="12" cy="12" r="7.5" /><path d="M12 3.5V6M12 18v2.5M3.5 12H6M18 12h2.5M6.05 6.05l1.8 1.8M16.15 16.15l1.8 1.8M17.95 6.05l-1.8 1.8M7.85 16.15l-1.8 1.8" /><path d="M12 12l3.5-2" /></>,
  transit: <><circle cx="12" cy="12" r="4.5" /><ellipse cx="12" cy="12" rx="10" ry="3.4" transform="rotate(-20 12 12)" /></>,
  // ── quick-start rows ─────────────────────────────────────────
  meditation: <><circle cx="12" cy="5.5" r="2.3" /><path d="M12 7.8v4.4M6.5 19c1-4.5 3.2-6.8 5.5-6.8s4.5 2.3 5.5 6.8M6.5 19c1.6 1.1 3.6 1.1 5.5 0 1.9 1.1 3.9 1.1 5.5 0" /></>,
  yoga: <><circle cx="12" cy="4.5" r="1.9" /><path d="M12 6.4v6M12 9l-4 2.6M12 9l4-1.8M12 12.4l-3 7.6M12 12.4c1.9 1.9 2.9 4.4 3 7.6" /></>,
  diet: <><path d="M4 11h16a8 8 0 0 1-16 0z" /><path d="M4.6 11c.8-3 3-4.6 7.4-4.6s6.6 1.6 7.4 4.6M9 5.2c0 1.1 6 1.1 6 0" /></>,
  ayurveda: <><path d="M12 21V8" /><path d="M12 13.2c-3 0-5-2-5-5.2 3.2 0 5.2 2.1 5.2 5.2M12 11c3 0 5-2 5-5.2-3.2 0-5.2 2.1-5.2 5.2" /></>,
  dosha: <><path d="M12 3l7 2.6v5.7c0 5-3.9 7.9-7 9-3.1-1.1-7-4-7-9V5.6z" /><path d="M9.5 12l1.7 1.7 3.3-3.6" /></>,
  vastu: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" /><path d="M12 8.4l2.2 3.6L12 15.6 9.8 12z" /></>,
  books: <><path d="M4 5.2h12.5a2.8 2.8 0 0 1 2.8 2.8v10.8H6.8A2.8 2.8 0 0 1 4 16z" /><path d="M4 5.2v10.8M7.5 8.4h9M7.5 11.2h9M7.5 14h6" /></>,
  // ── decorative ───────────────────────────────────────────────
  lamp: <><path d="M12 2.6v2.8M8 5.4h8M9 5.4c0 2 1.4 3.2 3 3.2s3-1.2 3-3.2M12 8.6v4.6M7.5 20.4h9M9.8 20.4l1-7.2h2.4l1 7.2M12 3.4c.9 0 .9-1.1 0-1.1s-.9 1.1 0 1.1z" /></>,
  lotus: <><path d="M12 20.2V9.4c-2 2-3.2 5-3.2 8.4M12 20.2c0-3.4-1.2-6.4-3.2-8.4M12 20.2c-4.8-1-8-4-8-8.2 3 0 5.4 2 6.8 4.4M12 20.2c4.8-1 8-4 8-8.2-3 0-5.4 2-6.8 4.4M12 9.4c1.4 1.4 3.2 4.6 3.2 8.4" /></>,
  bell: <><path d="M12 3a1 1 0 0 1 1 1v1.1A5.2 5.2 0 0 1 17 10v4l1.8 2H5.2L7 14v-4a5.2 5.2 0 0 1 4-4.9V4a1 1 0 0 1 1-1z" /><path d="M10 18.4a2 2 0 0 0 4 0" /></>,
  conch: <><path d="M6 18c-2-3-1.5-8 2-11 4-3.5 9-2 10 2 .6 2.4-.4 4-2 4-1.2 0-2-1-2-2M6 18l4-1.5M6 18c3 1 6 .5 8-1" /></>,
};

export default function Motif({ name, className = '', title }) {
  const path = P[name];
  if (!path) return null;
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : 'presentation'}
      aria-hidden={title ? undefined : 'true'}
    >
      {title ? <title>{title}</title> : null}
      {path}
    </svg>
  );
}
