import { statusStyle } from "../../utils/statusColors";

export default function Badge({ value, children }) {
    const label = children ?? value;
    if (label === undefined || label === null || label === "") return <span className="text-ink-300">—</span>;

    return (
        <span
            className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${statusStyle(
                value
            )}`}
        >
            {label}
        </span>
    );
}
