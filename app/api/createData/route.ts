import { NextResponse } from 'next/server';
import { formatInTimeZone } from "date-fns-tz";
import createData from 'src/lib/createData';
import { getUsersRoles } from 'actions/getUsersRoles';
import { isUserAdmin } from 'actions/isUserAdmin';

export async function POST(request: Request) {

    const roles = await getUsersRoles();
    console.log("roles:", roles)

    try {
        const admin = await isUserAdmin();
        
        if (!admin) {
            return Response.json({ error: 'Unauthorized' }, { status: 400 });
        }
        else {
            // Get the data within the request
            const data = await request.json();

            // Check if all the necessary fields have been provided
            if (!data.name && !data.unit && !data.value) {
                return NextResponse.json({
                    status: 400,
                    message: 'Missing required field(s).',
                });
            }
            else {
                // Pass data to database helper function
                await createData([data], new Date(data.datetime));

                return NextResponse.json({
                    status: 200,
                    message: 'Data created and inserted successfully.',
                });
            }
        }
    } 
    catch (error) {
        return NextResponse.json({ 
            status: 500, 
            message: 'Internal server error in creating data.' 
        });
    }
}