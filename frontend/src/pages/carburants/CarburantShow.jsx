import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { FileText } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { PageSpinner } from "../../components/ui/Spinner";
import { carburantService } from "../../services";
import { formatCurrency, formatDateTime } from "../../utils/formatters";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function CarburantShow() {
    const { id } = useParams();
    const [carburant, setCarburant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        carburantService.get(id).then(({ data }) => setCarburant(data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <DashboardLayout title="Plein"><PageSpinner /></DashboardLayout>;
    if (!carburant) return <DashboardLayout title="Plein">Introuvable.</DashboardLayout>;

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

    return (
        <DashboardLayout title="Détail du plein">
            <PageHeader backTo="/carburants" title={carburant.reference} subtitle={carburant.vehicule?.immatriculation} />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                    <h3 className="mb-3 text-sm font-semibold text-ink-700">Détails du ravitaillement</h3>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Véhicule" value={`${carburant.vehicule?.marque} ${carburant.vehicule?.modele}`} />
                        <InfoRow label="Conducteur" value={`${carburant.conducteur?.utilisateur?.prenom ?? ""} ${carburant.conducteur?.utilisateur?.nom ?? ""}`} />
                        <InfoRow label="Type de carburant" value={carburant.type_carburant} />
                        <InfoRow label="Quantité" value={`${carburant.quantite_litres} L`} />
                        <InfoRow label="Prix au litre" value={formatCurrency(carburant.prix_litre)} />
                        <InfoRow label="Coût total" value={formatCurrency(carburant.cout_total)} />
                        <InfoRow label="Kilométrage" value={`${carburant.kilometrage} km`} />
                        <InfoRow label="Station-service" value={carburant.station_service} />
                        <InfoRow label="Date du plein" value={formatDateTime(carburant.date_plein)} />
                        <InfoRow label="Validé par" value={`${carburant.utilisateur?.prenom ?? ""} ${carburant.utilisateur?.nom ?? ""}`} />
                        {carburant.observations && <InfoRow label="Observations" value={carburant.observations} />}
                    </div>
                </div>

                <div className="card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-ink-700">Justificatif</h3>
                    {carburant.justificatif ? (
                        <a
                            href={`${storageUrl}/${carburant.justificatif}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 rounded-lg border border-ink-100 p-3 text-sm text-brand-600 hover:bg-brand-50"
                        >
                            <FileText className="h-5 w-5" /> Voir le justificatif
                        </a>
                    ) : (
                        <p className="text-sm text-ink-400">Aucun justificatif fourni.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
