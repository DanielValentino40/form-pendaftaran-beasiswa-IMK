import { useState, useEffect } from "react";

export interface DocItem {
  id: string;
  label: string;
  required: boolean;
  hint: string;
  uploaded: boolean;
  fileName?: string;
}

interface Props {
  onValidChange: (valid: boolean) => void;
  showErrors: boolean;
  onDataChange: (data: { docs: DocItem[]; statement: string }) => void;
  scholarshipId?: string;
}

export function StepDocuments({ onValidChange, showErrors, onDataChange, scholarshipId = "" }: Props) {
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "transcript", label: "Transkrip Nilai Resmi", required: true, hint: "Transkrip tersegel dari Biro Akademik, format PDF", uploaded: false },
    { id: "ktp_scan", label: "Scan KTP (NIK)", required: true, hint: "Foto atau scan KTP yang jelas, PDF/JPG", uploaded: false },
    { id: "kk_scan", label: "Scan Kartu Keluarga", required: true, hint: "Foto atau scan KK yang jelas, PDF/JPG", uploaded: false },
    { id: "photo", label: "Pas Foto Formal", required: true, hint: "Pakaian formal, latar putih, ukuran 4×6 cm", uploaded: false },
    { id: "income", label: "Surat Keterangan Penghasilan Orang Tua", required: false, hint: "Diperlukan untuk beasiswa berbasis kebutuhan finansial", uploaded: false },
  ]);
  const [statement, setStatement] = useState("");

  function toggleUpload(id: string) {
    setDocs((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, uploaded: !d.uploaded, fileName: !d.uploaded ? `${id}_dokumen.pdf` : undefined }
          : d
      )
    );
  }

  const uploadedCount = docs.filter((d) => d.uploaded).length;
  const requiredCount = docs.filter((d) => d.required).length;
  const uploadedRequired = docs.filter((d) => d.required && d.uploaded).length;
  const allRequiredDone = uploadedRequired === requiredCount;


  useEffect(() => { onValidChange(allRequiredDone); }, [allRequiredDone]);
  useEffect(() => { onDataChange({ docs, statement }); }, [docs, statement]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

      {/* Ringkasan progres unggah */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        background: "rgba(26,47,94,0.04)", border: "1px solid rgba(26,47,94,0.1)",
        borderRadius: "12px", padding: "16px",
      }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px", flexShrink: 0,
          background: allRequiredDone ? "rgba(46,125,50,0.12)" : "rgba(245,166,35,0.12)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke={allRequiredDone ? "#2e7d32" : "#f5a623"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2v6h6M9 15l2 2 4-4" stroke={allRequiredDone ? "#2e7d32" : "#f5a623"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f1f3d", margin: 0 }}>
            {uploadedCount} dari {docs.length} dokumen telah diunggah
          </p>
          <p style={{ fontSize: "12px", color: "#6b7a99", margin: "2px 0 8px" }}>
            {uploadedRequired}/{requiredCount} wajib · {docs.filter((d) => !d.required && d.uploaded).length}/{docs.filter((d) => !d.required).length} opsional
          </p>
          <div style={{ height: "6px", background: "#e8ecf4", borderRadius: "99px", overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: "99px", transition: "width 0.4s",
              width: `${(uploadedCount / docs.length) * 100}%`,
              background: allRequiredDone ? "linear-gradient(90deg,#2e7d32,#43a047)" : "linear-gradient(90deg,#f5a623,#ffbc3b)",
            }} />
          </div>
        </div>
      </div>

      {/* Daftar dokumen */}
      {showErrors && !allRequiredDone && (
        <p style={{ fontSize: "12px", color: "#c0392b", margin: "-8px 0 0", fontWeight: 500 }}>
          Harap unggah semua dokumen wajib sebelum melanjutkan.
        </p>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {docs.map((doc) => {
          const needsUpload = showErrors && doc.required && !doc.uploaded;
          return (
          <div
            key={doc.id}
            style={{
              display: "flex", alignItems: "center", gap: "14px",
              borderRadius: "12px", padding: "14px 16px", transition: "all 0.2s",
              border: doc.uploaded
                ? "1.5px solid rgba(46,125,50,0.3)"
                : needsUpload
                ? "1.5px solid #e74c3c"
                : "1.5px solid rgba(26,47,94,0.12)",
              background: doc.uploaded ? "rgba(46,125,50,0.03)" : needsUpload ? "rgba(231,76,60,0.03)" : "#f8f9fc",
            }}
          >
            <div style={{
              width: "36px", height: "36px", borderRadius: "10px", flexShrink: 0,
              background: doc.uploaded ? "rgba(46,125,50,0.12)" : "rgba(26,47,94,0.06)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {doc.uploaded ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#2e7d32" strokeWidth="2" />
                  <path d="M9 12l2 2 4-4" stroke="#2e7d32" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#6b7a99" strokeWidth="2" />
                  <path d="M12 11v6M9 14l3-3 3 3" stroke="#6b7a99" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#0f1f3d", margin: 0 }}>{doc.label}</p>
                <span style={{
                  fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "6px",
                  background: doc.required ? "rgba(245,166,35,0.12)" : "rgba(26,47,94,0.06)",
                  color: doc.required ? "#f5a623" : "#6b7a99",
                }}>
                  {doc.required ? "Wajib" : "Opsional"}
                </span>
              </div>
              {doc.uploaded && doc.fileName ? (
                <p style={{ fontSize: "12px", color: "#2e7d32", margin: "2px 0 0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  ✓ {doc.fileName}
                </p>
              ) : (
                <p style={{ fontSize: "12px", color: "#6b7a99", margin: "2px 0 0" }}>{doc.hint}</p>
              )}
            </div>

            <button
              onClick={() => toggleUpload(doc.id)}
              style={{
                flexShrink: 0, padding: "6px 14px", borderRadius: "8px",
                fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                fontFamily: "inherit",
                background: doc.uploaded ? "rgba(46,125,50,0.1)" : "#1a2f5e",
                color: doc.uploaded ? "#2e7d32" : "white",
                border: doc.uploaded ? "1px solid rgba(46,125,50,0.2)" : "none",
              }}
            >
              {doc.uploaded ? "Hapus" : "Unggah"}
            </button>
          </div>
          );
        })}
      </div>

      {/* Pernyataan tambahan */}
      <div>
        <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f1f3d", display: "block", marginBottom: "6px" }}>
          Pernyataan Tambahan{" "}
          <span style={{ fontSize: "12px", color: "#6b7a99", fontWeight: 400 }}>(opsional)</span>
        </label>
        <textarea
          rows={4}
          placeholder="Sampaikan hal lain yang ingin Anda informasikan kepada panitia seleksi beasiswa…"
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
          style={{
            width: "100%", background: "#f8f9fc", border: "1.5px solid rgba(26,47,94,0.12)",
            borderRadius: "12px", padding: "14px 16px", fontSize: "14px", color: "#0f1f3d",
            resize: "none", outline: "none", lineHeight: "1.6", boxSizing: "border-box",
            fontFamily: "inherit",
          }}
        />
        <p style={{ fontSize: "12px", color: "#6b7a99", textAlign: "right", marginTop: "4px" }}>
          {statement.length}/500 karakter
        </p>
      </div>

      {/* Info */}
      <div style={{ display: "flex", gap: "10px", background: "rgba(26,47,94,0.04)", border: "1px solid rgba(26,47,94,0.08)", borderRadius: "12px", padding: "13px 16px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="12" cy="12" r="10" stroke="#1a2f5e" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#1a2f5e" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: "12px", color: "#6b7a99", lineHeight: "1.6", margin: 0 }}>
          Pastikan semua dokumen dalam kondisi jelas dan terbaca. Ukuran maksimum per file adalah <strong>5 MB</strong>. Format yang diterima: <strong>PDF, JPG, PNG</strong>.
        </p>
      </div>
    </div>
  );
}
