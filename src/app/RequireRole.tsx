import { Navigate } from "react-router-dom";
import { getRole, isAuthed } from "../utils/auth";
import type {JSX} from "react";

export default function RequireRole({
                                        allow,
                                        children,
                                    }: {
    allow: string[];
    children: JSX.Element;
}) {
    if (!isAuthed()) return <Navigate to="/login" replace />;
    const role = getRole();
    if (!role || !allow.includes(role)) return <Navigate to="/" replace />;
    return children;
}
