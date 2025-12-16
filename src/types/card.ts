export type CardId = string;

export type ProductionCard = {
    id: CardId;

    // fields from your table
    client: string;        // Клиент
    rank: string;          // Ранг (ex: "Ок мат")
    micron: number;        // микрон
    thickness: number;     // толщина
    sheetSize: string;     // размер листа (ex: "стандарт")
    qtySheets: number;     // кол-во лист
    qtyWarehouse: number;  // кол-во склад
    date: string;          // дата (ISO: "2026-01-10")
    note?: string;         // примечание
};
