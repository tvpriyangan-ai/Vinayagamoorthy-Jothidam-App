export default function RopeDivider({ knots = 2, om = false }) {
  const beads = (keyPrefix) =>
    Array.from({ length: knots }).map((_, i) => <div key={`${keyPrefix}${i}`} className="rope-knot" />);

  return (
    <div className="flex items-center gap-2 my-4">
      <div className="rope-divider flex-1" />
      {beads('l')}
      {om && (
        <>
          <span className="om-mark" aria-hidden="true">ॐ</span>
          {beads('r')}
        </>
      )}
      <div className="rope-divider flex-1" />
    </div>
  );
}
