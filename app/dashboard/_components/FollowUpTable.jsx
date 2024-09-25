"use client";
import React, { useState, useEffect, useRef , useMemo} from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { Search } from "lucide-react";
import StatusTag from "../leads/_components/StatusTag";
import FollowUpStatusTag from "../leads/_components/FollowUpStatusTag";
import { useRouter } from "next/navigation"; 
import { db } from "@/configs";
import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { format, parseISO } from 'date-fns';
import LeadDetailsModal from "../leads/_components/LeadDetailsModal";

const FollowUpTable = ({ leadsList ,onStatusUpdate ,onFollowUpStatusUpdate}) => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const router = useRouter();
  const [searchInput, setSearchInput] = useState("");
  const [rowData, setRowData] = useState([]);
  const gridApiRef = useRef(null);
  const rowStyle = useMemo(() => ({ background: "#EEEEEE" }), []);
  const [selectedLead, setSelectedLead] = useState(null);
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDialogOpen, setIsDialogOpen] = useState(false); // Define dialog state
const { toast } = useToast(); 

const handleStatusChange = (leadId, newStatus) => {
  if (newStatus.toLowerCase() === 'inactive') {
    setSelectedLead(leadId);
    setIsDialogOpen(true);
  } else {
    onStatusUpdate(leadId, newStatus);
  }
};
const confirmStatusChange = (followUpStatus) => {
  onFollowUpStatusUpdate(selectedLead, followUpStatus);
  setIsDialogOpen(false);
};

  useEffect(() => {
    updateRowData(leadsList);
  }, [leadsList]);

  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        try {
          const leadId = Number(id);
          if (isNaN(leadId)) {
            throw new Error("Invalid lead id");
          }
  
          const res = await fetch(`/api/leads/${leadId}`);
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
  
          const leadData = await res.json();
          if (leadData) {
            setLead(leadData);
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

  const handleLeadUpdate = (updatedLead) => {
    setRowData((prevRowData) =>
      prevRowData.map((lead) => (lead._id === updatedLead._id ? updatedLead : lead))
    );
    setSelectedLead(updatedLead); // Update the selected lead
  };
  

  const handleModalClose = () => {
    setIsModalOpen(false);
    updateRowData(leadsList);
    
  };
  const handleRowClick = async (params) => {
    try {
      const leadId = params.data._id;
      console.log("Lead ID:", leadId);

      const response = await fetch(`/api/leads/${leadId}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch lead details");
      }
  
      const lead = await response.json();
      // console.log("Lead Details:", lead);
      setSelectedLead(lead);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    }
  };
  

  const updateRowData = (data) => {
    const statusPriority = { Hot: 1, Warm: 2, NoReq: 3, Canceled: 4 };
    const followUpStatusPriority = { followedup: 1, pending: 2 }; 

    const sortedData = data.sort((a, b) => {
      // Move "followedup" status to the end of the top 5
      const followUpStatusA = followUpStatusPriority[a.follow_up_status.toLowerCase()] || 3;
      const followUpStatusB = followUpStatusPriority[b.follow_up_status.toLowerCase()] || 3;
      
      if (followUpStatusA !== followUpStatusB) {
        return followUpStatusA - followUpStatusB;
      }
      const dateA = a.follow_up_date;
      const dateB = b.follow_up_date;

      if (dateA === dateB) {
        return (
          (statusPriority[a.status] || 5) - (statusPriority[b.status] || 5)
        );
      }

      return dateA < dateB ? -1 : 1;
    });
    // Move "followedup" leads to the end of the top 5
    const topFive = sortedData.slice(0, 5);
    const rest = sortedData.slice(5);

    const followedUpTopFive = topFive.filter((lead) => lead.follow_up_status.toLowerCase() === 'followedup');
    const nonFollowedUpTopFive = topFive.filter((lead) => lead.follow_up_status.toLowerCase() !== 'followedup');

    setRowData([...nonFollowedUpTopFive, ...followedUpTopFive, ...rest]);

    // setRowData(sortedData);
  };
// //update the status
// Update the status
// const handleStatusUpdate = async (leadId, status) => {
//   try {
//     const response = await fetch('/api/leads/updateStatus', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         leadId,
//         newStatus: status,
//       }),
//     });

//     if (response.ok) {
//       const updatedLead = await response.json();

//       setRowData((prevRowData) =>
//         prevRowData.map((item) =>
//           item.id === leadId ? { ...item, status: updatedLead.status } : item
//         )
//       );

//       if (gridApiRef.current) {
//         const allNodes = gridApiRef.current.api.getRowNodes();
//         const updatedNode = allNodes.find((node) => node.data.id === leadId);
//         if (updatedNode) {
//           gridApiRef.current.api.refreshCells({
//             force: true,
//             columns: ["status"],
//             rowNodes: [updatedNode],
//           });
//         }
//       }
//       onUpdate();
//     } else {
//       console.error("Failed to update status. Response status:", response.status);
//     }
//   } catch (error) {
//     console.error("Error updating status:", error);
//   }
// };

//update the followup status
// Update the follow-up status
// const handleFollowUpdate = async (leadId, follow_up_status) => {
//   try {
//     const response = await fetch('/api/leads/updateFollowUpStatus', {
//       method: 'PATCH',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         leadId,
//         newFollowUpStatus: follow_up_status,
//       }),
//     });

//     if (response.ok) {
//       const updatedLead = await response.json();

//       setRowData((prevRowData) =>
//         prevRowData.map((item) =>
//           item.id === leadId ? { ...item, follow_up_status: updatedLead.follow_up_status } : item
//         )
//       );

//       if (gridApiRef.current) {
//         const allNodes = gridApiRef.current.api.getRowNodes();
//         const updatedNode = allNodes.find((node) => node.data.id === leadId);
//         if (updatedNode) {
//           gridApiRef.current.api.refreshCells({
//             force: true,
//             columns: ["follow_up_status"],
//             rowNodes: [updatedNode],
//           });
//         }
//       }
//       onUpdate();
//     } else {
//       console.error("Failed to update follow-up status. Response status:", response.status);
//     }
//   } catch (error) {
//     console.error("Error updating follow-up status:", error);
//   }
// };


  const colDefs = [
    {
      headerCheckboxSelection: true,
      checkboxSelection: true,
      minWidth: 80,
      flex: 1,
    },
    { field: "name", headerName: "Name", filter: true, minWidth: 150, flex: 1 },
    { field: "project_name", headerName: "Project Name", filter: true, minWidth: 150, flex: 1 },
    {
      field: "status",minWidth: 100, flex: 1,
      cellRenderer: (params) => (
        <StatusTag
          value={params.value}
          leadId={params.data._id}
          onUpdateStatus={onStatusUpdate}
          onStatusChange={(newStatus) => handleStatusChange(params.data._id, newStatus)}
        />
      ),
    },
    {
      field: "follow_up_date",
      headerName: "Follow-Up Date",
      minWidth: 100,
      flex: 1,
      cellRenderer: (params) => {
        const today = format(new Date(), "yyyy-MM-dd");
        const followUpDate = format(parseISO(params.value), "yyyy-MM-dd");
        const followUpStatus = params.data.follow_up_status;
    
        if (followUpDate === today) {
          if (followUpStatus.toLowerCase() === "followed up") {
            // Display DONE if the follow-up status is "Followed Up" and the date is today
            return <span className="text-green-500 font-bold">DONE</span>;
          }
          // Display TODAY in red if the follow-up date is today
          return <span className="text-red-500 font-bold">TODAY</span>;
        } else if (followUpDate < today) {
          // Display past dates in gray
          return <span className="text-gray-500">{followUpDate}</span>;
        } else {
          // Display future dates in blue
          return <span>Tomorrow</span>;
        }
      },
    },
    { field: "requirement", flex: 1, filter: true, minWidth: 150 },
    { field: "phone_number", minWidth: 150, flex: 1 },
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
      field: "update",
      headerName: "Update",
    },
  ];

  const onGridReady = (params) => {
    gridApiRef.current = params.api;
  };
  const getRowStyle = useMemo(
    () => (params) => {
      if (params.node.rowIndex % 2 === 0) {
        return { background: "white" };
      }
      return null;
    },
    []
  );

  return (
    <div className="my-4 p-6">
      <div className="ag-theme-quartz" style={{ height: 400, width: "100%" }}>
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
          rowData={rowData}
          columnDefs={colDefs}
          quickFilterText={searchInput}
          rowSelection="multiple"
          onRowClicked={handleRowClick}
          onGridReady={onGridReady}
          rowStyle={rowStyle}
          getRowStyle={getRowStyle}
        />
      </div>
      <LeadDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        lead={selectedLead}
        onLeadUpdate={handleLeadUpdate}
      />
    </div>
  );
};

export default FollowUpTable;
