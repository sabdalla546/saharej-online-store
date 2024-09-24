import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const stores = await db.store.findMany();
  let categories: any[] = [];
  for (const store of stores) {
    const storeData = await db.store.findUnique({
      where: {
        id: store.id,
      },
      include: {
        categories: true,
      },
    });
    storeData?.categories.forEach((item) => {
      if (item.isFeatured) {
        categories.push(item);
      }
    });
  }
  return NextResponse.json(categories);
}
