import { api } from "../../api/http";
import {useEffect, useMemo, useState} from "react";
import { DndContext, type DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { closestCenter } from "@dnd-kit/core";
import type { ProductionCard } from "../../types/card";
import { makeId } from "../../utils/id";

import Column from "./Column";
import DayTimeline from "../Calendar/DayTimeline";
import AddCardModal from "./AddCardModal";
import DropZone from "./DropZone.tsx";

type Mode = "create" | "view" | "edit";

function isoToday() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}
function addDaysISO(iso: string, add: number) {
    const d = new Date(iso + "T00:00:00");
    d.setDate(d.getDate() + add);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${dd}`;
}
function ruLabel(iso: string) {
    const d = new Date(iso + "T00:00:00");
    const wd = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"][d.getDay()];
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    return `${dd}.${mm} (${wd})`;
}

const LEFT = "left";
const RIGHT = "right";
const dayKey = (iso: string) => `day:${iso}`;

export default function Board() {
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 10 }, // was 6
        })
    );
    // demo initial cards (you can remove)
    const [leftCards, setLeftCards] = useState<ProductionCard[]>([]);
    const [rightCards, setRightCards] = useState<ProductionCard[]>([]);
    const [dayCards, setDayCards] = useState<Record<string, ProductionCard[]>>({});

    useEffect(() => {
        (async () => {
            const res = await api<{ ok: boolean; cards: any[] }>("/pp/board");
            const left: ProductionCard[] = [];
            const right: ProductionCard[] = [];
            const days: Record<string, ProductionCard[]> = {};

            for (const r of res.cards) {
                const c: ProductionCard = {
                    id: String(r.Id),
                    client: String(r.Client || ""),
                    rank: String(r.Rank || ""),
                    micron: Number(r.Micron || 0),
                    thickness: Number(r.Thickness || 0),
                    sheetSize: String(r.SheetSize || ""),
                    qtySheets: Number(r.QtySheets || 0),
                    qtyWarehouse: Number(r.QtyWarehouse || 0),
                    date: String(r.PlanDate || ""),
                    note: String(r.Note || ""),
                };

                const t = String(r.ContainerType || "");
                const k = String(r.ContainerKey || "");

                if (t === "LEFT") left.push(c);
                else if (t === "RIGHT") right.push(c);
                else if (t === "DAY") {
                    const dk = `day:${k}`;
                    (days[dk] ||= []).push(c);
                }
            }

            setLeftCards(left);
            setRightCards(right);
            setDayCards(days);
        })().catch(console.error);
    }, []);

    const days = useMemo(() => {
        const start = isoToday();
        return Array.from({ length: 10 }).map((_, i) => {
            const iso = addDaysISO(start, i);
            return { key: dayKey(iso), label: ruLabel(iso) };
        });
    }, []);

    // modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<Mode>("create");
    const [activeCard, setActiveCard] = useState<ProductionCard | null>(null);

    function openCreate() {
        setActiveCard(null);
        setModalMode("create");
        setModalOpen(true);
    }
    function openView(card: ProductionCard) {
        setActiveCard(card);
        setModalMode("view");
        setModalOpen(true);
    }

    function findContainerByCardId(cardId: string): string | null {
        if (leftCards.some((c) => c.id === cardId)) return LEFT;
        if (rightCards.some((c) => c.id === cardId)) return RIGHT;
        for (const k of Object.keys(dayCards)) {
            if ((dayCards[k] ?? []).some((c) => c.id === cardId)) return k;
        }
        return null;
    }

    function removeFromContainer(container: string, cardId: string): ProductionCard | null {
        if (container === LEFT) {
            const idx = leftCards.findIndex((c) => c.id === cardId);
            if (idx === -1) return null;
            const card = leftCards[idx];
            setLeftCards((p) => p.filter((x) => x.id !== cardId));
            return card;
        }
        if (container === RIGHT) {
            const idx = rightCards.findIndex((c) => c.id === cardId);
            if (idx === -1) return null;
            const card = rightCards[idx];
            setRightCards((p) => p.filter((x) => x.id !== cardId));
            return card;
        }
        // day
        const list = dayCards[container] ?? [];
        const idx = list.findIndex((c) => c.id === cardId);
        if (idx === -1) return null;
        const card = list[idx];
        setDayCards((p) => ({ ...p, [container]: (p[container] ?? []).filter((x) => x.id !== cardId) }));
        return card;
    }

    function addToContainer(container: string, card: ProductionCard) {
        if (container === LEFT) return setLeftCards((p) => [card, ...p]);
        if (container === RIGHT) return setRightCards((p) => [card, ...p]);
        setDayCards((p) => ({ ...p, [container]: [card, ...(p[container] ?? [])] }));
    }

    function updateCardEverywhere(id: string, next: Omit<ProductionCard, "id">) {
        const patch = (c: ProductionCard) => (c.id === id ? { ...c, ...next, id } : c);

        setLeftCards((p) => p.map(patch));
        setRightCards((p) => p.map(patch));
        setDayCards((p) => {
            const out: Record<string, ProductionCard[]> = {};
            for (const k of Object.keys(p)) out[k] = (p[k] ?? []).map(patch);
            return out;
        });
    }

    function deleteCardEverywhere(id: string) {
        setLeftCards((p) => p.filter((x) => x.id !== id));
        setRightCards((p) => p.filter((x) => x.id !== id));
        setDayCards((p) => {
            const out: Record<string, ProductionCard[]> = {};
            for (const k of Object.keys(p)) out[k] = (p[k] ?? []).filter((x) => x.id !== id);
            return out;
        });
    }

    function handleCreate(payload: Omit<ProductionCard, "id">) {
        const card: ProductionCard = { id: makeId(), ...payload };
        setLeftCards((p) => [card, ...p]);
    }

    function handleUpdate(id: string, payload: Omit<ProductionCard, "id">) {
        updateCardEverywhere(id, payload);
    }

    function handleDelete(id: string) {
        deleteCardEverywhere(id);
    }

    function onDragEnd(e: DragEndEvent) {
        const activeId = String(e.active.id);
        const overId = e.over?.id ? String(e.over.id) : null;
        if (!overId) return;

        // Where to drop?
        // overId can be another card id (sortable), so we treat it as "drop into that card's container"
        const toContainer =
            overId === LEFT || overId === RIGHT || overId.startsWith("day:")
                ? overId
                : findContainerByCardId(overId);

        const fromContainer = findContainerByCardId(activeId);
        if (!toContainer || !fromContainer) return;
        if (toContainer === fromContainer) return; // keep simple for now (no reordering)

        const card = removeFromContainer(fromContainer, activeId);
        if (!card) return;
        addToContainer(toContainer, card);
    }

    return (
        <div className="board">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                {/* LEFT */}
                <DropZone id={LEFT} className="dropzone">
                    <Column
                        title="Продажа (заказ)"
                        subtitle="Карточки для планирования"
                        items={leftCards}
                        onOpenCard={openView}
                        actions={
                            <button className="btn btn--primary" onClick={openCreate} type="button">
                                + Добавить
                            </button>
                        }
                    />
                </DropZone>

                {/* MIDDLE (days) */}
                <DropZone id={"timeline"} className="dropzone dropzone--mid">
                    <DayTimeline days={days} dayCards={dayCards} onOpenCard={openView} />
                </DropZone>

                {/* RIGHT */}
                <DropZone id={RIGHT} className="dropzone">
                    <Column
                        title="Производство (факт)"
                        subtitle="Сделано / закрыто"
                        items={rightCards}
                        onOpenCard={openView}
                    />
                </DropZone>
            </DndContext>

            {/* MODAL */}
            <AddCardModal
                open={modalOpen}
                mode={modalMode}
                card={activeCard}
                onOpenChange={setModalOpen}
                onCreate={handleCreate}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
            />

            {/* quick helper: switch view->edit from outside (simple) */}
            {modalOpen && modalMode === "view" && activeCard ? (
                <div className="floating-edit">
                    <button
                        className="btn"
                        type="button"
                        onClick={() => setModalMode("edit")}
                        title="Редактировать"
                    >
                        ✎ Редактировать
                    </button>
                </div>
            ) : null}
        </div>
    );
}
