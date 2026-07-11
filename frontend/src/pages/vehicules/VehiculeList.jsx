import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Search, Eye, Pencil, Trash2, Car } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { vehiculeService } from "../../services";
import { STATUTS_VEHICULE } from "../../utils/constants";
import { formatNumber, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function VehiculeList() {
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const navigate = useNavigate();
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(vehiculeService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await vehiculeService.remove(toDelete.id);
            toast.success("Véhicule supprimé avec succès.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Véhicules">
            <PageHeader
                title="Véhicules"
                subtitle="Parc automobile complet : identification, état et disponibilité."
                action={
                    canManage && (
                        <Link to="/vehicules/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Nouveau véhicule
                        </Link>
                    )
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input
                            className="input pl-9"
                            placeholder="Rechercher par immatriculation, marque, modèle…"
                            value={filters.q || ""}
                            onChange={(e) => setFilter("q", e.target.value)}
                        />
                    </div>
                    <Select
                        className="sm:w-56"
                        value={filters.statut || ""}
                        onChange={(e) => setFilter("statut", e.target.value)}
                    >
                        <option value="">Tous les statuts</option>
                        {STATUTS_VEHICULE.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucun véhicule enregistré pour le moment."
                    columns={[
                        {
                            key: "vehicule",
                            header: "Véhicule",
                            render: (v) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                                        <Car className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{v.marque} {v.modele}</p>
                                        <p className="text-xs text-ink-400">{v.immatriculation}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "annee", header: "Année" },
                        { key: "carburant", header: "Carburant" },
                        { key: "kilometrage", header: "Kilométrage", render: (v) => `${formatNumber(v.kilometrage)} km` },
                        { key: "statut", header: "Statut", render: (v) => <Badge value={v.statut} /> },
                    ]}
                    actions={(v) => (
                        <>
                            <IconButton as={Link} to={`/vehicules/${v.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
                            {canManage && (
                                <>
                                    <IconButton as={Link} to={`/vehicules/${v.id}/modifier`} icon={<Pencil className="h-4 w-4" />} title="Modifier" tone="brand" />
                                    <IconButton onClick={() => setToDelete(v)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
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
                title="Supprimer ce véhicule ?"
                message={`Le véhicule ${toDelete?.immatriculation ?? ""} sera définitivement supprimé.`}
            />
        </DashboardLayout>
    );
}
