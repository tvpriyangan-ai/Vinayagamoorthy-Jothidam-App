import Motif from './Motif';

export default function RopeDivider({ knots = 2, om = false }) {
  const beads = (k) =>
    Array.from({ length: knots }).map((_, i) => <div key={`${k}${i}`} className="rope-knot" />);

  return (
    <div className="flex items-center gap-2 my-5">
      <div className="rope-divider flex-1" />
      {beads('l')}
      {om && (
        <>
          <Motif name="lamp" className="w-4 h-5 text-gold" title="" />
          <span className="om-mark" aria-hidden="true">ॐ</span>
          <Motif name="lamp" className="w-4 h-5 text-gold" title="" />
          {beads('r')}
        </>
      )}
      <div className="rope-divider flex-1" />
    </div>
  );
}
