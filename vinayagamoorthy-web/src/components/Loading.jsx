// Shared loading indicator — palm-leaf spinner + optional caption.
export default function Loading({ text }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 opacity-80">
      <div className="leaf-spinner" />
      {text && <p className="text-sm text-center">{text}</p>}
    </div>
  );
}
