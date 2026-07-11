export default function Pagination({ meta, onPageChange }) {
    if (!meta || meta.last_page <= 1) return null;

    const { current_page, last_page, from, to, total } = meta;

    const pages = [];
    const windowSize = 1;
    for (let p = 1; p <= last_page; p++) {
        if (p === 1 || p === last_page || Math.abs(p - current_page) <= windowSize) {
            pages.push(p);
        } else if (pages[pages.length - 1] !== "…") {
            pages.push("…");
        }
    }

    return (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-ink-100 px-4 py-3.5 sm:flex-row">
            <p className="text-sm text-ink-500">
                {total > 0 ? (
                    <>
                        <span className="font-medium text-ink-700">{from}</span>–
                        <span className="font-medium text-ink-700">{to}</span> sur{" "}
                        <span className="font-medium text-ink-700">{total}</span>
                    </>
                ) : (
                    "Aucun résultat"
                )}
            </p>

            <div className="flex items-center gap-1">
                <button
                    className="btn-ghost !px-2.5 !py-1.5"
                    disabled={current_page <= 1}
                    onClick={() => onPageChange(current_page - 1)}
                >
                    ‹
                </button>

                {pages.map((p, i) =>
                    p === "…" ? (
                        <span key={`dots-${i}`} className="px-2 text-ink-400">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p)}
                            className={`h-9 min-w-9 rounded-lg px-2 text-sm font-medium transition ${
                                p === current_page
                                    ? "bg-brand-600 text-white shadow-soft"
                                    : "text-ink-600 hover:bg-ink-100"
                            }`}
                        >
                            {p}
                        </button>
                    )
                )}

                <button
                    className="btn-ghost !px-2.5 !py-1.5"
                    disabled={current_page >= last_page}
                    onClick={() => onPageChange(current_page + 1)}
                >
                    ›
                </button>
            </div>
        </div>
    );
}
