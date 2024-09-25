import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoaderIcon } from "lucide-react";

function UploadLeadsCsv({ onUploadSuccess }) {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!csvFile) return;
    setLoading(true);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch("/api/leads/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload CSV data");
      }

      const result = await response.json();
      toast({
        title: "New Leads Added",
        description: `${result.updatedLeads.length} leads have been successfully added.`,
      });
      // Call the function to refetch leads
      if (onUploadSuccess) {
        onUploadSuccess();
      }

    } catch (error) {
      console.error("Error uploading CSV data:", error);
      toast({
        title: "Upload Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span className="bg-blue-500 font-medium text-white px-4 py-2 rounded">
          Upload CSV
        </span>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Leads CSV</DialogTitle>
          <DialogDescription>
            Select a CSV file to upload leads to the database. The data will be processed and added to the leads list.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <input type="file" accept=".csv" onChange={handleFileChange} />
          <Button
            onClick={handleUpload}
            className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            disabled={loading}
          >
            {loading ? <LoaderIcon className="animate-spin" /> : "Upload"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadLeadsCsv;
