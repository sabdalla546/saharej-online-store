import { db } from "@/lib/db";
import { CategoryForm } from "./_component/category-form";

const CategoryPage = async ({
  params,
}: {
  params: {
    flashdealsId: string;
  };
}) => {
  let flashDeals;

  try {
    /*billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    console.log("bbbbbbbbb", billboards);*/
    flashDeals = await db.flashDeals.findUnique({
      where: {
        id: params.flashdealsId,
      },
    });

    //console.log("cattttt", params.flashdealsId);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={flashDeals} />
      </div>
    </div>
  );
};

export default CategoryPage;
