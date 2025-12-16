import AppRoutes from "./routes";
import { clearAuth, getRole, isAuthed } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function App() {
    const nav = useNavigate();

    function logout() {
        clearAuth();
        nav("/login", { replace: true });
    }

    return (
        <div className="app-shell">
            <header className="topbar">
                <div className="topbar__brand">
                    <div className="badge">PP</div>
                    <div>
                        <div className="topbar__title">Production Plan</div>
                        <div className="topbar__subtitle">Планирование производства</div>
                    </div>
                </div>

                <div className="topbar__right" style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    {isAuthed() ? <span className="pill">Роль: {getRole() || "—"}</span> : null}
                    {isAuthed() ? (
                        <button className="btn" onClick={logout} type="button">
                            Выйти
                        </button>
                    ) : null}
                </div>
            </header>

            <main className="app-main">
                <AppRoutes />
            </main>
        </div>
    );
}
