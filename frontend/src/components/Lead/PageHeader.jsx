import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Plus } from "lucide-react";

export default function PageHeader({ onCreateClick }) {
  const { user: currentUser, loading } = useContext(AuthContext);
  if (loading) return null;
  return (
    <div className="flex justify-end items-center">
      {(currentUser?.role === "manager" || currentUser?.role === "admin") && (
        <button
          onClick={onCreateClick}
          className="glass-button flex items-center gap-2 py-2.5 px-6 text-sm font-black uppercase tracking-widest shadow-lg shadow-blue-500/20"
        >
          <Plus size={20} className="stroke-[3px]" />
          <span>Create Lead</span>
        </button>
      )}
    </div>
  );
}
