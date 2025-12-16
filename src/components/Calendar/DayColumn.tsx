import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ProductionCard } from "../../types/card";
import CardItem from "../Board/CardItem";
import DropZone from "../Board/DropZone.tsx";

type Props = {
    dayKey: string;        // "day:YYYY-MM-DD"
    dayLabel: string;      // "10.01 (Пт)"
    items: ProductionCard[];
    onOpenCard: (card: ProductionCard) => void;
};

export default function DayColumn({ dayKey, dayLabel, items, onOpenCard }: Props) {
    return (
        <div className="day-col">
            <div className="day-col__head">
                <div className="day-col__title">{dayLabel}</div>
                <div className="day-col__count">{items.length}</div>
            </div>

            <DropZone id={dayKey} className="day-col__body">
                <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
                    <div className="pp-list">
                        {items.length === 0 ? (
                            <div className="pp-empty pp-empty--small">Перетащи сюда</div>
                        ) : (
                            items.map((c) => <CardItem key={c.id} card={c} onOpen={onOpenCard} />)
                        )}
                    </div>
                </SortableContext>
            </DropZone>
        </div>
    );
}
