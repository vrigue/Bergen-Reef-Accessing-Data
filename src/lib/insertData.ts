// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/mysql2';
// import { dataTable } from 'src/db/schema';

// export default async function insertData(data : JSON) {
//   const db = drizzle(process.env.DATABASE_URL!);

//   const sample1: typeof dataTable.$inferInsert = {
//     data: 75
//   };

//   const sample2: typeof dataTable.$inferInsert = {
//     data: 86
//   };

//   await db.insert(dataTable).values(sample1);
//   await db.insert(dataTable).values(sample2);
// }