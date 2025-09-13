import React, { useEffect, useState } from "react";
import api from "../api/api";
import LeadsTable from "../components/Lead/LeadsTable";
import LeadForm from "../components/Lead/LeadForm";
import LeadDetailsModal from "../components/Lead/LeadDetailsModel";
import Pagination from "../components/Lead/Pagination";
import PageHeader from "../components/Lead/PageHeader";
import PageSizeSelector from "../components/Lead/PageSizeSelector";

export default function Leads() {
  const [rowData, setRowData] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(10);
  const [showForm, setShowForm] = useState(false);
  const [editLead, setEditLead] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);
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
  });

  // Fetch leads
  const fetchPage = async (p = 1) => {
    try {
      const res = await api.get("/leads", { params: { page: p, limit } });
      setRowData(res.data.data);
      setPage(res.data.page);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPage(page);
  }, [page, limit]);

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
    });
    setEditLead(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editLead) {
        await api.put(`/leads/${editLead._id}`, formData);
      } else {
        await api.post("/leads", formData);
      }
      setShowForm(false);
      resetForm();
      fetchPage(page);
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save lead");
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
    setFormData(lead);
    setEditLead(lead);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lead?")) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchPage(page);
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete lead");
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

  return (
    <div className="p-6">
      <PageHeader onCreateClick={handleCreateClick} />

      <PageSizeSelector limit={limit} onLimitChange={handleLimitChange} />

      <LeadsTable
        rowData={rowData}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <LeadForm
        showForm={showForm}
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
