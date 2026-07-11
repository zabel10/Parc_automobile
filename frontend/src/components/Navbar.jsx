import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import Badge from "./ui/Badge";

export default function Navbar({ onMenuClick, title }) {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        function onClick(e) {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        }
        document.addEventListener("mousedown", onClick);
        return () => document.removeEventListener("mousedown", onClick);
    }, []);

    async function handleLogout() {
        await logout();
        navigate("/login", { replace: true });
    }

    const initials = user ? `${user.prenom?.[0] ?? ""}${user.nom?.[0] ?? ""}`.toUpperCase() : "";

    return (
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-100 bg-white/80 px-4 backdrop-blur sm:px-6">
            <div className="flex items-center gap-3">
                <button
                    onClick={onMenuClick}
                    className="rounded-lg p-2 text-ink-500 hover:bg-ink-100 lg:hidden"
                >
                    <Menu className="h-5 w-5" />
                </button>
                <h2 className="text-base font-semibold text-ink-800 sm:text-lg">{title}</h2>
            </div>

            <div className="relative" ref={ref}>
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="flex items-center gap-2.5 rounded-xl border border-transparent px-2 py-1.5 transition hover:border-ink-100 hover:bg-ink-50"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white shadow-soft">
                        {initials || <UserIcon className="h-4 w-4" />}
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-semibold leading-tight text-ink-800">
                            {user?.prenom} {user?.nom}
                        </p>
                        <p className="text-xs text-ink-400">{user?.role}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-ink-400" />
                </button>

                {open && (
                    <div className="absolute right-0 z-30 mt-2 w-56 animate-fade-in rounded-xl border border-ink-100 bg-white p-2 shadow-card">
                        <div className="border-b border-ink-100 px-3 py-2.5">
                            <p className="text-sm font-semibold text-ink-800">
                                {user?.prenom} {user?.nom}
                            </p>
                            <p className="truncate text-xs text-ink-400">{user?.email}</p>
                            <div className="mt-1.5">
                                <Badge value={user?.role} />
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50"
                        >
                            <LogOut className="h-4 w-4" />
                            Se déconnecter
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
}
