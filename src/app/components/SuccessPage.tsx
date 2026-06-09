import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

interface Props {
  registrationId?: string;
  scholarshipName?: string;
  submittedAt?: string;
  onRestart?: () => void;
}

/* ── Tiny icon helpers ─────────────────────────────────────────── */
function IconCopy() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconCheck({ size = 14, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M20 6L9 17l-5-5" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconMapPin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1118 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}
function IconWhatsapp() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SuccessPage({
  registrationId = "REG-2026-0842",
  scholarshipName,
  submittedAt = "7 Juni 2026",
  onRestart,
}: Props) {
  const isMobile = useIsMobile(640);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const start = document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
    if (start === 0) return;
    const duration = 480;
    const startTime = performance.now();
    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
    const step = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const pos = start * (1 - easeOut(progress));
      window.scrollTo(0, pos);
      document.documentElement.scrollTop = pos;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);
  const [dlHover, setDlHover]   = useState(false);
  const [dbHover, setDbHover]   = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(registrationId).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  /* shared layout token */
  const card: React.CSSProperties = {
    background: "white",
    borderRadius: "20px",
    border: "1px solid rgba(26,47,94,0.09)",
    boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
    overflow: "hidden",
  };

  /* doc stepper steps */
  const STEPS = [
    { label: "Data Diterima",       done: true  },
    { label: "Proses Cetak & TTD",  done: false },
    { label: "Surat Siap Diambil",  done: false },
  ];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f2f4f8",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Inter', system-ui, sans-serif",
    }}>

      {/* ── Header ── */}
      <header style={{
        background: "#1a2f5e",
        padding: "12px 20px",
        display: "flex", alignItems: "center", gap: "10px",
        flexShrink: 0,
      }}>
        <div style={{
          width: "34px", height: "34px", borderRadius: "10px",
          background: "#f5a623",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px", letterSpacing: "0.12em", textTransform: "uppercase", margin: 0 }}>
            Universitas Dian Nuswantoro
          </p>
          <p style={{ color: "white", fontSize: "15px", fontWeight: 700, margin: 0 }}>
            Portal Beasiswa
          </p>
        </div>
      </header>

      {/* ── Page body ── */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: isMobile ? "24px 14px 36px" : "44px 24px 56px",
      }}>
        <div style={{ width: "100%", maxWidth: "540px", display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* ═══════════════════════════════════════════════════════
              CARD 1 — Konfirmasi Berhasil
          ═══════════════════════════════════════════════════════ */}
          <div style={card}>
            {/* Top accent stripe */}
            <div style={{ height: "4px", background: "linear-gradient(90deg, #2e7d32, #66bb6a, #f5a623)" }} />

            <div style={{ padding: isMobile ? "28px 20px 24px" : "36px 36px 28px" }}>

              {/* Success icon */}
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "22px" }}>
                <div style={{ position: "relative", display: "inline-flex" }}>
                  {/* pulse rings */}
                  <div style={{ position: "absolute", inset: "-12px", borderRadius: "50%", background: "radial-gradient(circle, rgba(46,125,50,0.10) 30%, transparent 70%)" }} />
                  <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: "1.5px solid rgba(46,125,50,0.22)" }} />
                  {/* main circle */}
                  <div style={{
                    width: "68px", height: "68px", borderRadius: "50%",
                    background: "linear-gradient(140deg, #388e3c 0%, #2e7d32 100%)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 8px 24px rgba(46,125,50,0.30)",
                  }}>
                    <IconCheck size={30} color="white" />
                  </div>
                  {/* badge dot */}
                  <div style={{ position: "absolute", top: "2px", right: "2px", width: "16px", height: "16px", borderRadius: "50%", background: "#f5a623", border: "2.5px solid white", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none">
                      <path d="M12 3L2 8l10 5 10-5-10-5z" fill="white" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <h1 style={{
                fontSize: isMobile ? "19px" : "22px",
                fontWeight: 700, color: "#0f1f3d",
                margin: "0 0 8px", textAlign: "center", lineHeight: 1.35,
              }}>
                Selamat! Pendaftaran beasiswa Anda<br />berhasil dikirim.
              </h1>

              {scholarshipName && (
                <p style={{ textAlign: "center", fontSize: "13px", color: "#6b7a99", margin: "0 0 20px" }}>
                  Program: <strong style={{ color: "#1a2f5e" }}>{scholarshipName}</strong>
                </p>
              )}

              {/* ID Pendaftaran box */}
              <div style={{
                margin: "22px 0 0",
                borderRadius: "14px",
                border: "2px solid rgba(26,47,94,0.14)",
                background: "linear-gradient(135deg, #f7f9fc 0%, #eef2f9 100%)",
                padding: "16px 18px",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
              }}>
                <div>
                  <p style={{ fontSize: "10px", fontWeight: 700, color: "#9aa4b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
                    ID Pendaftaran
                  </p>
                  <p style={{ fontSize: isMobile ? "18px" : "22px", fontWeight: 800, color: "#1a2f5e", margin: 0, letterSpacing: "0.06em", fontVariantNumeric: "tabular-nums" }}>
                    {registrationId}
                  </p>
                </div>
                <button
                  onClick={handleCopy}
                  style={{
                    flexShrink: 0,
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px", borderRadius: "10px",
                    border: copied ? "1.5px solid rgba(46,125,50,0.45)" : "1.5px solid rgba(26,47,94,0.22)",
                    background: copied ? "rgba(46,125,50,0.08)" : "white",
                    color: copied ? "#2e7d32" : "#1a2f5e",
                    fontSize: "12px", fontWeight: 700,
                    cursor: "pointer", fontFamily: "inherit",
                    transition: "all 0.2s",
                    boxShadow: "0 1px 6px rgba(0,0,0,0.07)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {copied ? <IconCheck size={13} color="#2e7d32" /> : <IconCopy />}
                  {copied ? "Tersalin!" : "Salin"}
                </button>
              </div>

              {/* Micro-copy */}
              <p style={{
                fontSize: "12px", color: "#9aa4b8", lineHeight: "1.65",
                margin: "14px 0 0", textAlign: "center",
              }}>
                Anda masih dapat mengubah data melalui dashboard selama pendaftaran belum divalidasi oleh panitia.
              </p>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              CARD 2 — Status Surat Keterangan
          ═══════════════════════════════════════════════════════ */}
          <div style={card}>
            {/* Card header */}
            <div style={{
              padding: "14px 20px",
              background: "#1a2f5e",
              display: "flex", alignItems: "center", gap: "10px",
            }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "8px",
                background: "rgba(255,255,255,0.12)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontSize: "12px", fontWeight: 700, color: "white", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>
                Status Surat Keterangan
              </p>
            </div>

            <div style={{ padding: isMobile ? "20px" : "24px 28px 28px" }}>

              {/* Status row */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                gap: "12px",
                padding: "13px 16px",
                borderRadius: "12px",
                background: "rgba(245,166,35,0.06)",
                border: "1px solid rgba(245,166,35,0.25)",
                marginBottom: "20px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#f5a623", flexShrink: 0, boxShadow: "0 0 0 3px rgba(245,166,35,0.22)" }} />
                  <div>
                    <p style={{ fontSize: "11px", color: "#9aa4b8", margin: 0, fontWeight: 500 }}>Status Saat Ini</p>
                    <p style={{ fontSize: "14px", color: "#c47a00", fontWeight: 700, margin: "2px 0 0" }}>Menunggu Validasi</p>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <p style={{ fontSize: "11px", color: "#9aa4b8", margin: 0 }}>Tanggal Kirim</p>
                  <p style={{ fontSize: "12px", color: "#0f1f3d", fontWeight: 600, margin: "2px 0 0" }}>{submittedAt}</p>
                </div>
              </div>

              {/* Langkah Selanjutnya highlight box */}
              <div style={{
                borderRadius: "14px",
                border: "1.5px solid rgba(26,47,94,0.14)",
                background: "#f7f9fc",
                overflow: "hidden",
                marginBottom: "20px",
              }}>
                {/* Box header */}
                <div style={{
                  padding: "10px 16px",
                  background: "rgba(26,47,94,0.06)",
                  borderBottom: "1px solid rgba(26,47,94,0.1)",
                  display: "flex", alignItems: "center", gap: "7px",
                }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="#f5a623" strokeWidth="2" />
                    <path d="M12 8v5M12 17h.01" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <p style={{ fontSize: "11px", fontWeight: 700, color: "#1a2f5e", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>
                    Langkah Selanjutnya
                  </p>
                </div>

                {/* Box body */}
                <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <p style={{ fontSize: "13px", color: "#3a4a6b", lineHeight: "1.7", margin: 0 }}>
                    <strong>Surat Keterangan Belum Menerima Beasiswa</strong> Anda sedang diproses dan menunggu tanda tangan basah Kepala Biro.
                  </p>

                  {/* Location & WA hints */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#1a2f5e" }}>
                      <span style={{ flexShrink: 0, marginTop: "1px" }}><IconMapPin /></span>
                      <p style={{ fontSize: "13px", color: "#3a4a6b", margin: 0, lineHeight: "1.6" }}>
                        Silakan ambil dokumen fisik di <strong>Ruang BIMA, Gedung G Lantai 2</strong> dalam <strong>2–3 hari kerja</strong>.
                      </p>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "8px", color: "#2e7d32" }}>
                      <span style={{ flexShrink: 0, marginTop: "1px" }}><IconWhatsapp /></span>
                      <p style={{ fontSize: "13px", color: "#3a4a6b", margin: 0, lineHeight: "1.6" }}>
                        Jika berhalangan hadir, hubungi <strong style={{ color: "#2e7d32" }}>WhatsApp BIMA</strong> untuk permintaan scan dokumen.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Document Stepper */}
              <div>
                <p style={{ fontSize: "11px", fontWeight: 700, color: "#9aa4b8", textTransform: "uppercase", letterSpacing: "0.07em", margin: "0 0 14px" }}>
                  Progres Dokumen
                </p>
                <div style={{ display: "flex", alignItems: "flex-start" }}>
                  {STEPS.map((step, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", flex: i < STEPS.length - 1 ? 1 : undefined }}>
                      {/* Node + label */}
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                        <div style={{
                          width: "30px", height: "30px", borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          background: step.done
                            ? "linear-gradient(135deg,#2e7d32,#43a047)"
                            : i === 1
                            ? "rgba(26,47,94,0.06)"
                            : "#f2f4f8",
                          border: i === 1 ? "2px solid #f5a623" : "none",
                          boxShadow: step.done ? "0 3px 10px rgba(46,125,50,0.28)" : "none",
                        }}>
                          {step.done ? (
                            <IconCheck size={13} color="white" />
                          ) : (
                            <div style={{
                              width: "8px", height: "8px", borderRadius: "50%",
                              background: i === 1 ? "#f5a623" : "#c0c8d8",
                            }} />
                          )}
                        </div>
                        <span style={{
                          fontSize: "10px", fontWeight: step.done || i === 1 ? 700 : 500,
                          color: step.done ? "#2e7d32" : i === 1 ? "#c47a00" : "#9aa4b8",
                          textAlign: "center", lineHeight: "1.3",
                          maxWidth: isMobile ? "70px" : "90px",
                        }}>
                          {step.label}
                        </span>
                      </div>

                      {/* Connector */}
                      {i < STEPS.length - 1 && (
                        <div style={{
                          flex: 1,
                          height: "2px",
                          margin: "14px 6px 0",
                          borderRadius: "99px",
                          background: step.done
                            ? "linear-gradient(90deg, #2e7d32, rgba(46,125,50,0.25))"
                            : "rgba(26,47,94,0.1)",
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              ACTION BUTTONS
          ═══════════════════════════════════════════════════════ */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: "12px",
          }}>
            {/* Primary — Ke Dashboard */}
            <button
              onMouseEnter={() => setDbHover(true)}
              onMouseLeave={() => setDbHover(false)}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px 20px", borderRadius: "12px", border: "none",
                background: dbHover ? "#1e3a78" : "#1a2f5e",
                color: "white", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: dbHover ? "0 6px 20px rgba(26,47,94,0.38)" : "0 3px 12px rgba(26,47,94,0.22)",
                transition: "all 0.18s",
                transform: dbHover ? "translateY(-1px)" : "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.8" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.8" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.8" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="white" strokeWidth="1.8" />
              </svg>
              Ke Dashboard
            </button>

            {/* Secondary — Unduh PDF */}
            <button
              onMouseEnter={() => setDlHover(true)}
              onMouseLeave={() => setDlHover(false)}
              style={{
                flex: 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                padding: "13px 20px", borderRadius: "12px",
                border: "1.5px solid rgba(26,47,94,0.25)",
                background: dlHover ? "rgba(26,47,94,0.04)" : "white",
                color: "#1a2f5e", fontSize: "14px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: dlHover ? "0 4px 14px rgba(26,47,94,0.1)" : "0 1px 4px rgba(0,0,0,0.04)",
                transition: "all 0.18s",
                transform: dlHover ? "translateY(-1px)" : "none",
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Unduh Bukti PDF
            </button>
          </div>

          {/* Testing: restart button */}
          {onRestart && (
            <button
              onClick={onRestart}
              style={{
                display: "block", width: "100%",
                padding: "10px", borderRadius: "10px",
                border: "1.5px dashed rgba(26,47,94,0.2)",
                background: "transparent", color: "#9aa4b8",
                fontSize: "12px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "all 0.18s",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.color = "#1a2f5e"; (e.target as HTMLButtonElement).style.borderColor = "rgba(26,47,94,0.4)"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.color = "#9aa4b8"; (e.target as HTMLButtonElement).style.borderColor = "rgba(26,47,94,0.2)"; }}
            >
              ↩ Kembali ke Halaman Awal (Testing)
            </button>
          )}

          {/* Help line */}
          <p style={{ fontSize: "11px", color: "#9aa4b8", textAlign: "center", margin: 0 }}>
            Butuh bantuan?{" "}
            <span style={{ color: "#f5a623", fontWeight: 600, cursor: "pointer" }}>Hubungi Dukungan</span>
            {" · "}
            <span style={{ color: "#f5a623", fontWeight: 600, cursor: "pointer" }}>FAQ Beasiswa</span>
          </p>

        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "14px 16px", fontSize: "11px", color: "#9aa4b8" }}>
        © 2026 Universitas Dian Nuswantoro · Data Anda dilindungi dan dienkripsi
      </footer>
    </div>
  );
}
