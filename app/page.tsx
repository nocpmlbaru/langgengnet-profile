const services = [
  ["01", "Internet Rumah", "Koneksi nyaman untuk streaming, belajar, bekerja, dan kebutuhan keluarga."],
  ["02", "Internet Bisnis", "Koneksi yang mendukung operasional kantor dan usaha sehari-hari."],
  ["03", "Dukungan Teknis", "Bantuan yang responsif untuk membantu menjaga koneksi tetap optimal."],
];

const plans = [
  ["10 Mbps", "Untuk kebutuhan ringan", "Cek harga"],
  ["20 Mbps", "Nyaman untuk keluarga", "Paling populer"],
  ["30 Mbps", "Untuk penggunaan lebih aktif", "Cek harga"],
];

export default function Home() {
  return <main>
    <header className="site-header"><nav>
      <a className="logo" href="#home"><span>L</span>Langgeng<span className="blue">Net</span></a>
      <div className="nav-links"><a href="#layanan">Layanan</a><a href="#paket">Paket</a><a href="#tentang">Tentang</a><a href="#kontak">Kontak</a></div>
      <a className="nav-button" href="#kontak">Berlangganan <b>↗</b></a>
    </nav></header>

    <section className="hero" id="home"><div className="hero-copy">
      <div className="eyebrow"><i/> INTERNET UNTUK TETAP TERHUBUNG</div>
      <h1>Koneksi yang bekerja <em>untuk Anda.</em></h1>
      <p>Internet cepat dan stabil untuk rumah maupun bisnis, dengan pelayanan yang dekat dan mudah dihubungi.</p>
      <div className="actions"><a className="primary" href="#paket">Lihat Paket <b>↓</b></a><a className="secondary" href="#tentang">Kenal Langgeng Net</a></div>
      <div className="trust"><span><b>Stabil</b><small>untuk aktivitas harian</small></span><span><b>Responsif</b><small>dukungan teknis</small></span><span><b>Terjangkau</b><small>sesuai kebutuhan</small></span></div>
    </div><div className="hero-visual"><div className="visual-glow"/><div className="signal-card"><div className="card-top"><span>LANGGENG NET</span><span className="online">● ONLINE</span></div><div className="card-title">Your connection<br/><strong>works for you.</strong></div><div className="bars"><i/><i/><i/><i/><i/></div><div className="card-bottom"><span><b>99.9%</b><small>uptime*</small></span><span><b>24/7</b><small>support</small></span></div></div></div></section>

    <section className="section" id="layanan"><div className="section-head"><div><label>LAYANAN</label><h2>Sederhana untuk dipakai.<br/>Serius untuk diandalkan.</h2></div><p>Kami membangun layanan internet dengan satu tujuan: membuat koneksi menjadi bagian yang membantu, bukan menghambat.</p></div><div className="service-grid">{services.map(([n,t,d])=><article className="service" key={n}><span className="number">{n}</span><h3>{t}</h3><p>{d}</p><a href="#kontak">Pelajari lebih lanjut <b>→</b></a></article>)}</div></section>

    <section className="plans" id="paket"><div className="section plan-inner"><div className="section-head"><div><label>PAKET INTERNET</label><h2>Pilih koneksi yang<br/>pas untuk Anda.</h2></div><p>Contoh paket. Harga dan ketersediaan mengikuti area layanan serta hasil pengecekan teknis.</p></div><div className="plan-grid">{plans.map(([speed,note,badge],i)=><article className={i===1?"plan featured":"plan"} key={speed}>{i===1&&<span className="popular">PALING POPULER</span>}<small>{speed}</small><h3>{note}</h3><p>Paket internet sesuai kebutuhan penggunaan.</p><a href="#kontak">{badge} <b>→</b></a></article>)}</div></div></section>

    <section className="section" id="tentang"><div className="about"><div><label>TENTANG LANGGENG NET</label><h2>Dibangun dekat dengan pelanggan.</h2></div><div><p>Langgeng Net hadir untuk menyediakan koneksi internet yang dapat diandalkan bagi rumah dan bisnis.</p><p>Bagi kami, layanan internet bukan hanya soal kecepatan. Kestabilan, komunikasi, dan kehadiran saat pelanggan membutuhkan bantuan juga sama pentingnya.</p><a className="link" href="#kontak">Hubungi kami <b>↗</b></a></div></div></section>

    <section className="section contact-section" id="kontak"><div className="contact"><div><label>SIAP TERHUBUNG?</label><h2>Yuk, cek apakah <em>Langgeng Net</em> tersedia di area Anda.</h2></div><div><p>Hubungi kami untuk pengecekan coverage, pilihan paket, dan proses pemasangan.</p><a className="light" href="#">Hubungi Langgeng Net <b>↗</b></a></div></div></section>

    <footer><div className="footer-top"><a className="logo light-logo" href="#home"><span>L</span>Langgeng<span className="blue">Net</span></a><p>Internet yang membantu Anda tetap terhubung.</p></div><div className="footer-bottom"><span>© 2026 Langgeng Net. All rights reserved.</span><span>Company Profile</span></div></footer>
  </main>;
}