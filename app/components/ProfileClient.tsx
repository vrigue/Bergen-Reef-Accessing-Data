"use client";

import { useUser } from "@auth0/nextjs-auth0/client";

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        {/* <img src={user.picture} alt={user.name} /> */}
        <h1 className="text-2xl font-semibold">{user.name}</h1>
        <p className="text-sm">{user.email}</p>
      </div>
    )
  );
}
