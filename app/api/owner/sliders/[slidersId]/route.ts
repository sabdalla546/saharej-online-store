import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { slidersId: string } }
) {
  try {
    if (!params.slidersId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const flashDeals = await db.sliders.findUnique({
      where: {
        id: params.slidersId,
      },
      include: {
        products: true,
      },
    });
    return NextResponse.json(flashDeals);
  } catch (error) {
    console.log("slider_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { slidersId: string } }
) {
  try {
    const user = await currentUser();
    const body = await req.json();
    const { name, startDate, endDate, imgUrl, publish } = body;
    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!name) {
      return new NextResponse("sliders name  is  required", {
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

    if (!params.slidersId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const sliders = await db.sliders.updateMany({
      where: {
        id: params.slidersId,
      },
      data: {
        name,
        startDate,
        endDate,
        imgUrl,
        publish,
      },
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.log("sliders_PATCH :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
export async function DELETE(
  req: Request,
  { params }: { params: { slidersId: string } }
) {
  try {
    const user = await currentUser();

    if (!user?.id || user.role !== "SUPERADMIN") {
      return new NextResponse("unauthorized", { status: 401 });
    }
    if (!params.slidersId) {
      return new NextResponse("flash deals id  is required", { status: 400 });
    }

    const sliders = await db.sliders.deleteMany({
      where: {
        id: params.slidersId,
      },
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.log("sliders_DELETE :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
