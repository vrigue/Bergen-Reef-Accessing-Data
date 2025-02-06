"use server";

import { redirect } from "next/navigation";

export async function login() {
  redirect("/api/auth/login");
}

export async function logout() {
  redirect("/api/auth/logout");
}