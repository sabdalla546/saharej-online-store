import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse("size id  is required", { status: 400 });
    }

    const size = await db.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("Size_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name, value } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("size name  is  required", {
        status: 400,
      });
    }
    if (!value) {
      return new NextResponse("size value is  required", {
        status: 400,
      });
    }

    if (!params.sizeId) {
      return new NextResponse("size id  is required", { status: 400 });
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
    const size = await db.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("Size_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.sizeId) {
      return new NextResponse("size id  is required", { status: 400 });
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
    const size = await db.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("Size_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
