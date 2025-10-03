import React from "react";

export default function LeadDetailsModal({ selectedLead, onClose }) {
  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
        <h3 className="text-xl font-semibold mb-4">Lead Details</h3>
        <div className="grid grid-cols-2 gap-4">
          <p>
            <strong>First Name:</strong> {selectedLead.first_name}
          </p>
          <p>
            <strong>Last Name:</strong> {selectedLead.last_name}
          </p>
          <p>
            <strong>Email:</strong> {selectedLead.email}
          </p>
          <p>
            <strong>Phone:</strong> {selectedLead.phone}
          </p>
          <p>
            <strong>Company:</strong> {selectedLead.company}
          </p>
          <p>
            <strong>City:</strong> {selectedLead.city}
          </p>
          <p>
            <strong>State:</strong> {selectedLead.state}
          </p>
          <p>
            <strong>Source:</strong> {selectedLead.source}
          </p>
          <p>
            <strong>Status:</strong> {selectedLead.status}
          </p>
          <p>
            <strong>Score:</strong> {selectedLead.score}
          </p>
          <p>
            <strong>Lead Value:</strong> {selectedLead.lead_value}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(selectedLead.createdAt).toLocaleString()}
          </p>

          {/* Assigned Sales Rep */}
          <p>
            <strong>Assigned To:</strong>{" "}
            {selectedLead.assigned_to
              ? `${selectedLead.assigned_to.name} (${selectedLead.assigned_to.email})`
              : "Not assigned"}
          </p>
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
