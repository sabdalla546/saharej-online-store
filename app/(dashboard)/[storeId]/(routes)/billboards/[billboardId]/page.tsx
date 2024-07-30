import { db } from "@/lib/db";
import { BillboardForm } from "./_component/billboard-form";

const BillboardPage = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  let billboard;
  try {
    billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardPage;
