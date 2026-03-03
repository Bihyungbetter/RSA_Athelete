import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/helpers';
import type { InjuryRecord } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const athleteId = searchParams.get('athleteId');
  let data = Array.from(db.injuries.values());
  if (athleteId) {
    data = data.filter((i) => i.athleteId === athleteId);
  }
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const injury: InjuryRecord = {
      id: generateId(),
      athleteId: body.athleteId ?? db.DEFAULT_ATHLETE_ID,
      injuryType: body.injuryType,
      dateStarted: new Date(body.dateStarted ?? Date.now()),
      dateRecovered: body.dateRecovered ? new Date(body.dateRecovered) : undefined,
      severity: body.severity ?? 'minor',
      recoveryPlan: body.recoveryPlan ?? [],
      completedTasks: [],
      notes: body.notes,
    };
    db.injuries.set(injury.id, injury);
    return NextResponse.json({ data: injury }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
