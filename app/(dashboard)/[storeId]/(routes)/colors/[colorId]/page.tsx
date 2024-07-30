import { db } from "@/lib/db";
import { ColorForm } from "./_component/colors-form";

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  let color;
  try {
    color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorPage;
