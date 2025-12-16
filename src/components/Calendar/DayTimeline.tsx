import type { ProductionCard } from "../../types/card";
import DayColumn from "./DayColumn";

type Day = { key: string; label: string };

type Props = {
    days: Day[];
    dayCards: Record<string, ProductionCard[]>;
    onOpenCard: (card: ProductionCard) => void;
};

export default function DayTimeline({ days, dayCards, onOpenCard }: Props) {
    return (
        <section className="pp-col pp-col--mid">
            <div className="pp-col__head">
                <div>
                    <div className="pp-col__title">Календарь (по дням)</div>
                    <div className="pp-col__subtitle">Перетаскивай карточки на нужный день</div>
                </div>
            </div>

            <div className="pp-col__body">
                <div className="timeline">
                    {days.map((d) => (
                        <DayColumn
                            key={d.key}
                            dayKey={d.key}
                            dayLabel={d.label}
                            items={dayCards[d.key] ?? []}
                            onOpenCard={onOpenCard}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
