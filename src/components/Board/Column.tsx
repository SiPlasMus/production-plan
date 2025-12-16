import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { ProductionCard } from "../../types/card";
import CardItem from "./CardItem";

type Props = {
    title: string;
    subtitle?: string;
    items: ProductionCard[];
    actions?: React.ReactNode;
    onOpenCard: (card: ProductionCard) => void;
};

export default function Column({ title, subtitle, items, actions, onOpenCard }: Props) {
    return (
        <section className="pp-col">
            <div className="pp-col__head">
                <div>
                    <div className="pp-col__title">{title}</div>
                    {subtitle ? <div className="pp-col__subtitle">{subtitle}</div> : null}
                </div>
                <div className="pp-col__actions">{actions}</div>
            </div>

            <div className="pp-col__body">
                <SortableContext items={items.map((x) => x.id)} strategy={verticalListSortingStrategy}>
                    <div className="pp-list">
                        {items.length === 0 ? (
                            <div className="pp-empty">Пусто</div>
                        ) : (
                            items.map((c) => <CardItem key={c.id} card={c} onOpen={onOpenCard} />)
                        )}
                    </div>
                </SortableContext>
            </div>
        </section>
    );
}
