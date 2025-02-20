import { NextResponse } from 'next/server';
import editValueData from 'src/lib/editValueData';

export async function PUT(request: Request) {
    try {
        const { updates } = await request.json();
        if (!updates || !Array.isArray(updates)) {
            return NextResponse.json({ error: "Invalid updates data" }, { status: 400 });
        }

        for (const update of updates) {
            await editValueData(update.id, update.value);
        }

        return NextResponse.json({ message: "Updates successful" });
    } catch (error) {
        console.error("Error updating data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}