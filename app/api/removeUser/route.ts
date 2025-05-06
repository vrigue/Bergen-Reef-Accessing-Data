import { blockJack } from "actions/blockJack";
import { getUsersRoles } from "actions/getUsersRoles";
import { deleteUser } from "src/lib/auth0";
import { isUserAdmin } from "actions/isUserAdmin";

export const POST = async (req: Request) => {

  const roles = await blockJack();
  console.log("roles:", roles)

  try {

    const admin = await isUserAdmin();

    if (!admin) {
      return Response.json({ error: 'Unauthorized' }, { status: 400 });
    }

    const { userId } = await req.json();

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    await deleteUser(userId);

    return Response.json({ message: 'User Deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error removing user:', error);
    return Response.json({ error: 'Failed to delete user' }, { status: 500 });
  }
};