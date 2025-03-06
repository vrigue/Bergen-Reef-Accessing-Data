import { NextResponse } from "next/server";
import getMostRecentData from "src/lib/getMostRecentData"; // Import function

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const types = searchParams.get("types")?.split(",");

    const typeMapping: { [key: string]: string } = {
      Temperature: "Tmp",
      Salinity: "Salt",
      ORP: "ORP",
      Alkalinity: "alkx4",
      Calcium: "Cax4",
      pH: "pH"
    };

    const mappedTypes: string[] = [];
    for (const type of types) {
      mappedTypes.push(typeMapping[type] || type);
    }

    if (!types || types.length === 0) {
      return NextResponse.json({ error: "Missing types" }, { status: 400 });
    }

    console.log("Fetching most recent values for types:", types);

    const result = await getMostRecentData(mappedTypes); // Call function

    console.log("Most recent values:", result);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
