import { db } from "@/lib/db";
import { CategoryForm } from "./_component/category-form";

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryId: string;
  };
}) => {
  let catgories;

  try {
    /*billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    console.log("bbbbbbbbb", billboards);*/
    catgories = await db.mainCategory.findUnique({
      where: {
        id: params.categoryId,
      },
    });

    console.log("cattttt", params.categoryId);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={catgories} />
      </div>
    </div>
  );
};

export default CategoryPage;
