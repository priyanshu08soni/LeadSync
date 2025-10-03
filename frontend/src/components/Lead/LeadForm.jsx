import React from "react";

export default function LeadForm({
  showForm,
  salesReps,
  editLead,
  formData,
  onInputChange,
  onSubmit,
  onClose,
}) {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">
          {editLead ? "Edit Lead" : "Create Lead"}
        </h3>
        <form onSubmit={onSubmit} className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={formData.first_name}
            onChange={onInputChange}
            required
            className="border rounded p-2"
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={formData.last_name}
            onChange={onInputChange}
            className="border rounded p-2"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={onInputChange}
            required
            className="border rounded p-2 col-span-2"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={onInputChange}
            className="border rounded p-2 col-span-2"
          />
          <input
            type="text"
            name="company"
            placeholder="Company"
            value={formData.company}
            onChange={onInputChange}
            className="border rounded p-2 col-span-2"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={onInputChange}
            className="border rounded p-2"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={onInputChange}
            className="border rounded p-2"
          />
          <select
            name="source"
            value={formData.source}
            onChange={onInputChange}
            className="border rounded p-2"
          >
            <option value="website">Website</option>
            <option value="facebook_ads">Facebook Ads</option>
            <option value="google_ads">Google Ads</option>
            <option value="referral">Referral</option>
            <option value="events">Events</option>
            <option value="other">Other</option>
          </select>
          <select
            name="status"
            value={formData.status}
            onChange={onInputChange}
            className="border rounded p-2"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="lost">Lost</option>
            <option value="won">Won</option>
          </select>
          <select
            name="assigned_to"
            value={formData.assigned_to?._id || formData.assigned_to || ""}
            onChange={onInputChange}
            className="border rounded p-2 col-span-2"
            required
          >
            <option value="">-- Assign Sales Rep --</option>
            {salesReps.map((rep) => (
              <option key={rep._id} value={rep._id}>
                {rep.name} ({rep.email})
              </option>
            ))}
          </select>

          <input
            type="number"
            name="score"
            placeholder="Score"
            value={formData.score}
            onChange={onInputChange}
            className="border rounded p-2"
          />
          <input
            type="number"
            name="lead_value"
            placeholder="Lead Value"
            value={formData.lead_value}
            onChange={onInputChange}
            className="border rounded p-2"
          />
          <div className="col-span-2 flex justify-end space-x-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {editLead ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
