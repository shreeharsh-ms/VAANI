import React, { useState, useEffect, useRef } from 'react';
import {
  Mail,
  Lock,
  LogIn,
  Eye,
  EyeOff,
  ShieldCheck,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Smartphone,
  UserCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { useClinicSettings } from '../../context/ClinicSettingsContext';
import { authService } from '../../services/authService';

export const LoginForm = ({ onSuccess }) => {
  const { setSession } = useAuth();
  const { notify } = useNotification();
  const { logoUrl, clinicName } = useClinicSettings();

  // Primary view state: 'CREDENTIALS' | 'OTP_VERIFY' | 'FORGOT_PASSWORD' | 'FORGOT_OTP'
  const [currentStep, setCurrentStep] = useState('CREDENTIALS');

  // Credentials State
  const [email, setEmail] = useState('palak@vaaniclinic.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // OTP State
  const [activeOtp, setActiveOtp] = useState('482910');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(30);
  const [timerActive, setTimerActive] = useState(false);
  const otpInputRefs = useRef([]);

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Common UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  // Countdown timer effect for OTP resend
  useEffect(() => {
    let interval = null;
    if (timerActive && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setTimerActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerActive, otpTimer]);

  // Focus the first OTP input upon entering OTP step
  useEffect(() => {
    if (currentStep === 'OTP_VERIFY') {
      setTimeout(() => {
        if (otpInputRefs.current[0]) {
          otpInputRefs.current[0].focus();
        }
      }, 150);
    }
  }, [currentStep]);

  // Quick Demo Account autofill
  const handleSelectDemoAccount = (role) => {
    setError('');
    if (role === 'OWNER') {
      setEmail('palak@vaaniclinic.com');
      setPassword('password123');
      notify.info('Loaded Dr. Palak Paresh Gandhi credentials');
    } else {
      setEmail('reception@vaaniclinic.com');
      setPassword('password123');
      notify.info('Loaded Front Desk Receptionist credentials');
    }
  };

  // Step 1: Submit Credentials -> Generate OTP & Transition
  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your registered clinic email/username and password.');
      return;
    }

    setLoading(true);

    try {
      // Simulate network authentication handshake (or query API if online)
      await new Promise((resolve) => setTimeout(resolve, 450));

      const authResult = authService.mockLogin(email, password);
      const generatedCode = authResult.mockOtp || '482910';
      setActiveOtp(generatedCode);
      setOtpDigits(['', '', '', '', '', '']);
      setOtpTimer(30);
      setTimerActive(true);

      notify.success('Credentials verified. Two-Factor Passcode dispatched!');
      setCurrentStep('OTP_VERIFY');
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      notify.error('Login credentials rejected.');
    } finally {
      setLoading(false);
    }
  };

  // Helper: Mask email for privacy display
  const getMaskedEmail = (val) => {
    if (!val || !val.includes('@')) return '••••@vaaniclinic.com';
    const [name, domain] = val.split('@');
    if (name.length <= 2) return `${name[0]}••@${domain}`;
    return `${name[0]}••••${name[name.length - 1]}@${domain}`;
  };

  // Step 2: Handle OTP Digit Inputs with Auto-Advance & Backspace
  const handleOtpChange = (index, value) => {
    // Keep only numbers
    const cleanVal = value.replace(/[^0-9]/g, '');
    const newDigits = [...otpDigits];

    if (cleanVal.length > 1) {
      // Handle paste in single box
      const pasteData = cleanVal.slice(0, 6).split('');
      pasteData.forEach((char, i) => {
        if (index + i < 6) {
          newDigits[index + i] = char;
        }
      });
      setOtpDigits(newDigits);
      const nextFocus = Math.min(index + pasteData.length, 5);
      if (otpInputRefs.current[nextFocus]) {
        otpInputRefs.current[nextFocus].focus();
      }
      if (newDigits.every((d) => d !== '')) {
        verifyOtpCode(newDigits.join(''));
      }
      return;
    }

    newDigits[index] = cleanVal;
    setOtpDigits(newDigits);

    // If entered a digit, jump to next box
    if (cleanVal && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    // Auto-verify when all 6 digits are populated
    if (cleanVal && index === 5 && newDigits.every((d) => d !== '')) {
      verifyOtpCode(newDigits.join(''));
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        const newDigits = [...otpDigits];
        newDigits[index - 1] = '';
        setOtpDigits(newDigits);
        otpInputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasteText = e.clipboardData.getData('text').replace(/[^0-9]/g, '').slice(0, 6);
    if (!pasteText) return;

    const newDigits = pasteText.split('');
    while (newDigits.length < 6) newDigits.push('');
    setOtpDigits(newDigits);

    if (pasteText.length === 6) {
      verifyOtpCode(pasteText);
    } else {
      otpInputRefs.current[Math.min(pasteText.length, 5)]?.focus();
    }
  };

  // Quick 1-Click Auto Fill Demo OTP
  const handleQuickFillDemoOtp = () => {
    const code = activeOtp || '482910';
    const digits = code.split('');
    setOtpDigits(digits);
    notify.info(`Demo code ${code} inserted!`);
    verifyOtpCode(code);
  };

  // Resend OTP Code
  const handleResendOtp = () => {
    if (timerActive && otpTimer > 0) return;

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtp(newCode);
    setOtpDigits(['', '', '', '', '', '']);
    setOtpTimer(30);
    setTimerActive(true);
    setError('');
    notify.success(`New passcode generated: ${newCode}`);
    setTimeout(() => {
      otpInputRefs.current[0]?.focus();
    }, 100);
  };

  // Verify OTP & Grant Access
  const verifyOtpCode = async (codeToVerify) => {
    const enteredCode = codeToVerify || otpDigits.join('');
    setError('');

    if (enteredCode.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 550));

      // Accept matching OTP or demo default '482910'
      if (enteredCode === activeOtp || enteredCode === '482910') {
        const mockAuth = authService.mockLogin(email, password);
        setVerifiedSuccess(true);

        // Store session in AuthContext & LocalStorage
        setSession(mockAuth.user, mockAuth.token);
        notify.success(`Access Authorized! Welcome back, ${mockAuth.user.name}.`);

        setTimeout(() => {
          if (onSuccess) {
            onSuccess(mockAuth);
          }
        }, 650);
      } else {
        setError(`Invalid passcode (${enteredCode}). Use code ${activeOtp} or click Quick-Fill.`);
        notify.error('Two-Factor Verification Failed.');
      }
    } catch (err) {
      setError('Error verifying OTP passcode. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 (Request Reset Code)
  const handleForgotRequest = (e) => {
    e.preventDefault();
    setError('');

    if (!forgotEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('FORGOT_OTP');
      notify.success('Password recovery code dispatched to your email.');
    }, 500);
  };

  // Forgot Password: Step 2 (Reset Password)
  const handleResetSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (forgotOtp !== '931742' && forgotOtp.length < 6) {
      setError('Please enter the 6-digit recovery code (Demo: 931742).');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccessMessage('Password reset successfully! Please sign in with your new password.');
      setEmail(forgotEmail);
      setPassword(newPassword);
      setCurrentStep('CREDENTIALS');
      notify.success('Password updated successfully!');
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200/90 p-6 sm:p-9 shadow-[0_2px_16px_rgba(0,0,0,0.04)] relative transition-all duration-300">
      
      {/* ────────────────────────────────────────────────────────── */}
      {/* ── STEP 1: CREDENTIALS (USERNAME & PASSWORD) ─────────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {currentStep === 'CREDENTIALS' && (
        <div>
          {/* Header & Logo */}
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              <img
                src={logoUrl || '/vaani-logo.png'}
                alt={clinicName}
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => { e.target.src = '/vaani-logo.png'; }}
              />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Staff Portal Sign In
            </h1>
            <p className="text-xs sm:text-[13px] text-gray-500 mt-1.5 leading-relaxed max-w-sm mx-auto">
              Enter your credentials to access patient appointments, audiometry evaluations, and clinical records.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            {/* Username / Email Field */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Staff Email or Username <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@vaaniclinic.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#301444] focus:ring-2 focus:ring-[#301444]/10 transition-all"
                />
              </div>
            </div>

            {/* Password Field with Show/Hide Toggle */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-gray-700">
                  Password <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setForgotEmail(email);
                    setCurrentStep('FORGOT_PASSWORD');
                  }}
                  className="text-xs font-medium text-purple-700 hover:text-purple-900 transition-colors cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-10 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#301444] focus:ring-2 focus:ring-[#301444]/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Session Checkbox */}
            <div className="flex items-center justify-between text-xs text-gray-600 pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-gray-300 text-[#301444] focus:ring-[#301444] w-4 h-4 cursor-pointer"
                />
                <span>Remember this workstation (30-day session)</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-1.5 py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#301444] hover:bg-[#200b30] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Signing In...</span>
                </>
              ) : (
                <span>Sign In to Portal</span>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher */}
          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between text-xs">
            <span className="text-[11px] font-medium text-gray-400">Quick Fill Demo:</span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('OWNER')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  email.includes('palak')
                    ? 'border-[#301444] bg-purple-50 text-[#301444]'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Dr. Palak Gandhi
              </button>
              <button
                type="button"
                onClick={() => handleSelectDemoAccount('RECEPTION')}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors cursor-pointer ${
                  email.includes('reception')
                    ? 'border-[#301444] bg-purple-50 text-[#301444]'
                    : 'border-gray-200 hover:border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                Front Desk
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── STEP 2: TWO-FACTOR OTP VERIFICATION ─────────────────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {currentStep === 'OTP_VERIFY' && (
        <div>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#301444] border border-purple-100 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Two-Factor Authentication
            </h2>
            <p className="text-xs sm:text-[13px] text-gray-500 mt-1 max-w-sm mx-auto">
              Enter the 6-digit verification code sent to your registered clinic device.
            </p>
          </div>

          {/* Masked destination info pill */}
          <div className="p-2.5 mb-4 rounded-lg bg-gray-50 border border-gray-200/80 flex items-center justify-center gap-3 text-xs text-gray-600">
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Smartphone className="w-3.5 h-3.5 text-gray-400" />
              +91 ••••• •8291
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <Mail className="w-3.5 h-3.5 text-gray-400" />
              {getMaskedEmail(email)}
            </span>
          </div>

          {/* Demo Passcode Helper */}
          <div className="mb-4 p-2.5 rounded-lg bg-purple-50/70 border border-purple-100/90 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span>Demo Passcode:</span>
              <strong className="font-mono text-[#301444] font-bold">{activeOtp}</strong>
            </div>
            <button
              type="button"
              onClick={handleQuickFillDemoOtp}
              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#301444] text-white hover:bg-[#200b30] transition-colors cursor-pointer"
            >
              Auto-Fill
            </button>
          </div>

          {/* Error feedback */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 6 Digit OTP Input Boxes */}
          <div className="mb-5">
            <label className="block text-center text-xs font-medium text-gray-600 mb-2.5">
              Enter 6-Digit Passcode
            </label>
            <div className="flex justify-between items-center gap-2 max-w-sm mx-auto" onPaste={handleOtpPaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  className={`w-11 sm:w-12 h-12 sm:h-13 text-center font-mono text-xl font-bold rounded-lg border bg-white text-[#301444] transition-all focus:outline-none focus:ring-2 ${
                    digit
                      ? 'border-[#301444] bg-purple-50/30'
                      : 'border-gray-300 hover:border-gray-400'
                  } focus:border-[#301444] focus:ring-[#301444]/10`}
                />
              ))}
            </div>
          </div>

          {/* Countdown & Resend Option */}
          <div className="flex items-center justify-between text-xs text-gray-500 mb-5 px-1">
            <span>
              {timerActive ? (
                <span className="text-gray-500 flex items-center gap-1">
                  Resend code in <strong className="font-mono text-[#301444]">{otpTimer}s</strong>
                </span>
              ) : (
                <span className="text-gray-500">Didn't receive code?</span>
              )}
            </span>

            <button
              type="button"
              disabled={timerActive && otpTimer > 0}
              onClick={handleResendOtp}
              className={`font-medium transition-colors cursor-pointer flex items-center gap-1 ${
                timerActive && otpTimer > 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-purple-700 hover:text-purple-900'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${timerActive && otpTimer > 0 ? '' : 'text-purple-600'}`} />
              <span>Resend Code</span>
            </button>
          </div>

          {/* Verification CTA Buttons */}
          <div className="space-y-2.5">
            <button
              type="button"
              disabled={loading || verifiedSuccess}
              onClick={() => verifyOtpCode()}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#301444] hover:bg-[#200b30] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Verifying...</span>
                </>
              ) : verifiedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Verified! Redirecting...</span>
                </>
              ) : (
                <span>Verify & Sign In</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setCurrentStep('CREDENTIALS');
              }}
              className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── STEP 3: FORGOT PASSWORD REQUEST ─────────────────────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {currentStep === 'FORGOT_PASSWORD' && (
        <div>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-full bg-purple-50 text-[#301444] border border-purple-100 flex items-center justify-center mx-auto mb-3">
              <KeyRound className="w-5 h-5" />
            </div>

            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Reset Password
            </h2>
            <p className="text-xs sm:text-[13px] text-gray-500 mt-1 max-w-sm mx-auto">
              Enter your registered staff email address to receive password reset instructions.
            </p>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleForgotRequest} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-gray-700">
                Staff Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3 text-gray-400 pointer-events-none">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="name@vaaniclinic.com"
                  required
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#301444] focus:ring-2 focus:ring-[#301444]/10 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#301444] hover:bg-[#200b30] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Sending Code...</span>
                </>
              ) : (
                <span>Send Reset Code</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setCurrentStep('CREDENTIALS');
              }}
              className="w-full py-2 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Sign In</span>
            </button>
          </form>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────── */}
      {/* ── STEP 4: FORGOT PASSWORD OTP & NEW PASSWORD ─────────── */}
      {/* ────────────────────────────────────────────────────────── */}
      {currentStep === 'FORGOT_OTP' && (
        <div>
          {/* Header */}
          <div className="text-center mb-5">
            <h2 className="text-xl font-bold tracking-tight text-gray-900">
              Set New Password
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Enter the recovery passcode and choose a new secure password.
            </p>
          </div>

          {/* Demo Reset Code Banner */}
          <div className="mb-4 p-2.5 rounded-lg bg-purple-50/70 border border-purple-100 text-xs flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-gray-700">
              <span>Demo Code:</span>
              <strong className="font-mono text-[#301444]">931742</strong>
            </div>
            <button
              type="button"
              onClick={() => setForgotOtp('931742')}
              className="px-2 py-0.5 rounded text-[11px] font-semibold bg-[#301444] text-white hover:bg-[#200b30] cursor-pointer"
            >
              Fill Code
            </button>
          </div>

          {/* Feedback messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleResetSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Recovery Code
              </label>
              <input
                type="text"
                value={forgotOtp}
                onChange={(e) => setForgotOtp(e.target.value)}
                placeholder="6-digit recovery code"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#301444]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                New Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  required
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#301444]"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-700"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-gray-700">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:border-[#301444]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg font-semibold text-sm text-white bg-[#301444] hover:bg-[#200b30] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-purple-200" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <span>Update Password & Return to Login</span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setError('');
                setCurrentStep('CREDENTIALS');
              }}
              className="w-full py-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel</span>
            </button>
          </form>
        </div>
      )}

      {/* Security Footer Note */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock className="w-3.5 h-3.5 text-gray-400" />
        <span>Authorized Personnel • Clinical Practice Portal</span>
      </div>
    </div>
  );
};

export default LoginForm;
