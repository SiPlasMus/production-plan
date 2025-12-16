import { useDroppable } from "@dnd-kit/core";

export default function DropZone({
                                     id,
                                     className,
                                     children,
                                 }: {
    id: string;
    className?: string;
    children: React.ReactNode;
}) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className={className}
            data-over={isOver ? "1" : "0"}
        >
            {children}
        </div>
    );
}
