"use client"

import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import "./password.css"

export default function togglePasswordVisibility() {
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)

  const togglePasswordVisibility = () => {
    setIsAnimating(true)

    if (!showPassword) {
      setTimeout(() => {
        setShowPassword(true)
        setTimeout(() => {
          setIsAnimating(false)
        }, 150)
      }, 300)
    } else {
      setShowPassword(false)
      setTimeout(() => {
        setIsAnimating(false)
      }, 300)
    }
  }

  return (
    <div className="password-container">
      <h2 className="password-title">Password Input</h2>

      <div className="input-wrapper">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          className="password-input"
        />
        <button
          type="button"
          className="toggle-button"
          onClick={togglePasswordVisibility}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          <div className="icon-container">
            {showPassword ? (
              <EyeOff className="eye-icon" />
            ) : (
              <>
                <Eye className="eye-icon" />
                <div className={`eye-line ${isAnimating ? "animate" : ""}`}></div>
              </>
            )}
          </div>
        </button>
      </div>

      <p className="status-text">Password is currently {showPassword ? "visible" : "hidden"}</p>
    </div>
  )
}

