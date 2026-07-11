import EmptyState from "./EmptyState";
import { PageSpinner } from "./Spinner";

/**
 * columns: [{ key, header, render?: (row) => node, className? }]
 * rows: array of data
 * actions: (row) => node — rendu dans la dernière colonne
 */
export default function DataTable({ columns, rows, loading, actions, emptyMessage = "Aucune donnée pour le moment." }) {
    if (loading) return <PageSpinner />;

    if (!rows || rows.length === 0) {
        return <EmptyState icon="🗂️" title="Rien à afficher" description={emptyMessage} />;
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                    <tr className="border-b border-ink-100 text-xs font-semibold uppercase tracking-wide text-ink-400">
                        {columns.map((col) => (
                            <th key={col.key} className={`px-4 py-3 ${col.className || ""}`}>
                                {col.header}
                            </th>
                        ))}
                        {actions && <th className="px-4 py-3 text-right">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                    {rows.map((row) => (
                        <tr key={row.id} className="transition hover:bg-brand-50/40">
                            {columns.map((col) => (
                                <td key={col.key} className={`px-4 py-3.5 align-middle text-ink-700 ${col.className || ""}`}>
                                    {col.render ? col.render(row) : row[col.key] ?? "—"}
                                </td>
                            ))}
                            {actions && (
                                <td className="px-4 py-3.5 text-right">
                                    <div className="flex items-center justify-end gap-1.5">{actions(row)}</div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
