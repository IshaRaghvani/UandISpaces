"use client";
import React, { useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatusTag from "../leads/_components/StatusTag";
import FollowUpStatusTag from "../leads/_components/FollowUpStatusTag";
const FollowUpTable = ({ leadsList }) => {
  const pagination = true;
  const paginationPageSize = 50;
  const paginationPageSizeSelector = [50, 100, 150];

  const [searchInput, setSearchInput] = useState("");
  const [rowData, setRowData] = useState(leadsList);
  // Custom Buttons Component for actions
  const CustomButtons = (props) => (
    <Button variant="destructive">
      <Trash />
    </Button>
  );
  // Use effect to update rowData when leadsList changes
  useEffect(() => {
    updateRowData(leadsList);
  }, [leadsList]);

  

  // Function to update and sort rowData
  const updateRowData = (data) => {
    const statusPriority = { Hot: 1, Warm: 2, NoReq: 3, Canceled: 4 };

    const sortedData = data.sort((a, b) => {
      const dateA = a.follow_up_date;
      const dateB = b.follow_up_date;

      if (dateA === dateB) {
        return (
          (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5)
        );
      }

      return dateA < dateB ? -1 : 1;
    });

    setRowData(sortedData);
  };
  // Function to handle status change from dropdown
  const handleStatusChange = (id, newStatus) => {
    const updatedData = rowData.map((row) =>
      row.id === id ? { ...row, follow_up_status: newStatus } : row
    );
    updateRowData(updatedData);
  };
 
  // Column definitions
  const colDefs = [
    {
      
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 100,
      flex:1,
      
      
    },
    { field: "name", headerName: "Name", filter: true , minWidth: 150,flex:1},
    { field: "project_name", headerName: "Project Name", filter: true, minWidth: 150,flex:1 },
    { field: "status", cellRenderer: StatusTag,flex:1, minWidth: 150 },
    { field: "follow_up_date", headerName: "Follow-Up Date", filter: true , minWidth: 150,flex:1},
    { field: "requirement", flex: 1,filter: true, minWidth: 150 },
    { field: "phone_number", minWidth: 150,flex:1 },
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
    {
      field: "update",
      headerName: "Update",
      
    },
  ];

  

  return (
    <div className="my-4 p-6">
      <div className="ag-theme-quartz" style={{ height: 400, width:["100%"] }}>
        <div className="p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm ">
          <Search />
          <input
            type="text"
            placeholder="Search on Anything"
            className="outline-none w-full"
            onChange={(event) => setSearchInput(event.target.value)}
          />
        </div>
        <AgGridReact
          rowData={rowData} // Using the sorted and updated data
          columnDefs={colDefs}
          quickFilterText={searchInput}
          rowSelection={"multiple"}
         
          
          
        />
      </div>
    </div>
  );
};

export default FollowUpTable;
