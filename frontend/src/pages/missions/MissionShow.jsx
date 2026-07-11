import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, PlayCircle, FlagTriangleRight, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { missionService } from "../../services";
import { formatDateTime, formatNumber, extractErrorMessage, toInputDateTime } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function MissionShow() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const [mission, setMission] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [terminerOpen, setTerminerOpen] = useState(false);
    const [terminerForm, setTerminerForm] = useState({ date_retour: "", km_retour: "", observations: "" });

    function load() {
        setLoading(true);
        missionService.get(id).then(({ data }) => setMission(data)).finally(() => setLoading(false));
    }

    useEffect(load, [id]);

    async function runAction(action, data) {
        setActionLoading(true);
        try {
            await missionService.patch(id, action, data);
            toast.success("Mission mise à jour.");
            load();
            setTerminerOpen(false);
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    function openTerminer() {
        setTerminerForm({
            date_retour: toInputDateTime(new Date()),
            km_retour: mission.km_depart,
            observations: "",
        });
        setTerminerOpen(true);
    }

    if (loading) return <DashboardLayout title="Mission"><PageSpinner /></DashboardLayout>;
    if (!mission) return <DashboardLayout title="Mission">Mission introuvable.</DashboardLayout>;

    return (
        <DashboardLayout title="Détail de la mission">
            <PageHeader
                backTo="/missions"
                title={`${mission.lieu_depart} → ${mission.destination}`}
                subtitle={mission.numero_mission}
                action={
                    canManage && (
                        <div className="flex gap-2">
                            {mission.statut === "En attente" && (
                                <button onClick={() => runAction("valider")} disabled={actionLoading} className="btn-secondary">
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />} Valider
                                </button>
                            )}
                            {mission.statut === "Validée" && (
                                <button onClick={() => runAction("demarrer")} disabled={actionLoading} className="btn-primary">
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />} Démarrer
                                </button>
                            )}
                            {mission.statut === "En cours" && (
                                <button onClick={openTerminer} className="btn-primary">
                                    <FlagTriangleRight className="h-4 w-4" /> Terminer
                                </button>
                            )}
                        </div>
                    )
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink-700">Détails de la mission</h3>
                        <Badge value={mission.statut} />
                    </div>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Motif" value={mission.motif} />
                        <InfoRow label="Date de départ" value={formatDateTime(mission.date_depart)} />
                        <InfoRow label="Retour prévu" value={formatDateTime(mission.date_retour_prevue)} />
                        <InfoRow label="Retour effectif" value={mission.date_retour ? formatDateTime(mission.date_retour) : "—"} />
                        <InfoRow label="Kilométrage départ" value={`${formatNumber(mission.km_depart)} km`} />
                        <InfoRow label="Kilométrage retour" value={mission.km_retour ? `${formatNumber(mission.km_retour)} km` : "—"} />
                        {mission.observations && <InfoRow label="Observations" value={mission.observations} />}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-ink-700">Véhicule</h3>
                        <p className="text-sm font-medium text-ink-800">{mission.vehicule?.marque} {mission.vehicule?.modele}</p>
                        <p className="text-xs text-ink-400">{mission.vehicule?.immatriculation}</p>
                    </div>
                    <div className="card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-ink-700">Conducteur</h3>
                        <p className="text-sm font-medium text-ink-800">
                            {mission.conducteur?.utilisateur?.prenom} {mission.conducteur?.utilisateur?.nom}
                        </p>
                        <p className="text-xs text-ink-400">{mission.conducteur?.num_permis}</p>
                    </div>
                    <div className="card p-5">
                        <h3 className="mb-3 text-sm font-semibold text-ink-700">Créée par</h3>
                        <p className="text-sm font-medium text-ink-800">
                            {mission.utilisateur?.prenom} {mission.utilisateur?.nom}
                        </p>
                    </div>
                </div>
            </div>

            <Modal open={terminerOpen} onClose={() => setTerminerOpen(false)} title="Terminer la mission">
                <div className="space-y-4">
                    <Field label="Date/heure de retour" required>
                        <TextInput
                            type="datetime-local"
                            value={terminerForm.date_retour}
                            onChange={(e) => setTerminerForm((f) => ({ ...f, date_retour: e.target.value }))}
                        />
                    </Field>
                    <Field label="Kilométrage au retour" required hint={`Doit être ≥ ${formatNumber(mission.km_depart)} km (départ)`}>
                        <TextInput
                            type="number"
                            value={terminerForm.km_retour}
                            onChange={(e) => setTerminerForm((f) => ({ ...f, km_retour: e.target.value }))}
                        />
                    </Field>
                    <Field label="Observations">
                        <TextArea
                            value={terminerForm.observations}
                            onChange={(e) => setTerminerForm((f) => ({ ...f, observations: e.target.value }))}
                        />
                    </Field>
                    <div className="flex justify-end gap-2 pt-2">
                        <button className="btn-secondary" onClick={() => setTerminerOpen(false)}>Annuler</button>
                        <button
                            className="btn-primary"
                            disabled={actionLoading}
                            onClick={() => runAction("terminer", { ...terminerForm, km_depart: mission.km_depart, date_depart: mission.date_depart })}
                        >
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlagTriangleRight className="h-4 w-4" />}
                            Confirmer la fin de mission
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
