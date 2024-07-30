"use client";

import { MainHeader } from "@/components/main-heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { OrdersColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-tabel";

interface OrderClientProps {
  data: OrdersColumn[];
}
export const OrderClient: React.FC<OrderClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <MainHeader
          lebel={`Orders(${data.length})`}
          description="Manage Orders for your store"
        />
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="products" />
    </>
  );
};
