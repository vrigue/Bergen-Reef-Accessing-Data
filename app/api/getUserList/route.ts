import { getUsers } from "src/lib/auth0";
import { NextResponse } from "next/server";
import { getUsersRoles } from "actions/getUsersRoles";
import { blockJack } from "actions/blockJack";
import { isUserAdmin } from "actions/isUserAdmin";

export const GET = async () => {
  try {
    const users = await getUsers();

    const admin = await isUserAdmin();

    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 400 });
    }

    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
};

