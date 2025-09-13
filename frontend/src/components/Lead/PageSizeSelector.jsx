import React from "react";

export default function PageSizeSelector({ limit, onLimitChange }) {
  return (
    <div className="flex justify-end mb-4">
      <label className="mr-2 text-gray-700">Rows per page:</label>
      <select
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
        className="border rounded px-2 py-1"
      >
        <option value={10}>10</option>
        <option value={20}>20</option>
        <option value={50}>50</option>
      </select>
    </div>
  );
}
