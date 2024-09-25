// // api/leads.js
// import { db } from "@/configs";
// import { LeadsList } from "@/configs/schema";
// import { eq } from "drizzle-orm";

// // Fetch all leads
// export const fetchLeads = async () => {
//   try {
//     const leads = await db.select().from(LeadsList);
//     return leads;
//   } catch (error) {
//     console.error("Failed to fetch leads:", error);
//     throw error;
//   }
// };

// // Update lead status
// export const updateLeadStatus = async (leadId, newStatus) => {
//   try {
//     await db
//       .update(LeadsList)
//       .set({ status: newStatus })
//       .where(eq(LeadsList.id, leadId));
//   } catch (error) {
//     console.error("Failed to update lead status:", error);
//     throw error;
//   }
// };

// // Update follow-up status
// export const updateFollowUpStatus = async (leadId, newStatus) => {
//   try {
//     await db
//       .update(LeadsList)
//       .set({ follow_up_status: newStatus })
//       .where(eq(LeadsList.id, leadId));
//   } catch (error) {
//     console.error("Failed to update follow-up status:", error);
//     throw error;
//   }
// };
// // Fetch lead by ID

// // export const fetchLeadById = async (leadId) => {
// //   try {
// //     const lead = await db
// //       .select()
// //       .from(LeadsList)
// //       .where(eq(LeadsList.id, leadId));
    
// //     if (!lead.length) {
// //       console.error(`Lead with ID ${leadId} not found`);
// //       return null;
// //     }

// //     return lead[0]; // Assuming leadId is unique
// //   } catch (error) {
// //     console.error(`Failed to fetch lead by ID: ${leadId}`, error);
// //     throw error;
// //   }
// // };
// export const fetchLeadById = async (leadId) => {
//   try {
//     const lead = await db
//       .select()
//       .from(LeadsList)
//       .where(eq(LeadsList.id, leadId));
    
//     if (!lead.length) {
//       console.error(`Lead with ID ${leadId} not found`);
//       return null;
//     }

//     return lead[0]; // Assuming leadId is unique
//   } catch (error) {
//     console.error(`Failed to fetch lead by ID: ${leadId}`, error);
//     throw error;
//   }
// };

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LeadsData from '@/models/LeadsData';

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

// Handle GET requests to /api/leads
export async function GET() {
  await connectToDatabase();
  const leads = await LeadsData.find();
  
  return NextResponse.json(leads);
}

// Handle POST requests to /api/leads
export async function POST(request) {
  await connectToDatabase();
  const data = await request.json();
  const newLead = new LeadsData(data);
  await newLead.save();
  return NextResponse.json(newLead);
}
