import { NextResponse } from "next/server";
import { db } from "@/configs/index";  // Adjust path if necessary
import { LeadsList } from "@/configs/schema";  // Adjust path if necessary

export async function POST(req) {
    try {
        const data = await req.json();  // Parse the incoming JSON data

        // Insert data into the Leads table
        const result = await db.insert(LeadsList).values({
            name: data?.name,
            phone_number: data?.phone_number,
            email: data?.email,
            city: data?.city,
            configuration: data?.configuration,
            project_name: data?.project_name,
            budget: data?.budget,
            possession: data?.possession,
            requirement: data?.requirement,
            lead_source: data?.lead_source,
            status: data?.status,
            comments: data?.comments,
            follow_up_date: data?.follow_up_date,
            created_at: new Date(),  // Add createdAt field with the current timestamp
        });

        // Return success response
        return NextResponse.json({ success: true, data: result });

    } catch (error) {
        console.error("Error inserting lead:", error);
        // Return error response
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

