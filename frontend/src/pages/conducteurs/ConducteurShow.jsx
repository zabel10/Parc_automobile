import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import { PageSpinner } from "../../components/ui/Spinner";
import { conducteurService } from "../../services";
import { formatDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function ConducteurShow() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [conducteur, setConducteur] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        conducteurService.get(id).then(({ data }) => setConducteur(data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <DashboardLayout title="Conducteur"><PageSpinner /></DashboardLayout>;
    if (!conducteur) return <DashboardLayout title="Conducteur">Conducteur introuvable.</DashboardLayout>;

    const u = conducteur.utilisateur;

    return (
        <DashboardLayout title="Détail du conducteur">
            <PageHeader
                backTo="/conducteurs"
                title={`${u?.prenom ?? ""} ${u?.nom ?? ""}`}
                subtitle={u?.email}
                action={
                    hasRole("Gestionnaire") && (
                        <Link to={`/conducteurs/${id}/modifier`} className="btn-primary">
                            <Pencil className="h-4 w-4" /> Modifier
                        </Link>
                    )
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink-700">Informations sur le permis</h3>
                        <Badge value={conducteur.statut} />
                    </div>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Numéro de permis" value={conducteur.num_permis} />
                        <InfoRow label="Catégorie" value={conducteur.categorie_permis} />
                        <InfoRow label="Date de délivrance" value={formatDate(conducteur.date_delivrance_permis)} />
                        <InfoRow label="Date d'expiration" value={formatDate(conducteur.date_expiration_permis)} />
                        <InfoRow label="Date de naissance" value={formatDate(conducteur.date_naissance)} />
                        <InfoRow label="Adresse" value={conducteur.adresse} />
                        <InfoRow label="Contact d'urgence" value={conducteur.contact_urgence} />
                        <InfoRow label="Téléphone" value={u?.telephone} />
                    </div>
                </div>

                <div className="card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-ink-700">Missions récentes</h3>
                    {conducteur.missions?.length ? (
                        <ul className="divide-y divide-ink-50">
                            {conducteur.missions.slice(0, 6).map((m) => (
                                <li key={m.id} className="flex items-center justify-between py-2 text-sm">
                                    <span className="text-ink-700">{m.destination}</span>
                                    <Badge value={m.statut} />
                                </li>
                            ))}
                        </ul>
                    ) : <p className="text-sm text-ink-400">Aucune mission.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
}
