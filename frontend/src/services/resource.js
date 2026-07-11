import api from "../api/axios";

/**
 * Fabrique un service CRUD générique pour une ressource REST donnée.
 * Toutes les entités AutoPark suivent le même schéma d'API Laravel.
 */
export function createResourceService(basePath) {
    return {
        list(params = {}) {
            return api.get(`/${basePath}`, { params });
        },
        get(id) {
            return api.get(`/${basePath}/${id}`);
        },
        create(data, config = {}) {
            return api.post(`/${basePath}`, data, config);
        },
        update(id, data, config = {}) {
            // Laravel n'accepte pas toujours multipart en PUT -> on force POST + _method
            if (config.headers?.["Content-Type"] === "multipart/form-data") {
                data.append("_method", "PUT");
                return api.post(`/${basePath}/${id}`, data, config);
            }
            return api.put(`/${basePath}/${id}`, data, config);
        },
        remove(id) {
            return api.delete(`/${basePath}/${id}`);
        },
        patch(id, action, data = {}, config = {}) {
            return api.patch(`/${basePath}/${id}/${action}`, data, config);
        },
    };
}
