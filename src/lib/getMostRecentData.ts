import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc, inArray } from "drizzle-orm";
import { dataTable } from "src/db/data-schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function getMostRecentData(type: string) {
  try {
    const result = await db
      .select()
      .from(dataTable)
      .where(eq(dataTable.name, type))// Filter by types
      .orderBy(desc(dataTable.datetime)) // Order by most recent first
      .limit(10); // Get only the most recent per type

    //console.log(`Fetched most recent values for types: ${type}.`);

    return result;
  } catch (error) {
    console.error("Error fetching most recent data:", error);
    throw new Error("Failed to fetch most recent data.");
  }
}