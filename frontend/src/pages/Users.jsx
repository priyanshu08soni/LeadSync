import React, { useEffect, useState, useContext } from "react";
import { Shield, Users, ChevronDown, ChevronRight } from "lucide-react";
import { useNotification }  from "../contexts/NotificationContext";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";
// Mock API and contexts for demo
// const api = {
//   get: async () => ({
//     data: {
//       teams: [
//         {
//           "_id": "68dfd273617c0301592e68ad",
//           "name": "HR",
//           "manager": {
//             "_id": "68dfd273617c0301592e68ab",
//             "email": "22cd3023@rgipt.ac.in",
//             "name": "vinit",
//             "role": "manager"
//           },
//           "sales_reps": [
//             {
//               "_id": "68dfdab9ad6da3d012f98865",
//               "email": "salesrep1@example.com",
//               "name": "John Doe",
//               "role": "sales_rep",
//               "isActive": true,
//               "createdAt": "2025-10-03T14:00:00.000Z"
//             }
//           ],
//           "createdAt": "2025-10-03T13:41:07.760Z",
//           "updatedAt": "2025-10-03T14:16:25.848Z"
//         },
//         {
//           "_id": "68dfe8ed8e392506b3c0f7c1",
//           "name": "Finance",
//           "manager": {
//             "_id": "68dfe8ed8e392506b3c0f7bf",
//             "email": "manager2@gmail.com",
//             "name": "Shobhnath Yadav",
//             "role": "manager"
//           },
//           "sales_reps": [
//             {
//               "_id": "68dfe91a8e392506b3c0f7d2",
//               "email": "salesrep2@example.com",
//               "name": "Jane Smith",
//               "role": "sales_rep",
//               "isActive": true,
//               "createdAt": "2025-10-03T15:10:00.000Z"
//             }
//           ],
//           "createdAt": "2025-10-03T15:17:01.251Z",
//           "updatedAt": "2025-10-03T15:17:46.366Z"
//         }
//       ]
//     }
//   })
// };



export default function UsersManagement() {
  const { showNotification } = useNotification();
  const { user: currentUser } = useContext(AuthContext);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedManagers, setExpandedManagers] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/auth/users");
      setTeams(res.data.teams || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showNotification("Failed to load users", "error");
      setLoading(false);
    }
  };

  const toggleManager = (managerId) => {
    setExpandedManagers(prev => ({
      ...prev,
      [managerId]: !prev[managerId]
    }));
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-800",
      manager: "bg-purple-100 text-purple-800",
      sales_rep: "bg-blue-100 text-blue-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return <Shield size={16} />;
    return <Users size={16} />;
  };

  // Calculate stats
  const totalManagers = teams.length;
  const totalSalesReps = teams.reduce((sum, team) => sum + team.sales_reps.length, 0);
  const totalUsers = totalManagers + totalSalesReps;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Only admins and managers can view this page
  if (currentUser?.role !== "admin" && currentUser?.role !== "manager") {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 text-lg">Access Denied: Admins and Managers only</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-2">View all team members and their hierarchies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {totalUsers}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Managers</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {totalManagers}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Shield className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Sales Reps</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {totalSalesReps}
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Users className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Teams Table with Expandable Managers */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Team
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {teams.map((team) => (
                <React.Fragment key={team._id}>
                  {/* Manager Row - Clickable */}
                  <tr 
                    className="hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => toggleManager(team.manager._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <button 
                          className="mr-2 text-gray-400 hover:text-gray-600 transition"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleManager(team.manager._id);
                          }}
                        >
                          {expandedManagers[team.manager._id] ? (
                            <ChevronDown size={20} />
                          ) : (
                            <ChevronRight size={20} />
                          )}
                        </button>
                        <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-lg">
                            {team.manager.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {team.manager.name}
                          </div>
                          <div className="text-sm text-gray-500">{team.manager.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                          team.manager.role
                        )}`}
                      >
                        {getRoleIcon(team.manager.role)}
                        MANAGER
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                        {team.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        ({team.sales_reps.length} rep{team.sales_reps.length !== 1 ? 's' : ''})
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                  </tr>

                  {/* Sales Reps Rows - Show when expanded */}
                  {expandedManagers[team.manager._id] && team.sales_reps.map((salesRep) => (
                    <tr key={salesRep._id} className="bg-gray-50 hover:bg-gray-100 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center pl-10">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-bold text-lg">
                              {salesRep.name?.charAt(0).toUpperCase() || 'S'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {salesRep.name || 'Sales Rep'}
                            </div>
                            <div className="text-sm text-gray-500">{salesRep.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex items-center gap-1 text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(
                            'sales_rep'
                          )}`}
                        >
                          {getRoleIcon('sales_rep')}
                          SALES REP
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                          {team.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            salesRep.isActive !== false
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {salesRep.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {salesRep.createdAt ? new Date(salesRep.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {teams.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Users size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg">No teams found</p>
          </div>
        )}
      </div>
    </div>
  );
}