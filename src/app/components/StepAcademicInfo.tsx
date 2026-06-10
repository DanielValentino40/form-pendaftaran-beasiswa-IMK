import { useState, useEffect } from "react";
import { useIsMobile } from "../hooks/useIsMobile";

const FACULTY_MAJORS: Record<string, string[]> = {
  "Fakultas Ilmu Komputer": [
    "Ilmu Komputer (S3)",
    "Teknik Informatika (S2)",
    "Teknik Informatika (S1)",
    "Sistem Informasi (S1)",
    "Desain Komunikasi Visual (S1)",
    "Ilmu Komunikasi (S1)",
    "Film & Televisi (D4)",
    "Animasi (D4)",
    "Teknik Informatika (D3)",
  ],
  "Fakultas Ekonomi & Bisnis": [
    "Manajemen (S3)",
    "Manajemen (S2)",
    "Akuntansi (S2)",
    "Manajemen (S1)",
    "Akuntansi (S1)",
  ],
  "Fakultas Ilmu Budaya": [
    "Bahasa Inggris (S1)",
    "Sastra Jepang (S1)",
    "Pengelolaan Perhotelan (D4)",
  ],
  "Fakultas Kesehatan": [
    "Kesehatan Masyarakat (S2)",
    "Kesehatan Masyarakat (S1)",
    "Kesehatan Lingkungan (S1)",
    "Rekam Medis & Informasi Kesehatan (D3)",
    "Rekam Medis & Informasi Kesehatan (D4)",
  ],
  "Fakultas Teknik": [
    "Teknik Elektro (S1)",
    "Teknik Industri (S1)",
    "Teknik Biomedis (S1)",
  ],
  "Fakultas Kedokteran": [
    "Kedokteran (S1)",
    "Profesi Dokter (S1)",
  ],
};

const FACULTIES = Object.keys(FACULTY_MAJORS);

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

function SelectWrapper({ value, onChange, placeholder, children, showError, disabled }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
  children: React.ReactNode; showError?: boolean; disabled?: boolean;
}) {
  return (
    <div style={{ position: "relative" }}>
      <select value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} style={{
        ...inputBase, appearance: "none" as const, cursor: disabled ? "not-allowed" : "pointer",
        color: value ? "#0f1f3d" : "#9aa4b8",
        opacity: disabled ? 0.55 : 1,
        border: showError ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)",
        boxShadow: showError ? "0 0 0 3px rgba(212,24,61,0.07)" : "none",
      }}>
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "#6b7a99" }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

function RadioGroup({ options, value, onChange, showError }: {
  options: { id: string; label: string }[]; value: string;
  onChange: (v: string) => void; showError?: boolean;
}) {
  return (
    <div>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {options.map((opt) => {
          const active = value === opt.id;
          return (
            <button key={opt.id} type="button" onClick={() => onChange(opt.id)} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "9px 16px", borderRadius: "10px", cursor: "pointer",
              fontFamily: "inherit", fontSize: "13px", fontWeight: 600, transition: "all 0.2s",
              border: active ? "1.5px solid #1a2f5e" : showError ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)",
              background: active ? "rgba(26,47,94,0.06)" : "#f8f9fc",
              color: active ? "#1a2f5e" : "#6b7a99",
            }}>
              <div style={{ width: "16px", height: "16px", borderRadius: "50%", flexShrink: 0, border: active ? "none" : showError ? "2px solid #d4183d" : "2px solid #c0c8d8", background: active ? "#1a2f5e" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {active && <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "white" }} />}
              </div>
              {opt.label}
            </button>
          );
        })}
      </div>
      {showError && !value && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Wajib dipilih.</p>}
    </div>
  );
}

