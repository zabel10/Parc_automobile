import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, Select } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { vehiculeService } from "../../services";
import { CARBURANTS, ETATS_VEHICULE, STATUTS_VEHICULE } from "../../utils/constants";
import { toInputDate, extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    immatriculation: "",
    numero_chassis: "",
    marque: "",
    modele: "",
    annee: new Date().getFullYear(),
    couleur: "",
    carburant: "Essence",
    kilometrage: 0,
    capacite_reservoir: "",
    consommation_moyenne: "",
    statut: "Disponible",
    etat: "Bon",
    date_acquisition: toInputDate(new Date()),
};

export default function VehiculeForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEdit) return;
        vehiculeService.get(id).then(({ data }) => {
            setForm({ ...data, date_acquisition: toInputDate(data.date_acquisition) });
        }).finally(() => setLoading(false));
    }, [id, isEdit]);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            if (isEdit) {
                await vehiculeService.update(id, form);
                toast.success("Véhicule mis à jour.");
            } else {
                await vehiculeService.create(form);
                toast.success("Véhicule créé avec succès.");
            }
            navigate("/vehicules");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <DashboardLayout title="Véhicule"><PageSpinner /></DashboardLayout>
    );

    return (
        <DashboardLayout title={isEdit ? "Modifier le véhicule" : "Nouveau véhicule"}>
            <PageHeader
                backTo="/vehicules"
                title={isEdit ? "Modifier le véhicule" : "Nouveau véhicule"}
                subtitle="Renseignez les informations d'identification et techniques du véhicule."
            />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Identification</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Immatriculation" required error={errors.immatriculation?.[0]}>
                            <TextInput value={form.immatriculation} onChange={(e) => set("immatriculation", e.target.value)} placeholder="11 AB 2026 BF" error={errors.immatriculation} />
                        </Field>
                        <Field label="Numéro de châssis" required error={errors.numero_chassis?.[0]}>
                            <TextInput value={form.numero_chassis} onChange={(e) => set("numero_chassis", e.target.value)} error={errors.numero_chassis} />
                        </Field>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Informations générales</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Field label="Marque" required error={errors.marque?.[0]}>
                            <TextInput value={form.marque} onChange={(e) => set("marque", e.target.value)} error={errors.marque} />
                        </Field>
                        <Field label="Modèle" required error={errors.modele?.[0]}>
                            <TextInput value={form.modele} onChange={(e) => set("modele", e.target.value)} error={errors.modele} />
                        </Field>
                        <Field label="Année" required error={errors.annee?.[0]}>
                            <TextInput type="number" value={form.annee} onChange={(e) => set("annee", e.target.value)} error={errors.annee} />
                        </Field>
                        <Field label="Couleur" required error={errors.couleur?.[0]}>
                            <TextInput value={form.couleur} onChange={(e) => set("couleur", e.target.value)} error={errors.couleur} />
                        </Field>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Caractéristiques techniques</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Field label="Carburant" required error={errors.carburant?.[0]}>
                            <Select value={form.carburant} onChange={(e) => set("carburant", e.target.value)} error={errors.carburant}>
                                {CARBURANTS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </Field>
                        <Field label="Kilométrage" required error={errors.kilometrage?.[0]}>
                            <TextInput type="number" value={form.kilometrage} onChange={(e) => set("kilometrage", e.target.value)} error={errors.kilometrage} />
                        </Field>
                        <Field label="Capacité réservoir (L)" error={errors.capacite_reservoir?.[0]}>
                            <TextInput type="number" value={form.capacite_reservoir || ""} onChange={(e) => set("capacite_reservoir", e.target.value)} error={errors.capacite_reservoir} />
                        </Field>
                        <Field label="Consommation moyenne (L/100km)" error={errors.consommation_moyenne?.[0]}>
                            <TextInput type="number" step="0.01" value={form.consommation_moyenne || ""} onChange={(e) => set("consommation_moyenne", e.target.value)} error={errors.consommation_moyenne} />
                        </Field>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">État du véhicule</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <Field label="Statut" required error={errors.statut?.[0]}>
                            <Select value={form.statut} onChange={(e) => set("statut", e.target.value)} error={errors.statut}>
                                {STATUTS_VEHICULE.map((s) => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </Field>
                        <Field label="État" required error={errors.etat?.[0]}>
                            <Select value={form.etat} onChange={(e) => set("etat", e.target.value)} error={errors.etat}>
                                {ETATS_VEHICULE.map((s) => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </Field>
                        <Field label="Date d'acquisition" required error={errors.date_acquisition?.[0]}>
                            <TextInput type="date" value={form.date_acquisition} onChange={(e) => set("date_acquisition", e.target.value)} error={errors.date_acquisition} />
                        </Field>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/vehicules")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? "Enregistrer les modifications" : "Créer le véhicule"}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
