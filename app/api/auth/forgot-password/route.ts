import { generateToken } from "@/app/lib/auth";
import { sendPasswordResetEmail } from "@/app/lib/email";
import { prisma } from "@/app/lib/prisma";
import { ForgotPasswordDto } from "@/app/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as ForgotPasswordDto;

    if (!email) {
      return NextResponse.json(
        {
          error: "Email is required",
        },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "If this email is registered, you will receive a reset link.",
        },
        { status: 200 },
      );
    }

    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 1000 * 60 * 60); //1 HOUR

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExpiry },
    });

    await sendPasswordResetEmail(email, resetToken);

    return NextResponse.json(
      {
        message: "If this email is registered, you will receive a reset link.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[FORGOT_PASSWORD]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
