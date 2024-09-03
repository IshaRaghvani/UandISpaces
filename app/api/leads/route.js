import { NextResponse } from "next/server";
import { db } from "@/configs/index"; // Adjust path if necessary
import { LeadsList } from "@/configs/schema"; // Adjust path if necessary

export async function GET(req) {
  try {
    
    const result = await db.select().from(LeadsList);
  

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

