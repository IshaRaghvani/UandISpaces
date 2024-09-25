import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import LeadsData from '../../../../models/LeadsData';

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

// Handle GET requests to /api/leads/[id]
export async function GET(request, { params }) {
  const { id } = params;
  await connectToDatabase();
  
  try {
    const lead = await LeadsData.findById(id);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json({ error: 'Error fetching lead' }, { status: 500 });
  }
}

// Handle POST requests to /api/leads/[id]
// Handle POST requests to /api/leads/[id]
export async function POST(request, { params }) {
  const { id } = params; // Extract lead ID from params
  await connectToDatabase();

  try {
    const { followUpStatus, followUpDate, commentText, status } = await request.json(); // Fixed the request variable
    const lead = await LeadsData.findById(id);

    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    let logs = [];
    let updated = false;

    // Update the follow-up status
    if (followUpStatus && followUpStatus !== lead.follow_up_status) {
      lead.follow_up_status = followUpStatus;
      logs.push({
        status: followUpStatus,
        comment: `Follow-up status updated to '${followUpStatus}'`,
        date: new Date(),
      });
      updated = true;
    }

    // Update the lead status
    if (status && status !== lead.status) {
      lead.status = status;
      logs.push({
        status: status,
        comment: `Lead status updated to '${status}'`,
        date: new Date(),
      });
      updated = true;
    }

    // Update the follow-up date
    if (followUpDate && followUpDate !== lead.follow_up_date?.toISOString()) {
      lead.follow_up_date = new Date(followUpDate);
      logs.push({
        status: lead.follow_up_status || 'N/A',
        comment: `Follow-up date updated to ${new Date(followUpDate).toLocaleDateString()}`,
        date: new Date(),
      });
      updated = true;
    }

    // Update the comments
    if (commentText) {
      const newComment = {
        text: commentText,
        date: new Date(),
      };
      lead.comments.push(newComment);
      logs.push({
        status: lead.follow_up_status || 'N/A',
        comment: `Comment added: "${commentText}"`,
        date: new Date(),
      });
      updated = true;
    }

   
  

    await lead.save();
    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json({ error: 'Error updating lead' }, { status: 500 });
  }
}

