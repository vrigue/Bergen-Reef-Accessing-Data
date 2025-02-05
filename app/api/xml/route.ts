import { NextResponse } from 'next/server';
import xml2js from 'xml2js';
import insertData from 'src/lib/insertData';

export async function POST(request : Request) {
    try {
        // Get the XML file within the request
        const raw_xml = await request.text();
        
        // Use xml2js package to convert XML into JSON
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsed_xml = await parser.parseStringPromise(raw_xml);

        // Pass JSON to database helper function
        await insertData(parsed_xml.status.probes.probe, parsed_xml.status.date);
    } 
    catch (error) {
        console.error("Error parsing XML:", error);
        return NextResponse.json({ error: "Invalid XML Format" }, { status: 400 });
    }
}