import { NextResponse } from 'next/server';
import xml2js from 'xml2js';
import insertData from 'src/lib/insertData';

export async function POST(request : Request) {
    try {
        //
        const raw_xml = await request.text();
        console.log(raw_xml);

        //
        var xml = raw_xml.replace(/^<\?xml[^>]*>\s*/, '');
        xml = xml.replace(/^<status[^>]*>/, '').replace(/<\/status>\s*$/m, '');
        xml = xml.replace(/(<\/outlets>\s*\n)(\s*<name>)/, '$1<probe>$2');
        xml = xml.replace(/<\/record>\s*/, '');
        xml = xml.replace(/<\/datalog>\s*/, '');

        //
        const formatted_xml = `<status>\n${xml}\n</status>`;
        console.log(formatted_xml);
        
        //
        const parser = new xml2js.Parser({ explicitArray: false });
        const parsed_xml = await parser.parseStringPromise(formatted_xml);

        //
        await insertData(parsed_xml.status.probes.probe, parsed_xml.status.date);
        await insertData(parsed_xml.status.probe, parsed_xml.status.date);

        return NextResponse.json({ parsedData: parsed_xml });
    } 
    catch (error) {
        console.error("Error parsing XML:", error);
        return NextResponse.json({ error: "Invalid XML Format" }, { status: 400 });
    }
}