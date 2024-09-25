import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define a mapping for follow-up status to dot colors
const followUpDotStyles = {
  "to be followed up": "bg-orange-400",
  "followed up": "bg-green-400",
  later: "bg-yellow-400",
  "did not pick up": "bg-red-400",
  canceled: "bg-gray-400",
  "no requirement": "bg-blue-400",
  "wrong number": "bg-purple-400",
  "request cancelled": "bg-pink-400",
  "let go": "bg-teal-400",
  "close and lost": "bg-gray-600",
};

// Status mapping to follow-up options
const followUpOptions = {
  active: ["followed up", "did not pick up", "later"],
  inactive: [
    "no requirement",
    "wrong number",
    "request cancelled",
    "let go",
    "close and lost",
  ],
};

const FollowUpStatusTag = ({
  value,
  leadId,
  leadStatus,
  onUpdateFollowUpStatus,
}) => {
  
  if (!value) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm border bg-gray-200 text-black border-gray-200">
        Unknown Status
      </div>
    );
  }

  const normalizedValue = value.toLowerCase();
  const dotStyle = followUpDotStyles[normalizedValue] || "bg-gray-200";

  // Determine which follow-up options to display based on lead status
  const currentOptions =
    leadStatus === "inactive"
      ? followUpOptions.inactive
      : followUpOptions.active;
  
  const handleFollowUpStatusChange = (status) => {
    onUpdateFollowUpStatus(leadId, status); // Call the function passed from the parent
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center px-3 py-1 rounded-lg text-sm border bg-white text-black border-gray-200">
          <div className={`w-2 h-2 rounded-full ${dotStyle}`}></div>
          <span className="ml-2">
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 right-0 top-0">
          <DropdownMenuLabel>Update Follow-Up Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {currentOptions.map((status) => (
            <DropdownMenuItem
              key={status}
              className="cursor-pointer px-3 py-1 rounded-lg text-sm border m-2"
              onClick={() => handleFollowUpStatusChange(status)}
            >
              <div className="inline-flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${followUpDotStyles[status]}`}
                ></div>
                <span className="ml-2">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FollowUpStatusTag;
