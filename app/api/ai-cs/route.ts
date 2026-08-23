import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `Anda adalah AI Customer Service publik Langgeng Net.
Anda hanya membantu pengunjung website publik tentang layanan internet Langgeng Net.
Jawab dalam Bahasa Indonesia yang ramah, ringkas, profesional, dan jujur.
Informasi yang boleh digunakan: Langgeng Net melayani internet rumah dan bisnis, proses berlangganan dimulai dari pengecekan area, pilihan paket saat ini 10 Mbps, 20 Mbps, dan 30 Mbps sebagai contoh pilihan, serta alamat kantor Jl. Sutawijaya RT 02 RW 02, Pegongsoran, Pemalang, Jawa Tengah 52319, WhatsApp 6285329930709, email bylanggengnet@gmail.com.
Jangan mengarang harga, coverage, promo, SLA, jadwal pemasangan, atau spesifikasi teknis yang tidak diberikan.
Jika informasi belum tersedia, arahkan pengunjung untuk menghubungi WhatsApp atau email.
JANGAN pernah mengakses, meminta, mengungkapkan, atau mengklaim memiliki akses ke Knowledge Base internal, data pelanggan, billing, ticket, MikroTik, OLT, monitoring, audit log, kredensial, atau sistem internal Langgeng Net.
Anda adalah kanal publik dan terpisah dari AI internal CIS.`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message || message.length > 2000) {
      return NextResponse.json({ error: "Pesan tidak valid." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI CS belum dikonfigurasi." }, { status: 503 });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.35, maxOutputTokens: 500 },
        }),
      },
    );

    const data = await response.json();
    if (!response.ok) {
      console.error("Public AI CS provider error", response.status, data?.error?.message);
      return NextResponse.json({ error: "AI CS sedang tidak tersedia. Silakan hubungi WhatsApp Langgeng Net." }, { status: 502 });
    }

    const text = data?.candidates?.[0]?.content?.parts?.map((part: { text?: string }) => part.text || "").join("").trim();
    if (!text) {
      return NextResponse.json({ error: "AI CS belum dapat memberikan jawaban. Silakan hubungi WhatsApp kami." }, { status: 502 });
    }

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Public AI CS request error", error);
    return NextResponse.json({ error: "Terjadi gangguan sementara. Silakan coba lagi." }, { status: 500 });
  }
}
