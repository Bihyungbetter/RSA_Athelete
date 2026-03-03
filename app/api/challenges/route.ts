import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/helpers';
import type { CompetitionChallenge } from '@/types';

export async function GET() {
  const data = Array.from(db.challenges.values());
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const challenge: CompetitionChallenge = {
      id: generateId(),
      name: body.name,
      description: body.description ?? '',
      type: body.type ?? 'streak',
      participants: body.participants ?? [db.DEFAULT_ATHLETE_ID],
      startDate: new Date(body.startDate ?? Date.now()),
      endDate: new Date(body.endDate ?? Date.now() + 30 * 24 * 60 * 60 * 1000),
      leaderboard: [{ athleteId: db.DEFAULT_ATHLETE_ID, score: 0 }],
    };
    db.challenges.set(challenge.id, challenge);
    return NextResponse.json({ data: challenge }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
