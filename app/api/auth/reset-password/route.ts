import { hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/prisma";
import { ResetPasswordDto } from "@/app/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { token, password } = (await req.json()) as ResetPasswordDto;

    if (!token || !password) {
      return NextResponse.json(
        {
          error: "All fields are required",
        },
        { status: 400 },
      );
    }

    // Find user with valid reset token

    const user = await prisma.user.findFirst({
      where: { resetToken: token, resetTokenExpiry: { gt: new Date() } },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 400 },
      );
    }

    // Hash new password and clear reset token
    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json(
      {
        message: "Password reset successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("[RESET_PASSWORD]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
