import { NextResponse } from 'next/server';
import searchDataByDateType from 'src/lib/searchDataByDateType';

export async function GET(request: Request) {
    try {
        // ADD HERE

        return NextResponse.json({ message: "Updates successful" });
    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}