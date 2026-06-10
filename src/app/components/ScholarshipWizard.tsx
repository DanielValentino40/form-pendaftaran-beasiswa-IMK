import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { StepPersonalInfo } from "./StepPersonalInfo";
import { StepAcademicInfo } from "./StepAcademicInfo";
import { StepDocuments } from "./StepDocuments";
import { StepReview } from "./StepReview";
import { SuccessPage } from "./SuccessPage";
import { ProgressBar } from "./ProgressBar";
import { SidePanel } from "./SidePanel";
import type { PersonalFormData } from "./StepPersonalInfo";
import type { AcademicFormData } from "./StepAcademicInfo";
import type { DocItem } from "./StepDocuments";

const STEPS = [
  { label: "Informasi Pribadi",         short: "Pribadi"  },
  { label: "Latar Akademik & Keluarga", short: "Akademik" },
  { label: "Dokumen & Kirim",           short: "Dokumen"  },
  { label: "Tinjau & Konfirmasi",       short: "Tinjau"   },
];

const STEP_DESC = [
  "Lengkapi data diri Anda dengan benar. Informasi ini akan diverifikasi oleh panitia.",
  "Isi riwayat akademik, data orang tua, dan detail perkuliahan Anda saat ini.",
  "Unggah dokumen pendukung untuk melengkapi pendaftaran beasiswa.",
  "Periksa kembali seluruh data sebelum mengirimkan pendaftaran.",
];

const DRAFT_KEY = "beasiswa_draft";

