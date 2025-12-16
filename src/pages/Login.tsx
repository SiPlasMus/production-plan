import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/http";
import { setAuth } from "../utils/auth";

export default function Login() {
    const nav = useNavigate();
    const [login, setLogin] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const res = await api<{ ok: boolean; token: string; role: string }>(
                "/pp/auth/login",
                { method: "POST", body: JSON.stringify({ login, pin }) }
            );

            setAuth(res.token, res.role);
            nav("/", { replace: true });
        } catch (e: any) {
            setErr(e?.message || "Ошибка входа");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <form className="login__card" onSubmit={onSubmit}>
                <div className="login__title">Вход</div>
                <div className="login__sub">Production Plan</div>

                <div className="login__field">
                    <div className="pp-label">Логин</div>
                    <input
                        className="pp-input"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="например: sales1"
                        autoComplete="username"
                    />
                </div>

                <div className="login__field">
                    <div className="pp-label">PIN</div>
                    <input
                        className="pp-input"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="****"
                        type="password"
                        autoComplete="current-password"
                    />
                </div>

                {err ? <div className="login__error">{err}</div> : null}

                <button className="pp-btn pp-btn--primary login__btn" disabled={loading} type="submit">
                    {loading ? "Входим..." : "Войти"}
                </button>

                <div className="login__hint">
                    Роль подтягивается автоматически из базы.
                </div>
            </form>
        </div>
    );
}
