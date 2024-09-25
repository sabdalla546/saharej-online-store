import { format } from "date-fns";
import { db } from "@/lib/db";
import { CategoryClient } from "./_component/category-clients";
import { CategoryColumn } from "./_component/columns";

const CategoriesPage = async () => {
  const flashDeals = await db.flashDeals.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatedCategories: CategoryColumn[] = flashDeals.map((flash) => ({
    id: flash.id,
    name: flash.name,
    startDate: format(flash.startDate, "MMMM do , yyyy"),
    endDate: format(flash.endDate, "MMMM do , yyyy"),
    imgUrl: flash.imgUrl,
    publish: flash.publish,
    createdAt: format(flash.createdAt, "MMMM do , yyyy"),
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
