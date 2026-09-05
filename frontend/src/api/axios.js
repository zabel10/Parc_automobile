import axios from "axios";
// http://127.0.0.1:8000/api
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://api-backend-parc-auto.onrender.com/api",
    headers: {
        Accept: "application/json",
    },
});

// Jette le jeton Sanctum sur chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("autopark_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Déconnexion automatique si le jeton n'est plus valide
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("autopark_token");
            localStorage.removeItem("autopark_user");
            if (!window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
