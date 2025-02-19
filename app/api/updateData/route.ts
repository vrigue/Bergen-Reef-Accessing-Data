import { NextResponse } from 'next/server';
import editValueData from 'src/lib/editValueData';
  
export async function PUT(request: Request) {
    const { intParam, floatParam } = await request.json();
    const data = await editValueData(intParam, floatParam);
    return NextResponse.json(data);
}