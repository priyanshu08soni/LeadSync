import React, { useEffect, useState, useContext, Fragment } from "react";
import api from "../api/api";
import { useNotification } from "../contexts/NotificationContext";
import { AuthContext } from "../contexts/AuthContext";
import { Listbox, Transition } from "@headlessui/react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  Target,
  Activity,
  Award,
  ChevronDown,
  Check,
  LayoutDashboard,
  Calendar,
} from "lucide-react";

export default function Dashboard() {
  const { user: currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalLeads: 0,
    leadsByStatus: [],
    leadsBySource: [],
    avgLeadValue: 0,
    recentActivities: [],
    conversionRate: 0,
  });
  const [salesRepPerformance, setSalesRepPerformance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teams, setTeams] = useState([]);
  const [selectedManager, setSelectedManager] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [teamMembers, setTeamMembers] = useState([]);
  const { showNotification } = useNotification();

  useEffect(() => {
    if (currentUser) {
      fetchDashboardData();
      if (currentUser.role === "admin") {
        fetchTeams();
      }
    }
  }, [currentUser, selectedManager, selectedUser]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/analytics/managers");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const params = {};
      if (currentUser?.role === "admin") {
        if (selectedUser) params.userId = selectedUser;
        else if (selectedManager) params.managerId = selectedManager;
      }

      const [overviewRes, performanceRes] = await Promise.all([
        api.get("/analytics/overview", { params }),
        api.get("/analytics/sales-rep-performance", { params }),
      ]);

      setStats(overviewRes.data);
      setSalesRepPerformance(performanceRes.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      showNotification("Failed to load dashboard data", "error");
      setLoading(false);
    }
  };

  if (loading || !currentUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Activity className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  const STATUS_COLORS = {
    new: "#3B82F6",
    contacted: "#F59E0B",
    qualified: "#10B981",
    lost: "#EF4444",
    won: "#8B5CF6",
  };

  const SOURCE_COLORS = ["#3B82F6", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899"];

  const statusData = stats.leadsByStatus.map((item) => ({
    name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count,
    fill: STATUS_COLORS[item._id] || "#6B7280",
  }));

  const sourceData = stats.leadsBySource.map((item, index) => ({
    name: item._id.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    value: item.count,
    fill: SOURCE_COLORS[index % SOURCE_COLORS.length],
  }));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 rounded-xl border border-white/10 shadow-xl">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-blue-400 font-bold">{payload[0].value} Leads</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <LayoutDashboard className="text-blue-500" />
            Dashboard
          </h1>
          <p className="text-slate-400 mt-1">Overview of your sales pipeline and team performance</p>
        </div>

        {currentUser.role === "admin" && (
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative w-64">
              <Listbox value={selectedManager} onChange={setSelectedManager}>
                <div className="relative">
                  <Listbox.Button className="relative w-full glass-input text-left pr-10">
                    <span className="block truncate">
                      {selectedManager ? teams.find(t => t.manager._id === selectedManager)?.manager?.name || "Team Selected" : "All Teams"}
                    </span>
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <ChevronDown className="h-5 w-5 text-slate-500" />
                    </span>
                  </Listbox.Button>
                  <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
                    <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-slate-800 border border-white/10 py-1 shadow-2xl focus:outline-none">
                      <Listbox.Option value="" className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-600/20 text-blue-400" : "text-slate-300"}`}>
                        {({ selected }) => (
                          <>
                            <span className={`block truncate ${selected ? "font-medium text-white" : "font-normal"}`}>All Teams</span>
                            {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500"><Check size={18} /></span>}
                          </>
                        )}
                      </Listbox.Option>
                      {teams.map((team) => (
                        <Listbox.Option key={team._id} value={team.manager._id} className={({ active }) => `relative cursor-pointer select-none py-2 pl-10 pr-4 ${active ? "bg-blue-600/20 text-blue-400" : "text-slate-300"}`}>
                          {({ selected }) => (
                            <>
                              <span className={`block truncate ${selected ? "font-medium text-white" : "font-normal"}`}>{team.manager.name} ({team.name})</span>
                              {selected && <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-500"><Check size={18} /></span>}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border-l-4 border-blue-500 group hover:translate-y-[-4px] transition-all duration-300 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Total Leads</p>
              <h3 className="text-4xl font-extrabold text-slate-50 mt-1">{stats.totalLeads}</h3>
            </div>
            <div className="bg-blue-500/20 p-3 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform"><Users size={28} /></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-emerald-500 group hover:translate-y-[-4px] transition-all duration-300 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Conversion Rate</p>
              <h3 className="text-4xl font-extrabold text-slate-50 mt-1">{stats.conversionRate.toFixed(1)}%</h3>
            </div>
            <div className="bg-emerald-500/20 p-3 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform"><TrendingUp size={28} /></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-purple-500 group hover:translate-y-[-4px] transition-all duration-300 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Avg Lead Value</p>
              <h3 className="text-4xl font-extrabold text-slate-50 mt-1">${stats.avgLeadValue.toFixed(0)}</h3>
            </div>
            <div className="bg-purple-500/20 p-3 rounded-2xl text-purple-400 group-hover:scale-110 transition-transform"><DollarSign size={28} /></div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border-l-4 border-amber-500 group hover:translate-y-[-4px] transition-all duration-300 bg-slate-900/60">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Won Deals</p>
              <h3 className="text-4xl font-extrabold text-slate-50 mt-1">{stats.leadsByStatus.find((s) => s._id === "won")?.count || 0}</h3>
            </div>
            <div className="bg-amber-500/20 p-3 rounded-2xl text-amber-400 group-hover:scale-110 transition-transform"><Award size={28} /></div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Target className="text-blue-500" />
            Lead Status Distribution
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} className="focus:outline-none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[320px] text-slate-500 gap-2">
              <Target size={40} className="text-slate-700" />
              <span>No data available</span>
            </div>
          )}
        </div>

        <div className="glass-card rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="text-emerald-500" />
            Lead Sources
          </h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "#ffffff05" }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex flex-col items-center justify-center h-[320px] text-slate-500 gap-2">
              <Activity size={40} className="text-slate-700" />
              <span>No data available</span>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="glass-card rounded-2xl p-6">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Calendar className="text-amber-500" />
          Recent Activities
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.recentActivities?.length > 0 ? (
            stats.recentActivities.map((activity) => (
              <div key={activity._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors flex items-start gap-4">
                <div className={`p-3 rounded-xl ${activity.type === "call" ? "bg-blue-500/10 text-blue-500" : activity.type === "email" ? "bg-emerald-500/10 text-emerald-500" : "bg-purple-500/10 text-purple-500"}`}>
                  {activity.type === "call" ? "📞" : activity.type === "email" ? "📧" : "👥"}
                </div>
                <div>
                  <p className="text-sm text-slate-200 line-clamp-1">{activity.description}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {activity.user_id?.name} • {new Date(activity.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 flex flex-col items-center gap-2 text-slate-500">
              <Calendar size={40} className="text-slate-700" />
              <span>No recent activities found</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

