import { blockJack } from 'actions/blockJack';
import { getUsersRoles } from 'actions/getUsersRoles';
import { NextResponse } from 'next/server';
import deleteData from 'src/lib/deleteData';
import { isUserAdmin } from 'actions/isUserAdmin';

export async function DELETE(request: Request) {

    const roles = await blockJack();
    console.log("roles:", roles)

    try {
        const admin = await isUserAdmin();

        if (!admin) {
            return Response.json({ error: 'Unauthorized' }, { status: 400 });
        }
        else {
            // Get the data (ids) within the request
            const data = await request.json();
            console.log(new Date(data.date));

            // Pass ids to database helper function
            try {
                if (data.id) {
                    await deleteData([data.id], new Date(data.date));
                }
                else if (data.ids && Array.isArray(data.ids)) {
                    await deleteData(data.ids, new Date(data.date));
                }

                return NextResponse.json({
                    status: 200,
                    message: 'Data deleted successfully.',
                });
            }
            catch (error) {
                return NextResponse.json({
                    status: 400,
                    message: 'Missing or invalid data for deletion.',
                });
            }
        }
    }
    catch (error) {
        return NextResponse.json({ 
            status: 500, 
            message: 'Internal server error in deleting data.'
        });
    }
}