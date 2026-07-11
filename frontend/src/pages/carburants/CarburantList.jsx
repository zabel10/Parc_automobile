import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Eye, Trash2, Fuel } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useResourceList } from "../../hooks/useResourceList";
import { carburantService } from "../../services";
import { formatCurrency, formatDate, extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function CarburantList() {
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire", "Conducteur");
    const { rows, meta, loading, setPage, refresh } = useResourceList(carburantService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await carburantService.remove(toDelete.id);
            toast.success("Plein supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Carburant">
            <PageHeader
                title="Pleins de carburant"
                subtitle="Historique des ravitaillements du parc automobile."
                action={
                    canManage && (
                        <Link to="/carburants/nouveau" className="btn-primary">
                            <Plus className="h-4 w-4" /> Nouveau plein
                        </Link>
                    )
                }
            />

            <div className="card">
                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucun plein enregistré."
                    columns={[
                        {
                            key: "vehicule",
                            header: "Véhicule",
                            render: (c) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                        <Fuel className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{c.vehicule?.immatriculation}</p>
                                        <p className="text-xs text-ink-400">{c.reference}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "conducteur", header: "Conducteur", render: (c) => `${c.conducteur?.utilisateur?.prenom ?? ""} ${c.conducteur?.utilisateur?.nom ?? ""}` },
                        { key: "quantite_litres", header: "Quantité", render: (c) => `${c.quantite_litres} L` },
                        { key: "cout_total", header: "Coût total", render: (c) => formatCurrency(c.cout_total) },
                        { key: "date_plein", header: "Date", render: (c) => formatDate(c.date_plein) },
                    ]}
                    actions={(c) => (
                        <>
                            <IconButton as={Link} to={`/carburants/${c.id}`} icon={<Eye className="h-4 w-4" />} title="Voir" />
                            {canManage && (
                                <IconButton onClick={() => setToDelete(c)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
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
                title="Supprimer ce plein ?"
                message="Cette action est irréversible."
            />
        </DashboardLayout>
    );
}
