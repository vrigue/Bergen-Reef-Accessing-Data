import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm/expressions';
import { dataTable } from 'src/db/data-schema';

export default async function getData() {
    const db = drizzle(process.env.DATABASE_URL!);
    const data = await db.select().from(dataTable).where(eq(dataTable.deleted, 1));
    return data;
}