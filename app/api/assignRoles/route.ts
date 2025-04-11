import { getUsersRoles } from "actions/getUsersRoles";
import { assignAdminRole } from "src/lib/auth0";

export const POST = async (req: Request) => {

  const roles = await getUsersRoles();
  console.log("roles:", roles)

  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    await assignAdminRole(userId);

    return Response.json({ message: 'Admin role assigned' }, { status: 200 });
  } catch (error) {
    console.error('Error assigning admin role:', error);
    return Response.json({ error: 'Failed to assign admin role' }, { status: 500 });
  }
};

