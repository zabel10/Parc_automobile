export default function IconButton({ icon, onClick, to, title, tone = "default", as: As }) {
    const tones = {
        default: "text-ink-500 hover:bg-ink-100 hover:text-ink-800",
        danger: "text-rose-500 hover:bg-rose-50 hover:text-rose-700",
        brand: "text-brand-600 hover:bg-brand-50 hover:text-brand-700",
        success: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700",
    };

    const cls = `inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${tones[tone]}`;

    if (As) {
        return (
            <As to={to} title={title} className={cls}>
                {icon}
            </As>
        );
    }

    return (
        <button type="button" onClick={onClick} title={title} className={cls}>
            {icon}
        </button>
    );
}
