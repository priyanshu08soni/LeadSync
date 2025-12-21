import React from "react";
import { ListFilter } from "lucide-react";
import CustomDropdown from "../common/CustomDropdown";

export default function PageSizeSelector({ limit, onLimitChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
        <ListFilter size={14} className="text-slate-600" />
        Records:
      </label>
      <CustomDropdown
        value={limit}
        onChange={(value) => onLimitChange(Number(value))}
        options={[
          { value: 10, label: "10 CNT" },
          { value: 20, label: "20 CNT" },
          { value: 50, label: "50 CNT" }
        ]}
        className="min-w-[100px]"
      />
    </div>
  );
}
