const getAccessToken = async () => {
    const response = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: process.env.AUTH0_MGMT_CLIENT_ID,
        client_secret: process.env.AUTH0_MGMT_CLIENT_SECRET,
        audience: process.env.AUTH0_MGMT_AUDIENCE,
        grant_type: 'client_credentials'
      })
    });
  
    const { access_token } = await response.json();
    return access_token;
  };
  
  export const getUsers = async () => {
    const token = await getAccessToken();
  
    const response = await fetch(`${process.env.AUTH0_MGMT_AUDIENCE}users`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  };
  
  export const getUserRoles = async (userId: string) => {
    const token = await getAccessToken();
  
    const response = await fetch(`${process.env.AUTH0_MGMT_AUDIENCE}users/${userId}/roles`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  
    if (!response.ok) throw new Error('Failed to fetch roles');
    return await response.json();
  };
  
  export const assignAdminRole = async (userId: string) => {
    const token = await getAccessToken();
  
    const ADMIN_ROLE_ID = '<your-admin-role-id>'; // Get this from the Auth0 dashboard
  
    const response = await fetch(`${process.env.AUTH0_MGMT_AUDIENCE}users/${userId}/roles`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roles: [ADMIN_ROLE_ID]
      })
    });
  
    if (!response.ok) throw new Error('Failed to assign admin role');
  };
  