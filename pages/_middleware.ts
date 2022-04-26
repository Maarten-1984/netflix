import { verifyToken } from "./../utils/verifyToken"
import { NextFetchEvent, NextRequest, NextResponse } from "next/server"

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const token = req ? req.cookies.token : ""
  const issuer = await verifyToken(token)
  const { pathname } = req.nextUrl

  console.log({ pathname })

  if (
    (token && issuer) ||
    pathname.includes("/login") ||
    pathname.includes("/static")
  ) {
    console.log("User is logged in")
    return NextResponse.next()
  }

  if (!token && pathname !== "/login") {
    console.log("redirecting to login")
    return NextResponse.redirect("http://localhost:3000/login")
  }
}
