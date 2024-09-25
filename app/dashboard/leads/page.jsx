"use client";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LeadsListTable from "./_components/LeadsListTable";
import Badge from "./_components/Badge";
import ButtonsGroup from "./_components/ButtonsGroup";
import { useMemo } from "react";

const Leadpage = () => {
  const [leads, setLeads] = useState([]);
  const [error, setError] = useState(null);
  const [allLeads, setAllLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [hotLeads, setHotLeads] = useState([]);
  const [closedLeads, setClosedLeads] = useState([]);
  const [inactiveLeads, setInactiveLeads] = useState([]);
  const [openLeads, setOpenLeads] = useState([]);

  // Fetch all leads from the database
  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch("/api/leads");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const leadsData = await response.json();
      leadsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by 'createdAt'
      // Check if the leads have actually changed before updating the state
    if (JSON.stringify(leadsData) !== JSON.stringify(allLeads)) {
      setAllLeads(leadsData);
      updateFilteredLeads(leadsData);
    }
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      setError(error.message);
    }
  };

  // Filter leads based on their status
  const updateFilteredLeads = (leads) => {
    setHotLeads(leads.filter((lead) => lead.status.toLowerCase() === "hot"));
    setClosedLeads(leads.filter((lead) => lead.status.toLowerCase() === "close and win"));
    setInactiveLeads(leads.filter((lead) => lead.status.toLowerCase() === "inactive"));
    setOpenLeads(leads.filter((lead) => lead.status.toLowerCase() === "open"));
  };

  const handleStatusUpdate = async (leadId, newStatus) => {
    setAllLeads(prevLeads => 
      prevLeads.map(lead => 
        lead._id === leadId ? { ...lead, status: newStatus } : lead
      )
    );
    try {
      const response = await fetch("/api/leads/updateStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId, newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead status");
      }

      const updatedLead = await response.json();
      // setAllLeads(prevLeads =>
      //   prevLeads.map(lead =>
      //     lead._id === leadId ? updatedLead : lead
      //   )
      // );
      // updateFilteredLeads(allLeads);
    } catch (error) {
      console.error("Failed to update lead status:", error);
    }
  };

  const handleFollowUpStatusUpdate = async (leadId, newFollowUpStatus) => {
    setAllLeads(prevLeads => 
      prevLeads.map(lead => 
        lead._id === leadId ? { ...lead, followUpStatus: newFollowUpStatus } : lead
      )
    );
    try {
      const response = await fetch("/api/leads/updateFollowUpStatus", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ leadId, newFollowUpStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update lead follow up status");
      }

      const updatedLead = await response.json();
      // Update the local state with the response if it includes the updated lead
    setAllLeads(prevLeads =>
      prevLeads.map(lead =>
        lead._id === leadId ? updatedLead : lead
      )
    );
      updateFilteredLeads(allLeads); 
    } catch (error) {
      console.error("Failed to update lead follow up status:", error);
    }
  };

  const handleDownloadCsv = () => {
    let dataToExport = [];
    switch (activeTab) {
      case "all":
        dataToExport = allLeads;
        break;
      case "hot":
        dataToExport = hotLeads;
        break;
      case "closed":
        dataToExport = closedLeads;
        break;
      default:
        break;
    }

    // Filter out empty rows and convert to CSV
    dataToExport = dataToExport.filter((row) =>
      Object.values(row).some((value) => value !== null && value !== "")
    );

    const csv = Papa.unparse(dataToExport, {
      header: true,
      skipEmptyLines: true,
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${activeTab}-leads.csv`);
  };

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl mb-6">Leads Management</h2>

      <Tabs
        defaultValue="all"
        className="w-full justify-center"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="items-start justify-between space-x-2 border-b border-gray-300">
          <TabsTrigger
            value="all"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-gray-500 hover:border-gray-500 transition"
          >
            All Leads <Badge count={allLeads.length} />
          </TabsTrigger>
          <TabsTrigger
            value="open"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Open Leads <Badge count={openLeads.length} />
          </TabsTrigger>
          <TabsTrigger
            value="hot"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Hot Leads <Badge count={hotLeads.length} />
          </TabsTrigger>
          <TabsTrigger
            value="closed"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Closed Leads <Badge count={closedLeads.length} />
          </TabsTrigger>
          <TabsTrigger
            value="inactive"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Inactive Leads <Badge count={inactiveLeads.length} />
          </TabsTrigger>
        </TabsList>

        <div className="flex flex-col items-end pt-2">
          <ButtonsGroup onDownload={handleDownloadCsv} onUpload={fetchLeads} onAddSuccess={fetchLeads} />
        </div>

        <TabsContent value="all">
          <LeadsListTable
            data={allLeads}
            onStatusUpdate={handleStatusUpdate}
            onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
          />
        </TabsContent>
        <TabsContent value="open">
          <LeadsListTable
            data={openLeads}
            onStatusUpdate={handleStatusUpdate}
            onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
          />
        </TabsContent>
        <TabsContent value="hot">
          <LeadsListTable
            data={hotLeads}
            onStatusUpdate={handleStatusUpdate}
            onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
          />
        </TabsContent>
        <TabsContent value="closed">
          <LeadsListTable
            data={closedLeads}
            onStatusUpdate={handleStatusUpdate}
            onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
          />
        </TabsContent>
        <TabsContent value="inactive">
          <LeadsListTable
            data={inactiveLeads}
            onStatusUpdate={handleStatusUpdate}
            onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Leadpage;
