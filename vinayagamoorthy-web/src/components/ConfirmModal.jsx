import ParchmentCard from './ParchmentCard';

// Generic "are you sure?" popup, styled like the rest of the app (reuses
// ParchmentCard / btn-gold / btn-danger). Used by the Delete Account flow
// on the Profile page and on the public /delete-account page.
export default function ConfirmModal({
  title,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  loading = false,
  error = '',
  onConfirm,
  onCancel,
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.65)' }}
    >
      <ParchmentCard className="max-w-sm w-full">
        <h3 className="parchment-heading text-lg mb-3 text-center">{title}</h3>
        <div className="text-sm mb-4 text-center opacity-85">{children}</div>
        {error && <p className="error-text text-center mb-3">{error}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            className="btn-gold flex-1 !py-1.5 text-sm"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="btn-danger flex-1 !py-1.5 text-sm"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </ParchmentCard>
    </div>
  );
}
