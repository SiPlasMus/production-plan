const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
    console.warn("⚠️ VITE_API_URL is not defined");
}

export async function api<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("pp_token");

    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }

    return res.json();
}
