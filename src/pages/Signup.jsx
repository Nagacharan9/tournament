import { useState } from 'react'
import './Signup.css'

function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: ''
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState('weak')
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpVerified, setOtpVerified] = useState(false)
  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  // Mobile number validation (10 digits, can start with +91 or just digits)
  const mobileRegex = /^(\+91)?[6-9]\d{9}$/

  // Password strength checker
  const checkPasswordStrength = (password) => {
    let strength = 'weak'
    
    if (password.length >= 8) {
      const hasUpperCase = /[A-Z]/.test(password)
      const hasLowerCase = /[a-z]/.test(password)
      const hasNumbers = /\d/.test(password)
      const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)

      const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length

      if (strengthCount === 4) {
        strength = 'high'
      } else if (strengthCount >= 3) {
        strength = 'average'
      } else {
        strength = 'weak'
      }
    }
    
    return strength
  }

  // Validate form
  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!mobileRegex.test(formData.mobileNumber.replace(/\s/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (passwordStrength === 'weak') {
      newErrors.password = 'Password is too weak. Add uppercase, numbers, and symbols'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Send OTP
  const handleSendOtp = async () => {
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      setErrors({ email: 'Please enter a valid email first' })
      return
    }

    setLoading(true)
    try {
      // Simulate OTP sending
      console.log('📧 Sending OTP to:', formData.email)
      
      // In production, call your backend API
      // await fetch('/api/auth/send-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email })
      // })

      setOtpSent(true)
      setSuccessMessage('✅ OTP sent to your email!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ general: 'Failed to send OTP. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  const handleVerifyOtp = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' })
      return
    }

    setLoading(true)
    try {
      // Simulate OTP verification
      console.log('✓ Verifying OTP:', otp)
      
      // In production, call your backend API
      // await fetch('/api/auth/verify-otp', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email, otp })
      // })

      setOtpVerified(true)
      setSuccessMessage('✅ Email verified successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (error) {
      setErrors({ otp: 'Invalid OTP. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return
    if (!otpVerified) {
      setErrors({ general: 'Please verify your email with OTP first' })
      return
    }

    setLoading(true)
    try {
      console.log('Registering user:', formData)
      
      // Call backend registration
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // })
      // const data = await response.json()

      setSuccessMessage('✅ Registration successful! Redirecting to login...')
      setTimeout(() => {
        // Redirect to login page
        window.location.href = '/login'
      }, 2000)
    } catch (error) {
      setErrors({ general: 'Registration failed. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value))
    }

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Account</h1>
        <p className="signup-subtitle">Join TradeArena and start trading</p>

        {errors.general && <div className="error-message">{errors.general}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className={errors.fullName ? 'input-error' : ''}
            />
            {errors.fullName && <span className="field-error">{errors.fullName}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="email-group">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className={errors.email ? 'input-error' : ''}
              />
              {!otpVerified && (
                <button
                  type="button"
                  className="send-otp-btn"
                  onClick={handleSendOtp}
                  disabled={loading || !emailRegex.test(formData.email)}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              )}
              {otpVerified && <span className="verified-badge">✅ Verified</span>}
            </div>
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          {/* OTP Input */}
          {otpSent && !otpVerified && (
            <div className="form-group">
              <label htmlFor="otp">Enter OTP</label>
              <div className="otp-group">
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.slice(0, 6))
                    if (errors.otp) setErrors(prev => ({ ...prev, otp: '' }))
                  }}
                  placeholder="000000"
                  maxLength="6"
                  className={errors.otp ? 'input-error' : ''}
                />
                <button
                  type="button"
                  className="verify-otp-btn"
                  onClick={handleVerifyOtp}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : 'Verify'}
                </button>
              </div>
              {errors.otp && <span className="field-error">{errors.otp}</span>}
            </div>
          )}

          {/* Mobile Number */}
          <div className="form-group">
            <label htmlFor="mobileNumber">Mobile Number</label>
            <input
              type="tel"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              placeholder="10-digit mobile number or +91..."
              className={errors.mobileNumber ? 'input-error' : ''}
            />
            {errors.mobileNumber && <span className="field-error">{errors.mobileNumber}</span>}
            {formData.mobileNumber && mobileRegex.test(formData.mobileNumber.replace(/\s/g, '')) && (
              <span className="validation-success">✅ Valid mobile number</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-group">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter a strong password"
                className={errors.password ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <div className={`password-strength strength-${passwordStrength}`}>
                <div className="strength-bar">
                  <div className={`strength-fill ${passwordStrength}`}></div>
                </div>
                <span className={`strength-text ${passwordStrength}`}>
                  {passwordStrength === 'weak' && '⚠️ Weak'}
                  {passwordStrength === 'average' && '⚡ Average'}
                  {passwordStrength === 'high' && '✅ Strong'}
                </span>
              </div>
            )}

            {errors.password && <span className="field-error">{errors.password}</span>}

            <div className="password-hints">
              <p>Password should contain:</p>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>
                  {formData.password.length >= 8 ? '✓' : '○'} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
                  {/[A-Z]/.test(formData.password) ? '✓' : '○'} One uppercase letter
                </li>
                <li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
                  {/[a-z]/.test(formData.password) ? '✓' : '○'} One lowercase letter
                </li>
                <li className={/\d/.test(formData.password) ? 'valid' : ''}>
                  {/\d/.test(formData.password) ? '✓' : '○'} One number
                </li>
                <li className={/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? 'valid' : ''}>
                  {/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password) ? '✓' : '○'} One special character
                </li>
              </ul>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="password-input-group">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Re-enter your password"
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <span className="validation-success">✅ Passwords match</span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="signup-btn"
            disabled={loading || !otpVerified}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>

          <p className="signin-link">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </form>
      </div>
    </div>
  )
}

export default Signup
