export type Role = "sales" | "manager" | "production" | "admin";

const TOKEN_KEY = "pp_token";
const ROLE_KEY = "pp_role";

export function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAuth(token: string, role: string) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(ROLE_KEY, role);
}

export function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
}

export function getRole(): Role | null {
    const r = localStorage.getItem(ROLE_KEY);
    if (r === "sales" || r === "manager" || r === "production" || r === "admin") return r;
    return null;
}

export function isAuthed() {
    return Boolean(getToken());
}
