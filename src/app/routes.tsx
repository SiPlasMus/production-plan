import { Routes, Route } from "react-router-dom";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import Login from "../pages/Login";
import Board from "../components/Board/Board";
import AdminUsers from "../pages/AdminUsers";

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
                path="/"
                element={
                    <RequireAuth>
                        <Board />
                    </RequireAuth>
                }
            />
            <Route
                path="/admin/users"
                element={
                    <RequireRole allow={["admin"]}>
                        <AdminUsers />
                    </RequireRole>
                }
            />
        </Routes>
    );
}
