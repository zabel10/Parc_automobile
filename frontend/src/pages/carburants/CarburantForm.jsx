import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, TextArea, Select, FileInput } from "../../components/ui/FormField";
import { carburantService, vehiculeService, conducteurService } from "../../services";
import { CARBURANTS } from "../../utils/constants";
import { formatCurrency, toInputDateTime, extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    vehicule_id: "",
    conducteur_id: "",
    type_carburant: "Essence",
    quantite_litres: "",
    prix_litre: "775",
    kilometrage: "",
    station_service: "",
    date_plein: toInputDateTime(new Date()),
    observations: "",
};

export default function CarburantForm() {
    const navigate = useNavigate();
    const [form, setForm] = useState(EMPTY);
    const [file, setFile] = useState(null);
    const [vehicules, setVehicules] = useState([]);
    const [conducteurs, setConducteurs] = useState([]);
    const [errors, setErrors] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        vehiculeService.list({ per_page: 100 }).then(({ data }) => setVehicules(data.data));
        conducteurService.list({ statut: "Actif", per_page: 100 }).then(({ data }) => setConducteurs(data.data));
    }, []);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    function onVehiculeChange(id) {
        set("vehicule_id", id);
        const v = vehicules.find((v) => String(v.id) === String(id));
        if (v) {
            set("kilometrage", v.kilometrage);
            set("type_carburant", v.carburant);
        }
    }

    const total = useMemo(
        () => (Number(form.quantite_litres) || 0) * (Number(form.prix_litre) || 0),
        [form.quantite_litres, form.prix_litre]
    );

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const fd = new FormData();
            Object.entries(form).forEach(([k, v]) => fd.append(k, v ?? ""));
            if (file) fd.append("justificatif", file);

            await carburantService.create(fd, { headers: { "Content-Type": "multipart/form-data" } });
            toast.success("Plein enregistré avec succès.");
            navigate("/carburants");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    return (
        <DashboardLayout title="Nouveau plein">
            <PageHeader backTo="/carburants" title="Nouveau plein de carburant" subtitle="Enregistrez un ravitaillement pour un véhicule du parc." />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Véhicule" required error={errors.vehicule_id?.[0]}>
                        <Select value={form.vehicule_id} onChange={(e) => onVehiculeChange(e.target.value)} error={errors.vehicule_id}>
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

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Type de carburant" required error={errors.type_carburant?.[0]}>
                        <Select value={form.type_carburant} onChange={(e) => set("type_carburant", e.target.value)} error={errors.type_carburant}>
                            {CARBURANTS.map((c) => <option key={c} value={c}>{c}</option>)}
                        </Select>
                    </Field>
                    <Field label="Quantité (litres)" required error={errors.quantite_litres?.[0]}>
                        <TextInput type="number" step="0.01" value={form.quantite_litres} onChange={(e) => set("quantite_litres", e.target.value)} error={errors.quantite_litres} />
                    </Field>
                    <Field label="Prix au litre (FCFA)" required error={errors.prix_litre?.[0]}>
                        <TextInput type="number" step="0.01" value={form.prix_litre} onChange={(e) => set("prix_litre", e.target.value)} error={errors.prix_litre} />
                    </Field>
                    <Field label="Coût total">
                        <div className="input flex items-center bg-ink-50 font-semibold text-ink-700">{formatCurrency(total)}</div>
                    </Field>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Field label="Kilométrage" required error={errors.kilometrage?.[0]}>
                        <TextInput type="number" value={form.kilometrage} onChange={(e) => set("kilometrage", e.target.value)} error={errors.kilometrage} />
                    </Field>
                    <Field label="Station-service" required error={errors.station_service?.[0]}>
                        <TextInput value={form.station_service} onChange={(e) => set("station_service", e.target.value)} error={errors.station_service} />
                    </Field>
                    <Field label="Date du plein" required error={errors.date_plein?.[0]}>
                        <TextInput type="datetime-local" value={form.date_plein} onChange={(e) => set("date_plein", e.target.value)} error={errors.date_plein} />
                    </Field>
                </div>

                <Field label="Justificatif (PDF ou image, max 2 Mo)" error={errors.justificatif?.[0]}>
                    <FileInput accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFile(e.target.files?.[0] ?? null)} error={errors.justificatif} />
                </Field>

                <Field label="Observations" error={errors.observations?.[0]}>
                    <TextArea value={form.observations} onChange={(e) => set("observations", e.target.value)} error={errors.observations} />
                </Field>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/carburants")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        Enregistrer le plein
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
