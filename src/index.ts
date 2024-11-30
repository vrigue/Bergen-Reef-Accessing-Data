import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/schema';
  
const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const sample1: typeof dataTable.$inferInsert = {
    data: 75
  };

  const sample2: typeof dataTable.$inferInsert = {
    data: 86
  };

  await db.insert(dataTable).values(sample1);
  await db.insert(dataTable).values(sample2);
}

main();