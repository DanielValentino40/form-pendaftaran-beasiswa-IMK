import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const SCHOLARSHIPS = [
  { id: "djarum",    name: "DJARUM",    desc: "Beasiswa Prestasi & Kepemimpinan",                icon: "🏅" },
  { id: "bca",       name: "BCA",       desc: "Beasiswa Pendidikan BCA Finance",                 icon: "🏦" },
  { id: "bidikmisi", name: "Bidikmisi", desc: "Beasiswa Pemerintah bagi Mahasiswa Kurang Mampu", icon: "🎓" },
  { id: "oikumene",  name: "Oikumene",  desc: "Beasiswa Ekumenis Lintas Denominasi",             icon: "✝️" },
];

const BANKS = [
  "Bank BCA", "Bank BNI", "Bank BRI", "Bank Mandiri", "Bank BTN",
  "Bank CIMB Niaga", "Bank Danamon", "Bank Permata", "Bank OCBC NISP",
  "Bank Syariah Indonesia (BSI)", "Bank Bukopin", "Bank Mega",
];

interface FieldState { value: string; touched: boolean; valid: boolean; }

function useField(initial: string, validate: (v: string) => boolean): [FieldState, (v: string) => void, () => void] {
  const [field, setField] = useState<FieldState>({ value: initial, touched: false, valid: validate(initial) });
  const onChange = (v: string) => setField((f) => ({ ...f, value: v, valid: validate(v) }));
  const onBlur   = () => setField((f) => ({ ...f, touched: true }));
  return [field, onChange, onBlur];
}

const inputBase: React.CSSProperties = {
  background: "#f8f9fc", border: "1.5px solid rgba(26,47,94,0.12)", color: "#0f1f3d",
  borderRadius: "12px", padding: "12px 16px", width: "100%", fontSize: "14px",
  outline: "none", boxSizing: "border-box", fontFamily: "inherit",
  transition: "border 0.2s, box-shadow 0.2s",
};

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label style={{ fontSize: "13px", fontWeight: 600, color: "#0f1f3d", display: "block", marginBottom: "6px" }}>
      {children}{required && <span style={{ color: "#f5a623", marginLeft: "2px" }}>*</span>}
    </label>
  );
}

