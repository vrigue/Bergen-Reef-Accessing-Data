import { NextResponse } from 'next/server';
import xml2js from 'xml2js';

export async function POST(request : Request) {
    try {
        const xml = await request.text();
        const parser = new xml2js.Parser();
        const parsed_xml = await parser.parseStringPromise(xml);

        console.log(parsed_xml);

        return NextResponse.json({ parsedData: parsed_xml });
    } 
    catch (error) {
        console.error("Error parsing XML:", error);
        return NextResponse.json({ error: "Invalid XML Format" }, { status: 400 });
    }
}