import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";
import { dataTable } from "src/db/data-schema";
import { and, between, eq } from "drizzle-orm/expressions";

const db = drizzle(process.env.DATABASE_URL!);

export default async function updateValue(
  datetimeStart: Date,
  datetimeEnd: Date,
  type: string
) {
  try {
    const result = await db
      .select()
      .from(dataTable)
      .where(
        and(
          between(dataTable.datetime, datetimeStart, datetimeEnd),
          eq(dataTable.type, type)
        )
      );

    console.log(
      `Successfully filtered for data of type ${type} between ${datetimeStart} and ${datetimeEnd}.`
    );
  } catch (error) {
    console.error("Error searching for data: ", error);
    throw new Error("Failed to filter type in the database.");
  }
}
