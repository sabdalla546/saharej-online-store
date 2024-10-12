"use client";

import { MainHeader } from "@/components/main-heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { CategoryColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-tabel";

interface BillboardClientProps {
  data: CategoryColumn[];
}
export const CategoryClient: React.FC<BillboardClientProps> = ({ data }) => {
  const params = useParams();
  const router = useRouter();
  return (
    <>
      <div className="flex items-center justify-between">
        <MainHeader
          lebel={`Sliders(${data.length})`}
          description="Manage Sliders  for all store"
        />
        <Button onClick={() => router.push(`/owner/sliders/new`)}>
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="name" />
    </>
  );
};
