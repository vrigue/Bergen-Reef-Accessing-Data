import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { sql } from 'drizzle-orm';
import { dataTable } from 'src/db/data-schema'; // eventually change back to data-schema
import { eq } from 'drizzle-orm/expressions';

const db = drizzle(process.env.DATABASE_URL!);

export default async function updateValue(id: number, value: number) {
    try {
        await db.update(dataTable)
            .set({ value: sql`${value}` })
            .where(eq(dataTable.id, id));
        
        console.log(`Value updated successfully for ID: ${id}`);
    } catch (error) {
        console.error("Error updating value:", error);
        throw new Error("Failed to update value in the database.");
    }
}
