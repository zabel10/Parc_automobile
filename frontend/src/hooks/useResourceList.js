import { useCallback, useEffect, useState } from "react";

export function useResourceList(service, initialFilters = {}) {
    const [rows, setRows] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ page: 1, ...initialFilters });

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await service.list(filters);
            setRows(data.data ?? []);
            setMeta({
                current_page: data.current_page,
                last_page: data.last_page,
                from: data.from,
                to: data.to,
                total: data.total,
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(filters)]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const setPage = (page) => setFilters((f) => ({ ...f, page }));
    const setFilter = (key, value) => setFilters((f) => ({ ...f, [key]: value, page: 1 }));

    return { rows, meta, loading, error, filters, setFilter, setPage, refresh: fetchData };
}
