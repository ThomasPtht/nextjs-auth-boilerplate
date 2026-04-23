import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        {
          error: "No refresh token",
        },
        { status: 401 },
      );
    }

    // Verify refresh token

    const { userId } = verifyRefreshToken(refreshToken);

    //Check token matches DB (rotation check)

    const user = await prisma.user.findFirst({
      where: { id: userId, refreshToken },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "Invalid refresh token",
        },
        { status: 401 },
      );
    }

    // Rotate tokens
    const newAccessToken = generateAccessToken(user.id);
    const newRefreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken: newRefreshToken },
    });

    const response = NextResponse.json(
      {
        accessToken: newAccessToken,
      },
      { status: 200 },
    );

    response.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[REFRESH_TOKEN]", error);
    return NextResponse.json(
      {
        error: "Invalid refresh token",
      },
      { status: 401 },
    );
  }
}
