import { NextResponse } from "next/server";
import searchDataByDateType from "src/lib/searchDataByDateType";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const types = searchParams.get("types")?.split(",");

    if (!startDate || !endDate || !types || types.length === 0) {
    return NextResponse.json(
      { error: "Missing required parameters ", startDate, endDate, startDateObj: startDate ? new Date(startDate) : null, endDateObj: endDate ? new Date(endDate) : null },
      { status: 400 }
    );
    }

    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    console.log("startDate:", startDate);
    console.log("endDate:", endDate);
    console.log("types:", types);
    console.log("startDateObj:", startDateObj);
    console.log("endDateObj:", endDateObj);
    if (isNaN(startDateObj.getTime()) || isNaN(endDateObj.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    const result = await searchDataByDateType(startDateObj, endDateObj, types);
    console.log("Search result:", result); // see the json output
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
