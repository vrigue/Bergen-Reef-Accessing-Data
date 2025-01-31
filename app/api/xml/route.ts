import { NextResponse } from 'next/server';
import xml2js from 'xml2js';
import insertData from 'src/lib/insertData';

export async function POST(request : Request) {
    try {
        const xml = await request.text();
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsed_xml = await parser.parseStringPromise(xml);

        // await insertData(parsed_xml.status.probes.probe, parsed_xml.status.date);

        return NextResponse.json({ parsedData: parsed_xml });
    } 
    catch (error) {
        console.error("Error parsing XML:", error);
        return NextResponse.json({ error: "Invalid XML Format" }, { status: 400 });
    }
}