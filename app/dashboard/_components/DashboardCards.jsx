import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DonutChart from "./DonutChart"

function DashboardCards({
  totalLeads,
  hotLeads,
  todaysLeads,
  followUpStatusData,
}) {
  const cards = [
    {
      title: "TOTAL LEADS",
      value: totalLeads,
      color: "text-blue-600",
    },
    {
      title: "HOT LEADS",
      value: hotLeads,
      color: "text-red-600",
    },
    {
      title: "TODAY'S FOLLOWUPS",
      value: todaysLeads,
      color: "text-green-600",
    },
    {
      title: "NEW LEADS",
      value: 15,
      color: "text-purple-600",
    },
  ];

  return (
    <div className="flex flex-col p-4 gap-4">
      {/* Top Section: Cards */}
      <div className="flex flex-col lg:flex-row gap-8 mb-4">
        {/* Left Side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 w-full lg:w-3/4">
          {cards.map((card, index) => (
            <Card
              key={index}
              className="bg-opacity-40 text-black border-gray-200 shadow-sm"
              style={{ height: "170px" }}
            >
              <CardHeader>
                <CardTitle className={`font-semibold text-md ${card.color}`}>
                  {card.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-3xl">{card.value}</CardTitle>
                <hr className="border-t border-gray-300 my-4" />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Right Side */}
        <div className="flex flex-col lg:flex-row gap-4 w-full lg:w-[300]">
          <Card className="flex-1 bg-opacity-40 text-black border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-semibold text-md">
                Follow-Up Status
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              {/* <DonutChart data={followUpStatusData} /> */}
            </CardContent>
          </Card>
          <Card className="flex-1 bg-opacity-40 text-black border-gray-200 shadow-sm">
            <CardHeader>
              <CardTitle className="font-semibold text-md">Graphs</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-center h-full">
              {/* Add graph content here */}
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Bottom Section: Graphs 2 */}
      <div className="w-full">
        {/* <Card className="w-full bg-opacity-40 text-black border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="font-semibold text-md">Graphs 2</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center h-full">
           
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

export default DashboardCards;
