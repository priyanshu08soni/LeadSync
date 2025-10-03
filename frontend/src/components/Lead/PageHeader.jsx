import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";

export default function PageHeader({ onCreateClick }) {
  const { user: currentUser, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-4xl font-semibold text-gray-800">Leads</h2>
      {(currentUser?.role === "manager" || currentUser?.role === "admin") && (
        <button
          onClick={onCreateClick}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
        >
          + Create
        </button>
      )}
    </div>
  );
}
