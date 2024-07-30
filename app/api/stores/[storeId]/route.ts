import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { storeName } = body;
    const { description } = body;
    const { imageUrl } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!storeName) {
      return new NextResponse("store name is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("store id name is required", { status: 400 });
    }
    const store = await db.store.update({
      where: {
        id: params.storeId,
        userId: user.id,
      },
      data: {
        name: storeName,
        description,
        imageUrl,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("store id name is required", { status: 400 });
    }
    const store = await db.store.delete({
      where: {
        id: params.storeId,
        userId: user.id,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id name is required", { status: 400 });
    }
    const store = await db.store.findUnique({
      where: {
        id: params.storeId,
      },
      include: {
        billboards: true,
        categories: true,
        sizes: true,
        colors: true,
        products: true,
        orders: true,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_Get-single-store :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