function fmtDateInput(raw: string): string {
  const d = raw.replace(/\D/g, "").slice(0, 8);
  if (d.length > 4) return d.slice(0, 2) + "/" + d.slice(2, 4) + "/" + d.slice(4);
  if (d.length > 2) return d.slice(0, 2) + "/" + d.slice(2);
  return d;
}
function isoToDisplay(iso: string): string {
  if (!iso || iso.length < 10) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function displayToISO(s: string): string {
  const p = s.split("/");
  if (p.length === 3 && p[0].length === 2 && p[1].length === 2 && p[2].length === 4)
    return `${p[2]}-${p[1]}-${p[0]}`;
  return "";
}

function DatePickerField({ value, onChange, onBlur, showError, showValid }: {
  value: string; onChange: (v: string) => void; onBlur?: () => void;
  showError?: boolean; showValid?: boolean;
}) {
  const [display, setDisplay] = useState(() => isoToDisplay(value));
  useEffect(() => { setDisplay(isoToDisplay(value)); }, [value]);

  function handleText(e: React.ChangeEvent<HTMLInputElement>) {
    const fmt = fmtDateInput(e.target.value);
    setDisplay(fmt);
    onChange(displayToISO(fmt));
  }
  function handlePicker(e: React.ChangeEvent<HTMLInputElement>) {
    const iso = e.target.value;
    setDisplay(isoToDisplay(iso));
    onChange(iso);
  }

  return (
    <div style={{ position: "relative" }}>
      <input type="text" value={display} onChange={handleText} onBlur={onBlur}
        placeholder="DD/MM/YYYY" maxLength={10} inputMode="numeric"
        style={{
          ...inputBase, paddingRight: "44px",
          border: showError ? "1.5px solid #d4183d" : showValid ? "1.5px solid #2e7d32" : "1.5px solid rgba(26,47,94,0.12)",
          boxShadow: showError ? "0 0 0 3px rgba(212,24,61,0.07)" : showValid ? "0 0 0 3px rgba(46,125,50,0.07)" : "none",
        }}
      />
      <div style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", width: "24px", height: "24px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", color: showError ? "#d4183d" : "#6b7a99", pointerEvents: "none", zIndex: 2 }}>
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <input type="date" value={value} onChange={handlePicker}
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer", zIndex: 1 }}
        />
      </div>
    </div>
  );
}

function InputField({ field, onChange, onBlur, placeholder, type = "text", icon, showValidation, showErrors, maxLength }: {
  field: FieldState; onChange: (v: string) => void; onBlur: () => void;
  placeholder: string; type?: string; icon?: React.ReactNode;
  showValidation?: boolean; showErrors?: boolean; maxLength?: number;
}) {
  const touched = field.touched || showErrors;
  const ok  = showValidation && touched && field.valid;
  const err = touched && !field.valid;
  return (
    <div style={{ position: "relative" }}>
      {icon && (
        <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: err ? "#d4183d" : "#6b7a99", display: "flex" }}>
          {icon}
        </div>
      )}
      <input
        type={type} placeholder={placeholder} value={field.value}
        onChange={(e) => onChange(e.target.value)} onBlur={onBlur}
        maxLength={maxLength}
        style={{
          ...inputBase,
          paddingLeft: icon ? "44px" : "16px",
          paddingRight: (showValidation || err) ? "44px" : "16px",
          border: err ? "1.5px solid #d4183d" : ok ? "1.5px solid #2e7d32" : touched ? "1.5px solid #1a2f5e" : "1.5px solid rgba(26,47,94,0.12)",
          boxShadow: touched ? `0 0 0 3px ${err ? "rgba(212,24,61,0.07)" : "rgba(26,47,94,0.05)"}` : "none",
        }}
      />
      {ok && (
        <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      )}
      {err && (
        <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#d4183d" strokeWidth="2" />
            <path d="M12 8v4M12 16h.01" stroke="#d4183d" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      )}
    </div>
  );
}

export interface PersonalFormData {
  scholarshipId: string; scholarshipName: string; scholarshipIcon: string;
  nim: string; ktp: string; kk: string; rekening: string; bank: string;
  phone: string; dob: string; hasPkm: "ya" | "tidak" | null; judulPkm: string; deskPkm: string;
}

interface Props {
  onValidChange: (valid: boolean) => void;
  showErrors: boolean;
  onDataChange: (data: PersonalFormData) => void;
  initialData?: PersonalFormData | null;
}

