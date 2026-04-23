import { verifyRefreshToken } from "@/app/lib/jwt";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken")?.value;

    if (refreshToken) {
      try {
        const { userId } = verifyRefreshToken(refreshToken);

        // Remove refreshtoken from DB
        await prisma.user.update({
          where: { id: userId },
          data: { refreshToken: null },
        });
      } catch (error) {
        // Token invalid or expired — logout anyway
      }
    }

    const response = NextResponse.json(
      {
        message: "Logged out successfully",
      },
      { status: 200 },
    );

    // Clear the cookie
    response.cookies.delete("refreshToken");
    return response;
  } catch (error) {
    console.error("[LOGOUT]", error);
    return NextResponse.json(
      {
        error: "Internal servor error",
      },
      { status: 500 },
    );
  }
}
