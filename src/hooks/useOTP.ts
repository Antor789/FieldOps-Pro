import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { useToast } from '../context/ToastContext';

export function useOTP(initialPhone = '') {
  const { requestOTP, loginWithPhoneOTP } = useAuthContext();
  const { addToast } = useToast();

  const [phone, setPhone] = useState(initialPhone);
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastDispatchedCode, setLastDispatchedCode] = useState<string | null>(null);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const sendOTP = useCallback(
    async (targetPhone: string, purpose: 'login' | 'password_reset' | 'two_factor' = 'login') => {
      setIsSending(true);
      setPhone(targetPhone);

      const res = await requestOTP(targetPhone, purpose);
      setIsSending(false);

      if (res.success) {
        setCountdown(60);
        setLastDispatchedCode(res.simulatedCode || null);
        addToast({
          title: 'OTP Dispatched via Greenweb BD',
          description: `6-digit security code sent to +88${targetPhone}${
            res.simulatedCode ? ` (Dev Code: ${res.simulatedCode})` : ''
          }`,
          type: 'sms',
        });
        return { success: true, code: res.simulatedCode };
      } else {
        addToast({
          title: 'SMS Delivery Failed',
          description: res.message,
          type: 'error',
        });
        return { success: false };
      }
    },
    [requestOTP, addToast]
  );

  const resendOTP = useCallback(async () => {
    if (countdown > 0 || !phone) return;
    return sendOTP(phone);
  }, [countdown, phone, sendOTP]);

  const verifyOTP = useCallback(
    async (targetPhone: string, code: string, rememberMe = true) => {
      setIsVerifying(true);
      const success = await loginWithPhoneOTP(targetPhone, code, rememberMe);
      setIsVerifying(false);
      return success;
    },
    [loginWithPhoneOTP]
  );

  const canResend = countdown === 0;

  // Convert English number to Bengali digits
  const toBanglaDigits = (n: number) => {
    const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
    return n
      .toString()
      .split('')
      .map((d) => bnDigits[parseInt(d, 10)] || d)
      .join('');
  };

  const banglaCountdownText = `পুনরায় কোড পাঠান ${toBanglaDigits(countdown)} সেকেন্ড পর`;
  const englishCountdownText = `Resend code in ${countdown}s`;

  return {
    phone,
    setPhone,
    countdown,
    canResend,
    isSending,
    isVerifying,
    lastDispatchedCode,
    sendOTP,
    resendOTP,
    verifyOTP,
    banglaCountdownText,
    englishCountdownText,
  };
}
