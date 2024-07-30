import { RegisterSchema } from "@/schemas";
import { NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVervicationEmail } from "@/lib/mail";
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedField = RegisterSchema.safeParse(body);

    if (!validatedField.success) {
      return new NextResponse("Invalid field", { status: 400 });
    }
    const { name, email, password } = validatedField.data;
    const hashedPassword = await bcryptjs.hash(password, 10);
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: " Email already in use", status: 400 });
    }
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    const verificationToken = await generateVerificationToken(email);
    await sendVervicationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return NextResponse.json({
      success: "Confimation email send",
      data: newUser,
      token: verificationToken,
      status: 200,
    });
  } catch (err) {
    console.log("Register_POST :", err);
    return new NextResponse("internal server error", { status: 500 });
  }
}
