import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const {
      name,
      description,
      images,
      price,
      sizeId,
      colorId,
      categoryId,
      isArchived,
      isFeatured,
    } = body;
    //const formatImages = images.map((item: any) => item.url);
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("product  name  is required", {
        status: 400,
      });
    }
    if (!description) {
      return new NextResponse("product  description  is required", {
        status: 400,
      });
    }
    if (!images || !images.length) {
      return new NextResponse("product  image  is required", {
        status: 400,
      });
    }
    if (!categoryId) {
      return new NextResponse("product  category id  is required", {
        status: 400,
      });
    }
    if (!colorId) {
      return new NextResponse("product  colors id  is required", {
        status: 400,
      });
    }
    if (!price) {
      return new NextResponse("product  price   is required", {
        status: 400,
      });
    }
    if (!sizeId) {
      return new NextResponse("product  size id  is required", {
        status: 400,
      });
    }
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
      });
    }
    const storeByUserId = db.store.findFirst({
      where: {
        id: params.storeId,
      },
    });
    if (!storeByUserId) {
      return new NextResponse("unauthorized", {
        status: 403,
      });
    }
    const product = await db.product.create({
      data: {
        storeId: params.storeId,
        name,
        description,
        price,
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
        sizeId,
        colorId,
        categoryId,
        isArchived,
        isFeatured,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("Product_POST :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
      });
    }

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("Products_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
