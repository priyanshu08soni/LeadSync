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
  }, [currentUser, selectedManager]);

  const fetchTeams = async () => {
    try {
      const res = await api.get("/analytics/managers");
      setTeams(res.data);
    } catch (err) {
      console.error("Failed to fetch teams:", err);
      showNotification("Failed to load teams", "error");
    }
  };

  const handleManagerChange = async (e) => {
    const managerId = e.target.value;
    setSelectedManager(managerId);

    if (managerId) {
      const team = teams.find((t) => t.manager._id === managerId);
      if (team) {
        setTeamMembers([team.manager, ...team.sales_reps]);
      }
    } else {
      setTeamMembers([]);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const params = {};

      if (currentUser?.role === "admin") {
        if (selectedUser) {
          params.userId = selectedUser;
        } else if (selectedManager) {
          params.managerId = selectedManager;
        }
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
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Colors for charts
  const STATUS_COLORS = {
    new: "#3B82F6",
    contacted: "#F59E0B",
    qualified: "#10B981",
    lost: "#EF4444",
    won: "#8B5CF6",
  };

  const SOURCE_COLORS = [
    "#3B82F6",
    "#F59E0B",
    "#10B981",
    "#EF4444",
    "#8B5CF6",
    "#EC4899",
  ];

  // Format status data for charts
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

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Overview of your sales pipeline and team performance
        </p>

        {/* Admin Filters */}
        {currentUser.role === "admin" && (
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <label className="text-sm font-semibold text-gray-700">
                Filter by Manager:
              </label>

              <div className="relative w-60">
                <Listbox value={selectedManager} onChange={setSelectedManager}>
                  {({ open }) => (
                    <>
                      <Listbox.Button
                        className={`relative w-full cursor-pointer rounded-2xl border border-gray-200 bg-white py-3 pl-5 pr-10 text-left shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400/40 focus:border-transparent transition-all duration-300 text-gray-700 font-medium ${
                          open ? "ring-1 ring-blue-300" : ""
                        }`}
                      >
                        <span className="block truncate">
                          {selectedManager
                            ? teams.find(
                                (t) => t.manager._id === selectedManager
                              )?.manager?.name
                            : "All Teams"}
                        </span>
                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                          <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                              open ? "rotate-180 text-gray-600" : ""
                            }`}
                          />
                        </span>
                      </Listbox.Button>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute z-10 mt-2 max-h-60 w-full overflow-auto rounded-xl bg-white py-2 shadow-xl ring-1 ring-gray-200 focus:outline-none text-sm">
                          <Listbox.Option
                            value=""
                            className={({ active }) =>
                              `relative cursor-pointer select-none py-3 px-4 ${
                                active
                                  ? "bg-blue-50 text-blue-700"
                                  : "text-gray-700"
                              }`
                            }
                          >
                            {({ selected }) => (
                              <div className="flex justify-between items-center">
                                <span
                                  className={
                                    selected ? "font-semibold" : "font-normal"
                                  }
                                >
                                  All Teams
                                </span>
                                {selected ? (
                                  <Check className="h-4 w-4 text-blue-500" />
                                ) : null}
                              </div>
                            )}
                          </Listbox.Option>

                          {teams.map((team) => (
                            <Listbox.Option
                              key={team._id}
                              value={team.manager._id}
                              className={({ active }) =>
                                `relative cursor-pointer select-none py-3 px-4 flex justify-between items-center ${
                                  active
                                    ? "bg-blue-50 text-blue-700"
                                    : "text-gray-700"
                                }`
                              }
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? "font-semibold" : "font-normal"
                                    }`}
                                  >
                                    {team.manager.name} ({team.name})
                                  </span>
                                  {selected && (
                                    <Check className="h-4 w-4 text-blue-500 shrink-0" />
                                  )}
                                </>
                              )}
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </>
                  )}
                </Listbox>
              </div>
            </div>

            {(selectedManager || selectedUser) && (
              <button
                onClick={() => {
                  setSelectedManager("");
                  setTeamMembers([]);
                }}
                className="px-5 py-3.5 rounded-3xl font-medium text-sm bg-red-500 text-white transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200/80 hover:border-gray-300/80 backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Clear Filters
                </span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Leads</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stats.totalLeads}
              </h3>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Conversion Rate
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stats.conversionRate.toFixed(1)}%
              </h3>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        {/* Avg Lead Value */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Avg Lead Value
              </p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                ${stats.avgLeadValue.toFixed(0)}
              </h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <DollarSign className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {/* Won Deals */}
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Won Deals</p>
              <h3 className="text-3xl font-bold text-gray-800 mt-2">
                {stats.leadsByStatus.find((s) => s._id === "won")?.count || 0}
              </h3>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Award className="text-yellow-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Status Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Target className="mr-2 text-blue-600" size={24} />
            Lead Status Distribution
          </h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </div>

        {/* Lead Source Distribution */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2 text-green-600" size={24} />
            Lead Sources
          </h3>
          {sourceData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sourceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Sales Rep Performance */}
      {salesRepPerformance.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Users className="mr-2 text-purple-600" size={24} />
            {currentUser.role === "admin"
              ? "Sales Team Performance"
              : currentUser.role === "manager"
              ? "My Team Performance"
              : "My Performance"}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Won Leads
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Conversion Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesRepPerformance.map((rep, index) => (
                  <tr
                    key={rep._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {rep.name}
                      </div>
                      <div className="text-sm text-gray-500">{rep.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rep.role === "manager"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {rep.role.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rep.totalLeads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rep.wonLeads}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          rep.conversionRate >= 20
                            ? "bg-green-100 text-green-800"
                            : rep.conversionRate >= 10
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {rep.conversionRate.toFixed(1)}%
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${rep.totalValue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activities */}
      {stats.recentActivities && stats.recentActivities.length > 0 && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <Activity className="mr-2 text-orange-600" size={24} />
            Recent Activities
          </h3>
          <div className="space-y-4">
            {stats.recentActivities.map((activity) => (
              <div
                key={activity._id}
                className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    activity.type === "call"
                      ? "bg-blue-100 text-blue-600"
                      : activity.type === "email"
                      ? "bg-green-100 text-green-600"
                      : activity.type === "meeting"
                      ? "bg-purple-100 text-purple-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {activity.type === "call"
                    ? "📞"
                    : activity.type === "email"
                    ? "📧"
                    : activity.type === "meeting"
                    ? "👥"
                    : "📝"}
                </div>
                <div className="ml-4 flex-grow">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {activity.user_id?.name || "Unknown User"} •{" "}
                    {activity.lead_id
                      ? `${activity.lead_id.first_name} ${activity.lead_id.last_name} (${activity.lead_id.company})`
                      : "Lead deleted"}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(activity.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
