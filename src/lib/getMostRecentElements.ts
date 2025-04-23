import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { eq, desc } from "drizzle-orm";
import { dataTable } from "src/db/data-schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function getMostRecentElements() {
  try {
    const elements = ["pH", "Salt", "Tmp", "ORP", "Alkx4", "Cax4", "NO3", "NO2", "PO4"];
    let values = [];

    for (let i = 0; i < elements.length; i++) {
        var result = await db
        .select()
        .from(dataTable)
        .where(eq(dataTable.name, elements[i]))
        .orderBy(desc(dataTable.datetime))
        .limit(1);

        values.push(result[0]);
    }

    return values;
  } 
  catch (error) {
    console.error("Error fetching most recent elements:", error);
    throw new Error("Failed to fetch most recent elements.");
  }
}