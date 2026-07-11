import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, TextArea, Select } from "../../components/ui/FormField";
import { maintenanceService, vehiculeService, alerteService } from "../../services";
import { TYPES_MAINTENANCE } from "../../utils/constants";
import { extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    vehicule_id: "",
    alerte_id: "",
    type_maintenance: "Préventive",
    prestataire: "",
    description: "",
    kilometrage: "",
    prochaine_echeance: "",
    observations: "",
};

export default function MaintenanceForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [vehicules, setVehicules] = useState([]);
    const [alertes, setAlertes] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        vehiculeService.list({ per_page: 100 }).then(({ data }) => setVehicules(data.data));
        alerteService.list({ statut: "En attente", per_page: 100 }).then(({ data }) => setAlertes(data.data));
    }, []);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function onVehiculeChange(id) {
        set("vehicule_id", id);
        const v = vehicules.find((v) => String(v.id) === String(id));
        if (v) set("kilometrage", v.kilometrage);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = { ...form, alerte_id: form.alerte_id || null, prochaine_echeance: form.prochaine_echeance || null };
            await maintenanceService.create(payload);
            toast.success("Maintenance planifiée avec succès.");
            navigate("/maintenances");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <DashboardLayout title="Nouvelle maintenance">
            <PageHeader backTo="/maintenances" title="Nouvelle maintenance" subtitle="Planifiez un entretien préventif ou correctif pour un véhicule." />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Véhicule" required error={errors.vehicule_id?.[0]}>
                        <Select value={form.vehicule_id} onChange={(e) => onVehiculeChange(e.target.value)} error={errors.vehicule_id}>
                            <option value="">Sélectionner…</option>
                            {vehicules.map((v) => <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>)}
                        </Select>
                    </Field>
                    <Field label="Alerte liée (optionnel)" error={errors.alerte_id?.[0]}>
                        <Select value={form.alerte_id} onChange={(e) => set("alerte_id", e.target.value)} error={errors.alerte_id}>
                            <option value="">Aucune</option>
                            {alertes.map((a) => <option key={a.id} value={a.id}>{a.type_alerte} — {a.vehicule?.immatriculation}</option>)}
                        </Select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Type de maintenance" required error={errors.type_maintenance?.[0]}>
                        <Select value={form.type_maintenance} onChange={(e) => set("type_maintenance", e.target.value)} error={errors.type_maintenance}>
                            {TYPES_MAINTENANCE.map((t) => <option key={t} value={t}>{t}</option>)}
                        </Select>
                    </Field>
                    <Field label="Prestataire" required error={errors.prestataire?.[0]}>
                        <TextInput value={form.prestataire} onChange={(e) => set("prestataire", e.target.value)} error={errors.prestataire} />
                    </Field>
                    <Field label="Kilométrage" required error={errors.kilometrage?.[0]}>
                        <TextInput type="number" value={form.kilometrage} onChange={(e) => set("kilometrage", e.target.value)} error={errors.kilometrage} />
                    </Field>
                </div>

                <Field label="Description" required error={errors.description?.[0]}>
                    <TextArea value={form.description} onChange={(e) => set("description", e.target.value)} error={errors.description} />
                </Field>

                <Field label="Prochaine échéance (optionnel)" error={errors.prochaine_echeance?.[0]}>
                    <TextInput type="date" value={form.prochaine_echeance} onChange={(e) => set("prochaine_echeance", e.target.value)} error={errors.prochaine_echeance} />
                </Field>

                <Field label="Observations" error={errors.observations?.[0]}>
                    <TextArea value={form.observations} onChange={(e) => set("observations", e.target.value)} error={errors.observations} />
                </Field>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/maintenances")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Planifier la maintenance
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
