import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateId } from '@/lib/helpers';
import type { Athlete } from '@/types';

export async function GET() {
  const data = Array.from(db.athletes.values());
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const athlete: Athlete = {
      id: generateId(),
      name: body.name,
      email: body.email,
      role: body.role ?? 'athlete',
      teamId: body.teamId,
    };
    db.athletes.set(athlete.id, athlete);
    return NextResponse.json({ data: athlete }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
