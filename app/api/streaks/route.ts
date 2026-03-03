import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const athleteId = searchParams.get('athleteId') ?? db.DEFAULT_ATHLETE_ID;
  const data = Array.from(db.streaks.values()).filter((s) => s.athleteId === athleteId);
  return NextResponse.json({ data });
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { athleteId = db.DEFAULT_ATHLETE_ID, type } = body;
    const streak = Array.from(db.streaks.values()).find(
      (s) => s.athleteId === athleteId && s.type === type
    );
    if (!streak) return NextResponse.json({ error: 'Streak not found' }, { status: 404 });

    const newCurrent = streak.currentStreak + 1;
    const updated = {
      ...streak,
      currentStreak: newCurrent,
      longestStreak: Math.max(streak.longestStreak, newCurrent),
      lastUpdated: new Date(),
    };
    db.streaks.set(streak.id, updated);
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
