export default function EmptyState({ icon, title = "Aucun résultat", description, action }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            {icon && <div className="text-4xl">{icon}</div>}
            <p className="text-base font-semibold text-ink-700">{title}</p>
            {description && <p className="max-w-sm text-sm text-ink-500">{description}</p>}
            {action}
        </div>
    );
}