function formatTime(date: Date): string {
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function ScholarshipWizard() {
  const isMobile = useIsMobile(900);
  const [currentStep, setCurrentStep] = useState(0);
  const [draftSaved, setDraftSaved] = useState(false);

  // Per-step valid + showErrors arrays (index = step)
  const [stepValid,   setStepValid]   = useState([false, false, false, false]);
  const [showErrors,  setShowErrors]  = useState([false, false, false, false]);
  const [shaking,     setShaking]     = useState(false);
  const [submitted,   setSubmitted]   = useState(false);

  // Collected form data for review page
  const [personalData, setPersonalData] = useState<PersonalFormData | null>(null);
  const [academicData, setAcademicData] = useState<AcademicFormData | null>(null);
  const [docData,      setDocData]      = useState<{ docs: DocItem[]; statement: string } | null>(null);

  // Draft save state
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [draftTimestamp, setDraftTimestamp] = useState<string>("");
  const [draftRestoreKey, setDraftRestoreKey] = useState(0); // forces step remount on restore
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const saveStatusTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Refs to always have latest data in timer callback
  const personalDataRef = useRef(personalData);
  const academicDataRef = useRef(academicData);
  const docDataRef = useRef(docData);
  const currentStepRef = useRef(currentStep);
  useEffect(() => { personalDataRef.current = personalData; }, [personalData]);
  useEffect(() => { academicDataRef.current = academicData; }, [academicData]);
  useEffect(() => { docDataRef.current = docData; }, [docData]);
  useEffect(() => { currentStepRef.current = currentStep; }, [currentStep]);

  // Save draft to localStorage
  const saveDraftToStorage = useCallback(() => {
    setSaveStatus("saving");
    try {
      const draft = {
        personalData: personalDataRef.current,
        academicData: academicDataRef.current,
        docData: docDataRef.current ? {
          docs: docDataRef.current.docs.map(d => ({ ...d, fileError: undefined })),
          statement: docDataRef.current.statement,
        } : null,
        currentStep: currentStepRef.current,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
      const now = new Date();
      setLastSavedAt(formatTime(now));
    } catch (e) {
      // localStorage might be full or disabled
      console.warn("Failed to save draft:", e);
    }
    setSaveStatus("saved");
    if (saveStatusTimerRef.current) clearTimeout(saveStatusTimerRef.current);
    saveStatusTimerRef.current = setTimeout(() => setSaveStatus("idle"), 3000);
  }, []);

  // Check for existing draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.savedAt) {
          const d = new Date(draft.savedAt);
          setDraftTimestamp(d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) + " pukul " + formatTime(d));
          setShowRestoreDialog(true);
        }
      }
    } catch (e) {
      // ignore parse errors
    }
  }, []);

  // Auto-save timer: every 5 minutes
  useEffect(() => {
    if (autoSaveEnabled && !submitted) {
      autoSaveTimerRef.current = setInterval(() => {
        saveDraftToStorage();
      }, 2 * 60 * 1000); // 2 minutes
    }
    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
        autoSaveTimerRef.current = null;
      }
    };
  }, [autoSaveEnabled, submitted, saveDraftToStorage]);

  function handleRestoreDraft() {
    try {
      const raw = localStorage.getItem(DRAFT_KEY);
      if (raw) {
        const draft = JSON.parse(raw);
        if (draft.personalData) setPersonalData(draft.personalData);
        if (draft.academicData) setAcademicData(draft.academicData);
        if (draft.docData) setDocData(draft.docData);
        if (draft.currentStep !== undefined) setCurrentStep(draft.currentStep);
        // Increment key to force StepPersonalInfo & StepAcademicInfo to remount
        // so their internal useState picks up the new initialData
        setDraftRestoreKey(k => k + 1);
      }
    } catch (e) {
      console.warn("Failed to restore draft:", e);
    }
    setShowRestoreDialog(false);
  }

  function handleDiscardDraft() {
    localStorage.removeItem(DRAFT_KEY);
    setShowRestoreDialog(false);
  }

  function makeOnValidChange(i: number) {
    return (valid: boolean) =>
      setStepValid((prev) => prev.map((v, idx) => (idx === i ? valid : v)));
  }

  function makeShowErrors(i: number) { return showErrors[i]; }

  function handleSaveDraft() {
    saveDraftToStorage();
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  }

  function scrollTop() {
    const scrollable =
      document.documentElement.scrollTop > 0 ? document.documentElement :
      document.body.scrollTop > 0 ? document.body :
      document.documentElement;

    const start = scrollable.scrollTop || window.scrollY || 0;
    if (start === 0) return;

    const duration = 480;
    const startTime = performance.now();

    function easeOutCubic(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const position = start * (1 - easeOutCubic(progress));
      scrollable.scrollTop = position;
      window.scrollTo(0, position);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  function handleNext() {
    if (!stepValid[currentStep]) {
      setShowErrors((prev) => prev.map((v, i) => (i === currentStep ? true : v)));
      setShaking(true);
      setTimeout(() => setShaking(false), 400);
      return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
      scrollTop();
    }
  }

  function handleBack() {
    if (currentStep > 0) { setCurrentStep((s) => s - 1); scrollTop(); }
  }

  function handleEdit(step: number) {
    setCurrentStep(step);
    scrollTop();
  }

  function handleSubmit() {
    // Clear draft from localStorage on submit
    localStorage.removeItem(DRAFT_KEY);
    setSubmitted(true);
  }

  const isReviewStep = currentStep === STEPS.length - 1;

  if (submitted) {
    return (
      <SuccessPage
        registrationId="REG-2026-0842"
        scholarshipName={personalData?.scholarshipName}
        submittedAt="7 Juni 2026"
        onRestart={() => {
          setSubmitted(false);
          setCurrentStep(0);
          setStepValid([false, false, false, false]);
          setShowErrors([false, false, false, false]);
        }}
      />
    );
  }

  return (
    <>
    {/* Draft restore dialog */}
    {showRestoreDialog && (
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{
          background: "white", borderRadius: "20px", padding: "32px",
          maxWidth: "420px", width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
          textAlign: "center",
        }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "16px",
            background: "rgba(245,166,35,0.12)", margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 21v-8H7v8M7 3v5h8" stroke="#f5a623" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a2f5e", margin: "0 0 8px" }}>
            Draf Ditemukan
          </h2>
          <p style={{ fontSize: "13px", color: "#6b7a99", lineHeight: 1.6, margin: "0 0 24px" }}>
            Anda memiliki draf tersimpan dari <strong style={{ color: "#0f1f3d" }}>{draftTimestamp}</strong>. Apakah Anda ingin melanjutkan pengisian?
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={handleDiscardDraft}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                border: "1.5px solid rgba(26,47,94,0.15)", background: "white",
                color: "#1a2f5e", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              Mulai Baru
            </button>
            <button
              onClick={handleRestoreDraft}
              style={{
                flex: 1, padding: "12px", borderRadius: "12px",
                border: "none",
                background: "linear-gradient(135deg,#f5a623,#e8940d)",
                color: "white", fontSize: "13px", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 4px 14px rgba(245,166,35,0.35)",
              }}
            >
              Lanjutkan Draf
            </button>
          </div>
        </div>
      </div>
    )}

    <div style={{ minHeight: "100vh", background: "#f4f6f9", display: "flex", flexDirection: "column", fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ background: "#1a2f5e", padding: "12px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "34px", height: "34px", borderRadius: "10px", background: "#f5a623", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
        </div>
        <div className="wizard-header-meta">
          <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px" }}>ID Pendaftaran: SCH-2026-0842</span>
          <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="white" strokeWidth="2" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </header>

      {/* Progress */}
      <ProgressBar steps={STEPS} currentStep={currentStep} />

      {/* Body */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isMobile ? "1fr" : "1fr 290px",
        gap: isMobile ? "16px" : "24px",
        alignItems: "start",
        maxWidth: "1100px",
        width: "100%",
        margin: "0 auto",
        padding: isMobile ? "16px 14px" : "28px 24px",
        boxSizing: "border-box",
      }}>

        {/* Form card */}
        <div style={{ background: "white", borderRadius: isMobile ? "16px" : "20px", padding: isMobile ? "20px 16px" : "36px", border: "1px solid rgba(26,47,94,0.1)", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
          <div style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#f5a623", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 4px" }}>
              Langkah {currentStep + 1} dari {STEPS.length}
            </p>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#1a2f5e", margin: "0 0 6px", lineHeight: 1.3 }}>
              {STEPS[currentStep].label}
            </h1>
            <p style={{ fontSize: "13px", color: "#6b7a99", margin: 0, lineHeight: 1.5 }}>
              {STEP_DESC[currentStep]}
            </p>
          </div>

          {/*
            All step components are kept mounted (display none) to preserve state.
            Only the current step is visible.
          */}
          <div style={{ display: currentStep === 0 ? "block" : "none" }}>
            <StepPersonalInfo
              key={`personal-${draftRestoreKey}`}
              onValidChange={makeOnValidChange(0)}
              showErrors={makeShowErrors(0)}
              onDataChange={setPersonalData}
              initialData={draftRestoreKey > 0 ? personalData : null}
            />
          </div>
          <div style={{ display: currentStep === 1 ? "block" : "none" }}>
            <StepAcademicInfo
              key={`academic-${draftRestoreKey}`}
              onValidChange={makeOnValidChange(1)}
              showErrors={makeShowErrors(1)}
              onDataChange={setAcademicData}
              initialData={draftRestoreKey > 0 ? academicData : null}
            />
          </div>
          <div style={{ display: currentStep === 2 ? "block" : "none" }}>
            <StepDocuments
              key={`docs-${draftRestoreKey}`}
              onValidChange={makeOnValidChange(2)}
              showErrors={makeShowErrors(2)}
              onDataChange={setDocData}
              scholarshipId={personalData?.scholarshipId ?? ""}
              initialDocs={draftRestoreKey > 0 ? docData?.docs : null}
              initialStatement={draftRestoreKey > 0 ? docData?.statement : undefined}
            />
          </div>
          <div style={{ display: currentStep === 3 ? "block" : "none" }}>
            <StepReview
              personalData={personalData}
              academicData={academicData}
              docData={docData}
              onEdit={handleEdit}
              onValidChange={makeOnValidChange(3)}
              showErrors={makeShowErrors(3)}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Navigation — hidden on review step (submit is inside StepReview) */}
          {!isReviewStep && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "32px", paddingTop: "20px", borderTop: "1px solid rgba(26,47,94,0.08)" }}>
              <button
                onClick={handleBack}
                disabled={currentStep === 0}
                style={{
                  padding: "10px 20px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                  border: "1.5px solid rgba(26,47,94,0.15)", background: "transparent",
                  color: currentStep === 0 ? "#c0c8d8" : "#1a2f5e",
                  cursor: currentStep === 0 ? "not-allowed" : "pointer",
                  opacity: currentStep === 0 ? 0.5 : 1, fontFamily: "inherit",
                }}
              >
                ← Kembali
              </button>
              <button
                onClick={handleNext}
                className={shaking ? "shake" : ""}
                style={{
                  padding: "10px 28px", borderRadius: "10px", fontSize: "13px", fontWeight: 700,
                  color: "white", border: "none", cursor: "pointer", fontFamily: "inherit",
                  background: "linear-gradient(135deg,#f5a623,#e8940d)",
                  boxShadow: "0 4px 14px rgba(245,166,35,0.35)",
                }}
              >
                Lanjut →
              </button>
            </div>
          )}

          {/* Back button only on review step */}
          {isReviewStep && (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(26,47,94,0.08)" }}>
              <button
                onClick={handleBack}
                style={{
                  padding: "9px 18px", borderRadius: "10px", fontSize: "13px", fontWeight: 600,
                  border: "1.5px solid rgba(26,47,94,0.15)", background: "transparent",
                  color: "#1a2f5e", cursor: "pointer", fontFamily: "inherit",
                }}
              >
                ← Kembali ke Dokumen
              </button>
            </div>
          )}
        </div>

        {/* Side panel */}
        <SidePanel
          onSaveDraft={handleSaveDraft}
          draftSaved={draftSaved}
          currentStep={currentStep}
          totalSteps={STEPS.length}
          autoSaveEnabled={autoSaveEnabled}
          onAutoSaveToggle={() => setAutoSaveEnabled(prev => !prev)}
          lastSavedAt={lastSavedAt}
          saveStatus={saveStatus}
        />
      </div>

      {/* Footer */}
      <footer style={{ textAlign: "center", padding: "14px 16px", fontSize: "12px", color: "#6b7a99", fontFamily: "inherit" }}>
        © 2026 Universitas Dian Nuswantoro · Data Anda dilindungi dan dienkripsi ·{" "}
        <span style={{ color: "#f5a623", cursor: "pointer" }}>Hubungi Dukungan</span>
      </footer>
    </div>
    </>
  );
}
