import { format } from "date-fns";
import { db } from "@/lib/db";
import { BillboardClient } from "./_component/billboard-clients";
import { BillboardsColumn } from "./_component/columns";

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatedBillboards: BillboardsColumn[] = billboards.map(
    (billboard) => ({
      id: billboard.id,
      label: billboard.label,
      createdAt: format(billboard.createdAt, "MMMM do , yyyy"),
    })
  );
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
