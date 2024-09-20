import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();
  const body = await req.json();
  const { name } = body;

  try {
    if (user?.role !== "SUPERADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category  name  is required", {
        status: 400,
      });
    }

    const category = await db.mainCategory.create({
      data: {
        name,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("Main-CATEGORY_POST :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const categoris = await db.mainCategory.findMany({});
    return NextResponse.json(categoris);
  } catch (error) {
    console.log("mainCategories_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
