import { db } from "@/lib/db";
import { SizeForm } from "./_component/size-form";

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  let size;
  try {
    size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizePage;
