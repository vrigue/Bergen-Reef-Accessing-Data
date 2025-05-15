import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm/expressions';
import { dataTable } from 'src/db/data-schema';

const db = drizzle(process.env.DATABASE_URL!);

export default async function deleteData(ids: number[], date : Date) {
    try {
        // Iterate over all pieces of data (ids) in the array
        for (let i = 0; i < ids.length; i++) {
            // Mark each row from the database as deleted corresponding to the id
            await db.update(dataTable as any)
                    .set({ deleted: 0, updated_at: date })
                    .where(eq(dataTable.id, ids[i]));
        }
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        throw new Error(`Error deleting data: ${error}`);
    }
}