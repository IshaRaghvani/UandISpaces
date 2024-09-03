// LeadsListTable.jsx
"use client";
import React, { useState, useMemo, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Search } from "lucide-react";
import StatusTag from "./StatusTag";
import FollowUpStatusTag from "./FollowUpStatusTag";
import { useRouter } from "next/navigation"; // Import useRouter
import Link from "next/link";
import { db } from "@/configs";
import { Modal } from "@mui/material";
function LeadsListTable({ leadsList, setSelectedLeads,onRowClick }) {
  const router = useRouter(); // Initialize useRouter
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [50, 100, 150];
  const [searchInput, setsearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const rowStyle = { background: "#f9f9f9" };
  const [selectedLead, setSelectedLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (leadsList) {
      setRowData(leadsList);
    }
  }, [leadsList]);

  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      if (!rowData || rowData.length === 0) {
        console.error("Row data is not available");
        return;
      }
      const leadToUpdate = rowData.find((lead) => lead.id === Number(leadId));

      if (!leadToUpdate || leadToUpdate.status === undefined) {
        console.error(
          `Lead with ID ${leadId} not found or status is undefined`
        );
        return;
      }

      await db
        .update(LeadsList)
        .set({ status: newStatus })
        .where({ id: leadId });

      const updatedLeads = rowData.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      );
      setRowData(updatedLeads);
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const handleRowClick = (params) => {
    // Navigate to the detail page of the clicked lead
    router.push(`/dashboard/leads/${params.data.id}`);
  };

  // const handleRowClick = (params) => {
  //   setSelectedLead(params.data);
  //   setIsModalOpen(true);
  //   // onRowClick(params.data); // Pass the lead data to the parent component
  // };
  
  

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null); // Clear selected lead
  };

  const filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      const dateAsString = cellValue;
      if (dateAsString == null) return -1;
      const dateParts = dateAsString.split("/");
      const cellDate = new Date(
        Number(dateParts[2]),
        Number(dateParts[1]) - 1,
        Number(dateParts[0])
      );
      if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
        return 0;
      }
      if (cellDate < filterLocalDateAtMidnight) {
        return -1;
      }
      if (cellDate > filterLocalDateAtMidnight) {
        return 1;
      }
      return 0;
    },
    minValidYear: 2010,
    maxValidYear: 2070,
    inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  };

  const getRowStyle = (params) => {
    if (params.node.rowIndex % 2 === 0) {
      return { background: "white" };
    }
  };

  const [colDefs, setColDefs] = useState([
    {
      field: "select",
      flex: 1,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 100,
    },
    {
      field: "name",
      flex: 1,
      filter: true,
      editable: true,
      minWidth: 150,
      // cellRenderer: (params) => (
      //   <Link href={`/dashboard/leads/${params.data.id}`} passHref>
      //     {params.value}
      //   </Link>
      // ),
    },
    {
      field: "status",
      cellRenderer: (params) => (
        <StatusTag
          value={params.value}
          leadId={params.data.id}
          onUpdateStatus={updateLeadStatus}
        />
      ),
    },
    {
      field: "follow_up_date",
      flex: 2,
      minWidth: 200,
      floatingFilter: true,
      filter: "agDateColumnFilter",
      filterParams: filterParams,
    },
    { field: "project_name", flex: 1, filter: true, minWidth: 150 },
    { field: "budget", flex: 1, filter: true, minWidth: 100 },
    {
      field: "follow_up_status",
      minWidth: 200,
      flex: 1,
      cellRenderer: (params) => (
        <FollowUpStatusTag value={params.value} leadId={params.data.id} />
      ),
    },
    { field: "requirement", flex: 1, filter: true, minWidth: 150 },
    { field: "phone_number", flex: 1, editable: true, minWidth: 150 },
    { field: "configuration", flex: 1, filter: true, minWidth: 150 },
    { field: "city", flex: 1, filter: true, minWidth: 150 },
    { field: "possession", flex: 1, filter: true, minWidth: 150 },
    { field: "lead_source", minWidth: 150, flex: 1 },
  ]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const onSearchChange = (e) => {
    setsearchInput(e.target.value);
  };

  // const onSelectionChanged = () => {
  //   const selectedRows = gridRef.current.api.getSelectedRows();
  //   setSelectedLeads(selectedRows);
  // };

  const gridRef = React.createRef();

  return (
    <div>
      <div className="search-container">
        <Search className="search-icon" />
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={onSearchChange}
        />
      </div>
      <div className="ag-theme-quartz" style={{ height: 600, width: "100%" }}>
        <AgGridReact
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          
          rowSelection="single"
          onRowClicked={handleRowClick} // Handle row click
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
        />
      </div>

      {/* Modal for displaying lead details */}
      {selectedLead && (
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModal}
          contentLabel="Lead Details"
          className="modal"
          overlayClassName="overlay"
        >
          <h2>Lead Details</h2>
          <p><strong>Name:</strong> {selectedLead.name}</p>
          <p><strong>Status:</strong> {selectedLead.status}</p>
          <p><strong>Follow-up Date:</strong> {selectedLead.follow_up_date}</p>
          <p><strong>Project Name:</strong> {selectedLead.project_name}</p>
          <p><strong>Budget:</strong> {selectedLead.budget}</p>
          <p><strong>Follow-up Status:</strong> {selectedLead.follow_up_status}</p>
          <p><strong>Requirement:</strong> {selectedLead.requirement}</p>
          <p><strong>Phone Number:</strong> {selectedLead.phone_number}</p>
          <p><strong>Configuration:</strong> {selectedLead.configuration}</p>
          <p><strong>City:</strong> {selectedLead.city}</p>
          <p><strong>Possession:</strong> {selectedLead.possession}</p>
          <p><strong>Lead Source:</strong> {selectedLead.lead_source}</p>
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </div>
  );
}

export default LeadsListTable;
