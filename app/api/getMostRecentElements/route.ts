import { NextResponse } from "next/server";
import getMostRecentElements from "src/lib/getMostRecentElements";

export async function GET(request: Request) {
  try {
    const data = await getMostRecentElements(); 
    return NextResponse.json(data);
  } 
  catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}