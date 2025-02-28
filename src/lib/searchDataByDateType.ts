import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql, and, between, eq, inArray } from "drizzle-orm";
import { dataTable } from "src/db/data-schema";

const db = drizzle(process.env.DATABASE_URL!);

export default async function searchDataByDateType(
  datetimeStart: Date,
  datetimeEnd: Date,
  types: string[]
) {
  try {
    const result = await db
      .select()
      .from(dataTable)
      .where(
        and(
          between(dataTable.datetime, datetimeStart, datetimeEnd),
          inArray(dataTable.type, types)
        )
      )
      .orderBy(dataTable.datetime); // Order by datetime

    console.log(
      `Successfully filtered for data of types ${types} between ${datetimeStart} and ${datetimeEnd}.`
    );

    return result;
  } catch (error) {
    console.error("Error searching for data: ", error);
    throw new Error("Failed to filter types in the database.");
  }
}