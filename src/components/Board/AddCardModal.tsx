import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useMemo, useState } from "react";
import type { ProductionCard } from "../../types/card";

type Mode = "create" | "view" | "edit";

type Props = {
    open: boolean;
    mode: Mode;
    card?: ProductionCard | null;

    onOpenChange: (v: boolean) => void;
    onCreate: (payload: Omit<ProductionCard, "id">) => void;
    onUpdate: (id: string, payload: Omit<ProductionCard, "id">) => void;
    onDelete: (id: string) => void;
};

function toISODate(d: string) {
    // accept "10.01.2026" or already "2026-01-10"
    if (!d) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    const m = d.match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
    if (!m) return d;
    return `${m[3]}-${m[2]}-${m[1]}`;
}

export default function AddCardModal({
                                         open,
                                         mode,
                                         card,
                                         onOpenChange,
                                         onCreate,
                                         onUpdate,
                                         onDelete,
                                     }: Props) {
    const isReadOnly = mode === "view";

    const title = useMemo(() => {
        if (mode === "create") return "Новая карточка";
        if (mode === "edit") return "Редактировать карточку";
        return "Карточка";
    }, [mode]);

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [form, setForm] = useState<Omit<ProductionCard, "id">>({
        client: "",
        rank: "",
        micron: 0,
        thickness: 0,
        sheetSize: "стандарт",
        qtySheets: 0,
        qtyWarehouse: 0,
        date: "",
        note: "",
    });

    useEffect(() => {
        setConfirmDelete(false);

        if (mode === "create" || !card) {
            setForm({
                client: "",
                rank: "",
                micron: 0,
                thickness: 0,
                sheetSize: "стандарт",
                qtySheets: 0,
                qtyWarehouse: 0,
                date: "",
                note: "",
            });
            return;
        }

        setForm({
            client: card.client ?? "",
            rank: card.rank ?? "",
            micron: Number(card.micron ?? 0),
            thickness: Number(card.thickness ?? 0),
            sheetSize: card.sheetSize ?? "стандарт",
            qtySheets: Number(card.qtySheets ?? 0),
            qtyWarehouse: Number(card.qtyWarehouse ?? 0),
            date: toISODate(card.date ?? ""),
            note: card.note ?? "",
        });
    }, [mode, card]);

    function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
        setForm((p) => ({ ...p, [key]: value }));
    }

    function submit() {
        const payload: Omit<ProductionCard, "id"> = {
            ...form,
            micron: Number(form.micron) || 0,
            thickness: Number(form.thickness) || 0,
            qtySheets: Number(form.qtySheets) || 0,
            qtyWarehouse: Number(form.qtyWarehouse) || 0,
            date: toISODate(form.date),
            note: form.note?.trim() || "",
        };

        if (mode === "create") onCreate(payload);
        if (mode === "edit" && card?.id) onUpdate(card.id, payload);

        onOpenChange(false);
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="pp-modal-overlay" />
                <Dialog.Content className="pp-modal">
                    <div className="pp-modal__head">
                        <Dialog.Title className="pp-modal__title">{title}</Dialog.Title>
                        <Dialog.Close className="pp-btn pp-btn--ghost" aria-label="Close">
                            ✕
                        </Dialog.Close>
                    </div>

                    <div className="pp-modal__body">
                        <div className="pp-row">
                            <div>
                                <div className="pp-label">Клиент</div>
                                <input
                                    className="pp-input"
                                    value={form.client}
                                    onChange={(e) => set("client", e.target.value)}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <div className="pp-label">Ранг</div>
                                <input
                                    className="pp-input"
                                    value={form.rank}
                                    onChange={(e) => set("rank", e.target.value)}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className="pp-row">
                            <div>
                                <div className="pp-label">Микрон</div>
                                <input
                                    className="pp-input"
                                    type="number"
                                    value={form.micron}
                                    onChange={(e) => set("micron", Number(e.target.value))}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <div className="pp-label">Толщина</div>
                                <input
                                    className="pp-input"
                                    type="number"
                                    value={form.thickness}
                                    onChange={(e) => set("thickness", Number(e.target.value))}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className="pp-row">
                            <div>
                                <div className="pp-label">Размер листа</div>
                                <input
                                    className="pp-input"
                                    value={form.sheetSize}
                                    onChange={(e) => set("sheetSize", e.target.value)}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <div className="pp-label">Дата</div>
                                <input
                                    className="pp-input"
                                    type="date"
                                    value={form.date}
                                    onChange={(e) => set("date", e.target.value)}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        <div className="pp-row">
                            <div>
                                <div className="pp-label">Кол-во лист</div>
                                <input
                                    className="pp-input"
                                    type="number"
                                    value={form.qtySheets}
                                    onChange={(e) => set("qtySheets", Number(e.target.value))}
                                    disabled={isReadOnly}
                                />
                            </div>
                            <div>
                                <div className="pp-label">Кол-во склад</div>
                                <input
                                    className="pp-input"
                                    type="number"
                                    value={form.qtyWarehouse}
                                    onChange={(e) => set("qtyWarehouse", Number(e.target.value))}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="pp-label">Примечание</div>
                            <textarea
                                className="pp-input"
                                rows={3}
                                value={form.note}
                                onChange={(e) => set("note", e.target.value)}
                                disabled={isReadOnly}
                            />
                        </div>
                    </div>

                    <div className="pp-modal__footer">
                        <div className="flex gap-2">
                            {mode !== "create" && card?.id && (
                                <>
                                    {!confirmDelete ? (
                                        <button
                                            className="pp-btn pp-btn--danger"
                                            onClick={() => setConfirmDelete(true)}
                                            type="button"
                                        >
                                            Удалить
                                        </button>
                                    ) : (
                                        <div className="flex gap-2" style={{ alignItems: "center" }}>
                                            <span style={{ fontSize: 12, opacity: 0.75 }}>Точно удалить?</span>
                                            <button
                                                className="pp-btn pp-btn--danger"
                                                onClick={() => {
                                                    onDelete(card.id);
                                                    onOpenChange(false);
                                                }}
                                                type="button"
                                            >
                                                Да
                                            </button>
                                            <button
                                                className="pp-btn pp-btn--ghost"
                                                onClick={() => setConfirmDelete(false)}
                                                type="button"
                                            >
                                                Нет
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="flex gap-2">
                            <button
                                className="pp-btn pp-btn--ghost"
                                onClick={() => onOpenChange(false)}
                                type="button"
                            >
                                Закрыть
                            </button>

                            {mode !== "view" && (
                                <button className="pp-btn pp-btn--primary" onClick={submit} type="button">
                                    {mode === "create" ? "Создать" : "Сохранить"}
                                </button>
                            )}
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
