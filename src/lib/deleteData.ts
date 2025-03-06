import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';
import { eq } from 'drizzle-orm/expressions';

const db = drizzle(process.env.DATABASE_URL!);

export default async function deleteData(ids: number[]) {
    try {
        // Iterate over all pieces of data (ids) in the array
        for (let i = 0; i < ids.length; i++) {
            // Delete each row from the database corresponding to the id
            await db.delete(dataTable).where(eq(dataTable.id, ids[i]));
        }
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        throw new Error('Error deleting data.');
    }
}