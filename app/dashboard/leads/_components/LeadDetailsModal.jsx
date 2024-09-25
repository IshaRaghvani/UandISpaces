"use client";
import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { formatDistanceToNow, parseISO } from "date-fns";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import FollowUpStatusTag from "./FollowUpStatusTag";
import StatusTag from "./StatusTag";
import { ChevronsLeft } from "lucide-react";
import { format } from "date-fns";
import Badge from "./Badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const LeadDetailsModal = ({ isOpen, onClose, lead, onLeadUpdate }) => {
  const [selectedTab, setSelectedTab] = useState("update");
  const [followUpDate, setFollowUpDate] = useState(lead?.follow_up_date || "");
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState(null);

  const [updatedStatus, setUpdatedStatus] = useState(lead?.status);
  const [updatedFollowUpStatus, setUpdatedFollowUpStatus] = useState(
    lead?.follow_up_status
  );
  const router = useRouter();

  const handleViewMoreDetails = () => {
    if (lead?._id) {
      router.push(`/dashboard/leads/${lead._id}`);
    }
  };

  // Effect to update local state when lead changes
  useEffect(() => {
    if (lead) {
      setFollowUpDate(lead.follow_up_date);
      setUpdatedStatus(lead.status);
      setUpdatedFollowUpStatus(lead.follow_up_status);
    }
  }, [lead]);

  const createdAtDate = lead?.created_at
    ? parseISO(lead.created_at)
    : new Date();
  const daysAgo = formatDistanceToNow(createdAtDate, { addSuffix: true });
  const leadId = lead?._id;

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setFollowUpDate(newDate);
    updateLeadDetailsById({ followUpDate: newDate });
    handleFollowUpDateUpdate(newDate); // Call the function to update the follow-up date
  };
  // Function to update lead details by ID
  const updateLeadDetailsById = async (updateData, leadId) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update lead details");
      }

      // Fetch updated lead data
      const updatedLeadResponse = await fetch(`/api/leads/${leadId}`);
      if (!updatedLeadResponse.ok) {
        throw new Error("Failed to fetch updated lead data");
      }

      const updatedLead = await updatedLeadResponse.json();
      onLeadUpdate(updatedLead); // Update the lead data in the parent component
    } catch (error) {
      setError(error.message);
    }
  };
  const handleFollowUpDateUpdate = async (date) => {
    try {
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, followUpDate: date }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update follow-up date");
      }

      // Log success message to the console
      console.log(
        `Successfully updated follow-up date to ${date} for lead ID: ${leadId}`
      );

      const updatedLeadResponse = await fetch(`/api/leads/${leadId}`);
      if (!updatedLeadResponse.ok) {
        throw new Error("Failed to fetch updated lead data");
      }

      const updatedLead = await updatedLeadResponse.json();
      setFollowUpDate(updatedLead.follow_up_date);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Avoid adding empty comments

    try {
      // POST request to add a new comment
      const response = await fetch(`/api/leads/${leadId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentText: newComment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add comment");
      }

      await updateLeadDetailsById({ commentText: newComment }, leadId);

      const updatedLead = await updatedLeadResponse.json();
      onLeadUpdate(updatedLead); // Update the lead state with the new data
      setNewComment(""); // Clear the text box
    } catch (error) {
      setError(error.message);
      3;
    }
  };
  const handleStatusUpdate = async (leadId, newStatus) => {
    setUpdatedStatus(newStatus);
    try {
      const response = await fetch(`/api/leads/updateStatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, newStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      console.log(
        `Successfully updated status to ${newStatus} for lead ID: ${leadId}`
      );

      await updateLeadDetailsById({ status: newStatus }, leadId);

      const updatedLead = await updatedLeadResponse.json();
      onLeadUpdate(updatedLead); // Update the lead state in the parent component
      updateLeadDetailsById({ status: newStatus });
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFollowUpStatusUpdate = async (leadId, newFollowUpStatus) => {
    setUpdatedFollowUpStatus(newFollowUpStatus);
    try {
      await fetch(`/api/leads/updateFollowUpStatus`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leadId, newFollowUpStatus: newFollowUpStatus }),
      });

      console.log(
        `Successfully updated follow-up status to ${newFollowUpStatus} for lead ID: ${leadId}`
      );

      // Fetch the updated lead data
      const updatedLeadResponse = await fetch(`/api/leads/${leadId}`);
      if (!updatedLeadResponse.ok) {
        throw new Error("Failed to fetch updated lead data");
      }

      const updatedLead = await updatedLeadResponse.json();
      onLeadUpdate(updatedLead); // Update the lead state in the parent component
      updateLeadDetailsById({ followUpStatus: newFollowUpStatus });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetTrigger />
      <SheetContent
        side="right"
        className="w-[50vw] sm:max-w-2xl p-6 space-y-6 overflow-y-auto"
      >
        {/* Card 1: Lead Info */}
        <div className="p-4 border rounded-md space-y-4">
          {/* Lead Name and Created Date */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-gray-800">
                {lead?.name}
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <span className="text-green-500 mr-2">●</span>
                Created {daysAgo}
              </div>
            </div>
            {/* View More Details Button */}
            <Button
              variant="outline"
              onClick={handleViewMoreDetails}
              
            >
              View More Details
            </Button>
          </div>

          <div className="flex items-center space-x-4 text-gray-700">
            <span>{lead?.email}</span>
            <span className="border-l h-5" />
            <span>{lead?.phone_number}</span>
            <span className="border-l h-5" />
            <span>{lead?.city}</span>
          </div>

          <div className="flex items-center space-x-4">
            <StatusTag
              value={lead?.status}
              leadId={lead?._id}
              onUpdateStatus={handleStatusUpdate}
              onStatusChange={(newStatus) => handleStatusUpdate(newStatus)}
            />
            <FollowUpStatusTag
              value={lead?.follow_up_status}
              leadId={lead?._id}
              onUpdateFollowUpStatus={handleFollowUpStatusUpdate}
            />
            <span className="text-sm text-gray-500">
              Lead Source: {lead?.lead_source}
            </span>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">
                <strong>Project Name:</strong>
              </p>
              <p className="text-gray-800">{lead?.project_name}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">
                <strong>Configuration:</strong>
              </p>
              <p className="text-gray-800">{lead?.configuration}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">
                <strong>Requirement:</strong>
              </p>
              <p className="text-gray-800">{lead?.requirement}</p>
            </div>
            <div className="flex flex-col">
              <p className="text-sm text-gray-500">
                <strong>Possession:</strong>
              </p>
              <p className="text-gray-800">{lead?.possession_type}</p>
            </div>
          </div>
        </div>

        {/* Card 3: Tabs */}
        <div className="p-2 border rounded-md">
          <Tabs
            defaultValue="update"
            value={selectedTab}
            onValueChange={setSelectedTab}
          >
            <TabsList className="items-start flex border-b border-gray-300 pb-2">
              <TabsTrigger
                value="update"
                className={`relative pb-2 ${
                  selectedTab === "update" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                Update Status
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className={`relative pb-2 ${
                  selectedTab === "details" ? "border-b-2 border-blue-500" : ""
                }`}
              >
                Logs
              </TabsTrigger>
            </TabsList>

            <TabsContent value="update" className="space-y-4 p-4">
              <div className="flex items-center space-x-6">
                <div className="flex flex-col w-1/2">
                  <span className="text-gray-700 pb-2">
                    Today's Call Remark
                  </span>
                  <FollowUpStatusTag
                    value={lead?.follow_up_status}
                    leadId={lead?.id}
                    onUpdateFollowUpStatus={(id, status) =>
                      console.log(
                        `Update follow-up status for ${id}: ${status}`
                      )
                    }
                  />
                </div>

                <div className="flex flex-col w-1/2">
                  <span className="text-gray-700">Follow-Up Date</span>
                  <input
                    type="date"
                    value={
                      followUpDate
                        ? new Date(followUpDate).toISOString().substring(0, 10)
                        : ""
                    }
                    onChange={handleDateChange}
                    className="mt-1 block border rounded-md p-2"
                  />
                </div>
              </div>

              <div className="flex items-end mt-2 border rounded-md p-2">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Type here to comment..."
                  className="flex-grow "
                  rows="3"
                />
                <button
                  onClick={handleAddComment}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  Add Comment
                </button>
              </div>

              {/* Comment Section */}
              <h3>
                Notes
                <Badge count={lead?.comments.length} />
              </h3>
              <div className="space-y-2 mt-2 pb-2">
                {lead?.comments.length > 0 ? (
                  lead?.comments
                    .slice()
                    .reverse()
                    .map((comment, index) => {
                      const commentDate = new Date(comment.date);
                      const formattedDate = format(
                        commentDate,
                        "d MMMM yyyy, 'at' HH:mm"
                      );
                      return (
                        <div
                          key={index}
                          className="p-2 pb-4 bg-gray-100 border border-gray-300 rounded-md"
                        >
                          <div className="text-sm text-gray-500">
                            Created at {formattedDate}
                          </div>
                          <div>{comment.text}</div>
                        </div>
                      );
                    })
                ) : (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-4 p-4">
              <h3>Logs</h3>
              <div className="space-y-2 mt-2 pb-2">
                {lead?.logs.length > 0 ? (
                  lead.logs
                    .slice()
                    .reverse()
                    .map((log, index) => {
                      const logDate = new Date(log.date);
                      const formattedDate = format(
                        logDate,
                        "d MMMM yyyy, 'at' HH:mm"
                      );

                      return (
                        <div
                          key={index}
                          className="p-2 pb-4 bg-gray-100 border border-gray-300 rounded-md"
                        >
                          <div className="text-sm text-gray-500">
                            Status: {log.status}
                          </div>
                          <div className="text-gray-800">{log.comment}</div>
                          <div className="text-sm text-gray-500">
                            {formattedDate}
                          </div>
                        </div>
                      );
                    })
                ) : (
                  <div className="text-gray-500">No logs available.</div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default LeadDetailsModal;
