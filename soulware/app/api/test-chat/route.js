import { NextResponse } from 'next/server';

export async function GET() {
    return NextResponse.json({ 
        message: "Chat system is ready!",
        timestamp: new Date().toISOString(),
        status: "All Next.js 15 fixes applied"
    });
}
