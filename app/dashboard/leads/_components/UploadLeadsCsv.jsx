import React, { useState } from "react";
import Papa from "papaparse";
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
import { Toaster } from "@/components/ui/toaster"
import { LoaderIcon } from "lucide-react";
function UploadLeadsCsv({ onUpload }) {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast(); // Initialize the toast hook
  const [open, setOpen] = useState(false); // For controlling the dialog

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };
  

  const handleUpload = () => {
    if (!csvFile) return;
    setLoading(true);

    Papa.parse(csvFile, {
      header: true,
      complete: function (results) {
        console.log(results.data);
        // Call the onUpload function passed from the parent component
        onUpload(results.data);
        // Show success toast
        toast({
          title: "New Lead Added",
          description: `Lead has been successfully added.`,
        });

        setLoading(false); // Set loading to false after upload
        setOpen(false); // Close the dialog
      },
      error: function (error) {
        console.error("Error parsing CSV:", error);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="bg-blue-500 text-white px-4 py-2 rounded">
          Upload CSV
        </Button>
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
             {loading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              "Upload"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default UploadLeadsCsv;
