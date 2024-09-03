"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import FollowUpTable from "./_components/FollowUpTable"; // Import FollowUpTable
import { db } from "@/configs";
import { LeadsList } from "@/configs/schema";
import { desc } from "drizzle-orm";
import { format, parseISO, isValid } from "date-fns";
import DashboardCards from "./_components/DashboardCards";

function Dashboard() {
  const { setTheme } = useTheme();
  const [leadsList, setLeadsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalLeads, setTotalLeads] = useState(0);
  const [totalHotLeads, setTotalHotLeads] = useState(0);
  const [todaysLeads, setTodaysLeads] = useState(0);

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const res = await db
          .select()
          .from(LeadsList)
          .orderBy(desc(LeadsList.id));
          //total leads

        setTotalLeads(res.length);
        //hot leads
        const hotLeadsFiltered = res.filter((lead) => lead.status === "Hot");
        setTotalHotLeads(hotLeadsFiltered.length);


        //leads for today and tomorrow
        const today = format(new Date(), "yyyy-MM-dd");
        const tomorrow = format(
          new Date(new Date().setDate(new Date().getDate() + 1)),
          "yyyy-MM-dd"
        );

        const filteredLeads = res.filter((lead) => {
          if (lead.follow_up_date && isValid(parseISO(lead.follow_up_date))) {
            const followUpDate = format(
              parseISO(lead.follow_up_date),
              "yyyy-MM-dd"
            );
            return followUpDate === today || followUpDate === tomorrow;
          }
          return false;
        });
        // Set the count of today's leads
        setTodaysLeads(filteredLeads.length);
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
      } catch (error) {
        console.error("Error fetching leads:", error);
      } finally {
        setLoading(false); // Ensure loading state is set to false after fetching
      }
    };

    fetchLeads();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display loading message while fetching
  }

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-4">Welcome Back!</h1>
      <div className="pb-2">
        <DashboardCards totalLeads={totalLeads} hotLeads={totalHotLeads} todaysLeads={todaysLeads} />
      </div>
      <h2 className="text-2xl font-bold pt-4">Today's Follow ups</h2>
      <FollowUpTable leadsList={leadsList} />{" "}
      
    </div>
  );
}

export default Dashboard;
