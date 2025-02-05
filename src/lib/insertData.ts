import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';

const db = drizzle(process.env.DATABASE_URL!);

export default async function insertData(data : Array<Record<string, any>>, date : string) {
    for (let i = 0; i < data.length; i++) {
        var type = "";
        if (data[i].name === "LLS") {
            type = "in";
        }
        else if (data[i].name === "Volt_2") {
            type = "volts";
        }
        else if (data[i].name.slice(data[i].name.length - 1) === 'A') {
            type = "Amps";
        }
        else if (data[i].name.slice(data[i].name.length - 1) === 'W') {
            type = "pwr";
        }
        else {
            type = data[i].type;
        }

        const entry : typeof dataTable.$inferInsert = {
            datetime: new Date(date),
            name: data[i].name,
            type: type,
            value: data[i].value
        };
        
        await db.insert(dataTable).values(entry);
    }
}