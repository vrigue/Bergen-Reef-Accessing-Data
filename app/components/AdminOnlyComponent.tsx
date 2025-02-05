import { useUser } from '@auth0/nextjs-auth0/client';
import { useEffect, useState } from 'react';

export default function AdminOnly() {
  const { user, isLoading } = useUser();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      const roles = user['https://coralreefwebapp/roles'] || [];
      setIsAdmin(roles.includes('administrator'));
    }
  }, [user]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      {user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          {isAdmin ? (
            <div>
              <h3>Manage Users Section</h3>
            </div>
          ) : (
            <p>You do not have access to this section.</p>
          )}
        </>
      ) : (
        <p>Please log in to access this section.</p>
      )}
    </>
  );
}