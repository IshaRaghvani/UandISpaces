// LeadsListTable.jsx
"use client";
import React, { useState, useMemo, useEffect, useRef } from "react";
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
import { eq } from "drizzle-orm";
import { LeadsList } from "@/configs/schema";
import { useParams } from "next/navigation";

function LeadsListTable({ leadsList, setSelectedLeads }) {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const router = useRouter(); // Initialize useRouter
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [50, 100, 150];
  const [searchInput, setsearchInput] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const rowStyle = useMemo(() => ({ background: "#f9f9f9" }), []);
  const [hotLeads, setHotLeads] = useState([]);
  const [closedLeads, setclosedLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const gridApiRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gridApi, setGridApi] = useState(null);

  useEffect(() => {
    if (leadsList) {
      setRowData(leadsList);
      console.log("Updated rowData:", leadsList);
    }
  }, [leadsList]);

  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        try {
          const leadId = Number(id);
          if (isNaN(leadId)) {
            throw new Error("Invalid lead id");
          }

          const result = await db
            .select()
            .from(LeadsList)
            .where(eq(LeadsList.id, leadId));

          if (result.length > 0) {
            setLead(result[0]);
          } else {
            console.error("Lead not found");
          }
        } catch (error) {
          console.error("Error fetching lead details:", error);
        }
      };

      fetchLead();
    }
  }, [id]);

  const onGridReady = (params) => {
    setGridApi(params.api);
    params.api.addEventListener("sortChanged", (event) => {
      console.log("Sort changed event:", event);
      console.log("Current sort model:", event.api.getSortModel());
    });
  };
  const onSortChanged = (event) => {
    console.log("Sort changed event:", event);
    console.log("Current sort model:", event.api.getSortModel());
  };
  

  //update the status
  const handleStatusUpdate = async (leadId, status) => {
    try {
      await db
        .update(LeadsList)
        .set({ status })
        .where(eq(LeadsList.id, leadId));

      // Update the rowData and filtered lists
      setRowData((prevLeadsList) => {
        const updatedLeadsList = prevLeadsList.map((lead) =>
          lead.id === leadId ? { ...lead, status } : lead
        );
        // Update filtered lists manually after status change
        const updatedHotLeads = updatedLeadsList.filter(
          (lead) => lead.status === "Hot"
        );
        const updatedClosedLeads = updatedLeadsList.filter(
          (lead) => lead.status === "Close and Win"
        );
        setHotLeads(updatedHotLeads);
        setclosedLeads(updatedClosedLeads);
        return updatedLeadsList;
      });

      // Refresh the grid to update the display
      if (gridApiRef.current) {
        const allNodes = gridApiRef.current.api.getRowNodes();
        const updatedNode = allNodes.find((node) => node.data.id === leadId);
        if (updatedNode) {
          gridApiRef.current.api.refreshCells({
            force: true,
            columns: ["status"],
            rowNodes: [updatedNode],
          });
        }
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  //update the followup status
  const handleFollowUpdate = async (leadId, follow_up_status) => {
    try {
      await db
        .update(LeadsList)
        .set({ follow_up_status })
        .where(eq(LeadsList.id, leadId));

      setRowData((prevRowData) =>
        prevRowData.map((item) =>
          item.id === leadId ? { ...item, follow_up_status } : item
        )
      );

      // Refresh only the updated cell
      if (gridApiRef.current) {
        const allNodes = gridApiRef.current.api.getRowNodes();
        const updatedNode = allNodes.find((node) => node.data.id === leadId);
        if (updatedNode) {
          gridApiRef.current.api.refreshCells({
            force: true,
            columns: ["follow_up_status"],
            rowNodes: [updatedNode],
          });
        }
      }
    } catch (error) {
      console.error("Error updating follow up status:", error);
    }
  };

  const handleRowClick = (params) => {
    // Navigate to the detail page of the clicked lead
    router.push(`/dashboard/leads/${params.data.id}`);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null); // Clear selected lead
  };

  // const filterParams = {
  //   comparator: (filterLocalDateAtMidnight, cellValue) => {
  //     const dateAsString = cellValue;
  //     if (dateAsString == null) return -1;
  //     const dateParts = dateAsString.split("/");
  //     const cellDate = new Date(
  //       Number(dateParts[2]),
  //       Number(dateParts[1]) - 1,
  //       Number(dateParts[0])
  //     );
  //     if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
  //       return 0;
  //     }
  //     if (cellDate < filterLocalDateAtMidnight) {
  //       return -1;
  //     }
  //     if (cellDate > filterLocalDateAtMidnight) {
  //       return 1;
  //     }
  //     return 0;
  //   },
  //   minValidYear: 2010,
  //   maxValidYear: 2070,
  //   inRangeFloatingFilterDateFormat: "Do MMM YYYY",
  // };

  const getRowStyle = useMemo(
    () => (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "white" };
      }
      return null;
    },
    []
  );

  const colDefs = useMemo(
    () => [
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
      },
      {
        field: "status",
        cellRenderer: (params) => (
          <StatusTag
            value={params.value}
            leadId={params.data.id}
            onUpdateStatus={handleStatusUpdate}
          />
        ),
      },
      {
        field: "follow_up_date",
        flex: 2,
        minWidth: 200,
      },
      { field: "project_name", flex: 1, filter: true, minWidth: 150 },
      { field: "budget", flex: 1, filter: true, minWidth: 100 },
      {
        field: "follow_up_status",
        minWidth: 200,
        flex: 1,
        cellRenderer: (params) => (
          <FollowUpStatusTag
            value={params.value}
            leadId={params.data.id}
            onUpdateFollowUpStatus={handleFollowUpdate}
          />
        ),
      },
      { field: "requirement", flex: 1, filter: true, minWidth: 150 },
      { field: "phone_number", flex: 1, editable: true, minWidth: 150 },
      { field: "configuration", flex: 1, filter: true, minWidth: 150 },
      { field: "city", flex: 1, filter: true, minWidth: 150 },
      { field: "possession", flex: 1, filter: true, minWidth: 150 },
      { field: "lead_source", minWidth: 150, flex: 1 },
    ],
    []
  ); // Dependencies are an empty array because these definitions are static

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const gridRef = React.createRef();

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
          ref={gridRef}
          rowData={rowData}
          columnDefs={colDefs}
          defaultColDef={defaultColDef}

          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          quickFilterText={searchInput}
          rowSelection="multiple"
          onRowClicked={handleRowClick} // Handle row click
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
          // onGridReady={onGridReady}
          // onSortChanged={onSortChanged}
        />
      </div>

      {/* Modal for displaying lead details
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
      )} */}
    </div>
  );
}

export default LeadsListTable;
