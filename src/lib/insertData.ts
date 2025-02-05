import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';

const db = drizzle(process.env.DATABASE_URL!);

export default async function insertData(data : Array<Record<string, any>>, date : string) {
    // Iterate over all pieces of data (nodes) in the array from the JSON
    for (let i = 0; i < data.length; i++) {
        // Check name of the current data node to determine its type
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

        // Construct row of the current data node with all its attributes
        const entry : typeof dataTable.$inferInsert = {
            datetime: new Date(date),
            name: data[i].name,
            type: type,
            value: data[i].value
        };
        
        // Insert row into the database
        await db.insert(dataTable).values(entry);
    }
}