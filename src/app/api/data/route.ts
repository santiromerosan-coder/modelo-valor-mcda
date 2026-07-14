import { NextResponse } from 'next/server';
import { getAppData } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getAppData();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    );
  }
}
