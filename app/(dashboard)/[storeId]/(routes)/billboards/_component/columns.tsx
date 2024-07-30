"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-action";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardsColumn = {
  id: string;
  label: string;
  createdAt: string;
};

export const columns: ColumnDef<BillboardsColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
