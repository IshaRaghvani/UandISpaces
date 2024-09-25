// pages/leadpage.jsx
// "use client";
// import { useState, useEffect, useCallback } from "react";

// // import {
// //   fetchLeads,
// //   updateLeadStatus,
// //   updateFollowUpStatus,
// // } from "@/app/api/leads/route";

// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import Badge from "./_components/Badge";
// import ButtonsGroup from "./_components/ButtonsGroup";
// import { saveAs } from "file-saver";
// import Papa from "papaparse";

// const Leadpage = () => {
//   const [allLeads, setAllLeads] = useState([]);
//   const [hotLeads, setHotLeads] = useState([]);
//   const [closedLeads, setClosedLeads] = useState([]);
//   const [activeTab, setActiveTab] = useState("all");

//   // Fetch all leads from the database
// const fetchAndSetLeads = useCallback(async () => {
//   try {

//     const response = await fetch('/api/leads');
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     // Parse the JSON data
//     const leads = await response.json();
//     console.log(leads);
//     // Update state with fetched leads
//     setAllLeads(leads);

//     // updateFilteredLeads(leads);
//   } catch (error) {
//     console.error('Failed to fetch leads:', error);
//   }
// }, []);

//   // Filter leads based on their status
//   const updateFilteredLeads = (leads) => {
//     setHotLeads(leads.filter((lead) => lead.status.toLowerCase() === "hot"));
//     setClosedLeads(leads.filter((lead) => lead.status.toLowerCase() === "close and win"));
//   };

//   // Handle status update and re-fetch leads
//   const handleStatusUpdate = async (leadId, newStatus) => {
//     try {
//       await updateLeadStatus(leadId, newStatus);
//       fetchAndSetLeads();
//     } catch (error) {
//       console.error("Failed to update lead status:", error);
//     }
//   };

//   // Handle follow-up status update and re-fetch leads
//   const handleFollowUpStatusUpdate = async (leadId, newStatus) => {
//     try {
//       await updateFollowUpStatus(leadId, newStatus);
//       fetchAndSetLeads();
//     } catch (error) {
//       console.error("Failed to update follow-up status:", error);
//     }
//   };

//   useEffect(() => {
//     fetchAndSetLeads();
//   }, [fetchAndSetLeads]);
//   //uploadcsv
//   const handleUploadCsvData = async (csvData) => {
//     try {
//       for (const lead of csvData) {
//         // Check if the row is completely empty
//         const isEmptyRow = Object.values(lead).every(
//           (value) => value === null || value.trim() === ""
//         );

//         // Skip the row if it's completely empty
//         if (isEmptyRow) continue;
//         const phoneNo = lead["Phone No."] ? lead["Phone No."].trim() : null;
//         const formattedDate = lead["Date"] ? formatDate(lead["Date"]) : null;
//         const formattedFollowUpDate = lead["Follow-up Date"]
//           ? formatDate(lead["Follow-up Date"])
//           : null;

//         const mappedLead = {
//           date: formattedDate,
//           name: lead["Name"],
//           phone_number: phoneNo || null,
//           email: lead["Email"] || null,
//           city: lead["City"],
//           configuration: lead["Configuration"],
//           project_name: lead["Project Name"] || null,
//           budget: lead["Budget"] || null,
//           possession: lead["Possession"] || null,
//           requirement: lead["Requirement"] || null,
//           lead_source: lead["Lead Source"],
//           status: lead["Status"],
//           comments: lead["Comments"] || null,
//           follow_up_date: formattedFollowUpDate,
//         };

//         await db.insert(LeadsList).values(mappedLead);
//       }
//       GetAllList();
//     } catch (error) {
//       console.error("Error uploading CSV data:", error);
//     }
//   };

//   //download in csv
//   const handleDownloadCsv = () => {
//     // Determine which leads to export based on the active tab
//     let dataToExport = [];
//     switch (activeTab) {
//       case "all":
//         dataToExport = allLeads;
//         break;
//       case "hot":
//         dataToExport = hotLeads;
//         break;
//       case "closed":
//         dataToExport = closedLeads;
//         break;
//       default:
//         break;
//     }

//     // // Filter out rows that are completely empty
//     // dataToExport = dataToExport.filter((row) =>
//     //   Object.values(row).some((value) => value !== null && value !== "")
//     // );

//     // Convert data to CSV format
//     const csv = Papa.unparse(dataToExport, {
//       header: true,
//       skipEmptyLines: true,
//     });

//     // Save the CSV file
//     const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
//     saveAs(blob, `${activeTab}-leads.csv`);
//   };

//   return (
//     <div className="p-7">
//       <h2 className="font-bold text-2xl mb-6">Leads Management</h2>

//       <Tabs defaultValue="all" className="w-full justify-center" onValueChange={setActiveTab}>
//         <TabsList className="items-start justify-between space-x-2 border-b border-gray-300">
//           <TabsTrigger
//             value="all"
//             className="px-4 py-2 font-medium text-gray-700 border-b-2 border-gray-500 hover:border-gray-500 transition"
//           >
//             All Leads <Badge count={allLeads.length} />
//           </TabsTrigger>
//           <TabsTrigger
//             value="hot"
//             className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
//           >
//             Hot Leads <Badge count={hotLeads.length} />
//           </TabsTrigger>
//           <TabsTrigger
//             value="closed"
//             className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
//           >
//             Closed Leads
//             <Badge count={closedLeads.length} />
//           </TabsTrigger>
//         </TabsList>
//         <div className="flex flex-col items-end pt-2">
//         <ButtonsGroup
//           onUpload={handleUploadCsvData}
//           onDownload={handleDownloadCsv}
//         />
//       </div>
//         <TabsContent value="all">
//           <LeadsListTable
//             data={allLeads}
//             onStatusUpdate={handleStatusUpdate}
//             onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
//           />
//         </TabsContent>
//         <TabsContent value="hot">
//           <LeadsListTable
//             data={hotLeads}
//             onStatusUpdate={handleStatusUpdate}
//             onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
//           />
//         </TabsContent>
//         <TabsContent value="closed">
//           <LeadsListTable
//             data={closedLeads}
//             onStatusUpdate={handleStatusUpdate}
//             onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
//           />
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// };

// export default Leadpage;