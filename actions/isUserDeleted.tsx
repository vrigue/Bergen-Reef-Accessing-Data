"use server";

import { getUsersRoles } from "./getUsersRoles";

// Check if the current user is a deleted user?
export async function isUserDeleted(): Promise<boolean> {
  try {
    const roles = await getUsersRoles();

    console.log("ROLES", roles);
    return roles.some((role) => role.name.toLowerCase() === "deleted");
  } catch (error) {
    console.error("Error checking deleted status:", error);
    return false;
  }
}