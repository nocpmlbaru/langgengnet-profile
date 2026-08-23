"use client";

import { FormEvent, useState } from "react";

const whatsappHref = "https://wa.me/6285329930709?text=Halo%20Langgeng%20Net%2C%20saya%20ingin%20mengecek%20ketersediaan%20layanan%20internet.";

export default function PublicAiCs() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([{ role: "ai", text: "Halo! Saya AI CS Langgeng Net. Ada yang ingin Anda tanyakan tentang layanan, paket, pemasangan, atau coverage?" }]);
  const [loading, setLoading] = useState(false);

  async function send(event: FormEvent) {
    event.preventDefault();
    const text = message.trim();
    if (!text || loading) return;
    setMessage("");
    setMessages((items) => [...items, { role: "user", text }]);
    setLoading(true);
    try {
      const response = await fetch("/api/ai-cs", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: text }) });
      const data = await response.json();
      setMessages((items) => [...items, { role: "ai", text: data.text || data.error || "Maaf, AI CS sedang tidak tersedia." }]);
    } catch {
      setMessages((items) => [...items, { role: "ai", text: "AI CS sedang mengalami gangguan. Anda dapat langsung menghubungi WhatsApp Langgeng Net." }]);
    } finally { setLoading(false); }
  }

  return <div className={`public-ai ${open ? "is-open" : ""}`}>
    {open && <section className="public-ai-panel" aria-label="AI Customer Service Langgeng Net">
      <div className="public-ai-head"><div><strong>AI CS Langgeng Net</strong><small>Customer service publik</small></div><button type="button" onClick={() => setOpen(false)} aria-label="Tutup AI CS">×</button></div>
      <div className="public-ai-note">AI ini hanya untuk informasi publik dan tidak memiliki akses ke sistem internal perusahaan.</div>
      <div className="public-ai-messages">{messages.map((item, index) => <div className={`public-ai-message ${item.role}`} key={`${index}-${item.text.slice(0, 12)}`}>{item.text}</div>)}{loading && <div className="public-ai-message ai">Mengetik…</div>}</div>
      <form onSubmit={send} className="public-ai-form"><input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tanyakan layanan Langgeng Net…" maxLength={2000} aria-label="Pesan untuk AI CS" /><button type="submit" disabled={loading || !message.trim()} aria-label="Kirim pesan">→</button></form>
      <a className="public-ai-wa" href={whatsappHref} target="_blank" rel="noreferrer">Lanjut ke WhatsApp ↗</a>
    </section>}
    <button className="public-ai-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-label="Buka AI Customer Service"><span className="public-ai-dot" />{open ? "Tutup" : "Tanya AI CS"}</button>
  </div>;
}
