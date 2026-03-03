import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/helpers';
import type { ActivityLog } from '@/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const athleteId = searchParams.get('athleteId') ?? db.DEFAULT_ATHLETE_ID;
  const data = Array.from(db.activities.values()).filter((a) => a.athleteId === athleteId);
  data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const activity: ActivityLog = {
      id: generateId(),
      athleteId: body.athleteId ?? db.DEFAULT_ATHLETE_ID,
      date: new Date(body.date ?? Date.now()),
      type: body.type ?? 'training',
      duration: body.duration ?? 60,
      intensity: body.intensity,
      notes: body.notes,
    };
    db.activities.set(activity.id, activity);
    return NextResponse.json({ data: activity }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
