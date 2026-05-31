// Validation utilities for TradeArena

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Mobile number validation (India format: 10 digits or +91)
export const validateMobileNumber = (mobileNumber) => {
  const cleaned = mobileNumber.replace(/\s/g, '');
  const mobileRegex = /^(\+91)?[6-9]\d{9}$/;
  return mobileRegex.test(cleaned);
};

// Password strength checker
export const checkPasswordStrength = (password) => {
  let strength = 'weak';

  if (password.length >= 8) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

    const strengthCount = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar].filter(Boolean).length;

    if (strengthCount === 4) {
      strength = 'high';
    } else if (strengthCount >= 3) {
      strength = 'average';
    } else {
      strength = 'weak';
    }
  }

  return strength;
};

// Get password requirements checklist
export const getPasswordRequirements = (password) => {
  return {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumbers: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
  };
};

// Full name validation
export const validateFullName = (name) => {
  return name.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(name);
};

// Username validation
export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// OTP validation (6 digits)
export const validateOTP = (otp) => {
  return /^\d{6}$/.test(otp);
};

// Password match validation
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword && password.length > 0;
};

// Form validation object builder
export const validateRegistrationForm = (formData) => {
  const errors = {};

  // Full name
  if (!formData.fullName?.trim()) {
    errors.fullName = 'Full name is required';
  } else if (!validateFullName(formData.fullName)) {
    errors.fullName = 'Full name should contain only letters';
  }

  // Email
  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  // Mobile
  if (!formData.mobileNumber?.trim()) {
    errors.mobileNumber = 'Mobile number is required';
  } else if (!validateMobileNumber(formData.mobileNumber)) {
    errors.mobileNumber = 'Invalid mobile number (10 digits)';
  }

  // Password
  if (!formData.password?.trim()) {
    errors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (checkPasswordStrength(formData.password) === 'weak') {
    errors.password = 'Password is too weak. Add uppercase, numbers, and symbols';
  }

  // Confirm password
  if (!passwordsMatch(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

// Login form validation
export const validateLoginForm = (formData) => {
  const errors = {};

  if (!formData.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Invalid email format';
  }

  if (!formData.password?.trim()) {
    errors.password = 'Password is required';
  }

  return errors;
};
