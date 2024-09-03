"use client";
import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import AddNewLead from "./_components/AddNewLead";
import UploadLeadsCsv from "./_components/UploadLeadsCsv";
import LeadsListTable from "./_components/LeadsListTable";
import { db } from "@/configs";
import { LeadsList } from "@/configs/schema";
import { desc } from "drizzle-orm";
import { Button } from "@/components/ui/button";
import { saveAs } from "file-saver";
import Papa from "papaparse";
import ButtonsGroup from "./_components/ButtonsGroup"

function LeadsPage() {
  const [leadsList, setLeadsList] = useState([]);
  const [hotLeads, setHotLeads] = useState([]);
  const [closedLeads, setclosedLeads] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [activeTab, setActiveTab] = useState("manageLeads");

  useEffect(() => {
    GetAllList();
  }, []);

  const GetAllList = async () => {
    try {
      const res = await db.select().from(LeadsList).orderBy(desc(LeadsList.id));
      setLeadsList(res);
      filterHotLeads(res);
      filterclosedLeads(res);
    } catch (error) {
      console.error("Error fetching leads:", error);
    }
  };

  const filterHotLeads = (leads) => {
    const hotLeadsFiltered = leads.filter((lead) => lead.status === "Hot");
    setHotLeads(hotLeadsFiltered);
  };
  const filterclosedLeads = (leads) => {
    const closedLeadsFiltered = leads.filter(
      (lead) => lead.status === "Close and Win"
    );
    setclosedLeads(closedLeadsFiltered);
  };
  // upload csv
  const handleUploadCsvData = async (csvData) => {
    try {
      for (const lead of csvData) {
        const phoneNo = lead["Phone No."] ? lead["Phone No."].trim() : null;
        const formattedDate = lead["Date"] ? formatDate(lead["Date"]) : null;
        const formattedFollowUpDate = lead["Follow-up Date"]
          ? formatDate(lead["Follow-up Date"])
          : null;

        const mappedLead = {
          date: formattedDate,
          name: lead["Name"],
          phone_number: phoneNo || null,
          email: lead["Email"] || null,
          city: lead["City"],
          configuration: lead["Configuration"],
          project_name: lead["Project Name"] || null,
          budget: lead["Budget"] || null,
          possession: lead["Possession"] || null,
          requirement: lead["Requirement"] || null,
          lead_source: lead["Lead Source"],
          status: lead["Status"],
          comments: lead["Comments"] || null,
          follow_up_date: formattedFollowUpDate,
        };

        await db.insert(LeadsList).values(mappedLead);
      }
      GetAllList();
    } catch (error) {
      console.error("Error uploading CSV data:", error);
    }
  };
  //download in csv
  const handleDownloadCsv = () => {
    // Determine which leads to export based on the active tab
    let dataToExport = [];
    switch (activeTab) {
      case "manageLeads":
        dataToExport = leadsList;
        break;
      case "hotLeads":
        dataToExport = hotLeads;
        break;
      case "closedLeads":
        dataToExport = closedLeads;
        break;
      default:
        break;
    }
    // Convert data to CSV format
    const csv = Papa.unparse(dataToExport, {
      header: true,
      skipEmptyLines: true,
    });
    // Save the CSV file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, `${activeTab}-leads.csv`);
  };

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `20${year}-${month}-${day}`;
  };

  return (
    <div className="p-7">
      <h2 className="font-bold text-2xl mb-6">Leads Management</h2>
      <Tabs
        defaultValue="manageLeads"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="flex space-x-2 border-b border-gray-300">
          <TabsTrigger
            value="manageLeads"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Manage Leads
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {leadsList.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="hotLeads"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Hot Leads
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              {hotLeads.length}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="closedLeads"
            className="px-4 py-2 font-medium text-gray-700 border-b-2 border-transparent hover:border-gray-500 transition"
          >
            Closed and Won
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              {closedLeads.length}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="manageLeads" className="mt-4">
          <div className="flex flex-col">
            <ButtonsGroup
              onUpload={handleUploadCsvData}
              onDownload={handleDownloadCsv}
            />
            <LeadsListTable
              leadsList={leadsList}
              setSelectedLeads={setSelectedLeads}
            />
          </div>
        </TabsContent>

        <TabsContent value="hotLeads" className="mt-4">
          <ButtonsGroup
            onUpload={handleUploadCsvData}
            onDownload={handleDownloadCsv}
          />
          <LeadsListTable
            leadsList={hotLeads}
            setSelectedLeads={setSelectedLeads}
          />
        </TabsContent>

        <TabsContent value="closedLeads" className="mt-4">
          <ButtonsGroup
            onUpload={handleUploadCsvData}
            onDownload={handleDownloadCsv}
          />
          <LeadsListTable
            leadsList={closedLeads}
            setSelectedLeads={setSelectedLeads}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default LeadsPage;