function KtpField({ value, onChange, showError }: { value: string; onChange: (v: string) => void; showError?: boolean }) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  const isValid = digits.length === 16;
  const hasError = showError && !isValid;
  return (
    <div style={{ position: "relative" }}>
      <input type="text" inputMode="numeric" maxLength={16} placeholder="16 digit NIK" value={digits}
        onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 16))}
        style={{ ...inputBase, paddingRight: "80px", border: isValid ? "1.5px solid #2e7d32" : hasError ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)", boxShadow: (isValid || hasError) ? `0 0 0 3px ${isValid ? "rgba(46,125,50,0.07)" : "rgba(212,24,61,0.07)"}` : "none" }}
      />
      <span style={{ position: "absolute", right: isValid ? "44px" : "14px", top: "50%", transform: "translateY(-50%)", fontSize: "11px", color: "#9aa4b8", pointerEvents: "none" }}>
        {digits.length}/16
      </span>
      {isValid && (
        <div style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", width: "20px", height: "20px", borderRadius: "50%", background: "#2e7d32", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      )}
    </div>
  );
}

function CurrencyField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const formatted = value ? "Rp " + parseInt(value, 10).toLocaleString("id-ID") : "";
  return (
    <input type="text" inputMode="numeric" placeholder="Rp 0" value={formatted}
      onChange={(e) => onChange(e.target.value.replace(/\D/g, ""))}
      style={inputBase}
    />
  );
}

