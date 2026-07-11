export function Field({ label, error, required, hint, children }) {
    return (
        <div>
            {label && (
                <label className="label">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            {children}
            {hint && !error && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
            {error && <p className="mt-1 text-xs font-medium text-rose-600">{error}</p>}
        </div>
    );
}

export function TextInput({ error, className = "", ...props }) {
    return (
        <input
            className={`input ${error ? "!border-rose-400 !ring-rose-500/10" : ""} ${className}`}
            {...props}
        />
    );
}

export function TextArea({ error, className = "", rows = 3, ...props }) {
    return (
        <textarea
            rows={rows}
            className={`input resize-none ${error ? "!border-rose-400 !ring-rose-500/10" : ""} ${className}`}
            {...props}
        />
    );
}

export function Select({ error, className = "", children, ...props }) {
    return (
        <div className="relative">
            <select
                className={`select ${error ? "!border-rose-400 !ring-rose-500/10" : ""} ${className}`}
                {...props}
            >
                {children}
            </select>
            <svg
                className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        </div>
    );
}

export function Checkbox({ label, className = "", ...props }) {
    return (
        <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-700">
            <input
                type="checkbox"
                className={`h-4.5 w-4.5 rounded border-ink-300 text-brand-600 focus:ring-brand-500 ${className}`}
                {...props}
            />
            {label}
        </label>
    );
}

export function FileInput({ error, className = "", ...props }) {
    return (
        <input
            type="file"
            className={`block w-full text-sm text-ink-600 file:mr-4 file:rounded-lg file:border-0 file:bg-brand-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-brand-700 hover:file:bg-brand-100 ${
                error ? "text-rose-600" : ""
            } ${className}`}
            {...props}
        />
    );
}
