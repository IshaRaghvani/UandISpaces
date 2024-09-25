import mongoose from 'mongoose';
import LeadsData from '@/models/LeadsData';
import { NextResponse } from 'next/server';
// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

// Handle PATCH requests to /api/leads/updateFollowUpStatus
export async function PATCH(request) {
  await connectToDatabase();
  const { leadId, newFollowUpStatus } = await request.json();
  console.log('Request received:', { leadId, newFollowUpStatus });
  try {
    const result = await LeadsData.findByIdAndUpdate(
      leadId,
      { follow_up_status: newFollowUpStatus },
      { new: true }  // Return the updated document
    );
    
    if (!result) {
      return new NextResponse('Lead not found', { status: 404 });
    }
    
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Failed to update follow-up status:", error);
    return new NextResponse('Failed to update follow-up status', { status: 500 });
  }
}
