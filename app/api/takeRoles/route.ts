import { removeAdminRole } from "src/lib/auth0";

export const POST = async (req: Request) => {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return Response.json({ error: 'User ID is required' }, { status: 400 });
    }

    await removeAdminRole(userId);

    return Response.json({ message: 'Admin role removed' }, { status: 200 });
  } catch (error) {
    console.error('Error removing admin role:', error);
    return Response.json({ error: 'Failed to remove admin role' }, { status: 500 });
  }
};
