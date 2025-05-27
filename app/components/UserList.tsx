'use client';

import { useEffect, useState } from 'react';
import HistoryPageDialog from './HistoryPageDialog'; // Adjust the path based on your folder structure

type User = {
  roles: string[];
  user_id: string;
  email: string;
};

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

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
          'Content-Type': 'application/json',
        },
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
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to remove admin role');

      alert('Admin role removed successfully!');
    } catch (err) {
      console.error('Failed to remove admin role:', err);
      alert('Failed to remove admin role!');
    } finally {
      setLoading(false);
    }
  };

  const confirmRemoveUser = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      const res = await fetch('/api/removeUser', {
        method: 'POST',
        body: JSON.stringify({ userId: userToDelete.user_id }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) throw new Error('Failed to delete user');

      alert('Successfully deleted user!');
      setUsers((prev) => prev.filter((u) => u.user_id !== userToDelete.user_id));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert('Failed to delete user!');
    } finally {
      setDialogOpen(false);
      setUserToDelete(null);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-orange">Users</h2>
      <div className="h-72 overflow-y-auto pr-2">
        <ul>
          {users.map((user) => (
            <li
              key={user.user_id}
              className="flex justify-between items-center px-2 py-2 bg-white rounded shadow-sm"
            >
              <button onClick={() => { setUserToDelete(user); setDialogOpen(true); }}>
                <img
                  src="/images/delete-button.png"
                  style={{ width: '15%', height: '15%' }}
                  alt="Delete"
                />
              </button>
              {user.email}
              <select
                value={
                  ["coralreeves760@gmail.com", "anaghaajesh2010@gmail.com", "vrielleguevarra@gmail.com", "wukimberley98@gmail.com"].includes(user.email)
                    ? 'admin'
                    : 'user'
                }
                onChange={(e) => {
                  if (e.target.value === 'admin') {
                    handleAssignAdmin(user.user_id);
                  } else {
                    handleRemoveAdmin(user.user_id);
                  }
                }}
                className="ml-10 bg-teal text-white px-2 py-1 rounded"
                disabled={loading}
              >
                <option value="admin">Administrator</option>
                <option value="user">User</option>
              </select>
            </li>
          ))}
        </ul>
      </div>

      {/* Confirmation Dialog */}
      <HistoryPageDialog
        isOpen={dialogOpen}
        title="Delete User"
        message={`Are you sure you want to delete ${userToDelete?.email}?`}
        type="warning"
        onClose={() => setDialogOpen(false)}
        onConfirm={confirmRemoveUser}
      />
    </div>
  );
};

export default UserList;
