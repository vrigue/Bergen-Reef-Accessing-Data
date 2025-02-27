import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';

export default async function getData() {
    const db = drizzle(process.env.DATABASE_URL!);
    const data = await db.select().from(dataTable);
    
    return data;
}