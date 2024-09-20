import { db } from "@/lib/db";
import { CategoryForm } from "./_component/category-form";

const CategoryPage = async ({
  params,
}: {
  params: {
    categoryId: string;
    storeId: string;
  };
}) => {
  console.log("ccccccccccccccc", params.storeId);
  let catgories;
  let billboards;
  try {
    billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    console.log("bbbbbbbbb", billboards);
    catgories = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    console.log("cattttt", catgories);
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={catgories} billboards={billboards} />
      </div>
    </div>
  );
};

export default CategoryPage;
