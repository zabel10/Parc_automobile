// Palette cohérente pour tous les statuts métier de l'application.
export const STATUS_STYLES = {
    // Véhicules
    "Disponible": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "En mission": "bg-blue-50 text-blue-700 ring-blue-600/20",
    "Maintenance": "bg-amber-50 text-amber-700 ring-amber-600/20",
    "En panne": "bg-rose-50 text-rose-700 ring-rose-600/20",
    "Hors service": "bg-ink-100 text-ink-600 ring-ink-500/20",

    // Missions
    "En attente": "bg-amber-50 text-amber-700 ring-amber-600/20",
    "Validée": "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
    "En cours": "bg-blue-50 text-blue-700 ring-blue-600/20",
    "Terminée": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Annulée": "bg-ink-100 text-ink-600 ring-ink-500/20",

    // Alertes
    "Résolue": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Rejetée": "bg-ink-100 text-ink-600 ring-ink-500/20",

    // Maintenances
    "Planifiée": "bg-amber-50 text-amber-700 ring-amber-600/20",

    // Conducteurs / utilisateurs
    "Actif": "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
    "Inactif": "bg-ink-100 text-ink-600 ring-ink-500/20",
    "Suspendu": "bg-rose-50 text-rose-700 ring-rose-600/20",

    // Priorités
    "Faible": "bg-ink-100 text-ink-600 ring-ink-500/20",
    "Normale": "bg-blue-50 text-blue-700 ring-blue-600/20",
    "Haute": "bg-amber-50 text-amber-700 ring-amber-600/20",
    "Critique": "bg-rose-50 text-rose-700 ring-rose-600/20",

    // Rôles
    "Administrateur": "bg-violet-50 text-violet-700 ring-violet-600/20",
    "Gestionnaire": "bg-blue-50 text-blue-700 ring-blue-600/20",
    "Conducteur": "bg-teal-50 text-teal-700 ring-teal-600/20",
};

export function statusStyle(value) {
    return STATUS_STYLES[value] || "bg-ink-100 text-ink-600 ring-ink-500/20";
}
