import "../App.css";
import { useState, useRef, useEffect } from "react";
import "./password.css";

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

interface PasswordResetProps {
  onBackToLogin: () => void;
}

const PasswordReset = ({ onBackToLogin }: PasswordResetProps) => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const passwordRequirements = {
    length: newPassword.length >= 8,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  useEffect(() => {
    if (currentStep === 2) {
      inputRefs.current[0]?.focus();
    }
  }, [currentStep]);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Generate verification code
      const code = generateVerificationCode();

      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          subject: "Your Verification Code",
          code,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to send verification code");
      }
      setSuccess("Verification code has been sent to your email.");
      setError("");
      setCurrentStep(2);
    } catch (error) {
      setError("This email is not registered. Please enter a valid email.");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return; // Prevent multiple digits

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const code = verificationCode.join("");

      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Invalid verification code");
      }

      setSuccess("Code verified successfully!");
      setError("");
      setCurrentStep(3);
    } catch (error: any) {
      setError(error.message || "Invalid verification code. Please try again.");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      setError("Please ensure your password meets all requirements.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/update-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          newPassword,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to update password");
      }

      setSuccess("Password has been reset successfully!");
      setError("");
      setTimeout(() => {
        onBackToLogin();
      }, 2000);
    } catch (error: any) {
      setError(error.message || "Failed to reset password. Please try again.");
      setSuccess("");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-content">
        <div className="login-header">
          <h1>Reset Password</h1>
          <p>
            {currentStep === 1
              ? "Enter your email address to receive verification code."
              : currentStep === 2
              ? "Enter the verification code sent to your email."
              : "Create a new password."}
          </p>
        </div>

        <div className="step-indicator">
          <div
            className={`step-dot ${currentStep >= 1 ? "active" : ""} ${
              currentStep > 1 ? "completed" : ""
            }`}
          />
          <div
            className={`step-dot ${currentStep >= 2 ? "active" : ""} ${
              currentStep > 2 ? "completed" : ""
            }`}
          />
          <div className={`step-dot ${currentStep >= 3 ? "active" : ""}`} />
        </div>

        {currentStep === 1 && (
          <form onSubmit={handleEmailSubmit} className="form-step">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Test@SupNum.mr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="sign-in-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Verification Code"}
            </button>
          </form>
        )}

        {currentStep === 2 && (
          <form onSubmit={handleCodeSubmit} className="form-step">
            <div className="verification-code">
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                />
              ))}
            </div>

            <button
              type="submit"
              className="sign-in-button"
              disabled={
                isSubmitting || verificationCode.some((digit) => !digit)
              }
            >
              {isSubmitting ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {currentStep === 3 && (
          <form onSubmit={handlePasswordSubmit} className="form-step">
            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-wrapper">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  <div className="icon-container">
                    <svg
                      className="eye-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {showNewPassword && <div className="eye-line"></div>}
                  </div>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="toggle-button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <div className="icon-container">
                    <svg
                      className="eye-icon"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {showConfirmPassword && <div className="eye-line"></div>}
                  </div>
                </button>
              </div>
            </div>

            <div className="password-requirements">
              <ul>
                <li className={passwordRequirements.length ? "valid" : ""}>
                  At least 8 characters long
                </li>
                <li className={passwordRequirements.uppercase ? "valid" : ""}>
                  Contains uppercase letter
                </li>
                <li className={passwordRequirements.lowercase ? "valid" : ""}>
                  Contains lowercase letter
                </li>
                <li className={passwordRequirements.number ? "valid" : ""}>
                  Contains number
                </li>
              </ul>
            </div>

            <button
              type="submit"
              className="sign-in-button"
              disabled={
                isSubmitting ||
                !isPasswordValid ||
                newPassword !== confirmPassword
              }
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}

        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <button
            type="button"
            className="back-to-login"
            onClick={onBackToLogin}
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default PasswordReset;
