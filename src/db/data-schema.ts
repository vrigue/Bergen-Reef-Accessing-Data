import { int, datetime, varchar, decimal, mysqlTable, serial, tinyint } from 'drizzle-orm/mysql-core';

export const dataTable = mysqlTable('coral_data', {
  id: serial().primaryKey(),
  datetime: datetime().notNull(),
  name: varchar({ length: 45 }).notNull(),
  unit: varchar({ length: 45 }).notNull(),
  value: decimal({ precision: 1, scale: 1,}).notNull(),
  deleted: tinyint().notNull().default(1),
  updated_at: datetime().notNull()
});