"use client";

import { MainHeader } from "@/components/main-heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { BillboardsColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-tabel";

interface BillboardClientProps {
  data: BillboardsColumn[];
}
export const BillboardClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <MainHeader
          lebel={`Billboards(${data.length})`}
          description="Manage billboards for your store"
        />
        <Button
          className="bg-[#f39b80]"
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
    </>
  );
};
