import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse("category id  is required", { status: 400 });
    }

    const category = await db.mainCategory.findUnique({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("mainctegory_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name } = body;
    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category name  is  required", {
        status: 400,
      });
    }

    if (!params.categoryId) {
      return new NextResponse("category id  is required", { status: 400 });
    }

    const category = await db.mainCategory.updateMany({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("mainCategory_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.categoryId) {
      return new NextResponse("billboard id  is required", { status: 400 });
    }

    const category = await db.mainCategory.deleteMany({
      where: {
        id: params.categoryId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("mainCategory_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
