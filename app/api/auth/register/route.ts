import { generateToken, hashPassword } from "@/app/lib/auth";
import { sendVerificationEmail } from "@/app/lib/email";
import { generateAccessToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { RegisterDto } from "@/app/types/auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = (await req.json()) as RegisterDto;

    // Validate fields
    if (!email || !username || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "Registration failed",
        },
        { status: 400 },
      );
    }

    // hash password and generate verification token
    const hashedPassword = await hashPassword(password);
    const verificationToken = generateToken();

    //Create user
    await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        verificationToken,
      },
    });

    // send verification email
    await sendVerificationEmail(email, verificationToken);

    return NextResponse.json(
      {
        message: "Account created. Please verify your email",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    console.error("[REGISTER]", error);
    return NextResponse.json(
      {
        error: "Internal servor error",
      },
      { status: 500 },
    );
  }
}
