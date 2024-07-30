"use server";
import * as z from "zod";

import { SettingSchema } from "@/schemas";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { getUserById } from "@/data/user";

export const setting = async (values: z.infer<typeof SettingSchema>) => {
  const user = await currentUser();
  if (!user) {
    return { error: "unauthorized" };
  }
  const dbUser = await getUserById(user.id as string);

  if (!dbUser) {
    return { error: "unauthorized" };
  }
  try {
    await db.user.update({
      where: {
        id: dbUser.id,
      },
      data: {
        ...values,
      },
    });
    return { success: " updating" };
  } catch (err) {
    return { error: "error" };
  }
};
