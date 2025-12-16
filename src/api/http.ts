import { getToken, clearAuth } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL;

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    if (!API_URL) throw new Error("VITE_API_URL is not set");

    const token = getToken();

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    // If backend says unauthorized → kill token and force login
    if (res.status === 401) {
        clearAuth();
    }

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }

    return res.json();
}
