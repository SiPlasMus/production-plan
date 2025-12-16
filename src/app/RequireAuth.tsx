import { Navigate } from "react-router-dom";
import { isAuthed } from "../utils/auth";
import type {JSX} from "react";

export default function RequireAuth({ children }: { children: JSX.Element }) {
    if (!isAuthed()) return <Navigate to="/login" replace />;
    return children;
}
