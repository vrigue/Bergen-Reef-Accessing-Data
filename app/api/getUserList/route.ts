import { getUsers } from "src/lib/auth0";

export const GET = async () => {
  try {
    const users = await getUsers();
    return Response.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
};

