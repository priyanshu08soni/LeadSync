import React from "react";

export default function PageHeader({ onCreateClick }) {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-4xl font-semibold text-gray-800">Leads</h2>
      <button
        onClick={onCreateClick}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
      >
        + Create
      </button>
    </div>
  );
}
