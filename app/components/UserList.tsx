'use client';

import { useEffect, useState } from 'react';

type User = {
  roles: string[];
  user_id: string;
  email: string;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/getUserList');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Failed to fetch users:', err);
      }
    };

    fetchUsers();
  }, []);

  const handleAssignAdmin = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/assignRoles', {
        method: 'POST',
        body: JSON.stringify({ userId }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to assign admin role');

      alert('Admin role assigned successfully!');
    } catch (err) {
      console.error('Failed to assign admin role:', err);
      alert('Failed to assign admin role.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/takeRoles', {
        method: 'POST',
        body: JSON.stringify({ userId }), 
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) throw new Error('Failed to remove admin role');

      // Update state to remove "admin" role
      //setUsers((prevUsers) =>
        //prevUsers.map((user) =>
          //user.user_id === userId ? { ...user, roles: [] } : user
        //)
      //);

      alert('Admin role removed successfully!');
    } catch (err) {
      console.error('Failed to remove admin role:', err);
      alert('Failed to remove admin role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    //<div className="bg-white rounded-lg shadow-lg p-6" style={{height:370}}>
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.user_id} className="mb-2">
            {user.email}
            <select
              value={["coralreeves760@gmail.com", "anaghaajesh2010@gmail.com","vrielleguevarra@gmail.com","wukimberley98@gmail.com"].includes(user.email) ? "admin" : "user"}
              onChange={(e) => {
                if (e.target.value === "admin") {
                  handleAssignAdmin(user.user_id);
                } else {
                  handleRemoveAdmin(user.user_id);
                }
              }}
              //onClick={() => handleAssignAdmin(user.user_id)}
              className="ml-10 bg-teal text-white px-2 py-1 rounded"
              disabled={loading}
            >
              <option value="admin">Administrator</option>
              <option value="user">User</option>
              {loading ? 'Assigning...' : 'Make Admin'}
            </select>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;