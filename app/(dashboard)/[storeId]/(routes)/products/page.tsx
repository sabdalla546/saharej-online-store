import { format } from "date-fns";
import { db } from "@/lib/db";
import { ProductClient } from "./_component/product-clients";
import { ProductsColumn } from "./_component/columns";
import { formater } from "@/lib/utils";

const Products = async ({ params }: { params: { storeId: string } }) => {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const formatedProduct: ProductsColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category.name,
    size: product.size.value,
    color: product.color.value,
    isArchived: product.isArchived,
    isFeatured: product.isFeatured,
    createdAt: format(product.createdAt, "MMMM do , yyyy"),
  }));
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProduct} />
      </div>
    </div>
  );
};

export default Products;