export function StepPersonalInfo({ onValidChange, showErrors, onDataChange, initialData }: Props) {
  const isMobile = useIsMobile(640);

  const grid2: React.CSSProperties = isMobile
    ? { display: "flex", flexDirection: "column", gap: "12px" }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

  const [selectedScholarship, setSelectedScholarship] = useState(initialData?.scholarshipId ?? "");
  const [nim,      onNimChange,      onNimBlur]      = useField(initialData?.nim ?? "",      (v) => /^[A-Za-z]\d{2}\.\d{4}\.\d{5}$/.test(v.trim()));
  const [ktp,      onKtpChange,      onKtpBlur]      = useField(initialData?.ktp ?? "",      (v) => /^\d{16}$/.test(v.replace(/\s/g, "")));
  const [kk,       onKkChange,       onKkBlur]       = useField(initialData?.kk ?? "",       (v) => /^\d{16}$/.test(v.replace(/\s/g, "")));
  const [rekening, onRekeningChange, onRekeningBlur] = useField(initialData?.rekening ?? "", (v) => /^\d{10,16}$/.test(v.replace(/\s/g, "")));
  const [bank,     setBank]                          = useState(initialData?.bank ?? "");
  const [phone,    onPhoneChange,    onPhoneBlur]    = useField(initialData?.phone ?? "",    (v) => v.replace(/\D/g, "").length >= 10);
  const [dob,      onDobChange,      onDobBlur]      = useField(initialData?.dob ?? "",      (v) => v.length > 0);
  const [hasPkm,   setHasPkm]                        = useState<"ya" | "tidak" | null>(initialData?.hasPkm ?? null);
  const [judulPkm, setJudulPkm]                      = useState(initialData?.judulPkm ?? "");
  const [deskPkm,  setDeskPkm]                       = useState(initialData?.deskPkm ?? "");

  const isValid =
    selectedScholarship !== "" &&
    nim.valid && ktp.valid && kk.valid &&
    rekening.valid && bank !== "" &&
    phone.valid && dob.valid;

  useEffect(() => { onValidChange(isValid); }, [isValid]);
  useEffect(() => {
    const s = SCHOLARSHIPS.find((x) => x.id === selectedScholarship);
    onDataChange({
      scholarshipId: selectedScholarship,
      scholarshipName: s?.name ?? "",
      scholarshipIcon: s?.icon ?? "",
      nim: nim.value, ktp: ktp.value, kk: kk.value,
      rekening: rekening.value, bank, phone: phone.value, dob: dob.value,
      hasPkm, judulPkm, deskPkm,
    });
  }, [selectedScholarship, nim.value, ktp.value, kk.value, rekening.value, bank, phone.value, dob.value, hasPkm, judulPkm, deskPkm]);

  const CardIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.8" />
      <path d="M7 8h10M7 12h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
  const PhoneIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8A15.2 15.2 0 0013.2 17.4L15.6 15l4.4 1.8v4.2a2 2 0 01-2.2 2C6.1 22.4 1.6 17.9 1 7a2 2 0 012-2.2h4.2L9 9.2 6.6 10.8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
  const BankIcon = (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M3 10h18M3 14h18M5 6l7-3 7 3M4 10v8a1 1 0 001 1h14a1 1 0 001-1v-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  const scholarshipGrid: React.CSSProperties = isMobile
    ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }
    : { display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px", scrollbarWidth: "none" as const };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

      {/* 1. Pilihan Beasiswa */}
      <div>
        <Label required>Pilih Program Beasiswa</Label>
        <div style={scholarshipGrid}>
          {SCHOLARSHIPS.map((s) => {
            const isSelected = selectedScholarship === s.id;
            return (
              <button key={s.id} onClick={() => setSelectedScholarship(s.id)} style={{
                flexShrink: 0,
                ...(isMobile ? {} : { minWidth: "140px", maxWidth: "160px" }),
                border: showErrors && !selectedScholarship
                  ? "2px solid #d4183d"
                  : isSelected ? "2px solid #1a2f5e" : "1.5px solid rgba(26,47,94,0.12)",
                background: isSelected ? "rgba(26,47,94,0.06)" : "#f8f9fc",
                borderRadius: "14px", padding: "14px 12px", textAlign: "left",
                cursor: "pointer", transition: "all 0.2s", position: "relative", width: "100%",
              }}>
                {isSelected && (
                  <div style={{ position: "absolute", top: "8px", right: "8px", width: "16px", height: "16px", borderRadius: "50%", background: "#1a2f5e", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </div>
                )}
                <span style={{ fontSize: isMobile ? "18px" : "22px", display: "block", marginBottom: "6px" }}>{s.icon}</span>
                <p style={{ fontSize: "13px", fontWeight: 700, color: isSelected ? "#1a2f5e" : "#0f1f3d", margin: "0 0 3px", lineHeight: 1.2 }}>{s.name}</p>
                <p style={{ fontSize: "11px", color: "#6b7a99", margin: 0, lineHeight: 1.4 }}>{s.desc}</p>
              </button>
            );
          })}
        </div>
        {showErrors && !selectedScholarship && (
          <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "6px" }}>Pilih salah satu program beasiswa.</p>
        )}
        {selectedScholarship && selectedScholarship !== 'djarum' && (
          <div style={{ background: 'rgba(245, 166, 35, 0.08)', border: '1px solid rgba(245, 166, 35, 0.3)', borderRadius: '10px', padding: '12px 16px', marginTop: '12px', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <span style={{ fontSize: '16px', flexShrink: 0, lineHeight: 1 }}>📋</span>
            <p style={{ fontSize: '12.5px', color: '#8B6914', lineHeight: 1.5, margin: 0 }}>Beasiswa ini memerlukan Surat Keterangan Tidak Mampu (SKTM) yang harus diunggah pada tahap Dokumen &amp; Kirim.</p>
          </div>
        )}
      </div>

      {/* NIM + KTP */}
      <div style={grid2}>
        <div>
          <Label required>Nomor Induk Mahasiswa (NIM)</Label>
          <InputField field={nim} onChange={onNimChange} onBlur={onNimBlur} placeholder="Contoh: A11.2026.12345" showValidation showErrors={showErrors} icon={CardIcon} />
          <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "4px" }}>Format: [Kode Fak][Prodi].[Angkatan].[ID] — contoh: A11.2026.12345</p>
        </div>
        <div>
          <Label required>Nomor KTP (NIK)</Label>
          <InputField field={ktp} onChange={(v) => onKtpChange(v.replace(/\D/g, ''))} onBlur={onKtpBlur} placeholder="16 digit NIK" showValidation showErrors={showErrors} icon={CardIcon} maxLength={16} />
          <p style={{ fontSize: '11px', color: '#6b7a99', textAlign: 'right', marginTop: '2px' }}>{ktp.value.length}/16 digit</p>
          <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "4px" }}>Sesuai KTP yang berlaku</p>
        </div>
      </div>

      {/* KK */}
      <div>
        <Label required>Nomor Kartu Keluarga (KK)</Label>
        <InputField field={kk} onChange={(v) => onKkChange(v.replace(/\D/g, ''))} onBlur={onKkBlur} placeholder="16 digit Nomor KK" showValidation showErrors={showErrors} icon={CardIcon} maxLength={16} />
        <p style={{ fontSize: '11px', color: '#6b7a99', textAlign: 'right', marginTop: '2px' }}>{kk.value.length}/16 digit</p>
        <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "4px" }}>Tertera pada pojok kiri atas Kartu Keluarga</p>
      </div>

      {/* Rekening + Bank */}
      <div style={grid2}>
        <div>
          <Label required>Nomor Rekening Bank</Label>
          <InputField field={rekening} onChange={(v) => onRekeningChange(v.replace(/\D/g, ''))} onBlur={onRekeningBlur} placeholder="Nomor rekening atas nama sendiri" showValidation showErrors={showErrors} icon={BankIcon} maxLength={16} />
          <p style={{ fontSize: '11px', color: '#6b7a99', textAlign: 'right', marginTop: '2px' }}>{rekening.value.length}/16 digit</p>
          <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "4px" }}>Harus atas nama pendaftar</p>
        </div>
        <div>
          <Label required>Nama Bank</Label>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: showErrors && !bank ? "#d4183d" : "#6b7a99", display: "flex", zIndex: 1 }}>{BankIcon}</div>
            <select value={bank} onChange={(e) => setBank(e.target.value)} style={{
              ...inputBase, paddingLeft: "44px", appearance: "none", cursor: "pointer",
              color: bank ? "#0f1f3d" : "#9aa4b8",
              border: showErrors && !bank ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)",
              boxShadow: showErrors && !bank ? "0 0 0 3px rgba(212,24,61,0.07)" : "none",
            }}>
              <option value="" disabled>Pilih bank...</option>
              {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
            <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6b7a99" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          </div>
          {showErrors && !bank && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih nama bank.</p>}
        </div>
      </div>

      {/* Telepon + Tanggal Lahir */}
      <div style={grid2}>
        <div>
          <Label required>Nomor Telepon</Label>
          <InputField field={phone} onChange={onPhoneChange} onBlur={onPhoneBlur} placeholder="+62 812 3456 7890" type="tel" showValidation showErrors={showErrors} icon={PhoneIcon} />
        </div>
        <div>
          <Label required>Tanggal Lahir</Label>
          <DatePickerField value={dob.value} onChange={onDobChange} onBlur={onDobBlur}
            showError={(dob.touched || showErrors) && !dob.valid}
            showValid={(dob.touched || showErrors) && dob.valid}
          />
          {(dob.touched || showErrors) && !dob.valid && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Tanggal lahir wajib diisi.</p>}
        </div>
      </div>

      {/* Rencana PKM */}
      <div style={{ borderRadius: "14px", border: "1.5px solid rgba(26,47,94,0.1)", overflow: "hidden" }}>
        <div style={{ background: "#eef1f7", padding: "12px 16px", display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#1a2f5e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <p style={{ fontSize: "13px", fontWeight: 700, color: "#0f1f3d", margin: 0 }}>Rencana PKM</p>
            <p style={{ fontSize: "11px", color: "#6b7a99", margin: 0 }}>Program Kreativitas Mahasiswa</p>
          </div>
        </div>
        <div style={{ padding: "16px", background: "white" }}>
          <p style={{ fontSize: "13px", color: "#0f1f3d", margin: "0 0 12px", fontWeight: 500 }}>
            Apakah Anda memiliki rencana pengajuan PKM?
          </p>
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px", marginBottom: hasPkm === "ya" ? "18px" : "0" }}>
            {(["ya", "tidak"] as const).map((opt) => (
              <button key={opt} type="button" onClick={() => setHasPkm(opt)} style={{
                display: "flex", alignItems: "center", gap: "8px",
                padding: "9px 16px", borderRadius: "10px", cursor: "pointer",
                fontFamily: "inherit", fontSize: "13px", fontWeight: 600, transition: "all 0.2s",
                border: hasPkm === opt ? "1.5px solid #1a2f5e" : "1.5px solid rgba(26,47,94,0.12)",
                background: hasPkm === opt ? "rgba(26,47,94,0.06)" : "#f8f9fc",
                color: hasPkm === opt ? "#1a2f5e" : "#6b7a99",
                ...(isMobile ? { width: "100%", justifyContent: "flex-start" } : {}),
              }}>
                <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, border: hasPkm === opt ? "none" : "2px solid #c0c8d8", background: hasPkm === opt ? "#1a2f5e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {hasPkm === opt && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
                </div>
                {opt === "ya" ? "Ya, saya memiliki rencana" : "Tidak"}
              </button>
            ))}
          </div>
          <div style={{ maxHeight: hasPkm === "ya" ? "400px" : "0", overflow: "hidden", transition: "max-height 0.4s ease, opacity 0.3s ease", opacity: hasPkm === "ya" ? 1 : 0 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "14px", paddingTop: "4px" }}>
              <div>
                <Label required>Judul PKM</Label>
                <input type="text" placeholder="Contoh: Inovasi Teknologi Pengolahan Limbah Plastik berbasis AI" value={judulPkm} onChange={(e) => setJudulPkm(e.target.value)} style={inputBase} />
              </div>
              <div>
                <Label>Deskripsi PKM</Label>
                <textarea rows={3} placeholder="Jelaskan latar belakang, tujuan, dan manfaat PKM secara singkat…" value={deskPkm} onChange={(e) => setDeskPkm(e.target.value)} style={{ ...inputBase, resize: "none", lineHeight: "1.6" }} />
                <p style={{ fontSize: "11px", color: "#6b7a99", textAlign: "right", marginTop: "4px" }}>{deskPkm.length}/500 karakter</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div style={{ display: "flex", gap: "10px", background: "rgba(26,47,94,0.04)", border: "1px solid rgba(26,47,94,0.08)", borderRadius: "12px", padding: "12px 14px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="12" cy="12" r="10" stroke="#1a2f5e" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#1a2f5e" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: "12px", color: "#6b7a99", lineHeight: "1.6", margin: 0 }}>
          Data pribadi Anda dilindungi sesuai kebijakan privasi kami. Kolom bertanda <span style={{ color: "#f5a623", fontWeight: 700 }}>*</span> wajib diisi.
        </p>
      </div>
    </div>
  );
}
