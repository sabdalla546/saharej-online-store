import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/vervifcaton-token";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { token } = body;
  console.log("token", token);
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) {
    return new NextResponse("token does not exist", { status: 400 });
  }
  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) {
    return new NextResponse("token expired", { status: 400 });
  }
  const existingUser = await getUserByEmail(existingToken?.email);
  if (!existingUser) {
    return new NextResponse("email not found", { status: 404 });
  }
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });
  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });
  return NextResponse.json({
    success: "email verifird",
  });
}
