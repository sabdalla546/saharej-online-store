import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    if (!params.colorId) {
      return new NextResponse("color id  is required", { status: 400 });
    }

    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("Color_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name, value } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("color name  is  required", {
        status: 400,
      });
    }
    if (!value) {
      return new NextResponse("color value is  required", {
        status: 400,
      });
    }

    if (!params.colorId) {
      return new NextResponse("color id  is required", { status: 400 });
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
    const color = await db.color.updateMany({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("color_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.colorId) {
      return new NextResponse("color id  is required", { status: 400 });
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
    const color = await db.color.deleteMany({
      where: {
        id: params.colorId,
      },
    });
    return NextResponse.json(color);
  } catch (error) {
    console.log("Color_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
