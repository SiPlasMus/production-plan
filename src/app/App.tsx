import Board from "../components/Board/Board";

export default function App() {
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

                <div className="topbar__right">
                    <span className="pill">Netlify ready</span>
                </div>
            </header>

            <main className="app-main">
                <Board />
            </main>
        </div>
    );
}
