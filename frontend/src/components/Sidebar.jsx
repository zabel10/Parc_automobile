import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    LayoutDashboard,
    Users,
    IdCard,
    Car,
    ClipboardList,
    Fuel,
    Wrench,
    AlertTriangle,
    X,
} from "lucide-react";

const NAV = [
    { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard, roles: null },
    { to: "/utilisateurs", label: "Utilisateurs", icon: Users, roles: ["Administrateur"] },
    { to: "/conducteurs", label: "Conducteurs", icon: IdCard, roles: ["Administrateur", "Gestionnaire"] },
    { to: "/vehicules", label: "Véhicules", icon: Car, roles: null },
    { to: "/missions", label: "Missions", icon: ClipboardList, roles: null },
    { to: "/carburants", label: "Carburants", icon: Fuel, roles: null },
    { to: "/maintenances", label: "Maintenances", icon: Wrench, roles: null },
    { to: "/alertes", label: "Alertes", icon: AlertTriangle, roles: null },
];

export default function Sidebar({ open, onClose }) {
    const { hasRole } = useAuth();

    const items = NAV.filter((item) => !item.roles || hasRole(...item.roles));

    return (
        <>
            {open && (
                <div className="fixed inset-0 z-30 bg-ink-950/50 lg:hidden" onClick={onClose} />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-40 flex w-64 shrink-0 -translate-x-full flex-col bg-gradient-to-b from-ink-900 to-ink-950 text-ink-100 transition-transform duration-200 lg:static lg:translate-x-0 ${
                    open ? "translate-x-0" : ""
                }`}
            >
                <div className="flex items-center justify-between px-5 py-5">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 shadow-soft">
                            <Car className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-bold leading-tight text-white">AutoPark</p>
                            <p className="text-[11px] text-ink-400">Gestion de parc auto</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1 text-ink-400 hover:bg-white/5 lg:hidden">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
                    {items.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-brand-600 text-white shadow-soft"
                                        : "text-ink-300 hover:bg-white/5 hover:text-white"
                                }`
                            }
                        >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="border-t border-white/10 px-5 py-4">
                    <p className="text-[11px] leading-relaxed text-ink-500">
                        AutoPark © {new Date().getFullYear()}
                        <br />
                        Gestion de parc automobile — UV-BF
                    </p>
                </div>
            </aside>
        </>
    );
}
