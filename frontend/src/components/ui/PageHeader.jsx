import { Link } from "react-router-dom";

export default function PageHeader({ title, subtitle, action, backTo }) {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
                {backTo && (
                    <Link
                        to={backTo}
                        className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-brand-600"
                    >
                        ← Retour
                    </Link>
                )}
                <h1 className="text-2xl font-bold tracking-tight text-ink-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-ink-500">{subtitle}</p>}
            </div>
            {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </div>
    );
}
