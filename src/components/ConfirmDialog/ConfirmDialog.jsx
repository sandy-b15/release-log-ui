import { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { AlertTriangle, X } from 'lucide-react';
import './ConfirmDialog.css';

/**
 * Reusable confirmation dialog component.
 *
 * Props:
 * - open (bool)        — whether to show the dialog
 * - title (string)     — dialog heading
 * - message (string)   — body text
 * - confirmLabel (string) — confirm button label (default: "Confirm")
 * - cancelLabel (string)  — cancel button label  (default: "Cancel")
 * - variant ("danger" | "warning" | "info") — colour scheme (default: "danger")
 * - loading (bool)     — show spinner on confirm button
 * - onConfirm ()       — called when user confirms
 * - onCancel ()        — called when user cancels / closes
 */
const ConfirmDialog = ({
    open,
    title = 'Are you sure?',
    message = '',
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'danger',
    loading = false,
    onConfirm,
    onCancel,
}) => {
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e) => { if (e.key === 'Escape') onCancel?.(); };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [open, onCancel]);

    if (!open) return null;

    return ReactDOM.createPortal(
        <div className="confirm-overlay" onClick={onCancel}>
            <div className={`confirm-dialog variant-${variant}`} onClick={(e) => e.stopPropagation()}>
                <div className="confirm-header">
                    <div className={`confirm-icon-wrapper variant-${variant}`}>
                        <AlertTriangle size={20} />
                    </div>
                    <button className="confirm-close-btn" onClick={onCancel}>
                        <X size={16} />
                    </button>
                </div>

                <div className="confirm-body">
                    <h3>{title}</h3>
                    {message && <p>{message}</p>}
                </div>

                <div className="confirm-footer">
                    <button className="confirm-cancel-btn" onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button
                        className={`confirm-action-btn variant-${variant}`}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? 'Processing...' : confirmLabel}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmDialog;
