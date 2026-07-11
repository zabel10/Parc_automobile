import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, TextArea, Select, FileInput, Checkbox } from "../../components/ui/FormField";
import { alerteService, vehiculeService, conducteurService } from "../../services";
import { TYPES_ALERTE, PRIORITES_ALERTE } from "../../utils/constants";
import { toInputDateTime, extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    vehicule_id: "",
    conducteur_id: "",
    type_alerte: "Panne",
    priorite: "Normale",
    description: "",
    date_signalement: toInputDateTime(new Date()),
    immobilise_vehicule: false,
};

export default function AlerteForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [file, setFile] = useState(null);
    const [vehicules, setVehicules] = useState([]);
    const [conducteurs, setConducteurs] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        vehiculeService.list({ per_page: 100 }).then(({ data }) => setVehicules(data.data));
        conducteurService.list({ per_page: 100 }).then(({ data }) => setConducteurs(data.data));
    }, []);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, typeof v === "boolean" ? (v ? "1" : "0") : v ?? ""));
            if (file) fd.append("photo", file);

            await alerteService.create(fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Alerte signalée avec succès.");
            navigate("/alertes");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <DashboardLayout title="Nouvelle alerte">
            <PageHeader backTo="/alertes" title="Signaler une alerte" subtitle="Décrivez le problème rencontré sur un véhicule du parc." />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Véhicule" required error={errors.vehicule_id?.[0]}>
                        <Select value={form.vehicule_id} onChange={(e) => set("vehicule_id", e.target.value)} error={errors.vehicule_id}>
                            <option value="">Sélectionner…</option>
                            {vehicules.map((v) => <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>)}
                        </Select>
                    </Field>
                    <Field label="Conducteur" required error={errors.conducteur_id?.[0]}>
                        <Select value={form.conducteur_id} onChange={(e) => set("conducteur_id", e.target.value)} error={errors.conducteur_id}>
                            <option value="">Sélectionner…</option>
                            {conducteurs.map((c) => <option key={c.id} value={c.id}>{c.utilisateur?.prenom} {c.utilisateur?.nom}</option>)}
                        </Select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Type d'alerte" required error={errors.type_alerte?.[0]}>
                        <Select value={form.type_alerte} onChange={(e) => set("type_alerte", e.target.value)} error={errors.type_alerte}>
                            {TYPES_ALERTE.map((t) => <option key={t} value={t}>{t}</option>)}
                        </Select>
                    </Field>
                    <Field label="Priorité" required error={errors.priorite?.[0]}>
                        <Select value={form.priorite} onChange={(e) => set("priorite", e.target.value)} error={errors.priorite}>
                            {PRIORITES_ALERTE.map((p) => <option key={p} value={p}>{p}</option>)}
                        </Select>
                    </Field>
                    <Field label="Date de signalement" required error={errors.date_signalement?.[0]}>
                        <TextInput type="datetime-local" value={form.date_signalement} onChange={(e) => set("date_signalement", e.target.value)} error={errors.date_signalement} />
                    </Field>
                </div>

                <Field label="Description" required error={errors.description?.[0]}>
                    <TextArea value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} rows={4} />
                </Field>

                <Field label="Photo (optionnelle, max 2 Mo)" error={errors.photo?.[0]}>
                    <FileInput accept=".jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} error={errors.photo} />
                </Field>

                <Checkbox
                    label="Ce problème immobilise le véhicule"
                    checked={form.immobilise_vehicule}
                    onChange={(e) => set("immobilise_vehicule", e.target.checked)}
                />

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/alertes")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Signaler l'alerte
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
