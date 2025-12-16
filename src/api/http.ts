import { getToken, clearAuth } from "../utils/auth";

const API_BASE = "/api";

export async function api<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = getToken();

    const res = await fetch(`${API_BASE}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (res.status === 401) {
        clearAuth();
    }

    if (!res.ok) {
        const ct = res.headers.get("content-type") || "";
        if (ct.includes("application/json")) {
            const j = await res.json();
            throw new Error(j?.error || JSON.stringify(j));
        }
        const text = await res.text();
        throw new Error(text || res.statusText);
    }

    return res.json();
}
