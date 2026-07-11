import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, Select } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { conducteurService, userService } from "../../services";
import { CATEGORIES_PERMIS, STATUTS_CONDUCTEUR } from "../../utils/constants";
import { toInputDate, extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    utilisateur_id: "",
    num_permis: "",
    categorie_permis: "B",
    date_delivrance_permis: "",
    date_expiration_permis: "",
    date_naissance: "",
    adresse: "",
    contact_urgence: "",
    statut: "Actif",
};

export default function ConducteurForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY);
    const [users, setUsers] = useState([]);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        async function load() {
            const params = isEdit ? { role: "Conducteur", per_page: 100 } : { role: "Conducteur", sans_conducteur: 1, per_page: 100 };
            const usersReq = userService.list(params);

            if (isEdit) {
                const [{ data: cData }, { data: uData }] = await Promise.all([conducteurService.get(id), usersReq]);
                setForm({
                    ...cData,
                    utilisateur_id: cData.utilisateur_id,
                    date_delivrance_permis: toInputDate(cData.date_delivrance_permis),
                    date_expiration_permis: toInputDate(cData.date_expiration_permis),
                    date_naissance: toInputDate(cData.date_naissance),
                });
                let list = uData.data;
                if (cData.utilisateur && !list.find((u) => u.id === cData.utilisateur.id)) {
                    list = [cData.utilisateur, ...list];
                }
                setUsers(list);
            } else {
                const { data: uData } = await usersReq;
                setUsers(uData.data);
            }
            setLoading(false);
        }
        load();
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
                await conducteurService.update(id, form);
                toast.success("Conducteur mis à jour.");
            } else {
                await conducteurService.create(form);
                toast.success("Conducteur créé avec succès.");
            }
            navigate("/conducteurs");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <DashboardLayout title="Conducteur"><PageSpinner /></DashboardLayout>;

    return (
        <DashboardLayout title={isEdit ? "Modifier le conducteur" : "Nouveau conducteur"}>
            <PageHeader
                backTo="/conducteurs"
                title={isEdit ? "Modifier le conducteur" : "Nouveau conducteur"}
                subtitle="Associez un compte utilisateur existant à un profil de conducteur."
            />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Compte lié</h3>
                    <Field label="Utilisateur" required error={errors.utilisateur_id?.[0]}
                        hint={!isEdit && users.length === 0 ? "Aucun utilisateur de rôle « Conducteur » n'est disponible. Créez d'abord un compte utilisateur." : undefined}>
                        <Select value={form.utilisateur_id} onChange={(e) => set("utilisateur_id", e.target.value)} error={errors.utilisateur_id} disabled={isEdit}>
                            <option value="">Sélectionner un utilisateur…</option>
                            {users.map((u) => (
                                <option key={u.id} value={u.id}>{u.prenom} {u.nom} — {u.email}</option>
                            ))}
                        </Select>
                    </Field>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Permis de conduire</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Field label="Numéro de permis" required error={errors.num_permis?.[0]}>
                            <TextInput value={form.num_permis} onChange={(e) => set("num_permis", e.target.value)} error={errors.num_permis} />
                        </Field>
                        <Field label="Catégorie" required error={errors.categorie_permis?.[0]}>
                            <Select value={form.categorie_permis} onChange={(e) => set("categorie_permis", e.target.value)} error={errors.categorie_permis}>
                                {CATEGORIES_PERMIS.map((c) => <option key={c} value={c}>{c}</option>)}
                            </Select>
                        </Field>
                        <Field label="Statut" error={errors.statut?.[0]}>
                            <Select value={form.statut} onChange={(e) => set("statut", e.target.value)} error={errors.statut}>
                                {STATUTS_CONDUCTEUR.map((s) => <option key={s} value={s}>{s}</option>)}
                            </Select>
                        </Field>
                        <Field label="Date de délivrance" required error={errors.date_delivrance_permis?.[0]}>
                            <TextInput type="date" value={form.date_delivrance_permis} onChange={(e) => set("date_delivrance_permis", e.target.value)} error={errors.date_delivrance_permis} />
                        </Field>
                        <Field label="Date d'expiration" required error={errors.date_expiration_permis?.[0]}>
                            <TextInput type="date" value={form.date_expiration_permis} onChange={(e) => set("date_expiration_permis", e.target.value)} error={errors.date_expiration_permis} />
                        </Field>
                        <Field label="Date de naissance" required error={errors.date_naissance?.[0]}>
                            <TextInput type="date" value={form.date_naissance} onChange={(e) => set("date_naissance", e.target.value)} error={errors.date_naissance} />
                        </Field>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 text-sm font-semibold text-ink-700">Coordonnées</h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <Field label="Adresse" error={errors.adresse?.[0]}>
                            <TextInput value={form.adresse || ""} onChange={(e) => set("adresse", e.target.value)} error={errors.adresse} />
                        </Field>
                        <Field label="Contact d'urgence" error={errors.contact_urgence?.[0]}>
                            <TextInput value={form.contact_urgence || ""} onChange={(e) => set("contact_urgence", e.target.value)} error={errors.contact_urgence} />
                        </Field>
                    </div>
                </div>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/conducteurs")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? "Enregistrer" : "Créer le conducteur"}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
