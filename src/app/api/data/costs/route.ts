import { NextRequest, NextResponse } from 'next/server';
import { updateCostInput } from '@/lib/server-store';
import type { CostInput } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      moleculeName: string;
      updates: Partial<CostInput>;
    };
    if (!body.moleculeName || !body.updates) {
      return NextResponse.json(
        { error: 'Falta moleculeName o updates' },
        { status: 400 },
      );
    }
    const data = await updateCostInput(body.moleculeName, body.updates);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Error interno' },
      { status: 500 },
    );
  }
}
