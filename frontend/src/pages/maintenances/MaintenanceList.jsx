import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Trash2, Wrench } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { maintenanceService } from "../../services";
import { STATUTS_MAINTENANCE } from "../../utils/constants";
import { formatCurrency, formatDate, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function MaintenanceList() {
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(maintenanceService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await maintenanceService.remove(toDelete.id);
            toast.success("Maintenance supprimée.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Maintenances">
            <PageHeader
                title="Maintenances"
                subtitle="Entretiens préventifs et réparations correctives du parc."
                action={
                    canManage && (
                        <Link to="/maintenances/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Nouvelle maintenance
                        </Link>
                    )
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Select className="sm:w-56" value={filters.statut || ""} onChange={(e) => setFilter("statut", e.target.value)}>
                        <option value="">Tous les statuts</option>
                        {STATUTS_MAINTENANCE.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucune maintenance enregistrée."
                    columns={[
                        {
                            key: "maintenance",
                            header: "Maintenance",
                            render: (m) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                        <Wrench className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{m.type_maintenance}</p>
                                        <p className="text-xs text-ink-400">{m.vehicule?.immatriculation}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "prestataire", header: "Prestataire" },
                        { key: "date_debut", header: "Date début", render: (m) => formatDate(m.date_debut) },
                        { key: "cout", header: "Coût", render: (m) => formatCurrency(m.cout) },
                        { key: "statut", header: "Statut", render: (m) => <Badge value={m.statut} /> },
                    ]}
                    actions={(m) => (
                        <>
                            <IconButton as={Link} to={`/maintenances/${m.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
                            {canManage && (
                                <IconButton onClick={() => setToDelete(m)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
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
                title="Supprimer cette maintenance ?"
                message="Cette action est irréversible."
            />
        </DashboardLayout>
    );
}
