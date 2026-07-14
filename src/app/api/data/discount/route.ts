import { NextRequest, NextResponse } from 'next/server';
import { updateDiscount } from '@/lib/server-store';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as { discount: number };
    if (typeof body.discount !== 'number') {
      return NextResponse.json(
        { error: 'Falta discount (number)' },
        { status: 400 },
      );
    }
    const data = await updateDiscount(body.discount);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    );
  }
}
