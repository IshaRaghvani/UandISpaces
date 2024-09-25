import React from "react";
import { Button } from "@/components/ui/button";
import AddNewLead from "./AddNewLead";
import UploadLeadsCsv from "./UploadLeadsCsv";

function ButtonsGroup({ onUpload, onDownload ,fetchLeads  }) {
  return (
    <div className="flex space-x-4">
      <AddNewLead onAddSuccess={fetchLeads}/>
      <UploadLeadsCsv onUploadSuccess={onUpload} />
      <Button
        className="bg-green-700 text-white px-4 py-2 rounded"
        onClick={onDownload}
      >
        Download CSV
      </Button>
    </div>
  );
}

export default ButtonsGroup;
