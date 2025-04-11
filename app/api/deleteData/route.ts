import { getUsersRoles } from 'actions/getUsersRoles';
import { NextResponse } from 'next/server';
import deleteData from 'src/lib/deleteData';

export async function DELETE(request: Request) {

    const roles = await getUsersRoles();
    console.log("roles:", roles)

    try {
        // Get the data (ids) within the request
        const data = await request.json();
        console.log(new Date(data.date));

        // Pass ids to database helper function
        if (data.id) {
            await deleteData([data.id], new Date(data.date));
        }
        else if (data.ids && Array.isArray(data.ids)) {
            await deleteData(data.ids, new Date(data.date));
        } 
        else {
            return NextResponse.json({
                status: 400,
                message: 'Missing or invalid data for deletion.',
            });
        }

        return NextResponse.json({
            status: 200,
            message: 'Data deleted successfully.',
        });
    } 
    catch (error) {
        console.error('Error deleting data:', error);
        return NextResponse.json({ status: 500, message: 'Error deleting data.' });
    }
}