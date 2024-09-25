"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useTheme } from "next-themes";
import FollowUpTable from "./_components/FollowUpTable"; // Import FollowUpTable
import { format, parseISO, isValid } from "date-fns";
import DashboardCards from "./_components/DashboardCards";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Badge from "./leads/_components/Badge";

function Dashboard() {
  const { setTheme } = useTheme();
  const [allLeads, setAllLeads] = useState([]);
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalHotLeads, setTotalHotLeads] = useState(0);
  const [todaysLeads, setTodaysLeads] = useState(0);
  const [followUpStatusData, setFollowUpStatusData] = useState([]);

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  const fetchLeadsData = useCallback(async () => {
    try {
      const res = await fetch("/api/leads");
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      const leadsData = await res.json();

      setTotalLeads(leadsData.length);

      const hotLeadsFiltered = leadsData.filter(
        (lead) => lead.status.toLowerCase() === "hot"
      );
      setTotalHotLeads(hotLeadsFiltered.length);

      const today = format(new Date(), "yyyy-MM-dd");
      const tomorrow = format(
        new Date(new Date().setDate(new Date().getDate() + 1)),
        "yyyy-MM-dd"
      );

      const todaysLeadsCount = leadsData.filter((lead) => {
        if (lead.follow_up_date && isValid(parseISO(lead.follow_up_date))) {
          const followUpDate = format(
            parseISO(lead.follow_up_date),
            "yyyy-MM-dd"
          );
          return followUpDate === today;
        }
        return false;
      });
      setTodaysLeads(todaysLeadsCount.length);

      const filteredLeads = leadsData.filter((lead) => {
        if (lead.follow_up_date && isValid(parseISO(lead.follow_up_date))) {
          const followUpDate = format(
            parseISO(lead.follow_up_date),
            "yyyy-MM-dd"
          );
          return followUpDate === today;
        }
        return false;
      });

      const statusPriority = { Hot: 1, Warm: 2, NoReq: 3 };

      const sortedLeads = filteredLeads.sort((a, b) => {
        const dateA = format(parseISO(a.follow_up_date), "yyyy-MM-dd");
        const dateB = format(parseISO(b.follow_up_date), "yyyy-MM-dd");

        if (dateA === dateB) {
          return (
            (statusPriority[a.status] || 4) - (statusPriority[b.status] || 4)
          );
        }

        return dateA < dateB ? -1 : 1;
      });

      setLeadsList(sortedLeads);

      const followUpStatusCounts = filteredLeads.reduce((acc, lead) => {
        const status = lead.follow_up_status || "Unknown";
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      const followUpStatusData = Object.keys(followUpStatusCounts).map(
        (status) => ({
          category: status,
          count: followUpStatusCounts[status],
        })
      );
      setFollowUpStatusData(followUpStatusData);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeadsData();
  }, [fetchLeadsData]);

  const handleStatusUpdate = async (leadId, newStatus) => {
    console.log("Sending leadId:", leadId, "with newStatus:", newStatus);
    setLeadsList((prevLeads) =>
      prevLeads.map((lead) =>
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

      // // Re-fetch data or update state to reflect changes
      // fetchLeadsData();
    } catch (error) {
      console.error("Failed to update lead status:", error);
      setLeadsList((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId ? { ...lead, status: lead.previousStatus } : lead
        )
      );
    }
  };

  const handleFollowUpStatusUpdate = async (leadId, newFollowUpStatus) => {
    setLeadsList((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === leadId
          ? { ...lead, follow_up_status: newFollowUpStatus }
          : lead
      )
      
    );
    console.log("updated");
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

      // // Re-fetch data or update state to reflect changes
      // fetchLeads();
    } catch (error) {
      console.error("Failed to update lead follow up status:", error);
      // Revert the optimistic update if the API call fails
      setLeadsList((prevLeads) =>
        prevLeads.map((lead) =>
          lead._id === leadId
            ? { ...lead, follow_up_status: lead.previousFollowUpStatus }
            : lead
        )
      );
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6">
      <Tabs defaultValue="leadManagement" className="w-full">
        <TabsList className="items-start border-b border-gray-300">
          <TabsTrigger
            value="leadManagement"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-gray-500 hover:border-gray-700 transition"
          >
            Lead Management
          </TabsTrigger>
          <TabsTrigger
            value="analytics"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Analytics
          </TabsTrigger>
        </TabsList>
        <TabsContent value="leadManagement">
          <h1 className="text-2xl font-bold mb-4 mt-4">Welcome Back!</h1>
          <div className="pb-2 pt-6 ">
            <h2 className="text-2xl font-bold pt-4">Today's Follow ups <Badge count={todaysLeads}/></h2>
            {/* <DashboardCards
              totalLeads={totalLeads}
              hotLeads={totalHotLeads}
              todaysLeads={todaysLeads}
              followUpStatusData={followUpStatusData}
            /> */}
            <FollowUpTable
              leadsList={leadsList}
              onStatusUpdate={handleStatusUpdate}
              onFollowUpStatusUpdate={handleFollowUpStatusUpdate}
            />
          </div>
        </TabsContent>
        <TabsContent value="analytics">
          <h2 className="text-2xl font-bold pt-4">Analytics Overview</h2>
          <div className="pt-8">
            <DashboardCards
              totalLeads={totalLeads}
              hotLeads={totalHotLeads}
              todaysLeads={todaysLeads}
              followUpStatusData={followUpStatusData}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Dashboard;
