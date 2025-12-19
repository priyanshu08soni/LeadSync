import React, { useEffect, useState, useContext } from "react";
import { Shield, Users, ChevronDown, ChevronRight, UserCheck, UserX, UserMinus } from "lucide-react";
import { useNotification } from "../contexts/NotificationContext";
import { AuthContext } from "../contexts/AuthContext";
import api from "../api/api";

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
      admin: "bg-rose-500/20 text-rose-400 border-rose-500/20",
      manager: "bg-purple-500/20 text-purple-400 border-purple-500/20",
      sales_rep: "bg-blue-500/20 text-blue-400 border-blue-500/20",
    };
    return colors[role] || "bg-slate-500/20 text-slate-400 border-slate-500/20";
  };

  const getRoleIcon = (role) => {
    if (role === "admin") return <Shield size={14} />;
    return <Users size={14} />;
  };

  const totalManagers = teams.length;
  const totalSalesReps = teams.reduce((sum, team) => sum + team.sales_reps.length, 0);
  const totalUsers = totalManagers + totalSalesReps;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (currentUser?.role !== "admin" && currentUser?.role !== "manager") {
    return (
      <div className="text-center py-20 glass-card mx-6 my-12 rounded-3xl animate-in zoom-in duration-300">
        <UserX size={64} className="mx-auto text-rose-500/50 mb-4" />
        <h2 className="text-2xl font-bold text-white">Access Denied</h2>
        <p className="text-slate-400 mt-2">Only Admins and Managers can access this section.</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <UserCheck className="text-blue-500" />
          User Management
        </h1>
        <p className="text-slate-400 mt-1">View all team members and their hierarchies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500 group bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Users</p>
              <h3 className="text-3xl font-extrabold text-slate-50 mt-1">{totalUsers}</h3>
            </div>
            <div className="bg-blue-500/10 p-3 rounded-2xl text-blue-500 group-hover:scale-110 transition-transform"><Users size={28} /></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-purple-500 group bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Managers</p>
              <h3 className="text-3xl font-extrabold text-slate-50 mt-1">{totalManagers}</h3>
            </div>
            <div className="bg-purple-500/10 p-3 rounded-2xl text-purple-500 group-hover:scale-110 transition-transform"><Shield size={28} /></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500 group bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Sales Reps</p>
              <h3 className="text-3xl font-extrabold text-slate-50 mt-1">{totalSalesReps}</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 group-hover:scale-110 transition-transform"><Users size={28} /></div>
          </div>
        </div>
      </div>

      {/* Teams Table */}
      <div className="glass-card rounded-3xl overflow-hidden border border-white/10 shadow-xl bg-slate-950/40">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="min-w-full">
            <thead>
              <tr className="bg-slate-900/80 border-b border-white/5">
                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Team</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-xs font-black text-slate-400 uppercase tracking-widest">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {teams.map((team) => (
                <React.Fragment key={team._id}>
                  {/* Manager Row */}
                  <tr
                    className="hover:bg-white/5 transition-colors cursor-pointer group"
                    onClick={() => toggleManager(team.manager._id)}
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <button className="mr-3 text-slate-500 group-hover:text-blue-400 transition-colors">
                          {expandedManagers[team.manager._id] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </button>
                        <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg">
                          {team.manager.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-extrabold text-slate-50">{team.manager.name}</div>
                          <div className="text-xs font-medium text-slate-400 mt-0.5">{team.manager.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getRoleBadgeColor(team.manager.role)}`}>
                        {getRoleIcon(team.manager.role)} MANAGER
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-3 py-1 inline-flex text-xs font-medium rounded-lg bg-slate-800 text-slate-300 border border-white/5">
                        {team.name}
                      </span>
                      <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase">
                        {team.sales_reps.length} Reps
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-2 py-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 rounded-full">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></div>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-400 font-medium">
                      {new Date(team.createdAt).toLocaleDateString()}
                    </td>
                  </tr>

                  {/* Sales Reps */}
                  {expandedManagers[team.manager._id] && team.sales_reps.map((salesRep) => (
                    <tr key={salesRep._id} className="bg-white/5 hover:bg-white/10 transition-colors border-l-4 border-blue-500/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center pl-10">
                          <div className="h-9 w-9 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg opacity-80">
                            {salesRep.name?.charAt(0).toUpperCase() || 'S'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-100">{salesRep.name || 'Sales Rep'}</div>
                            <div className="text-xs text-slate-500">{salesRep.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-0.5 inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getRoleBadgeColor('sales_rep')}`}>
                          {getRoleIcon('sales_rep')} SALES REP
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs font-medium text-slate-500 italic">
                          Part of {team.name}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${salesRep.isActive !== false ? "text-emerald-400 bg-emerald-500/10" : "text-rose-400 bg-rose-500/10"
                          }`}>
                          {salesRep.isActive !== false ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 font-medium">
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
          <div className="text-center py-20 text-slate-500">
            <UserMinus size={48} className="mx-auto mb-4 text-slate-700" />
            <p className="text-lg font-medium">No teams found</p>
            <p className="text-sm mt-1">Start by adding managers and members to your organization.</p>
          </div>
        )}
      </div>
    </div>
  );
}
