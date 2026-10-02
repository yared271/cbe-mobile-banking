import React, { useState } from 'react';
import {
  ChevronLeft,
  Search,
  MoreVertical,
  Globe,
  UserCheck,
  Bell,
  Fingerprint,
  KeyRound,
  Lock,
  LogOut,
  ChevronRight,
  X,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Language } from '../types/banking';
import { CbeMyInformationScreen } from './CbeMyInformationScreen';
import { PWAInstallButton } from './PWAInstallButton';

interface CbeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
  onToggleLang: () => void;
  userProfile: {
    fullName: string;
    accountNumber: string;
    phone: string;
    pin: string;
  };
  onUpdatePin: (newPin: string) => void;
  onOpenLogoModal?: () => void;
  onLogout: () => void;
}

export const CbeSettingsModal: React.FC<CbeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentLang,
  onToggleLang,
  userProfile,
  onUpdatePin,
  onLogout,
}) => {
  const activePin = userProfile.pin || localStorage.getItem('cbe_custom_pin') || '1234';

  const [activeSubScreen, setActiveSubScreen] = useState<'my_info' | 'change_pin' | 'biometrics' | null>(null);

  // PIN change state
  const [currentPinInput, setCurrentPinInput] = useState(activePin);
  const [newPinInput, setNewPinInput] = useState('');
  const [confirmPinInput, setConfirmPinInput] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(true);
  const [showConfirmPin, setShowConfirmPin] = useState(true);
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);

  // Biometrics toggle state
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  if (!isOpen) return null;

  if (activeSubScreen === 'my_info') {
    return (
      <CbeMyInformationScreen
        currentLang={currentLang}
        userProfile={userProfile}
        onBack={() => setActiveSubScreen(null)}
      />
    );
  }

  const handleChangePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess(false);

    if (currentPinInput !== activePin) {
      setPinError('Incorrect current PIN! Please try again.');
      return;
    }

    if (newPinInput.length < 4 || newPinInput.length > 6) {
      setPinError('New PIN must be between 4 and 6 digits!');
      return;
    }

    if (newPinInput !== confirmPinInput) {
      setPinError('New PIN and Confirmation do not match!');
      return;
    }

    onUpdatePin(newPinInput);
    localStorage.setItem('cbe_custom_pin', newPinInput);
    setPinSuccess(true);

    setTimeout(() => {
      setPinSuccess(false);
      setActiveSubScreen(null);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex items-start justify-center p-0 overflow-hidden animate-in fade-in">
      <div className="w-full h-full max-h-screen bg-[#f8f9fa] text-slate-800 flex flex-col justify-between max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
        
        {/* Top Header Bar matching Screenshot_20261002-100902.jpg - Always Sticky at top */}
        <div className="bg-[#74117c] px-4 pt-3.5 pb-3.5 flex items-center justify-between text-white shrink-0 sticky top-0 z-20 shadow-sm">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-white hover:bg-white/10 active:scale-95 transition-all cursor-pointer"
              title="Back"
            >
              <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-medium tracking-wide">
              Settings
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-1.5 text-white hover:text-purple-200 transition-colors cursor-pointer">
              <Search className="w-5 h-5 stroke-[2.2]" />
            </button>
            <button className="p-1 text-white hover:text-purple-200 transition-colors cursor-pointer">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Settings Content Area matching Screenshot_20261002-100902.jpg */}
        <div className="flex-1 px-4 pt-4 pb-8 space-y-5 overflow-y-auto">
          {/* PWA App Install Banner */}
          <PWAInstallButton />
          
          {/* Section 1: Preferences */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-bold text-[#74117c] tracking-tight">
              Preferences
            </h2>

            <div className="space-y-2">
              {/* Item 1: Language */}
              <div
                onClick={onToggleLang}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74117c] flex items-center justify-center shrink-0">
                    <Globe className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-800">Language</div>
                    <div className="text-[11px] text-slate-400 font-medium">
                      {currentLang === 'am' ? 'አማርኛ (Amharic)' : 'English'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 2: Account Preferences */}
              <div
                onClick={() => setActiveSubScreen('my_info')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74117c] flex items-center justify-center shrink-0">
                    <UserCheck className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Account Preferences
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 3: Notification Preferences */}
              <div
                onClick={() => alert('Notification Preferences: All Push SMS Notifications are active.')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74117c] flex items-center justify-center shrink-0">
                    <Bell className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Notification Preferences
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Section 2: Security Settings */}
          <div className="space-y-2.5">
            <h2 className="text-sm font-bold text-[#74117c] tracking-tight">
              Security Settings
            </h2>

            <div className="space-y-2">
              {/* Item 4: Biometric Login */}
              <div
                onClick={() => setActiveSubScreen('biometrics')}
                className="bg-slate-100/90 rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-100/80 text-[#74117c] flex items-center justify-center shrink-0">
                    <Fingerprint className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Biometric Login
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 5: Change PIN */}
              <div
                onClick={() => setActiveSubScreen('change_pin')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74117c] flex items-center justify-center shrink-0">
                    <KeyRound className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Change PIN
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 6: Change Passphrase */}
              <div
                onClick={() => setActiveSubScreen('change_pin')}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-purple-200 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-[#74117c] flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">
                    Change Passphrase
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>

              {/* Item 7: Log out */}
              <div
                onClick={onLogout}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-rose-200 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <LogOut className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-xs font-bold text-rose-600">
                    Log out
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-rose-400" />
              </div>
            </div>
          </div>

          {/* Footer Version Info matching image.png */}
          <div className="pt-6 pb-4 text-center space-y-1 text-slate-500">
            <div className="text-[11px] font-semibold text-slate-400">
              Version: 1.0
            </div>
            <div className="text-[11px] font-bold flex items-center justify-center gap-2">
              <span className="text-purple-800 underline hover:text-purple-900 cursor-pointer">
                Privacy policy
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-purple-800 underline hover:text-purple-900 cursor-pointer">
                Terms and Conditions
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* Change PIN Modal Popup */}
      {activeSubScreen === 'change_pin' && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#74117c]" />
                <h3 className="text-sm font-bold text-slate-800">
                  Change / Reset App PIN
                </h3>
              </div>
              <button
                onClick={() => setActiveSubScreen(null)}
                className="p-1 rounded-full text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {pinError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{pinError}</span>
              </div>
            )}

            {pinSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>PIN updated successfully! Your new PIN is active.</span>
              </div>
            )}

            <form onSubmit={handleChangePinSubmit} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Current PIN*
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPin ? 'text' : 'password'}
                    value={currentPinInput}
                    onChange={(e) => setCurrentPinInput(e.target.value)}
                    maxLength={6}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 tracking-widest outline-none focus:border-[#74117c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPin(!showCurrentPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showCurrentPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#74117c]" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  New PIN (4-6 digits)*
                </label>
                <div className="relative">
                  <input
                    type={showNewPin ? 'password' : 'text'}
                    value={newPinInput}
                    onChange={(e) => setNewPinInput(e.target.value)}
                    maxLength={6}
                    placeholder="Enter new PIN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 tracking-widest outline-none focus:border-[#74117c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPin(!showNewPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showNewPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#74117c]" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Confirm New PIN*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPin ? 'password' : 'text'}
                    value={confirmPinInput}
                    onChange={(e) => setConfirmPinInput(e.target.value)}
                    maxLength={6}
                    placeholder="Confirm new PIN"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 tracking-widest outline-none focus:border-[#74117c]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer"
                  >
                    {showConfirmPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-[#74117c]" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#74117c] hover:bg-[#620d69] text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer mt-2"
              >
                Save New PIN
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Biometrics Modal Popup */}
      {activeSubScreen === 'biometrics' && (
        <div className="fixed inset-0 z-60 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border border-slate-100 text-center animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-purple-50 text-[#74117c] flex items-center justify-center mx-auto">
              <Fingerprint className="w-10 h-10" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-slate-800">Biometric Login</h3>
              <p className="text-xs text-slate-500 mt-1">Use Fingerprint or Face ID for fast login to CBE Mobile App.</p>
            </div>

            <button
              onClick={() => {
                setBiometricsEnabled(!biometricsEnabled);
                alert(biometricsEnabled ? 'Biometrics disabled' : 'Biometrics enabled successfully!');
                setActiveSubScreen(null);
              }}
              className={`w-full py-3 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
                biometricsEnabled ? 'bg-rose-600 text-white hover:bg-rose-700' : 'bg-[#74117c] text-white'
              }`}
            >
              {biometricsEnabled ? 'Disable Biometric Login' : 'Enable Fingerprint / Face ID'}
            </button>

            <button onClick={() => setActiveSubScreen(null)} className="text-xs text-slate-400 font-semibold cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
