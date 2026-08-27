export default function RopeDivider({ knots = 2 }) {
  return (
    <div className="flex items-center gap-2 my-4">
      <div className="rope-divider flex-1" />
      {Array.from({ length: knots }).map((_, i) => (
        <div key={i} className="rope-knot" />
      ))}
      <div className="rope-divider flex-1" />
    </div>
  );
}
