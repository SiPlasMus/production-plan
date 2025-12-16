import { useState } from "react";
import { api } from "../api/http";

type Role = "sales" | "manager" | "production" | "admin";

export default function AdminUsers() {
    const [login, setLogin] = useState("");
    const [pin, setPin] = useState("");
    const [role, setRole] = useState<Role>("sales");
    const [msg, setMsg] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function createUser(e: React.FormEvent) {
        e.preventDefault();
        setMsg(null);
        setLoading(true);
        try {
            const res = await api<{ ok: boolean; userId: string }>("/pp/admin/users", {
                method: "POST",
                body: JSON.stringify({ login, pin, role }),
            });
            setMsg(`✅ Создан: ${res.userId}`);
            setLogin("");
            setPin("");
            setRole("sales");
        } catch (e: any) {
            setMsg(`❌ ${e?.message || "Ошибка"}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin">
            <div className="admin__card">
                <div className="admin__title">Админ → Пользователи</div>
                <div className="admin__sub">Создание логина / PIN / роли</div>

                <form onSubmit={createUser} className="admin__form">
                    <div>
                        <div className="pp-label">Логин</div>
                        <input className="pp-input" value={login} onChange={(e) => setLogin(e.target.value)} />
                    </div>

                    <div>
                        <div className="pp-label">PIN</div>
                        <input
                            className="pp-input"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                            type="password"
                        />
                    </div>

                    <div>
                        <div className="pp-label">Роль</div>
                        <select className="pp-input" value={role} onChange={(e) => setRole(e.target.value as Role)}>
                            <option value="sales">Продажа</option>
                            <option value="manager">Менеджер</option>
                            <option value="production">Производство</option>
                            <option value="admin">Админ</option>
                        </select>
                    </div>

                    <button className="pp-btn pp-btn--primary" disabled={loading} type="submit">
                        {loading ? "Создаю..." : "Создать пользователя"}
                    </button>

                    {msg ? <div className="admin__msg">{msg}</div> : null}
                </form>
            </div>
        </div>
    );
}
