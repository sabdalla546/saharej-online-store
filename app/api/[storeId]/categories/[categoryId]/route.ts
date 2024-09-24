import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("category id  is required", { status: 400 });
    }

    const category = await db.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
        products: true,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("ategory_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name, billboardId, isFeatured } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category name  is  required", {
        status: 400,
      });
    }
    if (!billboardId) {
      return new NextResponse("billboard id is  required", {
        status: 400,
      });
    }

    if (!params.categoryId) {
      return new NextResponse("category id  is required", { status: 400 });
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
    const category = await db.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
        isFeatured,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("Category_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.categoryId) {
      return new NextResponse("billboard id  is required", { status: 400 });
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
    const category = await db.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("Category_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
