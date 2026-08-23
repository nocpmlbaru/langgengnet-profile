import { NextRequest, NextResponse } from 'next/server';
import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { getMobilePool } from '../../../../lib/mobile-db';

export const runtime = 'nodejs';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

function limited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_ATTEMPTS;
}

function secret() {
  const value = process.env.MOBILE_API_SECRET || process.env.SESSION_SECRET || process.env.DATABASE_URL;
  if (!value) throw new Error('Mobile API secret is not configured');
  return value;
}

function normalizePhone(value: unknown) {
  return String(value || '').replace(/[^0-9+]/g, '');
}

function tokenFor(id: number, expiresAt: number) {
  const payload = `${id}.${expiresAt}`;
  const signature = crypto.createHmac('sha256', secret()).update(payload).digest('hex');
  return Buffer.from(`${payload}.${signature}`).toString('base64url');
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (limited(ip)) return NextResponse.json({ error: 'Terlalu banyak percobaan. Coba lagi beberapa menit.' }, { status: 429 });

  try {
    const body = await request.json();
    const action = body?.action;
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';
    if (!username || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'Username atau password tidak valid.' }, { status: 401 });
    }

    const pool = getMobilePool();

    if (action === 'activate') {
      const phone = normalizePhone(body?.phone);
      if (!phone) return NextResponse.json({ error: 'Nomor HP wajib diisi.' }, { status: 400 });
      const result = await pool.query(
        `SELECT p.id,p.no_hp FROM pelanggan p LEFT JOIN pelanggan_auth a ON a.pelanggan_id=p.id WHERE p.username=$1 AND a.pelanggan_id IS NULL LIMIT 1`,
        [username],
      );
      const customer = result.rows[0];
      if (!customer || normalizePhone(customer.no_hp) !== phone) {
        return NextResponse.json({ error: 'Data pelanggan tidak cocok atau akun sudah aktif.' }, { status: 400 });
      }
      const hash = await bcrypt.hash(password, 12);
      await pool.query(
        `INSERT INTO pelanggan_auth (pelanggan_id,password_hash,phone_verified_at) VALUES ($1,$2,CURRENT_TIMESTAMP)`,
        [customer.id, hash],
      );
      return NextResponse.json({ ok: true, message: 'Akun aplikasi berhasil diaktifkan.' }, { status: 201 });
    }

    const result = await pool.query(
      `SELECT p.id,p.nama,p.username,p.alamat,p.no_hp,p.paket,p.status,p.created_at,a.password_hash,a.locked_until,a.failed_login_attempts FROM pelanggan p JOIN pelanggan_auth a ON a.pelanggan_id=p.id WHERE p.username=$1 LIMIT 1`,
      [username],
    );
    const customer = result.rows[0];
    if (!customer?.password_hash) return NextResponse.json({ error: 'Akun aplikasi belum diaktifkan.' }, { status: 401 });
    if (customer.locked_until && new Date(customer.locked_until).getTime() > Date.now()) {
      return NextResponse.json({ error: 'Akun sementara terkunci. Coba lagi nanti.' }, { status: 429 });
    }

    const valid = await bcrypt.compare(password, customer.password_hash);
    if (!valid) {
      const failed = Number(customer.failed_login_attempts || 0) + 1;
      await pool.query(
        `UPDATE pelanggan_auth SET failed_login_attempts=$2,locked_until=$3,updated_at=CURRENT_TIMESTAMP WHERE pelanggan_id=$1`,
        [customer.id, failed >= 5 ? 0 : failed, failed >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null],
      );
      return NextResponse.json({ error: 'Username atau password salah.' }, { status: 401 });
    }

    const expiresAt = Date.now() + 30 * 24 * 60 * 60 * 1000;
    await pool.query(
      `UPDATE pelanggan_auth SET failed_login_attempts=0,locked_until=NULL,last_login_at=CURRENT_TIMESTAMP,updated_at=CURRENT_TIMESTAMP WHERE pelanggan_id=$1`,
      [customer.id],
    );
    return NextResponse.json({
      token: tokenFor(customer.id, expiresAt),
      expiresAt,
      customer: {
        id: customer.id,
        nama: customer.nama,
        username: customer.username,
        alamat: customer.alamat,
        no_hp: customer.no_hp,
        paket: customer.paket,
        status: customer.status,
        created_at: customer.created_at,
      },
    });
  } catch (error) {
    console.error('MOBILE AUTH ERROR', error);
    return NextResponse.json({ error: 'Layanan mobile sedang mengalami gangguan.' }, { status: 500 });
  }
}
