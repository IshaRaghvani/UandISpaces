import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define a mapping for follow-up status to colors and styles
const followUpStatusStyles = {
  "to be followed up": "bg-opacity-40 bg-orange-400 text-bold text-orange-600",
  "followed up": "bg-opacity-40 bg-green-400 text-bold text-green-600",
  later: "bg-opacity-40 bg-yellow-400 text-bold text-yellow-600",
  "did not pick up": "bg-opacity-40 bg-red-400 text-bold text-red-600",
  canceled: "bg-opacity-40 bg-gray-400 text-bold text-gray-600",
};

const FollowUpStatusTag = ({ value, leadId, onUpdateFollowUpStatus }) => {
  if (!value) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm border bg-gray-200 text-black border-gray-200">
        Unknown Status
      </div>
    );
  }
  
  const normalizedValue = value.toLowerCase();
  const style =
    followUpStatusStyles[normalizedValue] || "bg-gray-200 text-black border-gray-200";

  const handleFollowUpStatusChange = (status) => {
    onUpdateFollowUpStatus(leadId, status); // Call the function passed from the parent
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={`inline-flex items-center px-3 py-1 rounded-lg text-sm border ${style}`}>
          <div
            className={`w-2 h-2 rounded-full ${style}`}
            style={{ backgroundColor: style.split(' ')[1] }}
          ></div>
          <span className="ml-2">{value.charAt(0).toUpperCase() + value.slice(1)}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 right-0 top-0">
          <DropdownMenuLabel>Update Follow-Up Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.keys(followUpStatusStyles).map((status) => (
            <DropdownMenuItem
              key={status}
              className={`cursor-pointer px-3 py-1 rounded-lg text-sm border m-2 ${followUpStatusStyles[status]}`}
              onClick={() => handleFollowUpStatusChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default FollowUpStatusTag;
