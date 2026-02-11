import { Users as UsersIcon, Plus } from 'lucide-react';

export default function Users() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Users</h1>
          <p className="text-gray-600">Manage system users and their roles.</p>
        </div>
        <button className="btn btn-primary">
          <Plus className="w-5 h-5 mr-2" />
          Add User
        </button>
      </div>
      <div className="card">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <UsersIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
            <p className="text-gray-600">User management features coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}