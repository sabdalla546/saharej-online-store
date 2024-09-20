import { format } from "date-fns";
import { db } from "@/lib/db";
import { CategoryClient } from "./_component/category-clients";
import { CategoryColumn } from "./_component/columns";

const CategoriesPage = async () => {
  const categories = await db.mainCategory.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatedCategories: CategoryColumn[] = categories.map((categore) => ({
    id: categore.id,
    name: categore.name,

    createdAt: format(categore.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
