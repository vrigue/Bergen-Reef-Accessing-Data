import 'dotenv/config';
import { drizzle } from 'drizzle-orm/mysql2';
import { dataTable } from 'src/db/data-schema';

const db = drizzle(process.env.DATABASE_URL!);

export default async function insertData(data : Array<Record<string, any>>, date : string) {
    // Iterate over all pieces of data (nodes) in the array from the JSON
    for (let i = 0; i < data.length; i++) {
        // Check name of the current data node to determine its corresponding name
        var name = "";
        if (data[i].name === "Salt") {
            name = "Salinity";
        }
        else if (data[i].name === "Tmp") {
            name = "Temperature";
        }
        else if (data[i].name === "Alkx4") {
            name = "Alkalinity";
        }
        else if (data[i].name === "Cax4") {
            name = "Calcium";
        }
        else if (data[i].name === "Mgx4") {
            name = "Magnesium";
        }
        else {
            name = data[i].name;
        }

        // Check type / name of the current data node to determine its type
        var unit = "";
        if (data[i].type === "Cond") {
            unit = "ppt";
        }
        else if (data[i].type === "Temp") {
            unit = "°F";
        }
        else if (data[i].type === "alk") {
            unit = "dkH";
        }
        else if (data[i].type === "ca" || data[i].type === "mg") {
            unit = "ppm";
        }

        else if (data[i].name === "LLS") {
            unit = "in";
        }
        else if (data[i].name === "Volt_2") {
            unit = "Volts";
        }
        else if (data[i].name.slice(data[i].name.length - 1) === 'A') {
            unit = "Amps";
        }
        else if (data[i].name.slice(data[i].name.length - 1) === 'W') {
            unit = "Watts";
        }
        else {
            unit = data[i].type;
        }

        // Construct row of the current data node with all its attributes
        const entry : typeof dataTable.$inferInsert = {
            datetime: new Date(date),
            name: name,
            unit: unit,
            value: data[i].value,
            updated_at: new Date(date)
        };
        
        // Insert row into the database
        try {
            await db.insert(dataTable).values(entry);
            console.log("Insertion successful:", entry);
        } catch (error) {
            console.error("Database Insertion Error:", error);
        }
    }
}