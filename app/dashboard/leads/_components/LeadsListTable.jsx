"use client";
import React, { useState, useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // React Data Grid Component
import "ag-grid-community/styles/ag-grid.css"; // Mandatory CSS required by the Data Grid
import "ag-grid-community/styles/ag-theme-quartz.css";
import { useEffect } from "react";
import { Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusTag from "./StatusTag";
import { db } from "@/configs";
import FollowUpStatusTag from "./FollowUpStatusTag";
function LeadsListTable({ leadsList, setSelectedLeads }) {
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [50, 100, 150];
  const [searchInput, setsearchInput] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowData, setRowData] = useState([]);
  const rowStyle = { background: "#f9f9f9" };

  useEffect(() => {
    console.log("leadsList:", leadsList);
    leadsList && setRowData(leadsList);
  }, [leadsList]);

  useEffect(() => {
    leadsList && setRowData(leadsList);
  }, [leadsList]);

  //update lead status
  const updateLeadStatus = async (leadId, newStatus) => {
    try {
      if (!rowData || rowData.length === 0) {
        console.error("Row data is not available");
        return;
      }
      console.log("Current rowData:", rowData);
      // Ensure that the lead exists and has a valid status
      const leadToUpdate = rowData.find((lead) => lead.id === Number(leadId));

      if (!leadToUpdate || leadToUpdate.status === undefined) {
        console.error(
          `Lead with ID ${leadId} not found or status is undefined`
        );
        return;
      }

      // Update status in the database
      await db
        .update(leadsList)
        .set({ status: newStatus })
        .where({ id: leadId });

      // Update the row data locally
      const updatedLeads = rowData.map((lead) =>
        lead.id === leadId ? { ...lead, status: newStatus } : lead
      );
      setRowData(updatedLeads);
    } catch (error) {
      console.error("Error updating lead status:", error);
    }
  };

  const handleRowSelection = (event) => {
    const selected = event.api.getSelectedRows();
    setSelectedRows(selected);
  };

  var filterParams = {
    comparator: (filterLocalDateAtMidnight, cellValue) => {
      var dateAsString = cellValue;
      if (dateAsString == null) return -1;
      var dateParts = dateAsString.split("/");
      var cellDate = new Date(
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
    { field: "name", flex: 1, filter: true, editable: true, minWidth: 150 },

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
      minWidth: 200
      ,
      flex: 1,
      cellRenderer: (params) => (
        <FollowUpStatusTag
          value={params.value}
          leadId={params.data.id}
          
        />
      ),
    },
    { field: "requirement", flex: 1, filter: true, minWidth: 150 },
    { field: "phone_number", flex: 1, editable: true, minWidth: 150 },
    { field: "configuration", flex: 1, filter: true, minWidth: 150 },
    { field: "city", flex: 1, filter: true, minWidth: 150 },
    { field: "possession", flex: 1, filter: true, minWidth: 150 },

    { field: "lead_source", minWidth: 150, flex: 1 },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: true,
    };
  }, []);
  return (
    <div className="my-7">
      <div
        className="ag-theme-quartz" // applying the Data Grid theme
        style={{ height: "auto", width: "100%" }} // the Data Grid will fill the size of the parent container
      >
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm">
          <Search />
          <input
            type="text"
            placeholder="Search on Anything"
            className="outline-none w-full"
            onChange={(event) => setsearchInput(event.target.value)}
          ></input>
        </div>
        <AgGridReact
          rowData={rowData}
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
          columnDefs={colDefs}
          quickFilterText={searchInput}
          pagination={pagination}
          paginationPageSize={paginationPageSize}
          paginationPageSizeSelector={paginationPageSizeSelector}
          domLayout="autoHeight"
          onSelectionChanged={handleRowSelection}
        />
      </div>
    </div>
  );
}

export default LeadsListTable;
