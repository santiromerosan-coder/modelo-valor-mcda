import { NextResponse } from 'next/server';
import { resetToSeed } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    const data = await resetToSeed();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    );
  }
}
