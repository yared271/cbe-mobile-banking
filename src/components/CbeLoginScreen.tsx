import React, { useState } from 'react';
import {
  Bell,
  ChevronDown,
  Grid,
  Lock,
  Fingerprint,
  ArrowRight,
  Loader2,
  Info,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { CbeLogo } from './CbeLogo';
import { Language } from '../types/banking';
import { LanguageModal } from './LanguageModal';

interface CbeLoginScreenProps {
  currentLang: Language;
  onToggleLang: () => void;
  onSelectLang?: (lang: Language) => void;
  onLoginSuccess?: () => void;
  onLoginWithPin: (pin: string) => Promise<{ success: boolean; error?: string }>;
  logoUrl?: string;
  onOpenLogoModal?: () => void;
}

export const CbeLoginScreen: React.FC<CbeLoginScreenProps> = ({
  currentLang,
  onToggleLang,
  onSelectLang,
  onLoginSuccess,
  onLoginWithPin,
  logoUrl,
  onOpenLogoModal,
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorToast, setErrorToast] = useState<{ title: string; message: string } | null>(null);
  const [fieldError, setFieldError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLangModal, setShowLangModal] = useState(false);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isProcessing) return;
    setErrorToast(null);
    setFieldError('');
    setInfoMessage('');

    if (!pin) {
      setFieldError(
        currentLang === 'am'
          ? 'ይህ መስክ ያስፈልጋል'
          : 'This field is required'
      );
      setErrorToast({
        title: currentLang === 'am' ? 'ስህተት' : 'Error',
        message: currentLang === 'am' ? 'እባክዎ ፒን (PIN) ያስገቡ' : 'PIN is required.',
      });
      return;
    }

    setIsProcessing(true);

    try {
      const res = await onLoginWithPin(pin);
      setIsProcessing(false);
      if (!res.success) {
        setFieldError(
          currentLang === 'am' ? 'የተሳሳተ ፒን' : 'Invalid PIN'
        );
        setErrorToast({
          title: currentLang === 'am' ? 'ስህተት' : 'Error',
          message: currentLang === 'am' ? 'የተሳሳተ የይለፍ ፒን አስገብተዋል' : 'Invalid PIN entered.',
        });
      }
    } catch (err) {
      setIsProcessing(false);
      setErrorToast({
        title: currentLang === 'am' ? 'ስህተት' : 'Error',
        message: currentLang === 'am' ? 'የኔትወርክ ግንኙነት ችግር' : 'Network connection error.',
      });
    }
  };

  // Biometrics feedback
  const handleBiometricsClick = () => {
    setErrorToast(null);
    setInfoMessage(
      currentLang === 'am'
        ? 'ባዮሜትሪክ (የጣት አሻራ) ለጊዜው ተሰናክሏል። እባክዎ ፒን (PIN) ተጠቅመው ይግቡ።'
        : 'Biometrics is currently disabled. Please login using your PIN.'
    );
  };

  return (
    <div className="min-h-screen bg-white text-slate-800 flex flex-col justify-between w-full max-w-[420px] mx-auto relative shadow-2xl overflow-hidden font-sans select-none px-6 py-5">
      {/* 1. Top Bar: Bell (Left), English Dropdown (Center), Grid (Right) */}
      <div className="flex items-center justify-between pt-1">
        {/* Left: Notification Bell Button */}
        <button
          onClick={() => {}}
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 stroke-[1.8]" />
        </button>

        {/* Center: Language Selector Pill */}
        <button
          onClick={() => setShowLangModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <span>{currentLang === 'am' ? 'አማርኛ' : 'English'}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>

        {/* Right: 4-Square Grid Button */}
        <div
          className="w-10 h-10 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-slate-100 flex items-center justify-center text-slate-700 select-none"
        >
          <Grid className="w-4.5 h-4.5 stroke-[1.8]" />
        </div>
      </div>

      {/* 2. Main Center Hero Area (100% Pure White Background, Seamless Logo) */}
      <div className="flex flex-col items-center text-center my-auto py-2 space-y-4">
        {/* CBE Official Logo - Clickable to change login screen logo */}
        <div 
          onClick={onOpenLogoModal}
          className="w-24 h-24 flex items-center justify-center bg-transparent cursor-pointer hover:scale-105 transition-transform"
        >
          <CbeLogo customUrl={logoUrl} isDarkBg={false} size="xl" className="w-24 h-24 object-contain bg-transparent" />
        </div>

        {/* Brand Typography */}
        <div className="space-y-1">
          <h1 className="text-[19px] font-bold text-[#b58b38] font-serif tracking-wide leading-tight">
            የኢትዮጵያ ንግድ ባንክ
          </h1>
          <h2 className="text-[11px] font-bold text-[#b58b38] tracking-wider uppercase font-sans">
            COMMERCIAL BANK OF ETHIOPIA
          </h2>

          {/* Thin subtle horizontal divider line */}
          <div className="w-20 h-px bg-slate-200 mx-auto my-3" />

          {/* Welcome back text ONLY (No person name as requested) */}
          <div className="space-y-0.5">
            <p className="text-[13px] text-slate-500 font-normal">
              {currentLang === 'am' ? 'እንኳን ደህና መጡ' : 'Welcome back'}
            </p>
          </div>
        </div>

        {/* Form Container: ONLY PIN input, Biometrics & Login button */}
        <div className="w-full max-w-xs space-y-4 pt-1">
          {infoMessage && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex items-center gap-2 text-left animate-in fade-in">
              <Info className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{infoMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* PIN Input Field with Soft Dimmed Lock and Placeholder */}
            <div className="space-y-1 text-left">
              <div className={`relative flex items-center bg-white rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.03)] border ${fieldError ? 'border-red-400 ring-2 ring-red-400/20' : 'border-slate-200/80 focus-within:border-[#701484]/40 focus-within:ring-2 focus-within:ring-[#701484]/10'} px-4 py-3.5 transition-all`}>
                <Lock className="w-4 h-4 text-slate-400/80 shrink-0 mr-3 stroke-[1.6]" />
                <input
                  type={showPin ? 'text' : 'password'}
                  inputMode="numeric"
                  maxLength={6}
                  value={pin}
                  disabled={isProcessing}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, ''));
                    if (fieldError) setFieldError('');
                    if (errorToast) setErrorToast(null);
                  }}
                  placeholder="PIN"
                  style={{
                    color: '#1e293b',
                    WebkitTextFillColor: '#1e293b',
                  }}
                  className="w-full bg-transparent text-slate-800 placeholder:text-slate-300 placeholder:font-normal text-sm font-semibold outline-none tracking-widest font-mono"
                  autoComplete="off"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors"
                  title={showPin ? 'Hide PIN' : 'Show PIN'}
                >
                  {showPin ? <EyeOff className="w-4 h-4 text-[#701484]" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Red field error underneath input */}
              {fieldError && (
                <p className="text-[11px] text-red-500 font-semibold pl-2 pt-0.5 animate-in fade-in">
                  {fieldError}
                </p>
              )}
            </div>

            {/* USE BIOMETRICS Button */}
            <div className="flex flex-col items-center justify-center pt-1">
              <button
                type="button"
                onClick={handleBiometricsClick}
                className="w-13 h-13 rounded-full bg-[#701484]/80 hover:bg-[#701484] active:scale-95 text-white flex items-center justify-center shadow-lg shadow-[#701484]/20 transition-transform cursor-pointer"
                title="Biometrics"
              >
                <Fingerprint className="w-7 h-7 stroke-[1.8]" />
              </button>
              <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase mt-2">
                {currentLang === 'am' ? 'የጣት አሻራ ተጠቃሚ' : 'USE BIOMETRICS'}
              </span>
            </div>

            {/* Gold Login Capsule Button with Loading Spinner */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#b88d4c] hover:bg-[#a3793b] active:scale-[0.98] text-white font-bold text-sm shadow-md shadow-[#b88d4c]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-80"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{currentLang === 'am' ? 'በማረጋገጥ ላይ...' : 'Authenticating...'}</span>
                </>
              ) : (
                <>
                  <span>{currentLang === 'am' ? 'ግባ' : 'Login'}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* 3. Footer */}
      <div className="text-center text-[11px] text-slate-400 font-sans pb-1">
        © Commercial Bank of Ethiopia
      </div>

      {/* Red Error Floating Toast as in image.png */}
      {errorToast && (
        <div className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-auto sm:w-[380px] sm:mx-auto z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="bg-[#e53935] text-white rounded-2xl p-3.5 shadow-2xl flex items-center justify-between border border-red-400/40">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <span className="text-white font-black text-xs">!</span>
              </div>
              <div className="text-left leading-tight">
                <h4 className="font-extrabold text-white text-[12.5px]">
                  {errorToast.title}
                </h4>
                <p className="text-[11px] text-white/90 font-medium mt-0.5">
                  {errorToast.message}
                </p>
              </div>
            </div>
            <button
              onClick={() => setErrorToast(null)}
              className="text-white/80 hover:text-white p-1 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Language Selection Modal */}
      <LanguageModal
        isOpen={showLangModal}
        currentLang={currentLang}
        onSelectLang={(lang: Language) => {
          if (onSelectLang) onSelectLang(lang);
          else if (lang !== currentLang) onToggleLang();
          setShowLangModal(false);
        }}
        onClose={() => setShowLangModal(false)}
      />
    </div>
  );
};
