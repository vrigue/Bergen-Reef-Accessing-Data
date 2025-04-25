"use server";

import React from "react";
import { createAccessToken } from "./createAccessToken";
import { getSession } from "@auth0/nextjs-auth0";
import { NextResponse } from "next/server";
import { isUserAdmin } from "./isUserAdmin";

type Role = {
  id: string;
  name: string;
  description: string;
};

// Get the roles for the current user in Auth0 Management API
export async function blockJack(): Promise<Role[]> {
  try {
    const session = await getSession();
    const user = session?.user;

    const ses = await isUserAdmin();
    const admin = ses?.valueOf;

    if (!admin) {
      //throw new NextResponse("Forbidden", { status: 403 });
      throw new Error("User not authenticated");
    }

    const token = await createAccessToken();

    const response = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${user.sub}/roles`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user roles");
    }

    const data: Role[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getUsersRoles:", error);
    throw error;
  }
}