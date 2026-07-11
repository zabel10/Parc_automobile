import Modal from "./Modal";

export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title = "Confirmer l'action",
    message = "Cette action est irréversible. Voulez-vous continuer ?",
    confirmLabel = "Confirmer",
    danger = true,
    loading = false,
}) {
    return (
        <Modal open={open} onClose={onClose} title={title} size="sm">
            <p className="text-sm text-ink-600">{message}</p>
            <div className="mt-6 flex justify-end gap-2">
                <button className="btn-secondary" onClick={onClose} disabled={loading}>
                    Annuler
                </button>
                <button
                    className={danger ? "btn-danger" : "btn-primary"}
                    onClick={onConfirm}
                    disabled={loading}
                >
                    {loading ? "Veuillez patienter…" : confirmLabel}
                </button>
            </div>
        </Modal>
    );
}
