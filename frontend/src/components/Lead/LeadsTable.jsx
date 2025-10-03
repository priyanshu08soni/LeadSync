import React from "react";
import { AgGridReact } from "ag-grid-react";
import { Pencil, Trash2, Eye } from "lucide-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export default function LeadsTable({ rowData, onView, onEdit, onDelete }) {
  const columns = [
    { field: "first_name", flex: 1, minWidth: 120 },
    { field: "last_name", flex: 1, minWidth: 120 },
    { field: "email", flex: 2, minWidth: 250 },
    { field: "company", minWidth: 80 },

    // Sales Rep Name
    {
      field: "assigned_to",
      headerName: "Sales Rep Name",
      flex: 1.5,
      minWidth: 150,
      valueGetter: (params) => params.data.assigned_to?.name || "Not assigned",
    },

    // Sales Rep Email
    {
      field: "assigned_to_email",
      headerName: "Sales Rep Email",
      flex: 2,
      minWidth: 200,
      valueGetter: (params) => params.data.assigned_to?.email || "Not assigned",
    },

    { field: "status", maxWidth: 100 },
    { field: "score", maxWidth: 100 },
    { field: "lead_value", headerName: "Value", maxWidth: 120 },
    {
      field: "createdAt",
      headerName: "Created",
      valueFormatter: (params) =>
        params.value
          ? new Date(params.value).toLocaleString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "",
      minWidth: 180,
    },
    {
      headerName: "Actions",
      pinned: "right",
      maxWidth: 150,
      cellRenderer: (params) => (
        <div className="flex w-full h-full py-[7px] justify-center gap-2">
          <button
            onClick={() => onView(params.data)}
            className="p-1 bg-blue-100 hover:bg-blue-200 rounded"
            title="View"
          >
            <Eye size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(params.data)}
            className="p-1 bg-yellow-100 hover:bg-yellow-200 rounded"
            title="Edit"
          >
            <Pencil size={18} className="text-yellow-600" />
          </button>
          <button
            onClick={() => onDelete(params.data._id)}
            className="p-1 bg-red-100 hover:bg-red-200 rounded"
            title="Delete"
          >
            <Trash2 size={18} className="text-red-600" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="ag-theme-alpine" style={{ height: 500, width: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columns}
        pagination={false}
        suppressMovableColumns={true}
        domLayout="autoHeight"
        defaultColDef={{
          resizable: true,
          sortable: true,
          filter: true,
          cellStyle: {
            whiteSpace: "nowrap",
            overflow: "visible",
            textOverflow: "clip",
          },
        }}
        suppressHorizontalScroll={false}
      />
    </div>
  );
}
