import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';

const db = drizzle(process.env.DATABASE_URL!);

export default async function insertData(data : Array<Record<string, any>>, date : string) {
    for (let i = 0; i < data.length; i++) {
        const entry : typeof dataTable.$inferInsert = {
            datetime: new Date(date),
            name: data[i].name,
            type: data[i].type,
            value: data[i].value
        };
        
        await db.insert(dataTable).values(entry);
    }
}