import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle2, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, TextArea, TextInput } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { alerteService } from "../../services";
import { formatDateTime, extractErrorMessage, toInputDateTime } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function AlerteShow() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const canResoudre = hasRole("Gestionnaire", "Conducteur");
    const [alerte, setAlerte] = useState(null);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [form, setForm] = useState({ commentaire_resolution: "", date_resolution: toInputDateTime(new Date()) });

    function load() {
        setLoading(true);
        alerteService.get(id).then(({ data }) => setAlerte(data)).finally(() => setLoading(false));
    }

    useEffect(load, [id]);

    async function handleResoudre() {
        setSaving(true);
        try {
            await alerteService.patch(id, "resoudre", form);
            toast.success("Alerte résolue.");
            setOpen(false);
            load();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <DashboardLayout title="Alerte"><PageSpinner /></DashboardLayout>;
    if (!alerte) return <DashboardLayout title="Alerte">Introuvable.</DashboardLayout>;

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";
    const dejaResolue = ["Résolue", "Rejetée"].includes(alerte.statut);

    return (
        <DashboardLayout title="Détail de l'alerte">
            <PageHeader
                backTo="/alertes"
                title={alerte.type_alerte}
                subtitle={alerte.vehicule?.immatriculation}
                action={
                    canResoudre && !dejaResolue && (
                        <button onClick={() => setOpen(true)} className="btn-primary">
                            <CheckCircle2 className="h-4 w-4" /> Marquer comme résolue
                        </button>
                    )
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="card p-5 lg:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-sm font-semibold text-ink-700">Détails</h3>
                        <div className="flex gap-2">
                            <Badge value={alerte.priorite} />
                            <Badge value={alerte.statut} />
                        </div>
                    </div>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Description" value={alerte.description} />
                        <InfoRow label="Véhicule" value={`${alerte.vehicule?.marque} ${alerte.vehicule?.modele}`} />
                        <InfoRow label="Conducteur" value={`${alerte.conducteur?.utilisateur?.prenom ?? ""} ${alerte.conducteur?.utilisateur?.nom ?? ""}`} />
                        <InfoRow label="Signalée le" value={formatDateTime(alerte.date_signalement)} />
                        <InfoRow label="Immobilise le véhicule" value={alerte.immobilise_vehicule ? "Oui" : "Non"} />
                        {alerte.date_resolution && <InfoRow label="Résolue le" value={formatDateTime(alerte.date_resolution)} />}
                        {alerte.commentaire_resolution && <InfoRow label="Commentaire de résolution" value={alerte.commentaire_resolution} />}
                    </div>
                </div>

                <div className="card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-ink-700">Photo</h3>
                    {alerte.photo ? (
                        <img src={`${storageUrl}/${alerte.photo}`} alt="Alerte" className="w-full rounded-lg border border-ink-100" />
                    ) : (
                        <p className="text-sm text-ink-400">Aucune photo fournie.</p>
                    )}
                </div>
            </div>

            <Modal open={open} onClose={() => setOpen(false)} title="Résoudre l'alerte">
                <div className="space-y-4">
                    <Field label="Date de résolution" required>
                        <TextInput type="datetime-local" value={form.date_resolution} onChange={(e) => setForm((f) => ({ ...f, date_resolution: e.target.value }))} />
                    </Field>
                    <Field label="Commentaire de résolution" required>
                        <TextArea value={form.commentaire_resolution} onChange={(e) => setForm((f) => ({ ...f, commentaire_resolution: e.target.value }))} />
                    </Field>
                    <div className="flex justify-end gap-2 pt-2">
                        <button className="btn-secondary" onClick={() => setOpen(false)}>Annuler</button>
                        <button className="btn-primary" disabled={saving} onClick={handleResoudre}>
                            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                            Confirmer la résolution
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
