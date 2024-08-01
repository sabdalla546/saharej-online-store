"use server";

import * as z from "zod";
import { StoreSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";

import { db } from "@/lib/db";

export const CreateStore = async (values: z.infer<typeof StoreSchema>) => {
  try {
    const user = await currentUser();
    const body = values;
    const { storeName, description, imageUrl } = body;
    if (!user?.id || user.role !== "ADMIN") {
      return { error: "unauthorized", status: 401 };
    }
    if (!storeName) {
      return { error: "store name is required", status: 400 };
    }
    const store = await db.store.create({
      data: {
        userId: user.id,
        name: storeName,
        description,
        imageUrl,
      },
    });
    return store;
  } catch (error) {
    console.log("STORE_POST :", error);
    return { error: "internal server eror", status: 500 };
  }
};
