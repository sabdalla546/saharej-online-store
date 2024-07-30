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
    const { label, imageUrl } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!label) {
      return new NextResponse("billboard  name  is required", {
        status: 400,
      });
    }
    if (!imageUrl) {
      return new NextResponse("billboard  image  is required", {
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
    const billboard = await db.billboard.create({
      data: {
        storeId: params.storeId,
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("Billboards_POST :", error);
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
    if (!params.storeId) {
      return new NextResponse("store id is required", {
        status: 400,
      });
    }

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(billboards);
  } catch (error) {
    console.log("Billboards_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
