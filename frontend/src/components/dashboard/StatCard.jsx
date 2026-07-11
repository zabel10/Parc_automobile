const palettes = {
    blue: "from-blue-500 to-blue-600",
    emerald: "from-emerald-500 to-emerald-600",
    amber: "from-amber-500 to-amber-600",
    rose: "from-rose-500 to-rose-600",
    violet: "from-violet-500 to-violet-600",
    teal: "from-teal-500 to-teal-600",
};

export default function StatCard({ label, value, icon, color = "blue", suffix }) {
    return (
        <div className="card group relative overflow-hidden p-5 transition hover:-translate-y-0.5 hover:shadow-card">
            <div
                className={`pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${palettes[color]} opacity-10 transition group-hover:opacity-20`}
            />
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-ink-500">{label}</p>
                    <p className="mt-2 text-2xl font-bold tracking-tight text-ink-900">
                        {value}
                        {suffix && <span className="ml-1 text-sm font-medium text-ink-400">{suffix}</span>}
                    </p>
                </div>
                <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${palettes[color]} text-white shadow-soft`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
