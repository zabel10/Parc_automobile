import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Trash2, ClipboardList } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { missionService } from "../../services";
import { STATUTS_MISSION } from "../../utils/constants";
import { formatDate, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function MissionList() {
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(missionService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await missionService.remove(toDelete.id);
            toast.success("Mission supprimée.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Missions">
            <PageHeader
                title="Missions"
                subtitle="Déplacements planifiés, en cours et terminés."
                action={
                    canManage && (
                        <Link to="/missions/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Nouvelle mission
                        </Link>
                    )
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Select className="sm:w-56" value={filters.statut || ""} onChange={(e) => setFilter("statut", e.target.value)}>
                        <option value="">Tous les statuts</option>
                        {STATUTS_MISSION.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucune mission enregistrée."
                    columns={[
                        {
                            key: "mission",
                            header: "Mission",
                            render: (m) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                                        <ClipboardList className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{m.lieu_depart} → {m.destination}</p>
                                        <p className="text-xs text-ink-400">{m.numero_mission}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "vehicule", header: "Véhicule", render: (m) => m.vehicule?.immatriculation },
                        { key: "conducteur", header: "Conducteur", render: (m) => `${m.conducteur?.utilisateur?.prenom ?? ""} ${m.conducteur?.utilisateur?.nom ?? ""}` },
                        { key: "date_depart", header: "Départ", render: (m) => formatDate(m.date_depart) },
                        { key: "statut", header: "Statut", render: (m) => <Badge value={m.statut} /> },
                    ]}
                    actions={(m) => (
                        <>
                            <IconButton as={Link} to={`/missions/${m.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
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
                title="Supprimer cette mission ?"
                message="Cette action est irréversible."
            />
        </DashboardLayout>
    );
}
