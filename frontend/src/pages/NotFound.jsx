import { Link } from "react-router-dom";
import { CarFront } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-ink-50 px-4 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <CarFront className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-ink-900">404</h1>
            <p className="mt-2 text-ink-500">Cette page n'existe pas ou a été déplacée.</p>
            <Link to="/dashboard" className="btn-primary mt-6">
                Retour au tableau de bord
            </Link>
        </div>
    );
}
