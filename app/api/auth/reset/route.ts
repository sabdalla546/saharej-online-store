import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { ResetSchema } from "@/schemas";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const validatedField = ResetSchema.safeParse(body);
  if (!validatedField.success) {
    return NextResponse.json({
      error: "invlid email",
    });
  }
  const { email } = validatedField.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    return NextResponse.json({
      error: " email not exist",
    });
  }
  // generate token and sen email
  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  );
  return NextResponse.json({
    success: "reset email send",
    token: passwordResetToken,
  });
}
