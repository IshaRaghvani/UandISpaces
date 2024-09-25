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

// Handle PATCH requests to /api/updateStatus
export async function PATCH(request) {
  await connectToDatabase();
  console.log('PATCH request received');
  
  const { leadId, newStatus } = await request.json();
  console.log('Lead ID:', leadId);
  console.log('New Status:', newStatus);
  
  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    return new NextResponse('Invalid lead ID', { status: 400 });
  }
  
  try {
    const existingLead = await LeadsData.findById(leadId);
    if (!existingLead) {
      return new NextResponse('Lead not found', { status: 404 });
    }
    
    const result = await LeadsData.findByIdAndUpdate(
      leadId,
      { status: newStatus },
      { new: true }
    );
    
    console.log("Updated Lead:", result);
    
    if (!result) {
      return new NextResponse('Lead not found', { status: 404 });
    }
    
    return new NextResponse(JSON.stringify(result), { status: 200 });
  } catch (error) {
    console.error("Failed to update lead status:", error);
    return new NextResponse('Failed to update lead status', { status: 500 });
  }
}

