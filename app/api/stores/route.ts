import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { storeName, description, imageUrl } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!storeName) {
      return new NextResponse("store name is required", { status: 400 });
    }
    const store = await db.store.create({
      data: {
        userId: user.id,
        name: storeName,
        description,
        imageUrl,
      },
    });
    return NextResponse.json(store);
  } catch (error) {
    console.log("STORE_POST :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const stores = await db.store.findMany();
    return NextResponse.json(stores);
  } catch (error) {
    console.log("STORE_GET:", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
