import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
    withCredentials: true,
    xsrfCookieName: "XSRF-TOKEN",
    xsrfHeaderName: "X-XSRF-TOKEN",
});

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
}

api.interceptors.request.use((config) => {
    const method = config.method?.toLowerCase();

    if (method === "post" || method === "put" || method === "delete" || method === "patch") {
        const csrfToken = getCookie("XSRF-TOKEN");
        if (csrfToken) {
            config.headers["X-XSRF-TOKEN"] = csrfToken;
        }
    }

    return config;
});

export default api;