import React from "react";
import { X } from "lucide-react";

export default function LeadDetailsModal({ selectedLead, onClose }) {
  if (!selectedLead) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold">Lead Details</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">First Name</p>
              <p className="font-medium">{selectedLead.first_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Name</p>
              <p className="font-medium">{selectedLead.last_name}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{selectedLead.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="font-medium">{selectedLead.phone || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Company</p>
              <p className="font-medium">{selectedLead.company || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">City</p>
              <p className="font-medium">{selectedLead.city || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">State</p>
              <p className="font-medium">{selectedLead.state || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Source</p>
              <p className="font-medium capitalize">{selectedLead.source?.replace("_", " ")}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <p className="font-medium capitalize">{selectedLead.status}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Score</p>
              <p className="font-medium">{selectedLead.score || 0}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Lead Value</p>
              <p className="font-medium">${selectedLead.lead_value || 0}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-600">Assigned To</p>
              <p className="font-medium">
                {selectedLead.assigned_to
                  ? `${selectedLead.assigned_to.name} (${selectedLead.assigned_to.email})`
                  : "Not assigned"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Created At</p>
              <p className="font-medium">
                {new Date(selectedLead.createdAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
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