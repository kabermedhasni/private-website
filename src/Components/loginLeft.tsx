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
          <h1>ArenaX</h1>
          <p>Play Like a Pro. Book Like One</p>
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
              <a
                href="https://wa.me/36133585"
                target="_blank"
              >
                <svg
                  fill="#00b5de"
                  width="800px"
                  height="800px"
                  viewBox="0 0 256 256"
                  xmlns="http://www.w3.org/2000/svg"
                  className="whatsapp-icon"
                >
                  <g>
                    <path d="M128.00049,24a104.0281,104.0281,0,0,0-91.189,154.041l-8.54687,29.915A15.99944,15.99944,0,0,0,48.044,227.73635l29.916-8.54688A104.00728,104.00728,0,1,0,128.00049,24ZM152.125,192c-.0293.02344-.084,0-.126,0A87.99949,87.99949,0,0,1,64,103.876,36.01385,36.01385,0,0,1,100,68,14.92643,14.92643,0,0,1,112.93066,75.503l11.69092,20.46094a16.01674,16.01674,0,0,1-.17187,16.16992l-7.11084,11.85156a40.03607,40.03607,0,0,0,14.67627,14.67676l11.85107-7.11133a16.01883,16.01883,0,0,1,16.17041-.17285l20.45947,11.69141A14.9238,14.9238,0,0,1,188,156,36.01427,36.01427,0,0,1,152.125,192Z" />
                    <path d="M136.4502,154.6592a7.99584,7.99584,0,0,1-7.397.43652,56.03179,56.03179,0,0,1-28.14892-28.14843,7.99972,7.99972,0,0,1,.43652-7.39746l9.38867-15.64844L99.36328,84.00979A19.99027,19.99027,0,0,0,80,103.89748,72.00036,72.00036,0,0,0,152,176h.10254a19.99027,19.99027,0,0,0,19.88769-19.36328l-19.8916-11.36621Z" />
                  </g>
                </svg>
              </a>
            </label>
            <div className="privacy">
              <label htmlFor="privacy">
                By signing in, you acknowledge that you have read and agree to
                our
                <span onClick={() => navigate("/termsOfServices")}>
                  Terms of Service
                </span>{" "}
                and
                <span onClick={() => navigate("/privacyPolicy")}>
                  Privacy policy
                </span>
              </label>
            </div>
          </div>
        </form>
        <p className="powered-by-phone">Powered by WhileTrueDev</p>
      </div>
    </div>
  );
};

export default LoginLeft;
