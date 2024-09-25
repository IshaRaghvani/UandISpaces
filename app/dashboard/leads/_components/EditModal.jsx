// components/EditModal.jsx
import { Button } from "@/components/ui/button";
import { Cross, CrossIcon, Delete, Edit2, EyeIcon, X } from "lucide-react";
import React from "react";
import { Modal } from "@mui/material";

const EditModal = ({ isVisible, onClose, selectedRows }) => {
  if (!isVisible) return null;

  const handleEdit = () => {
    console.log("Edit button clicked");
    console.log("Selected rows:", selectedRows);
  };

  const handleDelete = () => {
    console.log("Delete button clicked");
    console.log("Selected rows:", selectedRows);
  };

  const handleView = () => {
    console.log("View button clicked");
    console.log("Selected rows:", selectedRows);
  };

  return (
    
    <div className="fixed bottom-10 w-[80%] items-center rounded-lg bg-white shadow-lg p-4 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Selected Records</h3>
        <button onClick={onClose} className="text-red-500 font-bold"><X/></button>
      </div>
      <div className="flex items-center justify-between">
        <p className="font-medium mb-0">{selectedRows.length} Items Selected</p>
        <div className="flex space-x-4">
          <Button onClick={handleEdit} variant="outline" className="flex items-center space-x-2">
            <Edit2 className="w-4 h-5" />
            <span>Edit</span>
          </Button>
          <Button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2">
            <X className="w-4 h-5" />
            <span>Delete</span>
          </Button>
          <Button variant="outline" onClick={handleView} >
            <EyeIcon className="w-4 h-5" />
            <span>View</span>
          </Button>
        </div>
      </div>
    </div>
    
  );
};

export default EditModal;
