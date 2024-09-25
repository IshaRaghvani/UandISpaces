// LeadsListTable.jsx
import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import StatusTag from "./StatusTag";
import FollowUpStatusTag from "./FollowUpStatusTag";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import EditModal from "./EditModal";
import LeadDetailsModal from "./LeadDetailsModal";

const LeadsListTable = ({ data, onStatusUpdate, onFollowUpStatusUpdate }) => {
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [50, 100, 150];
  const [searchInput, setsearchInput] = useState("");
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rowData, setRowData] = useState(data); 
  const handleStatusChange = (leadId, newStatus) => {
    // if (newStatus.toLowerCase() === "inactive") {
    //   setSelectedLead(leadId);
    //   setIsDialogOpen(true);
    // } else {
    //   onStatusUpdate(leadId, newStatus);
    // }
    console.log("clicl");
  };
  useEffect(() => {
    setRowData(data);
}, [data]);

  const handleLeadUpdate = (updatedLead) => {
    setRowData((prevRowData) =>
      prevRowData.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead); // Update the selected lead
  };

  const confirmStatusChange = (followUpStatus) => {
    onFollowUpStatusUpdate(selectedLead, followUpStatus);
    setIsDialogOpen(false);
  };

  const rowStyle = useMemo(() => ({ background: "#EEEEEE" }), []);

  const formatDate = (date) => {
    if (!date) return "No Date"; 
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const columnDefs = [
    {
      field: "select",
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 100,
      headerCheckboxSelectionFilteredOnly: true,
    },
    {
      field: "name",
      flex: 1,
      filter: true,
      editable: true,
      minWidth: 150,
    },
    {
      field: "status",
      cellRenderer: (params) => (
        <StatusTag
          value={params.value}
          leadId={params.data._id}
          onUpdateStatus={onStatusUpdate}
          onStatusChange={(newStatus) =>
            handleStatusChange(params.data._id, newStatus)
          }
        />
      ),
    },
    {
      field: "follow_up_status",
      minWidth: 200,
      flex: 1,
      cellRenderer: (params) => (
        <FollowUpStatusTag
          value={params.value}
          leadId={params.data._id}
          leadStatus={params.data.status}
          onUpdateFollowUpStatus={onFollowUpStatusUpdate}
        />
      ),
    },
    {
      field: "follow_up_date",
      flex: 2,
      minWidth: 200,
      cellRenderer: (params) => formatDate(params.value),
    },
    { field: "project_name", flex: 1, filter: true, minWidth: 150 },
    { field: "budget", flex: 1, filter: true, minWidth: 100 },
    { field: "requirement", flex: 1, filter: true, minWidth: 150 },
    { field: "phone_number", flex: 1, editable: true, minWidth: 150 },
    { field: "configuration", flex: 1, filter: true, minWidth: 150 },
    { field: "city", flex: 1, filter: true, minWidth: 150 },
    { field: "possession_type", flex: 1, filter: true, minWidth: 150 },
    { field: "lead_source", minWidth: 150, flex: 1 },
    {
      field: "designer_name",
      headerName: "Designer Name",
      valueGetter: (params) => params.data.designer?.name,
      flex: 1,
      minWidth: 150,
    },
    {
      field: "comments",
      headerName: "Comments",
      valueGetter: (params) =>
        params.data.comments && params.data.comments.length > 0
          ? params.data.comments.map((comment) => comment.text || "").join(", ")
          : "No comments",
      flex: 1,
      minWidth: 200,
    },
  ];

  const getRowStyle = useMemo(
    () => (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "white" };
      }
      return null;
    },
    []
  );

  useEffect(() => {
    // Toggle modal visibility based on selected rows
    setIsModalVisible(selectedRows.length > 0);
  }, [selectedRows]);

  const onSelectionChanged = (params) => {
    const selectedNodes = params.api.getSelectedNodes();
    const selectedData = selectedNodes.map((node) => node.data);
    setSelectedRows(selectedData);

  };

  const handleRowClick = (params) => {
  setSelectedLead(params.data); // Set selected lead based on clicked row
  setIsModalVisible(true); // Open the modal
};

  const defaultColDef = useMemo(
    () => ({
      filter: true,
      resizable: true,
    }),
    []
  );

  return (
    <div className="my-7">
      <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
          <Search />
          <input
            className="outline-none w-full"
            type="text"
            placeholder="Search..."
            onChange={(event) => setsearchInput(event.target.value)}
          />
        </div>
        <AgGridReact
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          rowData={rowData}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          quickFilterText={searchInput}
          rowSelection="multiple"
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
          onSelectionChanged={onSelectionChanged}
          onRowClicked={handleRowClick}
        />
      </div>
      {/* <EditModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        selectedRows={selectedRows}
      /> */}
      <LeadDetailsModal
        isOpen={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        lead={selectedLead}
        onLeadUpdate={handleLeadUpdate}
        
      />
    </div>
  );
};

export default LeadsListTable;
