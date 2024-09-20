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

    const category = db.mainCategory.create({
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
