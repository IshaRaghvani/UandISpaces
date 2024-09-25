import { NextResponse } from "next/server";
import mongoose from "mongoose";
import LeadsData from "@/models/LeadsData";
import csvParser from "csv-parser"; // Ensure this is installed with `npm install csv-parser`
import { promisify } from "util";
import fs from "fs";
import path from "path";
import moment from "moment"; // Ensure this is installed with `npm install moment`

// Connect to MongoDB
const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) {
    return;
  }
  await mongoose.connect(process.env.MONGODB_URI);
};

// Promisify the fs.writeFile function
const writeFileAsync = promisify(fs.writeFile);

// Function to parse and format dates
const formatDate = (dateStr) => {
  const formats = ["DD-MM-YY", "DD-MM-YYYY", "YYYY-MM-DD"];
  let date = moment(dateStr, formats, true);
  return date.isValid() ? date.toDate() : null;
};

const parseCSV = (filePath) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on("data", (data) => {
        // Process comments field
        const commentsArray = data.Comments
          ? data.Comments.split(";").map((commentText) => ({
              date: new Date(), // Set to today's date
              text: commentText.trim(),
            }))
          : [];

        // Construct lead object
        results.push({
          ...data,
          comments: commentsArray,
          follow_up_date: formatDate(data["Follow-up Date"]),
        });
      })
      .on("end", () => resolve(results))
      .on("error", (error) => reject(error));
  });
};

// Handle POST requests to /api/leads/upload
export async function POST(request) {
  await connectToDatabase();

  try {
    const formData = await request.formData(); // Use formData to handle file uploads
    const file = formData.get('file'); // Get the file from the form data

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const fileBuffer = await file.arrayBuffer();
    const filePath = path.join(process.cwd(), 'uploads', file.name);
    await writeFileAsync(filePath, Buffer.from(fileBuffer));

    // Parse the CSV file asynchronously
    const results = await parseCSV(filePath);

    const defaultValues = {
      city: 'Unknown',
      budget: 0,
      possession_type: 'In Hand',
      requirement: 'Unknown',
      lead_source: 'Unknown',
      status: 'Warm',
      comments: [],
      follow_up_date: new Date(),
      follow_up_status: 'To be followed up '
    };

    const updatedLeads = [];

    for (const lead of results) {
      const leadData = {
        name: lead.Name || 'No Name',
        phone_number: lead['Phone No.'] || 'No Phone',
        email: lead.Email || 'No Email',
        city: lead.City || defaultValues.city,
        configuration: lead.Configuration || 'Unknown',
        project_name: lead['Project Name'] || 'Unknown',
        budget: lead.Budget || defaultValues.budget,
        possession_type: lead.possession_type || defaultValues.possession_type,
        requirement: lead.Requirement || defaultValues.requirement,
        lead_source: lead['Lead Source'] || defaultValues.lead_source,
        status: lead.Status || defaultValues.status,
        comments: lead.comments || defaultValues.comments,
        follow_up_status: lead.follow_up_status || defaultValues.follow_up_status,
        follow_up_date: lead.follow_up_date || defaultValues.follow_up_date,
      };

      

      // Check for existing record with the same phone number
      const existingLead = await LeadsData.findOne({ phone_number: leadData.phone_number });

      if (!existingLead) {
        // If no existing lead found, create a new one
        const newLead = await LeadsData.create(leadData);
        updatedLeads.push(newLead);
      }
    }

    return NextResponse.json({ success: true, updatedLeads });
  } catch (error) {
    console.error('Error uploading CSV:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
