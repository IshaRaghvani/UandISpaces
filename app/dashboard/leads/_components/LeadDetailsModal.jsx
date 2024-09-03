// LeadDetailsModal.jsx
import React from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  
 // Import CSS module if needed

const LeadDetailsModal = ({ isOpen, onClose, lead }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent >
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
          <SheetDescription>Here are the details of the lead.</SheetDescription>
          <button  onClick={onClose}>
            &times;
          </button>
        </SheetHeader>
        <div >
          <p><strong>Name:</strong> {lead?.name}</p>
          <p><strong>Phone Number:</strong> {lead?.phone_number}</p>
          <p><strong>Email:</strong> {lead?.email}</p>
          <p><strong>City:</strong> {lead?.city}</p>
          <p><strong>Configuration:</strong> {lead?.configuration}</p>
          <p><strong>Project Name:</strong> {lead?.project_name}</p>
          <p><strong>Budget:</strong> {lead?.budget}</p>
          <p><strong>Possession:</strong> {lead?.possession}</p>
          <p><strong>Requirement:</strong> {lead?.requirement}</p>
          <p><strong>Lead Source:</strong> {lead?.lead_source}</p>
          <p><strong>Status:</strong> {lead?.status}</p>
          <p><strong>Comments:</strong> {lead?.comments}</p>
          <p><strong>Follow-Up Date:</strong> {lead?.follow_up_date}</p>
          <p><strong>Follow-Up Status:</strong> {lead?.follow_up_status}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailsModal;