function NumberStepper({ value, onChange, min = 0, max = 20 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", border: "1.5px solid rgba(26,47,94,0.12)", borderRadius: "12px", overflow: "hidden", background: "#f8f9fc", width: "fit-content" }}>
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))} style={{ width: "40px", height: "44px", background: "transparent", border: "none", cursor: value <= min ? "not-allowed" : "pointer", fontSize: "18px", color: value <= min ? "#c0c8d8" : "#1a2f5e", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>−</button>
      <div style={{ width: "52px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center", borderLeft: "1px solid rgba(26,47,94,0.1)", borderRight: "1px solid rgba(26,47,94,0.1)", fontSize: "15px", fontWeight: 700, color: "#0f1f3d" }}>{value}</div>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))} style={{ width: "40px", height: "44px", background: "transparent", border: "none", cursor: value >= max ? "not-allowed" : "pointer", fontSize: "18px", color: value >= max ? "#c0c8d8" : "#1a2f5e", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>+</button>
    </div>
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

function DatePickerField({ value, onChange, showError }: {
  value: string; onChange: (v: string) => void; showError?: boolean;
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
      <input type="text" value={display} onChange={handleText}
        placeholder="DD/MM/YYYY" maxLength={10} inputMode="numeric"
        style={{
          ...inputBase, paddingRight: "44px",
          border: showError ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)",
          boxShadow: showError ? "0 0 0 3px rgba(212,24,61,0.07)" : "none",
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

function SectionHeader({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingBottom: "14px", borderBottom: "1px solid rgba(26,47,94,0.08)" }}>
      <div style={{ width: "30px", height: "30px", borderRadius: "9px", background: "#1a2f5e", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <p style={{ fontSize: "14px", fontWeight: 700, color: "#1a2f5e", margin: 0 }}>{title}</p>
        {subtitle && <p style={{ fontSize: "12px", color: "#6b7a99", margin: 0 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

export interface AcademicFormData {
  faculty: string; major: string; year: string; gpa: string;
  ktpOrtu: string; tempatLahirOrtu: string; tglLahirOrtu: string;
  namaOrtu: string; jenisKelaminOrtu: string; kewarganegaraan: string;
  statusPerkawinan: string; agama: string; pendapatan: string; tanggungan: number;
}

interface Props {
  onValidChange: (valid: boolean) => void;
  showErrors: boolean;
  onDataChange: (data: AcademicFormData) => void;
}

export function StepAcademicInfo({ onValidChange, showErrors, onDataChange }: Props) {
  const isMobile = useIsMobile(640);
  const grid2: React.CSSProperties = isMobile
    ? { display: "flex", flexDirection: "column", gap: "12px" }
    : { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" };

  const [faculty, setFaculty] = useState("");
  const [major,   setMajor]   = useState("");

  function handleFacultyChange(v: string) {
    setFaculty(v);
    setMajor(""); // reset prodi saat fakultas berubah
  }

  const availableMajors = faculty ? FACULTY_MAJORS[faculty] ?? [] : [];
  const [year,    setYear]    = useState("");
  const [gpa,     setGpa]     = useState("");

  const [ktpOrtu,          setKtpOrtu]          = useState("");
  const [namaOrtu,         setNamaOrtu]         = useState("");
  const [jenisKelaminOrtu, setJenisKelaminOrtu] = useState("");
  const [kewarganegaraan,  setKewarganegaraan]  = useState("");
  const [statusPerkawinan, setStatusPerkawinan] = useState("");
  const [agama,            setAgama]            = useState("");
  const [pendapatan,       setPendapatan]       = useState("");
  const [tanggungan,       setTanggungan]       = useState(0);
  const [tempatLahirOrtu,  setTempatLahirOrtu]  = useState("");
  const [tglLahirOrtu,     setTglLahirOrtu]     = useState("");

  const gpaNum = parseFloat(gpa) || 0;

  const isValid =
    faculty !== "" && major !== "" && year !== "" && gpaNum > 0 &&
    ktpOrtu.replace(/\D/g, "").length === 16 && namaOrtu.trim() !== "" &&
    jenisKelaminOrtu !== "" && kewarganegaraan !== "" &&
    statusPerkawinan !== "" && agama !== "" &&
    pendapatan !== "" && tempatLahirOrtu.trim() !== "" && tglLahirOrtu !== "";

  useEffect(() => { onValidChange(isValid); }, [isValid]);
  useEffect(() => {
    onDataChange({ faculty, major, year, gpa, ktpOrtu, tempatLahirOrtu, tglLahirOrtu, namaOrtu, jenisKelaminOrtu, kewarganegaraan, statusPerkawinan, agama, pendapatan, tanggungan });
  }, [faculty, major, year, gpa, ktpOrtu, tempatLahirOrtu, tglLahirOrtu, namaOrtu, jenisKelaminOrtu, kewarganegaraan, statusPerkawinan, agama, pendapatan, tanggungan]);

  const se = showErrors; // shorthand

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

      {/* ── AKADEMIK ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <SectionHeader title="Data Akademik" subtitle="Informasi perkuliahan yang sedang berjalan"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>}
        />
        <div style={grid2}>
          <div>
            <Label required>Fakultas</Label>
            <SelectWrapper value={faculty} onChange={handleFacultyChange} placeholder="Pilih fakultas..." showError={se && !faculty}>
              {FACULTIES.map((f) => <option key={f} value={f}>{f}</option>)}
            </SelectWrapper>
            {se && !faculty && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih fakultas.</p>}
          </div>
          <div>
            <Label required>Program Studi</Label>
            <SelectWrapper
              value={major}
              onChange={setMajor}
              placeholder={faculty ? "Pilih program studi..." : "Pilih fakultas terlebih dahulu"}
              showError={se && !major}
              disabled={!faculty}
            >
              {availableMajors.map((m) => <option key={m} value={m}>{m}</option>)}
            </SelectWrapper>
            {se && !major && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih program studi.</p>}
          </div>
        </div>
        <div style={grid2}>
          <div>
            <Label required>Tahun / Semester Aktif</Label>
            <SelectWrapper value={year} onChange={setYear} placeholder="Pilih tahun..." showError={se && !year}>
              <option value="1">Tahun ke-1 (Semester 1–2)</option>
              <option value="2">Tahun ke-2 (Semester 3–4)</option>
              <option value="3">Tahun ke-3 (Semester 5–6)</option>
              <option value="4">Tahun ke-4 (Semester 7–8)</option>
            </SelectWrapper>
            {se && !year && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih tahun studi.</p>}
          </div>
          <div>
            <Label required>IPK Kumulatif</Label>
            <div style={{ position: "relative" }}>
              <input type="number" min="0" max="4" step="0.01" value={gpa}
                onChange={(e) => setGpa(e.target.value)} placeholder="0.00"
                style={{ ...inputBase, paddingRight: "52px", border: se && !gpaNum ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)", boxShadow: se && !gpaNum ? "0 0 0 3px rgba(212,24,61,0.07)" : "none" }}
              />
              <span style={{ position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)", fontSize: "12px", color: "#6b7a99", pointerEvents: "none" }}>/ 4,00</span>
            </div>
            {gpaNum >= 3.5 && <p style={{ fontSize: "12px", color: "#2e7d32", marginTop: "4px" }}>✓ Memenuhi syarat minimum</p>}
            {gpaNum > 0 && gpaNum < 3.5 && <p style={{ fontSize: "12px", color: "#f5a623", marginTop: "4px" }}>Minimum untuk beasiswa prestasi: 3,50</p>}
            {se && !gpaNum && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Isi IPK Anda.</p>}
          </div>
        </div>

        {/* IPK bar */}
        <div style={{ background: "#eef1f7", borderRadius: "12px", padding: "14px 16px", border: "1px solid rgba(26,47,94,0.08)" }}>
          <p style={{ fontSize: "11px", color: "#6b7a99", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "10px" }}>Indikator IPK</p>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ flex: 1, height: "8px", background: "#dde3f0", borderRadius: "99px", overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: "99px", transition: "width 0.5s ease", width: `${Math.min((gpaNum / 4) * 100, 100)}%`, background: gpaNum >= 3.75 ? "linear-gradient(90deg,#1a7c3e,#43a047)" : gpaNum >= 3.5 ? "linear-gradient(90deg,#f5a623,#ffbc3b)" : "linear-gradient(90deg,#c0392b,#e74c3c)" }} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#1a2f5e", minWidth: "44px", textAlign: "right" }}>{gpa || "0,00"}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
            {["0,00", "3,50 · Min", "3,75 · CL", "4,00"].map((m, i) => (
              <span key={i} style={{ fontSize: "10px", color: "#6b7a99" }}>{m}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── DATA ORANG TUA ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <SectionHeader title="Data Orang Tua / Wali" subtitle="Digunakan untuk keperluan administrasi dan verifikasi"
          icon={<svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /><circle cx="9" cy="7" r="4" stroke="white" strokeWidth="1.8" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="white" strokeWidth="1.8" strokeLinecap="round" /></svg>}
        />

        <div>
          <Label required>Nomor KTP Orang Tua / Wali</Label>
          <KtpField value={ktpOrtu} onChange={setKtpOrtu} showError={se && ktpOrtu.replace(/\D/g,"").length !== 16} />
          {se && ktpOrtu.replace(/\D/g,"").length !== 16 && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Nomor KTP harus 16 digit.</p>}
        </div>

        <div>
          <Label required>Nama Orang Tua / Wali</Label>
          <input type="text" placeholder="Sesuai dengan KTP" value={namaOrtu} onChange={(e) => setNamaOrtu(e.target.value)}
            style={{ ...inputBase, border: se && !namaOrtu.trim() ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)", boxShadow: se && !namaOrtu.trim() ? "0 0 0 3px rgba(212,24,61,0.07)" : "none" }}
          />
          {se && !namaOrtu.trim() && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Nama wajib diisi.</p>}
        </div>

        <div style={grid2}>
          <div>
            <Label required>Tempat Lahir</Label>
            <input type="text" placeholder="Contoh: Semarang" value={tempatLahirOrtu} onChange={(e) => setTempatLahirOrtu(e.target.value)}
              style={{ ...inputBase, border: se && !tempatLahirOrtu.trim() ? "1.5px solid #d4183d" : "1.5px solid rgba(26,47,94,0.12)", boxShadow: se && !tempatLahirOrtu.trim() ? "0 0 0 3px rgba(212,24,61,0.07)" : "none" }}
            />
            {se && !tempatLahirOrtu.trim() && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Tempat lahir wajib diisi.</p>}
          </div>
          <div>
            <Label required>Tanggal Lahir</Label>
            <DatePickerField value={tglLahirOrtu} onChange={setTglLahirOrtu} showError={se && !tglLahirOrtu} />
            {se && !tglLahirOrtu && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Tanggal lahir wajib diisi.</p>}
          </div>
        </div>

        <div style={grid2}>
          <div>
            <Label required>Jenis Kelamin</Label>
            <RadioGroup value={jenisKelaminOrtu} onChange={setJenisKelaminOrtu} showError={se && !jenisKelaminOrtu}
              options={[{ id: "L", label: "Laki-laki" }, { id: "P", label: "Perempuan" }]}
            />
          </div>
          <div>
            <Label required>Kewarganegaraan</Label>
            <RadioGroup value={kewarganegaraan} onChange={setKewarganegaraan} showError={se && !kewarganegaraan}
              options={[{ id: "WNI", label: "WNI" }, { id: "WNA", label: "WNA" }]}
            />
          </div>
        </div>

        <div style={grid2}>
          <div>
            <Label required>Status Perkawinan</Label>
            <SelectWrapper value={statusPerkawinan} onChange={setStatusPerkawinan} placeholder="Pilih status..." showError={se && !statusPerkawinan}>
              <option>Belum Kawin</option><option>Kawin</option><option>Cerai Hidup</option><option>Cerai Mati</option>
            </SelectWrapper>
            {se && !statusPerkawinan && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih status perkawinan.</p>}
          </div>
          <div>
            <Label required>Agama</Label>
            <SelectWrapper value={agama} onChange={setAgama} placeholder="Pilih agama..." showError={se && !agama}>
              <option>Islam</option><option>Kristen Protestan</option><option>Katolik</option>
              <option>Hindu</option><option>Buddha</option><option>Konghucu</option><option>Lainnya</option>
            </SelectWrapper>
            {se && !agama && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Pilih agama.</p>}
          </div>
        </div>

        <div style={grid2}>
          <div>
            <Label required>Pendapatan Bulanan Orang Tua</Label>
            <CurrencyField value={pendapatan} onChange={setPendapatan} />
            {se && !pendapatan && <p style={{ fontSize: "12px", color: "#d4183d", marginTop: "4px" }}>Isi pendapatan bulanan.</p>}
            {!se && <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "4px" }}>Ketik angka → tampil otomatis Rp 1.500.000</p>}
          </div>
          <div>
            <Label required>Jumlah Tanggungan Keluarga</Label>
            <NumberStepper value={tanggungan} onChange={setTanggungan} min={0} max={15} />
            <p style={{ fontSize: "11px", color: "#6b7a99", marginTop: "6px" }}>Tidak termasuk pendaftar</p>
          </div>
        </div>
      </div>

      {/* Catatan */}
      <div style={{ display: "flex", gap: "10px", background: "rgba(26,47,94,0.04)", border: "1px solid rgba(26,47,94,0.08)", borderRadius: "12px", padding: "13px 16px" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: "1px" }}>
          <circle cx="12" cy="12" r="10" stroke="#1a2f5e" strokeWidth="1.8" />
          <path d="M12 8v4M12 16h.01" stroke="#1a2f5e" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <p style={{ fontSize: "12px", color: "#6b7a99", lineHeight: "1.6", margin: 0 }}>
          Pastikan data akademik dan orang tua sesuai dengan dokumen resmi yang akan diunggah. Semua data akan diverifikasi sebelum keputusan akhir.
        </p>
      </div>
    </div>
  );
}
