"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import StatusTag from "../_components/StatusTag";
import FollowUpStatusTag from "../_components/FollowUpStatusTag";

const LeadDetailPage = () => {
  const { id } = useParams(); // Get lead ID from URL params
  const [lead, setLead] = useState(null); // State to store lead data
  const [isModalOpen, setIsModalOpen] = useState(true); // Manage modal state

  useEffect(() => {
    // Fetch lead data from the API route using the lead ID
    if (id) {
      const fetchLead = async () => {
        try {
          // Make a GET request to the API route to fetch lead data
          const response = await fetch(`/api/leads/${id}`);
          if (response.ok) {
            const leadData = await response.json(); // Parse JSON response
            setLead(leadData); // Update state with lead data
          } else {
            console.error("Failed to fetch lead data");
          }
        } catch (error) {
          console.error("Error fetching lead details:", error);
        }
      };

      fetchLead(); // Call the fetch function
    }
  }, [id]);

  // Update lead status function
  const handleStatusUpdate = async (leadId, status) => {
    try {
      // Update status via API (if needed) or directly in the state
      await fetch(`/api/leads/${leadId}/updateStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });

      // Update local state
      setLead((prevLead) => (prevLead ? { ...prevLead, status } : prevLead));
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Update follow-up status function
  const handleFollowUpdate = async (leadId, follow_up_status) => {
    try {
      // Update follow up status via API (if needed) or directly in the state
      await fetch(`/api/leads/${leadId}/updateFollowUpStatus`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ follow_up_status })
      });

      // Update local state
      setLead((prevLead) => (prevLead ? { ...prevLead, follow_up_status } : prevLead));
    } catch (error) {
      console.error("Error updating follow up status:", error);
    }
  };

  // Display loading message until data is fetched
  if (!lead) {
    return <div>Loading...</div>;
  }

  // Render lead details and status update components
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Lead Details - {lead.name}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Basic Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Basic Information</h2>
          <p className="text-gray-700"><strong>Name:</strong> {lead.name}</p>
          <p className="text-gray-700"><strong>Phone Number:</strong> {lead.phone_number}</p>
          <p className="text-gray-700"><strong>Alternate Phone Number:</strong> {lead.alternate_phone_number}</p>
          <p className="text-gray-700"><strong>Email:</strong> {lead.email}</p>
          <p className="text-gray-700"><strong>City:</strong> {lead.city}</p>
        </div>

        {/* Project Details Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Project Details</h2>
          <p className="text-gray-700"><strong>Project Name:</strong> {lead.project_name}</p>
          <p className="text-gray-700"><strong>Budget:</strong> {lead.budget}</p>
          <p className="text-gray-700"><strong>Possession Type:</strong> {lead.possession_type}</p>
          <p className="text-gray-700"><strong>Possession Month:</strong> {lead.possession_month}</p>
          <p className="text-gray-700"><strong>Possession Year:</strong> {lead.possession_year}</p>
          <p className="text-gray-700"><strong>Requirement:</strong> {lead.requirement}</p>
        </div>

        {/* Lead Source & Status Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Lead Source & Status</h2>
          <p className="text-gray-700"><strong>Lead Source:</strong> {lead.lead_source}</p>
          <p className="text-gray-700"><strong>Status:</strong>
            <StatusTag value={lead.status} leadId={lead._id} onUpdateStatus={handleStatusUpdate} />
          </p>
        </div>

        {/* Additional Information Card */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Additional Information</h2>
          <p className="text-gray-700"><strong>Configuration:</strong> {lead.configuration}</p>
          <p className="text-gray-700"><strong>Follow-Up Date:</strong> {lead.follow_up_date}</p>
          <p className="text-gray-700"><strong>Follow-Up Status:</strong>
            <FollowUpStatusTag value={lead.follow_up_status} leadId={lead._id} onUpdateFollowUpStatus={handleFollowUpdate} />
          </p>
        </div>

      </div>

      {/* Logs Table */}
      <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-xl font-semibold mb-4">Logs</h2>
        <table className="min-w-full bg-white">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-4">Date</th>
              <th className="text-left py-2 px-4">Status</th>
              <th className="text-left py-2 px-4">Comment</th>
            </tr>
          </thead>
          <tbody>
            {lead.logs.map((log, index) => (
              <tr key={index} className="border-b hover:bg-gray-100">
                <td className="py-2 px-4">{new Date(log.date).toLocaleDateString()}</td>
                <td className="py-2 px-4">{log.status}</td>
                <td className="py-2 px-4">{log.comment}</td>
              </tr>
            ))}
            {lead.logs.length === 0 && (
              <tr>
                <td className="py-2 px-4" colSpan="3">No logs available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadDetailPage;
