import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getMobilePool } from '../../../../lib/mobile-db';

export const runtime = 'nodejs';

function readToken(value: string | null) {
  try {
    const raw = Buffer.from(String(value || ''), 'base64url').toString('utf8');
    const [id, expires, signature] = raw.split('.');
    const secret = process.env.MOBILE_API_SECRET || process.env.SESSION_SECRET || process.env.DATABASE_URL;
    if (!id || !expires || !signature || !secret) return null;
    const payload = `${id}.${expires}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
    if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
    const customerId = Number(id);
    if (!Number.isInteger(customerId) || Number(expires) <= Date.now()) return null;
    return customerId;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization');
  const customerId = readToken(authorization?.startsWith('Bearer ') ? authorization.slice(7) : null);
  if (!customerId) return NextResponse.json({ error: 'Sesi tidak valid atau kedaluwarsa.' }, { status: 401 });

  try {
    const result = await getMobilePool().query(
      `SELECT id,nama,username,alamat,no_hp,paket,status,created_at FROM pelanggan WHERE id=$1 LIMIT 1`,
      [customerId],
    );
    if (!result.rows[0]) return NextResponse.json({ error: 'Pelanggan tidak ditemukan.' }, { status: 404 });
    return NextResponse.json({ customer: result.rows[0] });
  } catch (error) {
    console.error('MOBILE PROFILE ERROR', error);
    return NextResponse.json({ error: 'Layanan mobile sedang mengalami gangguan.' }, { status: 500 });
  }
}
