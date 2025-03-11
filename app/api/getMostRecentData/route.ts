import { NextResponse } from "next/server";
import getMostRecentData from "src/lib/getMostRecentData"; // Import function

export async function GET(request: Request) {
  console.log("api being called");
  try {

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    const typeMapping: { [key: string]: string } = {
      Temperature: "Tmp",
      Salinity: "Salt",
      ORP: "ORP",
      Alkalinity: "alkx4",
      Calcium: "Cax4",
      pH: "pH"
    };

    if (!type || type.length === 0) {
      return NextResponse.json({ error: "Missing types" }, { status: 400 });
    }

    console.log("Fetching most recent values for types:", type);

    const result = await getMostRecentData(type); // Call function

    console.log("Most recent values:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
