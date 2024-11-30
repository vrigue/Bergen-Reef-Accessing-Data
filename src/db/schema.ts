import { int, mysqlTable, serial } from 'drizzle-orm/mysql-core';

export const dataTable = mysqlTable('test_data', {
  id: serial().primaryKey(),
  data: int().notNull(),
});