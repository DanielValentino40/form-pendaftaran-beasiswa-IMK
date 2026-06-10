interface SidePanelProps {
  onSaveDraft: () => void;
  draftSaved: boolean;
  currentStep: number;
  totalSteps: number;
  autoSaveEnabled: boolean;
  onAutoSaveToggle: () => void;
  lastSavedAt: string | null;
  saveStatus: "idle" | "saving" | "saved";
}

const TIPS: Record<number, { title: string; items: string[] }> = {
  0: {
    title: "Tips Informasi Pribadi",
    items: [
      "NIM tertera pada kartu mahasiswa atau surat penerimaan",
      "Pastikan NIK KTP 16 digit dan masih berlaku",
      "Nomor KK tertera pada pojok kiri atas Kartu Keluarga",
      "Rekening bank harus atas nama pendaftar sendiri",
    ],
  },
  1: {
    title: "Tips Data Akademik",
    items: [
      "IPK diambil dari transkrip resmi terbaru",
      "Beasiswa prestasi mensyaratkan IPK minimal 3,50",
      "Pastikan nama program studi sesuai ijazah/KTM",
      "Data akademik akan diverifikasi pihak kampus",
    ],
  },
  2: {
    title: "Tips Unggah Dokumen",
    items: [
      "Format yang diterima: PDF, JPG, PNG",
      "Ukuran maksimum per file: 2 MB",
      "Surat rekomendasi wajib bertanda tangan & stempel",
      "Transkrip harus disegel oleh Biro Akademik",
    ],
  },
  3: {
    title: "Tips Tinjau & Konfirmasi",
    items: [
      "Periksa kembali semua data sebelum mengirim",
      "Data tidak dapat diubah setelah pendaftaran terkirim",
      "Centang pernyataan kebenaran data sebelum konfirmasi",
      "Simpan ID pendaftaran sebagai bukti pengiriman",
    ],
  },
};

const STEP_LABELS = ["Informasi Pribadi", "Latar Akademik & Keluarga", "Dokumen & Kirim", "Tinjau & Konfirmasi"];

export function SidePanel({ onSaveDraft, draftSaved, currentStep, autoSaveEnabled, onAutoSaveToggle, lastSavedAt, saveStatus }: SidePanelProps) {
  const tips = TIPS[currentStep] ?? TIPS[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

      {/* Simpan Draf */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "20px",
        border: "1px solid rgba(26,47,94,0.12)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17 21v-8H7v8M7 3v5h8" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1f3d", margin: 0 }}>Simpan Progres</p>
        </div>
        <p style={{ fontSize: "12px", color: "#6b7a99", marginBottom: "14px" }}>
          Data hanya dikirim saat Anda menekan "Kirim Pendaftaran".
        </p>

        <button
          onClick={onSaveDraft}
          style={{
            width: "100%", padding: "12px", borderRadius: "12px", fontSize: "13px",
            fontWeight: 700, color: "white", border: "none", cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.2s",
            background: draftSaved
              ? "linear-gradient(135deg,#2e7d32,#43a047)"
              : "linear-gradient(135deg,#f5a623,#e8940d)",
            boxShadow: draftSaved
              ? "0 4px 14px rgba(46,125,50,0.3)"
              : "0 4px 14px rgba(245,166,35,0.35)",
          }}
        >
          {draftSaved ? "✓ Draf Tersimpan!" : "Simpan Draf"}
        </button>

        {/* Google Form style save status */}
        {saveStatus !== "idle" && (
          <p style={{
            fontSize: "12px",
            color: saveStatus === "saving" ? "#6b7a99" : "#2e7d32",
            opacity: 0.7,
            margin: "8px 0 0",
            textAlign: "center",
            transition: "all 0.3s ease",
          }}>
            {saveStatus === "saving" ? "Menyimpan..." : "Data disimpan"}
          </p>
        )}

        {/* Last saved timestamp */}
        {lastSavedAt && saveStatus === "idle" && (
          <p style={{ fontSize: "11px", color: "#9aa4b8", margin: "8px 0 0", textAlign: "center" }}>
            Terakhir disimpan: {lastSavedAt}
          </p>
        )}

        {/* Auto-save toggle */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(26,47,94,0.08)",
        }}>
          <span style={{ fontSize: "12px", color: "#6b7a99" }}>Simpan otomatis setiap 2 menit</span>
          <button
            onClick={onAutoSaveToggle}
            style={{
              position: "relative", width: "32px", height: "18px", borderRadius: "99px",
              background: autoSaveEnabled ? "#f5a623" : "#9aa4b8", border: "none",
              cursor: "pointer", padding: 0, transition: "background 0.2s",
            }}
          >
            <div style={{
              position: "absolute", top: "2px", left: autoSaveEnabled ? "14px" : "2px",
              width: "14px", height: "14px", borderRadius: "50%", background: "white",
              boxShadow: "0 1px 3px rgba(0,0,0,0.2)", transition: "left 0.2s",
            }} />
          </button>
        </div>
      </div>

      {/* Batas Waktu */}
      <div style={{
        borderRadius: "16px", padding: "16px 18px",
        background: "linear-gradient(135deg,#1a2f5e,#243670)",
        display: "flex", gap: "12px", alignItems: "flex-start",
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "2px" }}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="rgba(255,255,255,0.6)" strokeWidth="2" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: "0 0 2px" }}>Batas Akhir Pendaftaran</p>
          <p style={{ fontSize: "14px", fontWeight: 700, color: "white", margin: "0 0 4px" }}>31 Juli 2026</p>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", margin: 0 }}>55 hari lagi</p>
        </div>
      </div>

      {/* Tips */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "18px 20px",
        border: "1px solid rgba(26,47,94,0.12)", boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "rgba(245,166,35,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="#f5a623" strokeWidth="2" />
              <path d="M12 8v4M12 16h.01" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1f3d", margin: 0 }}>{tips.title}</p>
        </div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
          {tips.items.map((tip, i) => (
            <li key={i} style={{ display: "flex", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f5a623", flexShrink: 0, marginTop: "6px" }} />
              <p style={{ fontSize: "12px", color: "#6b7a99", lineHeight: "1.6", margin: 0 }}>{tip}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Mini progress tracker */}
      <div style={{ background: "#eef1f7", borderRadius: "16px", padding: "16px 18px", border: "1px solid rgba(26,47,94,0.08)" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "#6b7a99", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "12px" }}>
          Progres Pendaftaran
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {STEP_LABELS.map((s, i) => {
            const isDone = i < currentStep;
            const isCurrent = i === currentStep;
            return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "20px", height: "20px", borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: isDone ? "#2e7d32" : isCurrent ? "#f5a623" : "#e8ecf4",
                }}>
                  {isDone ? (
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span style={{ fontSize: "10px", color: isCurrent ? "white" : "#6b7a99", fontWeight: 700 }}>{i + 1}</span>
                  )}
                </div>
                <span style={{
                  fontSize: "12px",
                  color: isDone ? "#2e7d32" : isCurrent ? "#0f1f3d" : "#6b7a99",
                  fontWeight: isCurrent ? 600 : 400,
                }}>
                  {s}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bantuan */}
      <div style={{ textAlign: "center" }}>
        <button style={{
          fontSize: "12px", color: "#6b7a99", background: "none", border: "none",
          cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px",
          fontFamily: "inherit",
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
            <path d="M9 9a3 3 0 116 0c0 2-3 3-3 3M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Butuh bantuan? Hubungi kami
        </button>
      </div>
    </div>
  );
}
