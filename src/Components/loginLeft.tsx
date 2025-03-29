import "../App.css";
import { useState, useEffect } from "react";
import "./password.css";
import { useAuth } from "../Contexts/auth";
import { useNavigate } from "react-router-dom";
import PasswordReset from "./PasswordReset";

const LoginLeft = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [showResetForm, setShowResetForm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Attempting to sign in with:", email);
      await signIn(email, password);
      console.log("Sign in successful");
      navigate("/");
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please check your Password or Email.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleShowResetForm = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowResetForm(true);
    }, 300);
  };

  const handleBackToLogin = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShowResetForm(false);
    }, 300);
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  if (showResetForm) {
    return (
      <div
        className={`login-form-container ${isAnimating ? "sliding-out" : ""}`}
      >
        <PasswordReset onBackToLogin={handleBackToLogin} />
      </div>
    );
  }

  return (
    <div className={`login-form-container ${isAnimating ? "sliding-out" : ""}`}>
      <div className="login-form-content">
        <div className="login-header">
          <h1>Log in</h1>
          <p>Welcome back! Please enter your details.</p>
        </div>

        <form onSubmit={handleSubmit}>
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

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="toggle-button"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <div className="icon-container">
                  {showPassword ? (
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
                  ) : (
                    <>
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
                      <div
                        className={`eye-line ${
                          !showPassword ? "visible" : "hiding"
                        }`}
                      ></div>
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input
                type="checkbox"
                id="remember"
                onClick={() => setRememberMe(!rememberMe)}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <button
              type="button"
              className="forgot-password"
              onClick={handleShowResetForm}
            >
              Forgot password
            </button>
          </div>

          <button type="submit" className="sign-in-button">
            Sign in
          </button>

          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="contact">
              Don't have an account ? Contact :
              <span className="contact-number"> 36 13 35 85</span>
            </label>
            <div className="privacy">
              <label htmlFor="privacy">
                By signing in, you acknowledge that you have read and agree to
                our
                <a href="#">Terms of Service</a> and{" "}
                <a href="#">Privacy policy</a>
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginLeft;
