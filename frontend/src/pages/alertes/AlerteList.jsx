import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Trash2, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { alerteService } from "../../services";
import { STATUTS_ALERTE, PRIORITES_ALERTE } from "../../utils/constants";
import { formatDate, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function AlerteList() {
    const { hasRole } = useAuth();
    const canCreate = hasRole("Gestionnaire", "Conducteur");
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(alerteService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await alerteService.remove(toDelete.id);
            toast.success("Alerte supprimée.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Alertes">
            <PageHeader
                title="Alertes"
                subtitle="Signalements de pannes, entretiens et incidents remontés du terrain."
                action={
                    canCreate && (
                        <Link to="/alertes/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Signaler une alerte
                        </Link>
                    )
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Select className="sm:w-48" value={filters.priorite || ""} onChange={(e) => setFilter("priorite", e.target.value)}>
                        <option value="">Toutes priorités</option>
                        {PRIORITES_ALERTE.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                    <Select className="sm:w-48" value={filters.statut || ""} onChange={(e) => setFilter("statut", e.target.value)}>
                        <option value="">Tous les statuts</option>
                        {STATUTS_ALERTE.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucune alerte enregistrée."
                    columns={[
                        {
                            key: "alerte",
                            header: "Alerte",
                            render: (a) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
                                        <AlertTriangle className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{a.type_alerte}</p>
                                        <p className="text-xs text-ink-400">{a.vehicule?.immatriculation}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "priorite", header: "Priorité", render: (a) => <Badge value={a.priorite} /> },
                        { key: "date_signalement", header: "Signalée le", render: (a) => formatDate(a.date_signalement) },
                        { key: "statut", header: "Statut", render: (a) => <Badge value={a.statut} /> },
                    ]}
                    actions={(a) => (
                        <>
                            <IconButton as={Link} to={`/alertes/${a.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
                            {canCreate && (
                                <IconButton onClick={() => setToDelete(a)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
                            )}
                        </>
                    )}
                />

                <Pagination meta={meta} onPageChange={setPage} />
            </div>

            <ConfirmDialog
                open={!!toDelete}
                onClose={() => setToDelete(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Supprimer cette alerte ?"
                message="Cette action est irréversible."
            />
        </DashboardLayout>
    );
}
