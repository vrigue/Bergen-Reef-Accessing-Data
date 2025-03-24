import { NextResponse } from 'next/server';
import { toZonedTime } from "date-fns-tz";
import insertData from 'src/lib/insertData';

export async function POST(request: Request) {
    try {
        // Get the data within the request
        const data = await request.json();
        const utcDate = toZonedTime(new Date(data.datetime), "America/New_York");
        const estDate = new Date(utcDate.getTime() - (4 * 60 * 60 * 1000));

        // Check if all the necessary fields have been provided
        if (!data.name || !data.type || !data.value) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required field(s).',
            });
        }

        // Pass data to database helper function
        await insertData([data], estDate);

        return NextResponse.json({
            status: 200,
            message: 'Data created and inserted successfully.',
        });
    } 
    catch (error) {
        console.error('Error creating data:', error);
        return NextResponse.json({ status: 500, message: 'Error creating data.' });
    }
}