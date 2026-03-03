import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const injury = db.injuries.get(id);
  if (!injury) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ data: injury });
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const injury = db.injuries.get(id);
  if (!injury) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  try {
    const body = await request.json();
    const updated = {
      ...injury,
      ...body,
      id,
      dateStarted: body.dateStarted ? new Date(body.dateStarted) : injury.dateStarted,
      dateRecovered: body.dateRecovered ? new Date(body.dateRecovered) : injury.dateRecovered,
    };
    db.injuries.set(id, updated);
    return NextResponse.json({ data: updated });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!db.injuries.has(id)) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  db.injuries.delete(id);
  return NextResponse.json({ data: { deleted: true } });
}
