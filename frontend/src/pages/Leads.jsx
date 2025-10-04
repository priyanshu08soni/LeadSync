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
import { Search, Filter, X } from "lucide-react";

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

  // Fetch sales reps
  useEffect(() => {
    const fetchSalesReps = async () => {
      try {
        const res = await api.get("/auth/users/salesreps");
        setSalesReps(res.data.salesReps || []);
      } catch (err) {
        console.error("Failed to load sales reps", err);
        showNotification("Failed to load sales reps", "error");
      }
    };

    if (currentUser && (currentUser.role === "admin" || currentUser.role === "manager")) {
      fetchSalesReps();
    }
  }, [currentUser]);

  // Fetch leads with filters
  const fetchPage = async (p = 1) => {
    setLoading(true);
    try {
      const params = { page: p, limit };
      
      // Add search query
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Add filters
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

  // Trigger fetch when search or filters change
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

    if (!currentUser) {
      showNotification("User not loaded. Please try again.", "error");
      return;
    }

    try {
      const payload = {
        ...formData,
        updated_by: currentUser._id,
      };

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
      console.error("Save failed:", err);
      const errorMsg = err.response?.data?.message || "Failed to save lead";
      showNotification(errorMsg, "error");
    }
  };

  const handleCreateClick = () => {
    resetForm();
    setShowForm(true);
  };

  const handleView = (lead) => {
    setSelectedLead(lead);
  };

  const handleEdit = (lead) => {
    setFormData({
      ...lead,
      assigned_to: lead.assigned_to?._id || lead.assigned_to || "",
    });
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
      console.error("Delete failed:", err);
      showNotification("Failed to delete lead", "error");
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (newLimit) => {
    setLimit(newLimit);
    setPage(1);
  };

  const handleFormClose = () => {
    setShowForm(false);
    resetForm();
  };

  const handleDetailsClose = () => {
    setSelectedLead(null);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
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
    setSearchQuery("");
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PageHeader onCreateClick={handleCreateClick} />

      {/* Stats Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Total Leads</p>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Current Page</p>
          <p className="text-2xl font-bold text-gray-900">{page} / {totalPages}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Showing</p>
          <p className="text-2xl font-bold text-gray-900">{rowData.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-600">Per Page</p>
          <p className="text-2xl font-bold text-gray-900">{limit}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search leads by name, email, company, or phone..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${
              showFilters ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter size={20} />
            Filters
          </button>
          {(Object.values(filters).some(v => v !== "") || searchQuery) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 flex items-center gap-2"
            >
              <X size={20} />
              Clear
            </button>
          )}
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Advanced Filters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                  <option value="won">Won</option>
                </select>
              </div>

              {/* Source Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Sources</option>
                  <option value="website">Website</option>
                  <option value="facebook_ads">Facebook Ads</option>
                  <option value="google_ads">Google Ads</option>
                  <option value="referral">Referral</option>
                  <option value="events">Events</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Qualified Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Qualified</label>
                <select
                  value={filters.is_qualified}
                  onChange={(e) => handleFilterChange("is_qualified", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All</option>
                  <option value="true">Qualified</option>
                  <option value="false">Not Qualified</option>
                </select>
              </div>

              {/* Score Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.score_min}
                  onChange={(e) => handleFilterChange("score_min", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={filters.score_max}
                  onChange={(e) => handleFilterChange("score_max", e.target.value)}
                  placeholder="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Value Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Value ($)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.value_min}
                  onChange={(e) => handleFilterChange("value_min", e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Value ($)</label>
                <input
                  type="number"
                  min="0"
                  value={filters.value_max}
                  onChange={(e) => handleFilterChange("value_max", e.target.value)}
                  placeholder="999999"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created After</label>
                <input
                  type="date"
                  value={filters.created_after}
                  onChange={(e) => handleFilterChange("created_after", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created Before</label>
                <input
                  type="date"
                  value={filters.created_before}
                  onChange={(e) => handleFilterChange("created_before", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <PageSizeSelector limit={limit} onLimitChange={handleLimitChange} />

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600"></div>
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <LeadForm
        showForm={showForm}
        salesReps={salesReps}
        editLead={editLead}
        formData={formData}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onClose={handleFormClose}
      />

      <LeadDetailsModal
        selectedLead={selectedLead}
        onClose={handleDetailsClose}
      />
    </div>
  );
}