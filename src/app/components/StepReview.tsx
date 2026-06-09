import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import type { PersonalFormData } from "./StepPersonalInfo";
import type { AcademicFormData } from "./StepAcademicInfo";
import type { DocItem } from "./StepDocuments";

interface Props {
  personalData: PersonalFormData | null;
  academicData: AcademicFormData | null;
  docData: { docs: DocItem[]; statement: string } | null;
  onEdit: (step: number) => void;
  onValidChange: (valid: boolean) => void;
  showErrors: boolean;
  onSubmit: () => void;
}

const YEAR_LABELS: Record<string, string> = {
  "1": "Tahun ke-1 (Semester 1–2)",
  "2": "Tahun ke-2 (Semester 3–4)",
  "3": "Tahun ke-3 (Semester 5–6)",
  "4": "Tahun ke-4 (Semester 7–8)",
};

function formatDate(v: string) {
  if (!v) return "—";
  const d = new Date(v + "T00:00:00");
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}

function formatCurrency(v: string) {
  if (!v) return "—";
  return "Rp " + parseInt(v, 10).toLocaleString("id-ID");
}

function mask(v: string, show = 4) {
  if (!v || v.length <= show * 2) return v || "—";
  return v.slice(0, show) + " •••• •••• " + v.slice(-show);
}

function FieldRow({ label, value, isMobile }: { label: string; value: string; isMobile?: boolean }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: isMobile ? "column" : "row",
      justifyContent: "space-between",
      alignItems: isMobile ? "flex-start" : "flex-start",
      gap: isMobile ? "2px" : "12px",
      padding: isMobile ? "7px 0" : "9px 0",
      borderBottom: "1px solid rgba(26,47,94,0.06)",
    }}>
      <span style={{ fontSize: "11px", color: "#717182", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#0f1f3d", fontWeight: 500, wordBreak: "break-word", maxWidth: "100%" }}>
        {value || "—"}
      </span>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontSize: "10px", fontWeight: 700, color: "#f5a623",
      textTransform: "uppercase", letterSpacing: "0.08em",
      margin: "14px 0 2px",
    }}>{children}</p>
  );
}

