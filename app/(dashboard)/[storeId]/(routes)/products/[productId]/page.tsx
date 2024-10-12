import { db } from "@/lib/db";
import { ProductForm } from "./_component/product-form";

const ProductPage = async ({
  params,
}: {
  params: { productId: string; storeId: string };
}) => {
  let product;
  let categories;
  let colors;
  let sizes;
  let flashDeals = await db.flashDeals.findMany();
  let sliders = await db.sliders.findMany();
  try {
    categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    colors = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
      },
    });
  } catch (error) {
    console.log(error);
  }
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          initialData={product}
          categories={categories}
          flashDeals={flashDeals}
          sliders={sliders}
          colors={colors}
          sizes={sizes}
        />
      </div>
    </div>
  );
};

export default ProductPage;
