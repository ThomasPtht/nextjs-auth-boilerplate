import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        {
          message: "Token is required",
        },
        { status: 400 },
      );
    }

    // Fin user with this verification token
    const user = await prisma.user.findFirst({
      where: { verificationToken: token },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid or expired token",
        },
        { status: 400 },
      );
    }

    // Mark email as verified and clear token

    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true, verificationToken: null },
    });
  } catch (error) {
    console.error("[VERIFY_EMAIL]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
