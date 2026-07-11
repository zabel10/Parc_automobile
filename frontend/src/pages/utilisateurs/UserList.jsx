import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Search, UserRound } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import DataTable from "../../components/ui/DataTable";
import Pagination from "../../components/ui/Pagination";
import Badge from "../../components/ui/Badge";
import IconButton from "../../components/ui/IconButton";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { Select } from "../../components/ui/FormField";
import { useResourceList } from "../../hooks/useResourceList";
import { userService } from "../../services";
import { ROLES } from "../../utils/constants";
import { extractErrorMessage } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

export default function UserList() {
    const { user: currentUser } = useAuth();
    const { rows, meta, loading, filters, setFilter, setPage, refresh } = useResourceList(userService);
    const [toDelete, setToDelete] = useState(null);
    const [deleting, setDeleting] = useState(false);

    async function handleDelete() {
        setDeleting(true);
        try {
            await userService.remove(toDelete.id);
            toast.success("Utilisateur supprimé.");
            setToDelete(null);
            refresh();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setDeleting(false);
        }
    }

    return (
        <DashboardLayout title="Utilisateurs">
            <PageHeader
                title="Utilisateurs"
                subtitle="Comptes ayant accès à AutoPark, avec leurs rôles et permissions."
                action={
                    <Link to="/utilisateurs/nouveau" className="btn-primary">
                        <Plus className="h-4 w-4" /> Nouvel utilisateur
                    </Link>
                }
            />

            <div className="card">
                <div className="flex flex-col gap-3 border-b border-ink-100 p-4 sm:flex-row sm:items-center">
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                        <input className="input pl-9" placeholder="Rechercher par nom ou e-mail…" value={filters.q || ""} onChange={(e) => setFilter("q", e.target.value)} />
                    </div>
                    <Select className="sm:w-56" value={filters.role || ""} onChange={(e) => setFilter("role", e.target.value)}>
                        <option value="">Tous les rôles</option>
                        {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                    </Select>
                </div>

                <DataTable
                    loading={loading}
                    rows={rows}
                    emptyMessage="Aucun utilisateur trouvé."
                    columns={[
                        {
                            key: "utilisateur",
                            header: "Utilisateur",
                            render: (u) => (
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-xs font-bold text-white">
                                        {u.prenom?.[0]}{u.nom?.[0]}
                                    </div>
                                    <div>
                                        <p className="font-medium text-ink-800">{u.prenom} {u.nom}</p>
                                        <p className="text-xs text-ink-400">{u.email}</p>
                                    </div>
                                </div>
                            ),
                        },
                        { key: "telephone", header: "Téléphone" },
                        { key: "role", header: "Rôle", render: (u) => <Badge value={u.role} /> },
                        { key: "statut", header: "Statut", render: (u) => <Badge value={u.statut} /> },
                    ]}
                    actions={(u) => (
                        <>
                            <IconButton as={Link} to={`/utilisateurs/${u.id}/modifier`} icon={<Pencil className="h-4 w-4" />} title="Modifier" tone="brand" />
                            {u.id !== currentUser?.id && (
                                <IconButton onClick={() => setToDelete(u)} icon={<Trash2 className="h-4 w-4" />} title="Supprimer" tone="danger" />
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
                title="Supprimer cet utilisateur ?"
                message="Cette action est irréversible. Le compte perdra tout accès à l'application."
            />
        </DashboardLayout>
    );
}
