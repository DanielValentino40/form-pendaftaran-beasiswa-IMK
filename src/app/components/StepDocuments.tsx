import { useState, useEffect, useRef } from "react";

export interface DocItem {
  id: string;
  label: string;
  required: boolean;
  hint: string;
  uploaded: boolean;
  fileName?: string;
  fileSize?: number;
  fileError?: string;
}

interface Props {
  onValidChange: (valid: boolean) => void;
  showErrors: boolean;
  onDataChange: (data: { docs: DocItem[]; statement: string }) => void;
  scholarshipId?: string;
}

const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
const MAX_SIZE = 2 * 1024 * 1024; // 2MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export function StepDocuments({ onValidChange, showErrors, onDataChange, scholarshipId = "" }: Props) {
  const [docs, setDocs] = useState<DocItem[]>([
    { id: "transcript", label: "Transkrip Nilai Resmi", required: true, hint: "Transkrip tersegel dari Biro Akademik, format PDF", uploaded: false },
    { id: "ktp_scan", label: "Scan KTP (NIK)", required: true, hint: "Foto atau scan KTP yang jelas, PDF/JPG", uploaded: false },
    { id: "kk_scan", label: "Scan Kartu Keluarga", required: true, hint: "Foto atau scan KK yang jelas, PDF/JPG", uploaded: false },
    { id: "photo", label: "Pas Foto Formal", required: true, hint: "Pakaian formal, latar putih, ukuran 4×6 cm", uploaded: false },
    { id: "income", label: "Surat Keterangan Penghasilan Orang Tua", required: false, hint: "Diperlukan untuk beasiswa berbasis kebutuhan finansial", uploaded: false },
    { id: "sktm", label: "Surat Keterangan Tidak Mampu (SKTM)", required: false, hint: "Wajib untuk beasiswa selain Djarum. Format PDF/JPG/PNG, maks 2MB.", uploaded: false },
  ]);
  const [statement, setStatement] = useState("");
  const [hoveredDropzone, setHoveredDropzone] = useState<string | null>(null);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Conditionally require SKTM based on scholarshipId
  useEffect(() => {
    setDocs(prev => prev.map(d => {
      if (d.id !== "sktm") return d;
      const sktmRequired = scholarshipId !== 'djarum' && scholarshipId !== '';
      return { ...d, required: sktmRequired };
    }));
  }, [scholarshipId]);

  function handleFileSelect(docId: string, file: File | null) {
    if (!file) return;

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, uploaded: false, fileName: undefined, fileSize: undefined, fileError: 'Format file tidak didukung. Gunakan PDF, JPG, atau PNG.' } : d));
      return;
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      setDocs(prev => prev.map(d => d.id === docId ? { ...d, uploaded: false, fileName: undefined, fileSize: undefined, fileError: `Ukuran file terlalu besar (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimal 2 MB.` } : d));
      return;
    }

    // Valid file
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, uploaded: true, fileName: file.name, fileSize: file.size, fileError: undefined } : d));
  }

  function handleRemoveFile(docId: string) {
    setDocs(prev => prev.map(d => d.id === docId ? { ...d, uploaded: false, fileName: undefined, fileSize: undefined, fileError: undefined } : d));
    // Reset the file input
    const input = fileInputRefs.current[docId];
    if (input) input.value = "";
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
              borderRadius: "12px", padding: "14px 16px", transition: "all 0.2s",
              border: doc.uploaded
                ? "1.5px solid rgba(46,125,50,0.3)"
                : needsUpload
                ? "1.5px solid #e74c3c"
                : "1.5px solid rgba(26,47,94,0.12)",
              background: doc.uploaded ? "rgba(46,125,50,0.03)" : needsUpload ? "rgba(231,76,60,0.03)" : "#f8f9fc",
            }}
          >
            {/* Document header */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "10px" }}>
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
                    fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px",
                    background: doc.required ? "#dc2626" : "rgba(107,122,153,0.1)",
                    color: doc.required ? "white" : "#6b7a99",
                  }}>
                    {doc.required ? "Wajib" : "Opsional"}
                  </span>
                </div>
                <p style={{ fontSize: "12px", color: "#6b7a99", margin: "2px 0 0" }}>{doc.hint}</p>
              </div>
            </div>

            {/* Upload area / file info */}
            {doc.uploaded && doc.fileName ? (
              /* Uploaded success state */
              <div style={{
                display: "flex", alignItems: "center", gap: "12px",
                background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
                borderRadius: "10px", padding: "12px 16px",
              }}>
                <span style={{ fontSize: "18px", flexShrink: 0 }}>✅</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontSize: "13px", fontWeight: 600, color: "#15803d", margin: 0,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {doc.fileName}
                  </p>
                  {doc.fileSize !== undefined && (
                    <p style={{ fontSize: "11px", color: "#6b7a99", margin: "2px 0 0" }}>
                      {formatFileSize(doc.fileSize)}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleRemoveFile(doc.id)}
                  style={{
                    flexShrink: 0, padding: "6px 14px", borderRadius: "8px",
                    fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                    fontFamily: "inherit", background: "transparent",
                    color: "#dc2626", border: "none",
                  }}
                >
                  Hapus
                </button>
              </div>
            ) : (
              /* Dropzone upload area */
              <>
                <div
                  onClick={() => fileInputRefs.current[doc.id]?.click()}
                  onMouseEnter={() => setHoveredDropzone(doc.id)}
                  onMouseLeave={() => setHoveredDropzone(null)}
                  style={{
                    border: hoveredDropzone === doc.id ? "2px dashed #f5a623" : "2px dashed rgba(26,47,94,0.15)",
                    borderRadius: "10px", padding: "16px", textAlign: "center" as const,
                    cursor: "pointer", background: "rgba(26,47,94,0.02)",
                    transition: "border-color 0.2s",
                  }}
                >
                  <div style={{ fontSize: "24px", marginBottom: "6px" }}>📎</div>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: "#1a2f5e", margin: "0 0 2px" }}>
                    Klik untuk memilih file
                  </p>
                  <p style={{ fontSize: "11px", color: "#6b7a99", margin: 0 }}>
                    PDF, JPG, PNG · Maks 2MB
                  </p>
                  <input
                    ref={(el) => { fileInputRefs.current[doc.id] = el; }}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileSelect(doc.id, file);
                    }}
                  />
                </div>
                {doc.fileError && (
                  <p style={{ color: "#dc2626", fontSize: "12px", marginTop: "6px", margin: "6px 0 0" }}>
                    {doc.fileError}
                  </p>
                )}
              </>
            )}
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
          Pastikan semua dokumen dalam kondisi jelas dan terbaca. Ukuran maksimum per file adalah <strong>2 MB</strong>. Format yang diterima: <strong>PDF, JPG, PNG</strong>.
        </p>
      </div>
    </div>
  );
}
