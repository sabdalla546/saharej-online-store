import * as z from "zod";
import { AuthError } from "next-auth";
import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";

import { sendTwoFactorTokenEmail, sendVervicationEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import {
  generateTwoFactorToken,
  generateVerificationToken,
} from "@/lib/tokens";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const validatedField = LoginSchema.safeParse(body);
  let vervicationEmail;
  if (!validatedField.success) {
    return new NextResponse("Invalid field", { status: 400 });
  }
  const { email, password, code } = validatedField.data;
  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return NextResponse.json({
      error: "email does not exist",
      status: 400,
    });
  }
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );
    vervicationEmail = await sendVervicationEmail(
      verificationToken.email,
      verificationToken.token
    );
    return NextResponse.json({
      success: "Confirmation email send",
      status: 200,
    });
  }
  if (existingUser.isTwoFactorEnabbled && existingUser.email) {
    if (code) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) {
        return NextResponse.json({ error: "invalid code" });
      }
      if (twoFactorToken.token !== code) {
        return NextResponse.json({ error: "invalid code" });
      }
      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) {
        return NextResponse.json({ error: "code expierd" });
      }
      await db.twoFactowToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });
      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        twoFactorToken.id
      );
      if (existingConfirmation) {
        await db.twoFactowConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });
      }
      await db.twoFactowConfirmation.create({
        data: {
          userid: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
      return NextResponse.json({ twoFactor: true });
    }
  }
  try {
    const login = await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then((result) => {
      if (result.error) {
        alert("invalid");
      } else {
        window.location.replace("/");
      }
    });
    return NextResponse.json({
      success: "success",
      token: vervicationEmail,
      user: existingUser,
      status: 200,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return NextResponse.json({
            error: " invalid credentias!",
            status: 400,
          });
        default:
          return NextResponse.json({
            error: " something want wrong!",
            status: 400,
          });
      }
    }
    throw error;
  }
}
