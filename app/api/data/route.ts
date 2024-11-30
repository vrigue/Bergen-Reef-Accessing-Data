import { NextResponse } from 'next/server';
import getData from 'src/lib/getData';
  
export async function GET(request: Request) {
    const data = await getData();

    return NextResponse.json(data);
}