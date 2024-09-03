import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define a mapping for status to pastel colors and border styles
const statusStyles = {
  warm: " bg-opacity-40 bg-yellow-400 text-bold text-yellow-600",
  open: " bg-opacity-40 bg-blue-400 text-bold text-blue-600",
  hot: "bg-opacity-40 bg-rose-400 text-bold text-red-600",
  "no requirement": " bg-opacity-40 bg-purple-400 text-bold text-purple-700 ",
  "close and win": "bg-opacity-40 bg-green-400 text-bold text-green-600",
};

const StatusTag = ({ value, leadId, onUpdateStatus }) => {
 
  if (!value) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-lg text-sm border bg-gray-200 text-black border-gray-200">
        Unknown Status
      </div>
    );
  }
  const normalizedValue = value.toLowerCase();
  const style =
    statusStyles[normalizedValue] || "bg-gray-200 text-black border-gray-200";

  const handleStatusChange = (status) => {
    onUpdateStatus(leadId, status); // Call the function passed from the parent
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger className={`inline-flex items-center px-3 py-1 rounded-lg text-sm border ${style}`}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="p-2 right-0 top-0">
          <DropdownMenuLabel>Update Status</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {Object.keys(statusStyles).map((status) => (
            <DropdownMenuItem
              key={status}
              className={`cursor-pointer px-3 py-1 rounded-lg text-sm border m-2 ${statusStyles[status]}`}
              onClick={() => handleStatusChange(status)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatusTag;
