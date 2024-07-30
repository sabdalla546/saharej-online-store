import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse("billboard id  is required", { status: 400 });
    }

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { label, imageUrl } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!label) {
      return new NextResponse("billboard name  is  required", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse("image   is  required", {
        status: 400,
      });
    }

    if (!params.billboardId) {
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
    const billboard = await db.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("BILLBOARD_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.billboardId) {
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
    const billboard = await db.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboard_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
