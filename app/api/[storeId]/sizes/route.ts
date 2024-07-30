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
    const { name, value } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("size  name  is required", {
        status: 400,
      });
    }
    if (!value) {
      return new NextResponse("size  value  is required", {
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
    const size = await db.size.create({
      data: {
        storeId: params.storeId,
        name,
        value,
      },
    });
    return NextResponse.json(size);
  } catch (error) {
    console.log("size_POST :", error);
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

    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(sizes);
  } catch (error) {
    console.log("Sizes_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
