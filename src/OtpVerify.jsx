import { useState, useRef, useEffect } from "react";
import "./auth.css";

// ─────────────────────────────────────────────────────────────────────────────
// OtpVerify — Step 2 of registration
// 6-box OTP input with auto-focus, paste support, and countdown timer
// ─────────────────────────────────────────────────────────────────────────────

const OTP_LENGTH = 6;
const RESEND_SECONDS = 30;

export default function OtpVerify({ phone, onVerified, onBack }) {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  // Auto-focus first box
  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  const handleChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.every(Boolean)) handleVerify();
  };

  // Handle paste — fills all boxes at once
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = [...otp];
    pasted.split("").forEach((char, i) => { next[i] = char; });
    setOtp(next);
    inputRefs.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const handleVerify = async () => {
    setError("");
    const code = otp.join("");
    if (code.length < OTP_LENGTH) { setError("Please enter all 6 digits."); return; }

    setLoading(true);
    try {
      // TODO (backend): POST /api/auth/verify-otp  { phone, otp: code }
      // const res = await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ phone, otp: code }),
      // });
      // if (!res.ok) throw new Error('Invalid OTP');

      await new Promise((r) => setTimeout(r, 1000));
      // For demo, accept any 6-digit OTP
      onVerified(phone);
    } catch {
      setError("Incorrect OTP. Please try again.");
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      // TODO (backend): POST /api/auth/send-otp  { phone }
      await new Promise((r) => setTimeout(r, 800));
      setTimer(RESEND_SECONDS);
      setOtp(Array(OTP_LENGTH).fill(""));
      inputRefs.current[0]?.focus();
    } finally {
      setResending(false);
    }
  };

  const maskedPhone = phone.slice(0, 3) + "XXXXX" + phone.slice(-2);

  return (
    <div className="auth-page">
      <aside className="auth-panel">
        <div className="panel-top">
          <div className="logo-mark">
            <div className="logo-dot-wrap">
              <span className="logo-dot center" /><span className="logo-dot top" />
              <span className="logo-dot left" /><span className="logo-dot right" />
            </div>
          </div>
          <div>
            <h1 className="brand-name">The Curry</h1>
            <p className="brand-sub">Taste of Madurai</p>
          </div>
        </div>

        <div className="step-indicator">
          <div className="step-item">
            <div className="step-num done">✓</div>
            <span className="step-label done">Mobile number</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num active">2</div>
            <span className="step-label active">Verify OTP</span>
          </div>
          <div className="step-connector" />
          <div className="step-item">
            <div className="step-num">3</div>
            <span className="step-label">Set up profile</span>
          </div>
        </div>

        <blockquote className="panel-quote">
          <p>"Where every bite carries the soul of Madurai's streets."</p>
          <cite>— The Curry, since 2024</cite>
        </blockquote>
      </aside>

      <main className="auth-content">
        <div className="auth-card">
          <button className="btn-back" onClick={onBack}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Change number
          </button>

          <p className="form-eyebrow">Create account — Step 2 of 3</p>
          <h2 className="form-heading">Check your messages</h2>
          <div className="heading-accent" />
          <p className="form-sub">
            We sent a 6-digit OTP to <strong>{maskedPhone}</strong>. Enter it below.
          </p>

          {error && <p className="form-error">{error}</p>}

          <div className="otp-wrap" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => (inputRefs.current[i] = el)}
                className={`otp-box${digit ? " filled" : ""}`}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
              />
            ))}
          </div>

          <button
            className="btn-primary"
            onClick={handleVerify}
            disabled={loading || otp.some((d) => !d)}
          >
            {loading ? "Verifying…" : "Verify OTP"}
          </button>

          <div className="resend-row">
            {timer > 0 ? (
              <span className="resend-timer">
                Resend OTP in <strong>{timer}s</strong>
              </span>
            ) : (
              <button className="btn-ghost" onClick={handleResend} disabled={resending}>
                {resending ? "Resending…" : "Resend OTP"}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
