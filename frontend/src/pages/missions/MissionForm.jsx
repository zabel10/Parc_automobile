import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, TextArea, Select } from "../../components/ui/FormField";
import { missionService, vehiculeService, conducteurService } from "../../services";
import { toInputDateTime, extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    vehicule_id: "",
    conducteur_id: "",
    lieu_depart: "Ouagadougou",
    destination: "",
    motif: "",
    date_depart: "",
    date_retour_prevue: "",
    km_depart: "",
};

export default function MissionForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [vehicules, setVehicules] = useState([]);
    const [conducteurs, setConducteurs] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        vehiculeService.list({ statut: "Disponible", per_page: 100 }).then(({ data }) => setVehicules(data.data));
        conducteurService.list({ statut: "Actif", per_page: 100 }).then(({ data }) => setConducteurs(data.data));
    }, []);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function onVehiculeChange(id) {
        set("vehicule_id", id);
        const v = vehicules.find((v) => String(v.id) === String(id));
        if (v) set("km_depart", v.kilometrage);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            await missionService.create(form);
            toast.success("Mission créée avec succès.");
            navigate("/missions");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <DashboardLayout title="Nouvelle mission">
            <PageHeader
                backTo="/missions"
                title="Nouvelle mission"
                subtitle="Planifiez un déplacement en assignant un véhicule et un conducteur disponibles."
            />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Véhicule" required error={errors.vehicule_id?.[0]}
                        hint={vehicules.length === 0 ? "Aucun véhicule disponible actuellement." : undefined}>
                        <Select value={form.vehicule_id} onChange={(e) => onVehiculeChange(e.target.value)} error={errors.vehicule_id}>
                            <option value="">Sélectionner…</option>
                            {vehicules.map((v) => (
                                <option key={v.id} value={v.id}>{v.marque} {v.modele} — {v.immatriculation}</option>
                            ))}
                        </Select>
                    </Field>
                    <Field label="Conducteur" required error={errors.conducteur_id?.[0]}
                        hint={conducteurs.length === 0 ? "Aucun conducteur actif disponible." : undefined}>
                        <Select value={form.conducteur_id} onChange={(e) => set("conducteur_id", e.target.value)} error={errors.conducteur_id}>
                            <option value="">Sélectionner…</option>
                            {conducteurs.map((c) => (
                                <option key={c.id} value={c.id}>{c.utilisateur?.prenom} {c.utilisateur?.nom}</option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Lieu de départ" required error={errors.lieu_depart?.[0]}>
                        <TextInput value={form.lieu_depart} onChange={(e) => set("lieu_depart", e.target.value)} error={errors.lieu_depart} />
                    </Field>
                    <Field label="Destination" required error={errors.destination?.[0]}>
                        <TextInput value={form.destination} onChange={(e) => set("destination", e.target.value)} error={errors.destination} />
                    </Field>
                </div>

                <Field label="Motif de la mission" required error={errors.motif?.[0]}>
                    <TextArea value={form.motif} onChange={(e) => set("motif", e.target.value)} error={errors.motif} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <Field label="Date/heure de départ" required error={errors.date_depart?.[0]}>
                        <TextInput type="datetime-local" value={form.date_depart} onChange={(e) => set("date_depart", e.target.value)} error={errors.date_depart} />
                    </Field>
                    <Field label="Retour prévu" required error={errors.date_retour_prevue?.[0]}>
                        <TextInput type="datetime-local" value={form.date_retour_prevue} onChange={(e) => set("date_retour_prevue", e.target.value)} error={errors.date_retour_prevue} />
                    </Field>
                    <Field label="Kilométrage au départ" required error={errors.km_depart?.[0]}>
                        <TextInput type="number" value={form.km_depart} onChange={(e) => set("km_depart", e.target.value)} error={errors.km_depart} />
                    </Field>
                </div>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/missions")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Créer la mission
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
