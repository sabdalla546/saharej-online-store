import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { flashdealsId: string } }
) {
  try {
    if (!params.flashdealsId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const flashDeals = await db.flashDeals.findUnique({
      where: {
        id: params.flashdealsId,
      },
    });
    return NextResponse.json(flashDeals);
  } catch (error) {
    console.log("flashDeals_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { flashdealsId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name, startDate, endDate, imgUrl, publish } = body;
    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category name  is  required", {
        status: 400,
      });
    }
    if (!startDate) {
      return new NextResponse("start date  is  required", {
        status: 400,
      });
    }
    if (!endDate) {
      return new NextResponse("end date  is  required", {
        status: 400,
      });
    }
    if (!imgUrl) {
      return new NextResponse("image url  is  required", {
        status: 400,
      });
    }

    if (!params.flashdealsId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const category = await db.flashDeals.updateMany({
      where: {
        id: params.flashdealsId,
      },
      data: {
        name,
        startDate,
        endDate,
        imgUrl,
        publish,
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    console.log("flashDeals_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { flashdealsId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.flashdealsId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const flashDeals = await db.flashDeals.deleteMany({
      where: {
        id: params.flashdealsId,
      },
    });
    return NextResponse.json(flashDeals);
  } catch (error) {
    console.log("flashDeals_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
