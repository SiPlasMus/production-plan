import type { Role } from "./auth";

export type ContainerType = "LEFT" | "DAY" | "RIGHT";

export function canCreate(role: Role | null) {
    return role === "admin" || role === "manager" || role === "sales";
}

export function canEdit(role: Role | null, container: ContainerType) {
    if (role === "admin" || role === "manager") return true;
    if (role === "sales") return container === "LEFT";
    if (role === "production") return container === "RIGHT";
    return false;
}

export function canMove(role: Role | null, from: ContainerType, to: ContainerType) {
    if (role === "admin" || role === "manager") return true;
    if (role === "sales") return false;
    if (role === "production") return from === "DAY" && to === "RIGHT";
    return false;
}
