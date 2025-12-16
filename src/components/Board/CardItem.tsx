import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { ProductionCard } from "../../types/card";

type Props = {
    card: ProductionCard;
    onOpen: (card: ProductionCard) => void;
};

function fmtDate(iso?: string) {
    if (!iso) return "";
    // "2026-01-10" -> "10.01.2026"
    const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) return iso;
    return `${m[3]}.${m[2]}.${m[1]}`;
}

export default function CardItem({ card, onOpen }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
        useSortable({ id: card.id });

    const style: React.CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.65 : 1,
    };

    const line =
        `${card.client || "Без клиента"} • ${card.rank || "—"} — ` +
        `${card.micron}μ • ${card.thickness} • ${card.sheetSize} • ` +
        `${card.qtySheets}л (склад ${card.qtyWarehouse})` +
        (card.date ? ` • ${fmtDate(card.date)}` : "");

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="pp-card pp-card--compact"
            {...attributes}
            {...listeners}
            onDoubleClick={() => onOpen(card)}
            role="button"
            tabIndex={0}
            title="Двойной клик — открыть"
        >
            <div className="pp-card__line">{line}</div>
            {card.note ? <div className="pp-card__sub">{card.note}</div> : null}
        </div>
    );
}
