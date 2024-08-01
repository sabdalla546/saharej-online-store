import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { NewPasswodSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { token } = body;
  const { values } = body;
  if (!token) {
    return NextResponse.json({ error: "missing token", status: 400 });
  }
  const validatedField = NewPasswodSchema.safeParse(values);
  if (!validatedField.success) {
    return NextResponse.json({
      error: "invalid password",
      status: 400,
    });
  }
  const { password } = validatedField.data;
  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) {
    return NextResponse.json({
      error: "invalid token",
      status: 400,
    });
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return NextResponse.json({
      error: "token has expired",
      status: 400,
    });
  }

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) {
    return NextResponse.json({
      error: "email not exist",
      status: 400,
    });
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await db.passwordRrsetToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return NextResponse.json({
    success: "password update",
    status: 400,
  });
}
