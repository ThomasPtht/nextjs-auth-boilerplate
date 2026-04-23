import { verifyPassword } from "@/app/lib/auth";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { LoginDto } from "@/app/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = (await req.json()) as LoginDto;

    if (!email || !password) {
      return NextResponse.json(
        {
          message: "All fields are required",
        },
        {
          status: 400,
        },
      );
    }

    // Check if user exists

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json(
        {
          message: "Please verify your email before logging in",
        },
        { status: 403 },
      );
    }

    // Generate tokens
    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Save refresh token in DB
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    // Set refresh token in HTTP-only cookie
    const response = NextResponse.json(
      {
        accessToken,
        user: { id: user.id, name: user.name, email: user.email },
      },
      { status: 200 },
    );
    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, //7days
    });

    return response;
  } catch (error) {
    console.error("[LOGIN]", error);
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      {
        status: 500,
      },
    );
  }
}
