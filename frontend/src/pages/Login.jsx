import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Car, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { extractErrorMessage } from "../utils/formatters";

export default function Login() {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (!authLoading && isAuthenticated) {
        return <Navigate to={location.state?.from?.pathname || "/dashboard"} replace />;
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        try {
            await login(email, password);
            toast.success("Connexion réussie. Bienvenue !");
            navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
        } catch (err) {
            toast.error(extractErrorMessage(err, "Identifiants invalides."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            {/* Panneau visuel */}
            <div className="relative hidden overflow-hidden bg-gradient-to-br from-ink-900 via-brand-900 to-brand-700 lg:flex lg:flex-col lg:justify-between lg:p-12">
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:24px_24px]" />

                <div className="relative flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 backdrop-blur">
                        <Car className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-lg font-bold text-white">AutoPark</span>
                </div>

                <div className="relative max-w-md">
                    <h1 className="text-4xl font-bold leading-tight text-white">
                        Pilotez votre flotte automobile en toute sérénité.
                    </h1>
                    <p className="mt-4 text-brand-100">
                        Véhicules, conducteurs, missions, carburant, maintenance et alertes : toute la
                        gestion de votre parc automobile, centralisée et en temps réel.
                    </p>
                </div>

                <p className="relative text-xs text-brand-200">
                    © {new Date().getFullYear()} AutoPark — Projet de gestion de parc automobile
                </p>
            </div>

            {/* Formulaire */}
            <div className="flex items-center justify-center bg-ink-50 p-6 sm:p-10">
                <div className="w-full max-w-sm">
                    <div className="mb-8 flex items-center gap-2.5 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
                            <Car className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-lg font-bold text-ink-900">AutoPark</span>
                    </div>

                    <h2 className="text-2xl font-bold text-ink-900">Connexion</h2>
                    <p className="mt-1.5 text-sm text-ink-500">
                        Accédez à votre espace de gestion de parc automobile.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div>
                            <label className="label">Adresse e-mail</label>
                            <input
                                type="email"
                                required
                                autoFocus
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@gmail.bf"
                                className="input"
                            />
                        </div>

                        <div>
                            <label className="label">Mot de passe</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    required
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="input pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((s) => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={submitting} className="btn-primary w-full !py-3">
                            {submitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin" /> Connexion…
                                </>
                            ) : (
                                "Se connecter"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
