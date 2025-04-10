import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0/edge";

export async function middleware(req) {
  const res = NextResponse.next();
  const session = await getSession(req, res);

  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/login", req.url));
  }

  const roles = session.user["https://coral-reef-capstone.app/roles"] || [];

  if (!roles.includes("Administrator")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  return res;
}

export const config = {
  matcher: ["/api/assignRoles", "/api/createData", "/api/deleteData","/api/getUserList","/api/takeRoles"],
};
