import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Pencil, Trash2, IdCard } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { conducteurService } from "../../services";
import { STATUTS_CONDUCTEUR } from "../../utils/constants";
import { formatDate, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function ConducteurList() {
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(conducteurService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await conducteurService.remove(toDelete.id);
            toast.success("Conducteur supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Conducteurs">
            <PageHeader
                title="Conducteurs"
                subtitle="Chauffeurs habilités à conduire les véhicules du parc."
                action={
                    canManage && (
                        <Link to="/conducteurs/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Nouveau conducteur
                        </Link>
                    )
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center sm:justify-end">
                    <Select className="sm:w-56" value={filters.statut || ""} onChange={(e) => setFilter("statut", e.target.value)}>
                        <option value="">Tous les statuts</option>
                        {STATUTS_CONDUCTEUR.map((s) => <option key={s} value={s}>{s}</option>)}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucun conducteur enregistré."
                    columns={[
                        {
                            key: "conducteur",
                            header: "Conducteur",
                            render: (c) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                                        <IdCard className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{c.utilisateur?.prenom} {c.utilisateur?.nom}</p>
                                        <p className="text-xs text-ink-400">{c.utilisateur?.email}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "num_permis", header: "N° permis" },
                        { key: "categorie_permis", header: "Catégorie" },
                        { key: "date_expiration_permis", header: "Expiration permis", render: (c) => formatDate(c.date_expiration_permis) },
                        { key: "statut", header: "Statut", render: (c) => <Badge value={c.statut} /> },
                    ]}
                    actions={(c) => (
                        <>
                            <IconButton as={Link} to={`/conducteurs/${c.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
                            {canManage && (
                                <>
                                    <IconButton as={Link} to={`/conducteurs/${c.id}/modifier`} icon={<Pencil className="h-4 w-4" />} title="Modifier" tone="brand" />
                                    <IconButton onClick={() => setToDelete(c)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
                                </>
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
                title="Supprimer ce conducteur ?"
                message="Cette action est irréversible."
            />
        </DashboardLayout>
    );
}
