import { getUsers } from "src/lib/auth0";
import { NextResponse } from "next/server";
import { getUsersRoles } from "actions/getUsersRoles";


export const GET = async () => {
  
  const roles = await getUsersRoles();
  console.log("roles:", roles)
  try {
    const users = await getUsers();
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
};

