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
    const { name, billboardId } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category  name  is required", {
        status: 400,
      });
    }
    if (!billboardId) {
      return new NextResponse("billboard id is required", {
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
    const category = await db.category.create({
      data: {
        storeId: params.storeId,
        name,
        billboardId,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("CATEGORY_POST :", error);
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

    const categoris = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(categoris);
  } catch (error) {
    console.log("Categories_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
