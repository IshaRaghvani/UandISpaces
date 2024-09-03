"use client";
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { db } from "@/configs"; // Ensure you have this correctly set up
import { LeadsList } from "@/configs/schema";
import { eq } from "drizzle-orm";
import LeadDetailsModal from "../_components/LeadDetailsModal";
//leads page
const LeadDetailPage = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  useEffect(() => {
    if (id) {
      const fetchLead = async () => {
        try {
          const leadId = Number(id); // Convert id to number
          if (isNaN(leadId)) {
            throw new Error("Invalid lead id");
          }

          // Ensure your query is using the correct method
          const result = await db
            .select()
            .from(LeadsList)
            .where(eq(LeadsList.id, leadId));

          console.log(result);

          if (result.length > 0) {
            setLead(result[0]);
          } else {
            console.error("Lead not found");
          }
        } catch (error) {
          console.error("Error fetching lead details:", error);
        }
      };

      fetchLead();
    }
  }, [id]);

  if (!lead) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Lead Details</h1>
      <p>
        <strong>Name:</strong> {lead.name}
      </p>
      <p>
        <strong>Phone Number:</strong> {lead.phone_number}
      </p>
      <p>
        <strong>Email:</strong> {lead.email}
      </p>
      <p>
        <strong>City:</strong> {lead.city}
      </p>
      <p>
        <strong>Configuration:</strong> {lead.configuration}
      </p>
      <p>
        <strong>Project Name:</strong> {lead.project_name}
      </p>
      <p>
        <strong>Budget:</strong> {lead.budget}
      </p>
      <p>
        <strong>Possession:</strong> {lead.possession}
      </p>
      <p>
        <strong>Requirement:</strong> {lead.requirement}
      </p>
      <p>
        <strong>Lead Source:</strong> {lead.lead_source}
      </p>
      <p>
        <strong>Status:</strong> {lead.status}
      </p>
      <p>
        <strong>Comments:</strong> {lead.comments}
      </p>
      <p>
        <strong>Follow-Up Date:</strong> {lead.follow_up_date}
      </p>
      <p>
        <strong>Follow-Up Status:</strong> {lead.follow_up_status}
      </p>
    </div>

    // <>
    //   <LeadDetailsModal
    //     isOpen={isModalOpen}
    //     onClose={() => setIsModalOpen(false)}
    //     lead={lead}
    //   />
    // </>
  );
};

export default LeadDetailPage;
