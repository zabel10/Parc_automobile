import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Car, ClipboardList, AlertTriangle, Wrench, Fuel, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import DashboardLayout from "../layouts/DashboardLayout";
import StatCard from "../components/dashboard/StatCard";
import Badge from "../components/ui/Badge";
import { PageSpinner } from "../components/ui/Spinner";
import { formatCurrency, formatDate } from "../utils/formatters";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;
        api.get("/dashboard").then(({ data }) => {
            if (!ignore) setData(data);
        }).finally(() => !ignore && setLoading(false));
        return () => { ignore = true; };
    }, []);

    const missionsChart = (data?.evolutionMissions ?? []).map((m) => ({ mois: m.mois, missions: m.total }));
    const carburantChart = (data?.evolutionCarburant ?? []).map((m) => ({ mois: m.mois, cout: m.total }));

    return (
        <DashboardLayout title="Tableau de bord">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-ink-900">
                    Bonjour, {user?.prenom} 
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                    Voici un aperçu en temps réel de votre parc automobile.
                </p>
            </div>

            {loading || !data ? (
                <PageSpinner />
            ) : (
                <div className="space-y-6">
                    {/* Cartes de synthèse */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Véhicules disponibles" value={`${data.vehiculesDisponibles}/${data.vehicules}`} icon={<Car className="h-5 w-5" />} color="blue" />
                        <StatCard label="Missions en cours" value={data.missionsEnCours} icon={<ClipboardList className="h-5 w-5" />} color="violet" />
                        <StatCard label="Alertes en attente" value={data.alertesEnAttente} icon={<AlertTriangle className="h-5 w-5" />} color="rose" />
                        <StatCard label="Maintenances en cours" value={data.maintenancesEnCours} icon={<Wrench className="h-5 w-5" />} color="amber" />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Véhicules en mission" value={data.vehiculesMission} icon={<Car className="h-5 w-5" />} color="teal" />
                        <StatCard label="Coût carburant total" value={formatCurrency(data.coutCarburant)} icon={<Fuel className="h-5 w-5" />} color="emerald" />
                        <StatCard label="Coût maintenance total" value={formatCurrency(data.coutMaintenance)} icon={<Wrench className="h-5 w-5" />} color="amber" />
                        <StatCard label="Missions terminées" value={data.missionsTerminees} icon={<CheckCircle2 className="h-5 w-5" />} color="blue" />
                    </div>

                    {/* Graphiques */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                        <div className="card p-5 lg:col-span-2">
                            <h3 className="mb-4 text-sm font-semibold text-ink-700">Évolution des missions</h3>
                            <ResponsiveContainer width="100%" height={260}>
                                <AreaChart data={missionsChart}>
                                    <defs>
                                        <linearGradient id="missionsFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef2" />
                                    <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#7c869e" }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 12, fill: "#7c869e" }} axisLine={false} tickLine={false} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", fontSize: 13 }} />
                                    <Area type="monotone" dataKey="missions" stroke="#2563eb" strokeWidth={2.5} fill="url(#missionsFill)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card p-5">
                            <h3 className="mb-4 text-sm font-semibold text-ink-700">Répartition des véhicules</h3>
                            <div className="space-y-3">
                                {[
                                    { label: "Disponibles", value: data.vehiculesDisponibles, color: "bg-emerald-500" },
                                    { label: "En mission", value: data.vehiculesMission, color: "bg-blue-500" },
                                    { label: "En maintenance", value: data.vehiculesMaintenance, color: "bg-amber-500" },
                                ].map((item) => {
                                    const pct = data.vehicules ? Math.round((item.value / data.vehicules) * 100) : 0;
                                    return (
                                        <div key={item.label}>
                                            <div className="mb-1 flex justify-between text-xs font-medium text-ink-600">
                                                <span>{item.label}</span>
                                                <span>{item.value} · {pct}%</span>
                                            </div>
                                            <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
                                                <div className={`h-full rounded-full ${item.color}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="card p-5">
                        <h3 className="mb-4 text-sm font-semibold text-ink-700">Dépenses de carburant (FCFA)</h3>
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={carburantChart}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eceef2" />
                                <XAxis dataKey="mois" tick={{ fontSize: 12, fill: "#7c869e" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 12, fill: "#7c869e" }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", fontSize: 13 }}
                                    formatter={(v) => formatCurrency(v)}
                                />
                                <Bar dataKey="cout" fill="#0d9488" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Listes récentes */}
                    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <div className="card p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-ink-700">Dernières missions</h3>
                                <Link to="/missions" className="text-xs font-medium text-brand-600 hover:underline">Tout voir</Link>
                            </div>
                            <ul className="divide-y divide-ink-50">
                                {data.dernieresMissions?.length ? data.dernieresMissions.map((m) => (
                                    <li key={m.id} className="flex items-center justify-between py-2.5">
                                        <div>
                                            <p className="text-sm font-medium text-ink-800">{m.destination}</p>
                                            <p className="text-xs text-ink-400">{m.vehicule?.immatriculation} · {formatDate(m.date_depart)}</p>
                                        </div>
                                        <Badge value={m.statut} />
                                    </li>
                                )) : <p className="py-6 text-center text-sm text-ink-400">Aucune mission récente.</p>}
                            </ul>
                        </div>

                        <div className="card p-5">
                            <div className="mb-4 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-ink-700">Dernières alertes</h3>
                                <Link to="/alertes" className="text-xs font-medium text-brand-600 hover:underline">Tout voir</Link>
                            </div>
                            <ul className="divide-y divide-ink-50">
                                {data.dernieresAlertes?.length ? data.dernieresAlertes.map((a) => (
                                    <li key={a.id} className="flex items-center justify-between py-2.5">
                                        <div>
                                            <p className="text-sm font-medium text-ink-800">{a.type_alerte}</p>
                                            <p className="text-xs text-ink-400">{a.vehicule?.immatriculation} · {formatDate(a.date_signalement)}</p>
                                        </div>
                                        <Badge value={a.priorite} />
                                    </li>
                                )) : <p className="py-6 text-center text-sm text-ink-400">Aucune alerte récente.</p>}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
