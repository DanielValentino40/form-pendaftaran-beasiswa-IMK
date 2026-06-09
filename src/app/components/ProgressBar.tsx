import { useIsMobile } from "../hooks/useIsMobile";

interface Step { label: string; short: string; }
interface ProgressBarProps { steps: Step[]; currentStep: number; }

export function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const isMobile = useIsMobile(640);
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div style={{ background: "#1a2f5e", borderBottom: "1px solid rgba(255,255,255,0.08)", flexShrink: 0 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "14px 20px" }}>

        {/* Step indicators */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: isMobile ? "center" : "flex-start",
          marginBottom: "12px",
          gap: 0,
        }}>
          {steps.map((step, i) => {
            const isCompleted = i < currentStep;
            const isActive    = i === currentStep;

            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: "0 0 auto",
                }}
              >
                {/* Circle + optional label */}
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: 700, transition: "all 0.3s",
                    background: isCompleted
                      ? "#f5a623"
                      : isActive
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.08)",
                    border: isActive ? "2px solid #f5a623" : isCompleted ? "none" : "1.5px solid rgba(255,255,255,0.2)",
                    color: "white",
                  }}>
                    {isCompleted ? (
                      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <span>{i + 1}</span>
                    )}
                  </div>

                  {/* Desktop: full label always. Mobile: short label only for active step */}
                  {(!isMobile || isActive) && (
                    <span style={{
                      color: isActive ? "white" : isCompleted ? "#f5a623" : "rgba(255,255,255,0.4)",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: isMobile ? "12px" : "13px",
                      whiteSpace: "nowrap",
                      transition: "color 0.3s",
                    }}>
                      {step.label}
                    </span>
                  )}
                </div>

                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div style={{
                    flexShrink: 0,
                    height: "1.5px",
                    width:  isMobile ? "12px" : "60px",
                    margin: isMobile ? "0 6px" : "0 12px",
                    borderRadius: "99px",
                    background: isCompleted ? "#f5a623" : "rgba(255,255,255,0.18)",
                    transition: "background 0.3s",
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress track */}
        <div style={{ height: "5px", background: "rgba(255,255,255,0.35)", borderRadius: "99px", overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: "99px", transition: "width 0.5s ease",
            width: `${progress}%`,
            background: "linear-gradient(90deg, #f5a623, #ffbc3b)",
          }} />
        </div>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "11px", marginTop: "5px" }}>
          {Math.round(progress)}% selesai
        </p>
      </div>
    </div>
  );
}
