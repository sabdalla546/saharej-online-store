import { db } from "@/lib/db";
import { CategoryForm } from "./_component/category-form";

const CategoryPage = async ({
  params,
}: {
  params: {
    slidersId: string;
  };
}) => {
  let sliders;

  try {
    /*billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    console.log("bbbbbbbbb", billboards);*/
    sliders = await db.sliders.findUnique({
      where: {
        id: params.slidersId,
      },
    });

    //console.log("cattttt", params.flashdealsId);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={sliders} />
      </div>
    </div>
  );
};

export default CategoryPage;
