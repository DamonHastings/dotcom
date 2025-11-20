import { NextResponse } from 'next/server';

// POST /api/admin/booking-action
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id } = body as { action?: string; id?: string };
    if (!action || !id) return NextResponse.json({ error: 'missing params' }, { status: 400 });

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/graphql';
    const adminSecret = process.env.ADMIN_PASSWORD;
    if (!adminSecret) return NextResponse.json({ error: 'admin secret not configured' }, { status: 500 });

    let mutation = '';
    if (action === 'confirm') {
      mutation = `mutation ConfirmBooking($id: ID!) { confirmBooking(id: $id) { id status } }`;
    } else if (action === 'cancel') {
      mutation = `mutation CancelBooking($id: ID!) { cancelBooking(id: $id) { id status } }`;
    } else {
      return NextResponse.json({ error: 'unknown action' }, { status: 400 });
    }

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify({ query: mutation, variables: { id } }),
    });

    const json = await res.json();
    if (!res.ok || json.errors) {
      return NextResponse.json({ error: json.errors || 'mutation failed' }, { status: 500 });
    }
    return NextResponse.json(json.data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
