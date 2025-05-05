import { NextResponse } from "next/server";
import searchDataByDateType from "src/lib/searchDataByDateType";

export async function GET(request: Request) {
  console.log("THIS IS HISTORY REQUEST")
  console.log(request);
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const names = searchParams.get("names")?.split(",");

    if (!startDate || !endDate || !names || names.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters ", startDate, endDate, startDateObj: startDate ? new Date(startDate) : null, endDateObj: endDate ? new Date(endDate) : null },
        { status: 400 }
      );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("names:", names);
    console.log("startDateObj:", startDateObj);
    console.log("endDateObj:", endDateObj);

    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime()) || startDateObj > endDateObj) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const result = await searchDataByDateType(startDateObj, endDateObj, names);
    
    // console.log("Search result:", result); // for debugging purposes

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
