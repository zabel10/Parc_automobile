import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { PlayCircle, FlagTriangleRight, Loader2, FileText } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import Badge from "../../components/ui/Badge";
import Modal from "../../components/ui/Modal";
import { Field, TextInput, TextArea, FileInput } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { maintenanceService } from "../../services";
import api from "../../api/axios";
import { formatCurrency, formatDate, extractErrorMessage, toInputDate } from "../../utils/formatters";
import { useAuth } from "../../context/AuthContext";

function InfoRow({ label, value }) {
    return (
        <div className="flex items-center justify-between py-2.5 text-sm">
            <span className="text-ink-500">{label}</span>
            <span className="font-medium text-ink-800">{value ?? "—"}</span>
        </div>
    );
}

export default function MaintenanceShow() {
    const { id } = useParams();
    const { hasRole } = useAuth();
    const canManage = hasRole("Gestionnaire");
    const [maintenance, setMaintenance] = useState(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [terminerOpen, setTerminerOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [terminerForm, setTerminerForm] = useState({ date_fin: "", cout: "", prochaine_echeance: "", observations: "" });

    function load() {
        setLoading(true);
        maintenanceService.get(id).then(({ data }) => setMaintenance(data)).finally(() => setLoading(false));
    }

    useEffect(load, [id]);

    async function handleDemarrer() {
        setActionLoading(true);
        try {
            await maintenanceService.patch(id, "demarrer", { date_debut: toInputDate(new Date()) });
            toast.success("Maintenance démarrée.");
            load();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    function openTerminer() {
        setTerminerForm({ date_fin: toInputDate(new Date()), cout: "", prochaine_echeance: "", observations: "" });
        setTerminerOpen(true);
    }

    async function handleTerminer() {
        setActionLoading(true);
        try {
            const fd = new FormData();
            Object.entries(terminerForm).forEach(([k, v]) => fd.append(k, v ?? ""));
            if (file) fd.append("facture", file);
            fd.append("_method", "PATCH");
            // Multipart + PATCH nécessite le contournement _method (PHP ne parse pas
            // les fichiers sur les requêtes PATCH/PUT natives).
            await api.post(`/maintenances/${id}/terminer`, fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Maintenance terminée.");
            setTerminerOpen(false);
            load();
        } catch (err) {
            toast.error(extractErrorMessage(err));
        } finally {
            setActionLoading(false);
        }
    }

    if (loading) return <DashboardLayout title="Maintenance"><PageSpinner /></DashboardLayout>;
    if (!maintenance) return <DashboardLayout title="Maintenance">Introuvable.</DashboardLayout>;

    const storageUrl = import.meta.env.VITE_STORAGE_URL || "http://127.0.0.1:8000/storage";

    return (
        <DashboardLayout title="Détail de la maintenance">
            <PageHeader
                backTo="/maintenances"
                title={maintenance.type_maintenance}
                subtitle={maintenance.vehicule?.immatriculation}
                action={
                    canManage && (
                        <div className="flex gap-2">
                            {maintenance.statut === "Planifiée" && (
                                <button onClick={handleDemarrer} disabled={actionLoading} className="btn-primary">
                                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <PlayCircle className="h-4 w-4" />} Démarrer
                                </button>
                            )}
                            {maintenance.statut === "En cours" && (
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
                        <h3 className="text-sm font-semibold text-ink-700">Détails</h3>
                        <Badge value={maintenance.statut} />
                    </div>
                    <div className="divide-y divide-ink-50">
                        <InfoRow label="Description" value={maintenance.description} />
                        <InfoRow label="Prestataire" value={maintenance.prestataire} />
                        <InfoRow label="Date de début" value={formatDate(maintenance.date_debut)} />
                        <InfoRow label="Date de fin" value={maintenance.date_fin ? formatDate(maintenance.date_fin) : "—"} />
                        <InfoRow label="Coût" value={formatCurrency(maintenance.cout)} />
                        <InfoRow label="Kilométrage" value={`${maintenance.kilometrage} km`} />
                        <InfoRow label="Prochaine échéance" value={maintenance.prochaine_echeance ? formatDate(maintenance.prochaine_echeance) : "—"} />
                        {maintenance.observations && <InfoRow label="Observations" value={maintenance.observations} />}
                    </div>
                </div>

                <div className="card p-5">
                    <h3 className="mb-3 text-sm font-semibold text-ink-700">Facture</h3>
                    {maintenance.facture ? (
                        <a href={`${storageUrl}/${maintenance.facture}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-lg border border-ink-100 p-3 text-sm text-brand-600 hover:bg-brand-50">
                            <FileText className="h-5 w-5" /> Voir la facture
                        </a>
                    ) : <p className="text-sm text-ink-400">Aucune facture disponible.</p>}
                </div>
            </div>

            <Modal open={terminerOpen} onClose={() => setTerminerOpen(false)} title="Terminer la maintenance">
                <div className="space-y-4">
                    <Field label="Date de fin" required>
                        <TextInput type="date" value={terminerForm.date_fin} onChange={(e) => setTerminerForm((f) => ({ ...f, date_fin: e.target.value }))} />
                    </Field>
                    <Field label="Coût (FCFA)" required>
                        <TextInput type="number" value={terminerForm.cout} onChange={(e) => setTerminerForm((f) => ({ ...f, cout: e.target.value }))} />
                    </Field>
                    <Field label="Prochaine échéance">
                        <TextInput type="date" value={terminerForm.prochaine_echeance} onChange={(e) => setTerminerForm((f) => ({ ...f, prochaine_echeance: e.target.value }))} />
                    </Field>
                    <Field label="Facture (PDF ou image)">
                        <FileInput accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                    </Field>
                    <Field label="Observations">
                        <TextArea value={terminerForm.observations} onChange={(e) => setTerminerForm((f) => ({ ...f, observations: e.target.value }))} />
                    </Field>
                    <div className="flex justify-end gap-2 pt-2">
                        <button className="btn-secondary" onClick={() => setTerminerOpen(false)}>Annuler</button>
                        <button className="btn-primary" disabled={actionLoading} onClick={handleTerminer}>
                            {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FlagTriangleRight className="h-4 w-4" />}
                            Confirmer
                        </button>
                    </div>
                </div>
            </Modal>
        </DashboardLayout>
    );
}
