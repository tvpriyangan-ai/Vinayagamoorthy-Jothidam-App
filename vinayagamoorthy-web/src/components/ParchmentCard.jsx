export default function ParchmentCard({ children, className = '', decorated = true, ...props }) {
  return (
    <div
      className={`parchment ${decorated ? 'parchment-corners' : ''} p-6 relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
