import React, { useContext, useEffect, useState } from "react";
import api from "../api/api";
import LeadsTable from "../components/Lead/LeadsTable";
import LeadForm from "../components/Lead/LeadForm";
import LeadDetailsModal from "../components/Lead/LeadDetailsModel";
import Pagination from "../components/Lead/Pagination";
import PageHeader from "../components/Lead/PageHeader";
import PageSizeSelector from "../components/Lead/PageSizeSelector";
import { useNotification } from "../contexts/NotificationContext";
import { AuthContext } from "../contexts/AuthContext";
import { Search, Filter, X, LayoutGrid, Users, BarChart3, TrendingUp, Loader2 } from "lucide-react";

export default function Leads() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit, setLimit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    status: "",
    source: "",
    score_min: "",
    score_max: "",
    value_min: "",
    value_max: "",
    is_qualified: "",
    created_after: "",
    created_before: "",
  });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    company: "",
    city: "",
    state: "",
    source: "website",
    status: "new",
    score: 0,
    lead_value: 0,
    assigned_to: "",
  });

  const [salesReps, setSalesReps] = useState([]);
  const { user: currentUser, loading: authLoading } = useContext(AuthContext);
  const { showNotification } = useNotification();

  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const res = await api.get("/auth/users/salesreps");
        setSalesReps(res.data.salesReps || []);
      } catch (err) {
        console.error("Failed to load sales reps", err);
      }
    };

    if (currentUser && (currentUser.role === "admin" || currentUser.role === "manager")) {
      fetchSalesReps();
    }
  }, [currentUser]);

  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit };
      if (searchQuery) params.search = searchQuery;
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== null && value !== undefined) {
          params[key] = value;
        }
      });

      const res = await api.get("/leads", { params });
      setRowData(res.data.data || []);
      setPage(res.data.page || 1);
      setTotalPages(res.data.totalPages || 1);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Failed to fetch leads:", err);
      showNotification("Failed to load leads", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && currentUser) {
      fetchPage(page);
    }
  }, [page, limit, authLoading, currentUser]);

  useEffect(() => {
    if (!authLoading && currentUser) {
      const timer = setTimeout(() => {
        fetchPage(1);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, filters]);

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      company: "",
      city: "",
      state: "",
      source: "website",
      status: "new",
      score: 0,
      lead_value: 0,
      assigned_to: "",
    });
    setEditLead(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      const payload = { ...formData, updated_by: currentUser._id };
      if (editLead) {
        await api.put(`/leads/${editLead._id}`, payload);
        showNotification("Lead updated successfully!", "success");
      } else {
        await api.post("/leads", payload);
        showNotification("Lead created successfully!", "success");
      }
      setShowForm(false);
      resetForm();
      fetchPage(page);
    } catch (err) {
      showNotification(err.response?.data?.message || "Failed to save lead", "error");
    }
  };

  const handleCreateClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleView = (lead) => setSelectedLead(lead);
  const handleEdit = (lead) => {
    setFormData({ ...lead, assigned_to: lead.assigned_to?._id || lead.assigned_to || "" });
    setEditLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      showNotification("Lead deleted successfully!", "success");
      fetchPage(page);
    } catch (err) {
      showNotification("Failed to delete lead", "error");
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "", source: "", score_min: "", score_max: "",
      value_min: "", value_max: "", is_qualified: "",
      created_after: "", created_before: "",
    });
    setSearchQuery("");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Leads Overview</h1>
          <p className="text-slate-400 mt-1">Manage and track your sales opportunities</p>
        </div>
        <PageHeader onCreateClick={handleCreateClick} />
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4 bg-slate-900/40">
          <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400"><Users size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Leads</p>
            <p className="text-2xl font-black text-slate-50">{total}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4 bg-slate-900/40">
          <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400"><LayoutGrid size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Pages</p>
            <p className="text-2xl font-black text-slate-50">{page} / {totalPages}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4 bg-slate-900/40">
          <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400"><TrendingUp size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Current View</p>
            <p className="text-2xl font-black text-slate-50">{rowData.length}</p>
          </div>
        </div>
        <div className="glass-card rounded-2xl p-6 flex items-center gap-4 bg-slate-900/40">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400"><BarChart3 size={24} /></div>
          <div>
            <p className="text-sm font-medium text-slate-400">Limit</p>
            <p className="text-2xl font-black text-slate-50">{limit}</p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name, email, company..."
              className="w-full pl-10 glass-input"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-none glass-button-secondary flex items-center justify-center gap-2 ${showFilters ? "bg-white/10" : ""}`}
            >
              <Filter size={20} />
              Filters
            </button>
            {(Object.values(filters).some(v => v !== "") || searchQuery) && (
              <button
                onClick={clearFilters}
                className="glass-button-secondary bg-red-500/10 hover:bg-red-500/20 text-red-500 !border-red-500/20 flex items-center justify-center gap-2"
              >
                <X size={20} />
                Clear
              </button>
            )}
          </div>
        </div>

        {showFilters && (
          <div className="glass-card p-6 rounded-2xl space-y-6 animate-in slide-in-from-top-4 duration-300">
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <h3 className="text-lg font-bold text-white uppercase tracking-wider">Advanced Filters</h3>
              <span className="text-xs font-bold text-slate-500 bg-white/5 px-2 py-1 rounded">PRO FILTERS</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                  className="w-full glass-input appearance-none"
                >
                  <option value="" className="bg-slate-900">All Statuses</option>
                  <option value="new" className="bg-slate-900">New</option>
                  <option value="contacted" className="bg-slate-900">Contacted</option>
                  <option value="qualified" className="bg-slate-900">Qualified</option>
                  <option value="lost" className="bg-slate-900">Lost</option>
                  <option value="won" className="bg-slate-900">Won</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                  className="w-full glass-input appearance-none"
                >
                  <option value="" className="bg-slate-900">All Sources</option>
                  <option value="website" className="bg-slate-900">Website</option>
                  <option value="facebook_ads" className="bg-slate-900">Facebook Ads</option>
                  <option value="google_ads" className="bg-slate-900">Google Ads</option>
                  <option value="referral" className="bg-slate-900">Referral</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Score Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.score_min}
                    onChange={(e) => setFilters({ ...filters, score_min: e.target.value })}
                    placeholder="Min"
                    className="w-full glass-input !py-2 !text-sm"
                  />
                  <input
                    type="number"
                    value={filters.score_max}
                    onChange={(e) => setFilters({ ...filters, score_max: e.target.value })}
                    placeholder="Max"
                    className="w-full glass-input !py-2 !text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Lead Value Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.value_min}
                    onChange={(e) => setFilters({ ...filters, value_min: e.target.value })}
                    placeholder="Min $"
                    className="w-full glass-input !py-2 !text-sm"
                  />
                  <input
                    type="number"
                    value={filters.value_max}
                    onChange={(e) => setFilters({ ...filters, value_max: e.target.value })}
                    placeholder="Max $"
                    className="w-full glass-input !py-2 !text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <PageSizeSelector limit={limit} onLimitChange={(l) => { setLimit(l); setPage(1); }} />
          <div className="text-sm text-slate-400">Total: {total}</div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-blue-500" size={40} />
              <p className="text-slate-400 animate-pulse">Fetching leads...</p>
            </div>
          ) : (
            <LeadsTable
              rowData={rowData}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentUser={currentUser}
            />
          )}
        </div>

        <div className="p-4 border-t border-white/10">
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      </div>

      <LeadForm
        showForm={showForm}
        salesReps={salesReps}
        editLead={editLead}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={() => { setShowForm(false); resetForm(); }}
      />

      <LeadDetailsModal
        selectedLead={selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}