function ReviewCard({
  title, iconPath, badge, onEdit, children, isMobile,
}: {
  title: string;
  iconPath: React.ReactNode;
  badge?: string;
  onEdit: () => void;
  children: React.ReactNode;
  isMobile?: boolean;
}) {
  return (
    <div style={{
      background: "white", borderRadius: "14px",
      border: "1px solid rgba(26,47,94,0.1)",
      boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
      overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isMobile ? "10px 12px" : "14px 20px",
        background: "linear-gradient(135deg, #1a2f5e 0%, #213772 100%)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <div style={{
            width: isMobile ? "26px" : "30px", height: isMobile ? "26px" : "30px", borderRadius: "9px",
            background: "rgba(255,255,255,0.14)", flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {iconPath}
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: isMobile ? "12px" : "14px", fontWeight: 700, color: "white", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</p>
            {badge && <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.55)", margin: 0 }}>{badge}</p>}
          </div>
        </div>
        <button
          onClick={onEdit}
          style={{
            display: "flex", alignItems: "center", gap: "4px", flexShrink: 0,
            padding: isMobile ? "4px 8px" : "5px 12px", borderRadius: "8px",
            background: "rgba(245,166,35,0.18)",
            border: "1px solid rgba(245,166,35,0.45)",
            cursor: "pointer", color: "#f5a623",
            fontSize: isMobile ? "11px" : "12px", fontWeight: 600, fontFamily: "inherit",
            transition: "background 0.2s", marginLeft: "8px",
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Edit
        </button>
      </div>
      {/* Card body */}
      <div style={{ padding: isMobile ? "4px 12px 12px" : "4px 20px 16px" }}>
        {children}
      </div>
    </div>
  );
}

export function StepReview({ personalData: p, academicData: a, docData: d, onEdit, onValidChange, showErrors, onSubmit }: Props) {
  const isMobile = useIsMobile(640);
  const [agreed, setAgreed] = useState(false);
  const [localShaking, setLocalShaking] = useState(false);

  useEffect(() => { onValidChange(agreed); }, [agreed]);

  function handleSubmit() {
    if (!agreed) {
      setLocalShaking(true);
      setTimeout(() => setLocalShaking(false), 400);
      return;
    }
    onSubmit();
  }

  // Required docs always shown; optional ones only if uploaded
  const allDocs = d?.docs ?? [];
  const docs = allDocs.filter((doc) => doc.required || doc.uploaded);
  const statement = d?.statement ?? "";

  const PersonIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="1.8" />
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
  const AcademicIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const DocIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2v6h6M9 15l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const ShieldIcon = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#1a2f5e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="#1a2f5e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "12px" : "16px" }}>

      {/* Intro banner */}
      <div style={{
        display: "flex", alignItems: "flex-start", gap: isMobile ? "8px" : "12px",
        background: "rgba(26,47,94,0.04)", border: "1px solid rgba(26,47,94,0.1)",
        borderRadius: "12px", padding: isMobile ? "10px 12px" : "12px 16px",
      }}>
        <div style={{ flexShrink: 0, marginTop: isMobile ? "1px" : "0" }}>{ShieldIcon}</div>
        <p style={{ fontSize: isMobile ? "11px" : "12px", color: "#6b7a99", lineHeight: "1.6", margin: 0 }}>
          Periksa kembali seluruh data Anda sebelum mengirimkan pendaftaran. Klik <strong style={{ color: "#1a2f5e" }}>Edit</strong> pada kartu yang ingin diubah.
        </p>
      </div>

      {/* ── Card 1: Informasi Pribadi ── */}
      <ReviewCard title="Informasi Pribadi" iconPath={PersonIcon} onEdit={() => onEdit(0)} isMobile={isMobile}>
        <SectionLabel>Program Beasiswa</SectionLabel>
        <FieldRow label="Program Dipilih" value={p ? `${p.scholarshipIcon} ${p.scholarshipName}` : "—"} isMobile={isMobile} />

        <SectionLabel>Data Diri</SectionLabel>
        <FieldRow label="NIM" value={p?.nim || "—"} isMobile={isMobile} />
        <FieldRow label="NIK (KTP)" value={p?.ktp ? mask(p.ktp) : "—"} isMobile={isMobile} />
        <FieldRow label="No. Kartu Keluarga" value={p?.kk ? mask(p.kk) : "—"} isMobile={isMobile} />
        <FieldRow label="Tanggal Lahir" value={formatDate(p?.dob ?? "")} isMobile={isMobile} />
        <FieldRow label="No. Telepon" value={p?.phone || "—"} isMobile={isMobile} />

        <SectionLabel>Rekening</SectionLabel>
        <FieldRow label="No. Rekening" value={p?.rekening || "—"} isMobile={isMobile} />
        <FieldRow label="Bank" value={p?.bank || "—"} isMobile={isMobile} />

        {p?.hasPkm != null && (
          <>
            <SectionLabel>Rencana PKM</SectionLabel>
            {p.hasPkm === "ya" ? (
              <>
                <FieldRow label="Judul PKM" value={p.judulPkm || "—"} isMobile={isMobile} />
                <FieldRow label="Deskripsi PKM" value={p.deskPkm?.trim() || "—"} isMobile={isMobile} />
              </>
            ) : (
              <FieldRow label="Rencana PKM" value="Tidak ada" isMobile={isMobile} />
            )}
          </>
        )}
      </ReviewCard>

      {/* ── Card 2: Akademik & Keluarga ── */}
      <ReviewCard title="Data Akademik & Keluarga" iconPath={AcademicIcon} onEdit={() => onEdit(1)} isMobile={isMobile}>
        <SectionLabel>Data Akademik</SectionLabel>
        <FieldRow label="Fakultas" value={a?.faculty || "—"} isMobile={isMobile} />
        <FieldRow label="Program Studi" value={a?.major || "—"} isMobile={isMobile} />
        <FieldRow label="Tahun Studi" value={a?.year ? (YEAR_LABELS[a.year] ?? a.year) : "—"} isMobile={isMobile} />
        <FieldRow label="IPK Kumulatif" value={a?.gpa ? `${a.gpa} / 4,00` : "—"} isMobile={isMobile} />

        <SectionLabel>Data Orang Tua / Wali</SectionLabel>
        <FieldRow label="Nama" value={a?.namaOrtu || "—"} isMobile={isMobile} />
        <FieldRow label="Jenis Kelamin" value={a?.jenisKelaminOrtu === "L" ? "Laki-laki" : a?.jenisKelaminOrtu === "P" ? "Perempuan" : "—"} isMobile={isMobile} />
        <FieldRow label="Kewarganegaraan" value={a?.kewarganegaraan || "—"} isMobile={isMobile} />
        <FieldRow label="Status Perkawinan" value={a?.statusPerkawinan || "—"} isMobile={isMobile} />
        <FieldRow label="Agama" value={a?.agama || "—"} isMobile={isMobile} />
        <FieldRow label="Pendapatan Bulanan" value={formatCurrency(a?.pendapatan ?? "")} isMobile={isMobile} />
        <FieldRow label="Jumlah Tanggungan" value={a?.tanggungan !== undefined ? `${a.tanggungan} orang` : "—"} isMobile={isMobile} />
      </ReviewCard>

      {/* ── Card 3: Dokumen ── */}
      <ReviewCard title="Dokumen yang Diunggah" iconPath={DocIcon} onEdit={() => onEdit(2)} isMobile={isMobile}>
        <div style={{ paddingTop: "8px" }}>
          {docs.length === 0 && (
            <p style={{ fontSize: "13px", color: "#6b7a99", margin: 0 }}>Tidak ada data dokumen.</p>
          )}
          {docs.map((doc, i) => (
            <div key={doc.id ?? i} style={{
              display: "flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              justifyContent: "space-between",
              gap: isMobile ? "4px" : "12px",
              padding: "8px 0",
              borderBottom: "1px solid rgba(26,47,94,0.06)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", minWidth: 0, flexWrap: "wrap" }}>
                <div style={{
                  width: "7px", height: "7px", borderRadius: "50%", flexShrink: 0,
                  background: doc.uploaded ? "#2e7d32" : doc.required ? "#d4183d" : "#9aa4b8",
                }} />
                <span style={{ fontSize: isMobile ? "12px" : "13px", color: "#0f1f3d", wordBreak: "break-word" }}>{doc.label}</span>
                {doc.required && (
                  <span style={{ fontSize: "10px", color: "#f5a623", background: "rgba(245,166,35,0.1)", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, flexShrink: 0 }}>Wajib</span>
                )}
              </div>
              <span style={{
                fontSize: "12px", fontWeight: 600, flexShrink: 0,
                marginLeft: isMobile ? "13px" : "0",
                color: doc.uploaded ? "#2e7d32" : doc.required ? "#d4183d" : "#9aa4b8",
              }}>
                {doc.uploaded ? "✓ Terunggah" : "Belum"}
              </span>
            </div>
          ))}
          {/* Pernyataan tambahan always shown at bottom */}
          <div style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: isMobile ? "2px" : "12px",
            padding: "8px 0",
          }}>
            <span style={{ fontSize: "11px", color: "#717182", flexShrink: 0 }}>Pernyataan Tambahan</span>
            <span style={{
              fontSize: isMobile ? "12px" : "13px",
              color: statement.trim() ? "#0f1f3d" : "#9aa4b8",
              fontWeight: statement.trim() ? 500 : 400,
              wordBreak: "break-word",
              fontStyle: statement.trim() ? "normal" : "italic",
            }}>
              {statement.trim() || "—"}
            </span>
          </div>
        </div>
      </ReviewCard>

      {/* ── Pernyataan & Submit ── */}
      <div style={{
        background: "white", borderRadius: "14px",
        border: agreed ? "1.5px solid rgba(46,125,50,0.3)" : showErrors ? "1.5px solid rgba(212,24,61,0.25)" : "1px solid rgba(26,47,94,0.1)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
        padding: isMobile ? "14px 12px" : "20px",
        transition: "border 0.2s",
      }}>
        <p style={{ fontSize: "12px", fontWeight: 700, color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 12px" }}>
          Pernyataan Pendaftar
        </p>

        <label style={{ display: "flex", gap: "12px", cursor: "pointer", alignItems: "flex-start" }}>
          <div style={{ position: "relative", flexShrink: 0, marginTop: "1px" }}>
            <input
              type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
              style={{ opacity: 0, position: "absolute", inset: 0, cursor: "pointer", margin: 0, width: "100%", height: "100%" }}
            />
            <div style={{
              width: "20px", height: "20px", borderRadius: "6px", border: agreed ? "none" : showErrors ? "2px solid #d4183d" : "2px solid rgba(26,47,94,0.25)",
              background: agreed ? "#1a2f5e" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.2s",
            }}>
              {agreed && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          </div>
          <span style={{ fontSize: "13px", color: "#0f1f3d", lineHeight: "1.65", fontWeight: 500 }}>
            Saya menyatakan bahwa seluruh data dan dokumen yang saya berikan adalah{" "}
            <strong>benar dan dapat dipertanggungjawabkan</strong>.
          </span>
        </label>

        {showErrors && !agreed && (
          <p style={{ fontSize: "12px", color: "#d4183d", margin: "8px 0 0 32px" }}>
            Centang pernyataan ini sebelum mengirimkan pendaftaran.
          </p>
        )}

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          className={localShaking ? "shake" : ""}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
            width: "100%", marginTop: "20px",
            padding: isMobile ? "14px 20px" : "16px 28px",
            borderRadius: "12px", border: "none", cursor: "pointer",
            fontFamily: "inherit", fontSize: isMobile ? "14px" : "15px", fontWeight: 700,
            color: "white",
            background: agreed
              ? "linear-gradient(135deg, #1a6e3c 0%, #2e7d32 50%, #388e3c 100%)"
              : "linear-gradient(135deg, #2d4a87 0%, #1a2f5e 100%)",
            boxShadow: agreed
              ? "0 6px 20px rgba(46,125,50,0.35)"
              : "0 4px 14px rgba(26,47,94,0.25)",
            transition: "all 0.3s",
            opacity: agreed ? 1 : 0.75,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Konfirmasi &amp; Kirim Pendaftaran
        </button>

        <p style={{ fontSize: "11px", color: "#9aa4b8", textAlign: "center", marginTop: "10px" }}>
          Data Anda dienkripsi dan dilindungi sesuai kebijakan privasi Universitas Dian Nuswantoro.
        </p>
      </div>
    </div>
  );
}
