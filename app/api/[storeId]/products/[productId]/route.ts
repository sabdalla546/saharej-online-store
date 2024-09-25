import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId) {
      return new NextResponse("product id  is required", { status: 400 });
    }

    const product = await db.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("Product :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
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
      flashdealsId,
      isArchived,
      isFeatured,
    } = body;

    if (!params.productId) {
      return new NextResponse("billboard id  is required", { status: 400 });
    }
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
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
    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        description,
        images: {
          deleteMany: {},
        },
        price,
        sizeId,
        colorId,
        categoryId,
        flashdealsId,
        isArchived,
        isFeatured,
      },
    });
    const product = await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("product_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.productId) {
      return new NextResponse("product id  is required", { status: 400 });
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
    const product = await db.product.deleteMany({
      where: {
        id: params.productId,
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("product_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
