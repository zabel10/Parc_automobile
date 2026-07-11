import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem("autopark_user");
        return stored ? JSON.parse(stored) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem("autopark_token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let ignore = false;

        async function bootstrap() {
            if (!token) {
                setLoading(false);
                return;
            }
            try {
                const { data } = await api.get("/me");
                if (!ignore) {
                    setUser(data);
                    localStorage.setItem("autopark_user", JSON.stringify(data));
                }
            } catch {
                if (!ignore) {
                    setUser(null);
                    setToken(null);
                    localStorage.removeItem("autopark_token");
                    localStorage.removeItem("autopark_user");
                }
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        bootstrap();
        return () => {
            ignore = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const login = useCallback(async (email, password) => {
        const { data } = await api.post("/login", { email, password });
        localStorage.setItem("autopark_token", data.token);
        localStorage.setItem("autopark_user", JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return data.user;
    }, []);

    const logout = useCallback(async () => {
        try {
            await api.post("/logout");
        } catch {
            /* on efface localement même si l'appel échoue */
        }
        localStorage.removeItem("autopark_token");
        localStorage.removeItem("autopark_user");
        setToken(null);
        setUser(null);
    }, []);

    const role = user?.role;
    const isAdmin = role === "Administrateur";
    const isGestionnaire = role === "Gestionnaire";
    const isConducteur = role === "Conducteur";

    const hasRole = useCallback(
        (...roles) => isAdmin || (role && roles.includes(role)),
        [role, isAdmin]
    );

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                role,
                isAdmin,
                isGestionnaire,
                isConducteur,
                hasRole,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
    return ctx;
}
