import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Pencil, Fuel, Wrench, ClipboardList, AlertTriangle } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import { PageSpinner } from "../../components/ui/Spinner";
import { vehiculeService } from "../../services";
import { formatDate, formatNumber } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function VehiculeShow() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const [vehicule, setVehicule] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        vehiculeService.get(id).then(({ data }) => setVehicule(data)).finally(() => setLoading(false));
    }, [id]);

    if (loading) return <DashboardLayout title="Véhicule"><PageSpinner /></DashboardLayout>;
    if (!vehicule) return <DashboardLayout title="Véhicule">Véhicule introuvable.</DashboardLayout>;

    return (
        <DashboardLayout title="Détail du véhicule">
            <PageHeader
                backTo="/vehicules"
                title={`${vehicule.marque} ${vehicule.modele}`}
                subtitle={vehicule.immatriculation}
                action={
                    hasRole("Gestionnaire") && (
                        <Link to={`/vehicules/${id}/modifier`} className="btn-primary">
                            <Pencil className="h-4 w-4" /> Modifier
                        </Link>
                    )
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink-700">Informations générales</h3>
                        <Badge value={vehicule.statut} />
                    </div>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Immatriculation" value={vehicule.immatriculation} />
                        <InfoRow label="Numéro de châssis" value={vehicule.numero_chassis} />
                        <InfoRow label="Année" value={vehicule.annee} />
                        <InfoRow label="Couleur" value={vehicule.couleur} />
                        <InfoRow label="Carburant" value={vehicule.carburant} />
                        <InfoRow label="Kilométrage" value={`${formatNumber(vehicule.kilometrage)} km`} />
                        <InfoRow label="Capacité réservoir" value={vehicule.capacite_reservoir ? `${vehicule.capacite_reservoir} L` : "—"} />
                        <InfoRow label="Consommation moyenne" value={vehicule.consommation_moyenne ? `${vehicule.consommation_moyenne} L/100km` : "—"} />
                        <InfoRow label="État" value={<Badge value={vehicule.etat} />} />
                        <InfoRow label="Date d'acquisition" value={formatDate(vehicule.date_acquisition)} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-ink-700">Dernier plein</h3>
                        {vehicule.dernierPlein ? (
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                    <Fuel className="h-4 w-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-ink-800">{vehicule.dernierPlein.quantite_litres} L</p>
                                    <p className="text-xs text-ink-400">{formatDate(vehicule.dernierPlein.date_plein)}</p>
                                </div>
                            </div>
                        ) : <p className="text-sm text-ink-400">Aucun plein enregistré.</p>}
                    </div>

                    <div className="card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-ink-700">Dernière maintenance</h3>
                        {vehicule.derniereMaintenance ? (
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                                    <Wrench className="h-4 w-4" />
                                </div>
                                <div className="text-sm">
                                    <p className="font-medium text-ink-800">{vehicule.derniereMaintenance.type_maintenance}</p>
                                    <p className="text-xs text-ink-400">{formatDate(vehicule.derniereMaintenance.date_debut)}</p>
                                </div>
                            </div>
                        ) : <p className="text-sm text-ink-400">Aucune maintenance enregistrée.</p>}
                    </div>

                    <div className="card p-5">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
                            <AlertTriangle className="h-4 w-4 text-rose-500" /> Alertes ouvertes
                        </h3>
                        {vehicule.alertesOuvertes?.length ? (
                            <ul className="space-y-2">
                                {vehicule.alertesOuvertes.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between text-sm">
                                        <span className="text-ink-700">{a.type_alerte}</span>
                                        <Badge value={a.priorite} />
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-sm text-ink-400">Aucune alerte ouverte.</p>}
                    </div>
                </div>
            </div>

            <div className="card mt-4 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-700">
                    <ClipboardList className="h-4 w-4 text-brand-600" /> Missions récentes
                </h3>
                {vehicule.missions?.length ? (
                    <ul className="divide-y divide-ink-50">
                        {vehicule.missions.map((m) => (
                            <li key={m.id} className="flex items-center justify-between py-2.5 text-sm">
                                <div>
                                    <p className="font-medium text-ink-800">{m.destination}</p>
                                    <p className="text-xs text-ink-400">{formatDate(m.date_depart)}</p>
                                </div>
                                <Badge value={m.statut} />
                            </li>
                        ))}
                    </ul>
                ) : <p className="text-sm text-ink-400">Aucune mission récente.</p>}
            </div>
        </DashboardLayout>
    );
}
