import { NextResponse } from 'next/server';
import { formatInTimeZone } from "date-fns-tz";
import createData from 'src/lib/createData';

export async function POST(request: Request) {
    try {
        // Get the data within the request
        const data = await request.json();
        // const utcDate = toZonedTime(new Date(data.datetime), "America/New_York");
        // const estDate = new Date(utcDate.getTime() - (4 * 60 * 60 * 1000));
        
        // const estDateStr = formatInTimeZone(
        //     new Date(data.datetime),
        //     "America/New_York",
        //     "yyyy-MM-dd HH:mm:ss"
        // );
        // const estDate = new Date(estDateStr);

        // Check if all the necessary fields have been provided
        if (!data.name || !data.type || !data.value) {
            return NextResponse.json({
                status: 400,
                message: 'Missing required field(s).',
            });
        }

        // Pass data to database helper function
        await createData([data], new Date(data.datetime));

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