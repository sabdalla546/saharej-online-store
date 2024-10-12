import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await currentUser();
  const body = await req.json();
  const { name, startDate, endDate, imgUrl, publish } = body;

  try {
    if (user?.role !== "SUPERADMIN") {
      return new NextResponse("unauthorntcated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("category  name  is required", {
        status: 400,
      });
    }
    if (!startDate) {
      return new NextResponse("start date    is required", {
        status: 400,
      });
    }
    if (!endDate) {
      return new NextResponse("end date    is required", {
        status: 400,
      });
    }
    if (!imgUrl) {
      return new NextResponse("image url     is required", {
        status: 400,
      });
    }

    const sliders = await db.sliders.create({
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
    console.log("sliders_POST :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const sliders = await db.sliders.findMany({
      where: {
        publish: true,
      },
    });
    return NextResponse.json(sliders);
  } catch (error) {
    console.log("slidersS_GET :", error);
    return new NextResponse("internal server error", { status: 500 });
  }
}
