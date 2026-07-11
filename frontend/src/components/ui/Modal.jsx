import { useEffect } from "react";

export default function Modal({ open, onClose, title, children, size = "md" }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose?.();
        }
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;

    const sizes = {
        sm: "max-w-sm",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 animate-fade-in bg-ink-950/50 backdrop-blur-sm"
                onClick={onClose}
            />
            <div
                className={`relative z-10 w-full ${sizes[size]} animate-slide-up rounded-xl2 bg-white shadow-card`}
            >
                {title && (
                    <div className="flex items-center justify-between border-b border-ink-100 px-6 py-4">
                        <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700"
                        >
                            ✕
                        </button>
                    </div>
                )}
                <div className="max-h-[75vh] overflow-y-auto p-6">{children}</div>
            </div>
        </div>
    );
}
