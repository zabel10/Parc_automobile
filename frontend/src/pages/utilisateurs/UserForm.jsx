import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Save, Loader2 } from "lucide-react";
import DashboardLayout from "../../layouts/DashboardLayout";
import PageHeader from "../../components/ui/PageHeader";
import { Field, TextInput, Select } from "../../components/ui/FormField";
import { PageSpinner } from "../../components/ui/Spinner";
import { userService } from "../../services";
import { ROLES, STATUTS_UTILISATEUR } from "../../utils/constants";
import { extractErrorMessage } from "../../utils/formatters";

const EMPTY = {
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    role: "Conducteur",
    statut: "Actif",
};

export default function UserForm() {
    const { id } = useParams();
    const isEdit = !!id;
    const navigate = useNavigate();

    const [form, setForm] = useState(EMPTY);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isEdit) return;
        userService.get(id).then(({ data }) => setForm({ ...data, password: "" })).finally(() => setLoading(false));
    }, [id, isEdit]);

    function set(key, value) {
        setForm((f) => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setErrors({});
        try {
            const payload = { ...form };
            if (isEdit && !payload.password) delete payload.password;

            if (isEdit) {
                await userService.update(id, payload);
                toast.success("Utilisateur mis à jour.");
            } else {
                await userService.create(payload);
                toast.success("Utilisateur créé avec succès.");
            }
            navigate("/utilisateurs");
        } catch (err) {
            setErrors(err.response?.data?.errors || {});
            toast.error(extractErrorMessage(err));
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <DashboardLayout title="Utilisateur"><PageSpinner /></DashboardLayout>;

    return (
        <DashboardLayout title={isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}>
            <PageHeader
                backTo="/utilisateurs"
                title={isEdit ? "Modifier l'utilisateur" : "Nouvel utilisateur"}
                subtitle="Gérez les accès et permissions de la plateforme AutoPark."
            />

            <form onSubmit={handleSubmit} className="card space-y-6 p-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Prénom" required error={errors.prenom?.[0]}>
                        <TextInput value={form.prenom} onChange={(e) => set("prenom", e.target.value)} error={errors.prenom} />
                    </Field>
                    <Field label="Nom" required error={errors.nom?.[0]}>
                        <TextInput value={form.nom} onChange={(e) => set("nom", e.target.value)} error={errors.nom} />
                    </Field>
                    <Field label="E-mail" required error={errors.email?.[0]}>
                        <TextInput type="email" value={form.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
                    </Field>
                    <Field label="Téléphone" error={errors.telephone?.[0]}>
                        <TextInput value={form.telephone || ""} onChange={(e) => set("telephone", e.target.value)} error={errors.telephone} />
                    </Field>
                </div>

                <Field
                    label={isEdit ? "Nouveau mot de passe (laisser vide pour ne pas changer)" : "Mot de passe"}
                    required={!isEdit}
                    error={errors.password?.[0]}
                    hint="8 caractères minimum."
                >
                    <TextInput type="password" value={form.password} onChange={(e) => set("password", e.target.value)} error={errors.password} />
                </Field>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Rôle" required error={errors.role?.[0]}>
                        <Select value={form.role} onChange={(e) => set("role", e.target.value)} error={errors.role}>
                            {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </Select>
                    </Field>
                    <Field label="Statut" required error={errors.statut?.[0]}>
                        <Select value={form.statut} onChange={(e) => set("statut", e.target.value)} error={errors.statut}>
                            {STATUTS_UTILISATEUR.map((s) => <option key={s} value={s}>{s}</option>)}
                        </Select>
                    </Field>
                </div>

                <div className="flex justify-end gap-3 border-t border-ink-100 pt-5">
                    <button type="button" onClick={() => navigate("/utilisateurs")} className="btn-secondary">Annuler</button>
                    <button type="submit" disabled={saving} className="btn-primary">
                        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                        {isEdit ? "Enregistrer" : "Créer l'utilisateur"}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
