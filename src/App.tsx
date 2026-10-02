import React, { useState, useEffect } from 'react';
import { CbeAccount, Language, Transaction } from './types/banking';
import { INITIAL_CBE_TRANSACTIONS } from './data/initialData';
import { CbeRegisterScreen } from './components/CbeRegisterScreen';
import { CbeLoginScreen } from './components/CbeLoginScreen';
import { CbeHomeScreen } from './components/CbeHomeScreen';
import { CbeTransferScreen } from './components/CbeTransferScreen';
import { CbeOtherTransfersScreen } from './components/CbeOtherTransfersScreen';
import { CbeAirtimeScreen } from './components/CbeAirtimeScreen';
import { CbeBillsScreen } from './components/CbeBillsScreen';
import { CbeSuccessScreen } from './components/CbeSuccessScreen';
import { CbeTransferModal } from './components/CbeTransferModal';
import { CbeReceiptSlipModal } from './components/CbeReceiptSlipModal';
import { CbeReceiveModal } from './components/CbeReceiveModal';
import { CbeScanQrModal } from './components/CbeScanQrModal';
import { CbeLogoModal } from './components/CbeLogoModal';
import { SmsParserModal } from './components/SmsParserModal';
import { StatementModal } from './components/StatementModal';
import { CbeSettingsModal } from './components/CbeSettingsModal';
import { CbeMyInformationScreen } from './components/CbeMyInformationScreen';
import { CbeSearchModal } from './components/CbeSearchModal';
import { CbeBranchesModal } from './components/CbeBranchesModal';
import { CbeCashOutModal } from './components/CbeCashOutModal';
import { CbeMiniStatementModal } from './components/CbeMiniStatementModal';
import { CbeCardsModal } from './components/CbeCardsModal';
import { CbeBillShareModal } from './components/CbeBillShareModal';
import { CbeBirrScreen } from './components/CbeBirrScreen';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('en');
  const [viewState, setViewState] = useState<'register' | 'login' | 'home' | 'transfer' | 'other_transfers' | 'airtime' | 'bills' | 'success' | 'my_info' | 'cbe_birr'>('login');
  const [customLogoUrl, setCustomLogoUrl] = useState<string>(() => {
    return localStorage.getItem('cbe_custom_logo_url') || '';
  });
  const [activeUserPhone, setActiveUserPhone] = useState<string>(() => {
    return localStorage.getItem('cbe_active_user_phone') || '0911824902';
  });

  const [userProfile, setUserProfile] = useState<{
    fullName: string;
    accountNumber: string;
    phone: string;
    pin: string;
  }>({
    fullName: 'Yared Nigusse Teshome',
    accountNumber: '1000348298657',
    phone: '0911824902',
    pin: '1234',
  });

  const [accounts, setAccounts] = useState<CbeAccount[]>([
    {
      id: 'cbe-primary',
      nameEn: 'CBE Saving Account',
      nameAm: 'የኢትዮጵያ ንግድ ባንክ የቁጠባ ሒሳብ',
      accountNumber: '1000348298657',
      accountTypeEn: 'Saving Account - 1*********8657',
      accountTypeAm: 'የቁጠባ ሒሳብ - 1*********8657',
      balance: 5000000.00, // 5 Million ETB for Yared
      currency: 'ETB',
      isPrimary: true,
    },
    {
      id: 'cbe-birr',
      nameEn: 'CBE Birr Wallet',
      nameAm: 'ንግድ ባንክ ብር (CBE Birr)',
      accountNumber: '0911824902',
      accountTypeEn: 'Mobile Wallet Account',
      accountTypeAm: 'የሞባይል ዋሌት ሒሳብ',
      balance: 14820.50,
      currency: 'ETB',
      isPrimary: false,
    }
  ]);

  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_CBE_TRANSACTIONS);

  const [lastSuccessTx, setLastSuccessTx] = useState<Transaction>(() => ({
    id: 'FT262277V0S0',
    referenceNumber: 'FT262277V0S0',
    transferMode: 'cbe_to_cbe',
    accountId: 'cbe-primary',
    senderName: 'Yared Nigusse Teshome',
    senderAccount: 'ETB-0997',
    receiverName: 'Mikyas Kassa Birhanu',
    receiverAccount: 'ETB-8612',
    receiverBank: 'Commercial Bank of Ethiopia',
    amount: 2130.00,
    fee: 1.00,
    vat: 0.15,
    currency: 'ETB',
    type: 'outflow',
    category: 'CBE to CBE Transfer',
    timestamp: '2026-08-15T17:46:00.000Z',
    status: 'completed',
    note: 'MB Transfer',
    channel: 'CBE Mobile App',
    hash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
  }));

  const [activeReceiptModalTx, setActiveReceiptModalTx] = useState<Transaction | null>(null);
  const [showOtherTransferModal, setShowOtherTransferModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showScanQrModal, setShowScanQrModal] = useState(false);
  const [showLogoModal, setShowLogoModal] = useState(false);
  const [showSmsModal, setShowSmsModal] = useState(false);
  const [showStatementModal, setShowStatementModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showBranchesModal, setShowBranchesModal] = useState(false);
  const [showCashOutModal, setShowCashOutModal] = useState(false);
  const [showMiniStatementModal, setShowMiniStatementModal] = useState(false);
  const [showCardsModal, setShowCardsModal] = useState(false);
  const [showBillShareModal, setShowBillShareModal] = useState(false);

  // Poll state from Backend server for real-time multi-device banking synchronization!
  const fetchState = async () => {
    try {
      const res = await fetch(`/api/state?phone=${activeUserPhone}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.userProfile) {
          setUserProfile(data.userProfile);
          setAccounts(data.accounts);
          setTransactions(data.transactions);
        }
      }
    } catch (err) {
      console.warn('Backend API connection offline, utilizing client-side storage:', err);
    }
  };

  useEffect(() => {
    fetchState();
  }, [activeUserPhone]);

  useEffect(() => {
    const interval = setInterval(fetchState, 4500); // Poll every 4.5 seconds
    return () => clearInterval(interval);
  }, [activeUserPhone]);

  const handleUpdatePin = async (newPin: string) => {
    const updatedProfile = { ...userProfile, pin: newPin };
    setUserProfile(updatedProfile);
    try {
      await fetch('/api/state/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: activeUserPhone, userProfile: updatedProfile }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginWithPhone = async (phone: string, pin: string) => {
    try {
      const res = await fetch(`/api/state?phone=${phone}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.userProfile) {
          if (data.userProfile.pin === pin) {
            setActiveUserPhone(phone);
            localStorage.setItem('cbe_active_user_phone', phone);
            setUserProfile(data.userProfile);
            setAccounts(data.accounts);
            setTransactions(data.transactions);
            setViewState('home');
            return { success: true };
          } else {
            return { success: false, error: 'Incorrect security PIN' };
          }
        } else {
          return { success: false, error: 'Phone number not registered. Please register first.' };
        }
      }
    } catch (err) {
      console.error(err);
    }
    return { success: false, error: 'Server connection failed.' };
  };

  const primaryAccount = accounts.find(a => a.id === 'cbe-primary') || accounts[0];

  const handleRegisterSuccess = async (data: typeof userProfile) => {
    setUserProfile(data);
    const updatedAccounts = accounts.map(a => a.id === 'cbe-primary' ? { ...a, accountNumber: data.accountNumber } : a);
    setAccounts(updatedAccounts);
    setActiveUserPhone(data.phone);
    localStorage.setItem('cbe_active_user_phone', data.phone);
    localStorage.setItem('cbe_is_registered', 'true');
    setViewState('home');
    
    try {
      const regRes = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          accountNumber: data.accountNumber,
          phone: data.phone,
          pin: data.pin
        }),
      });
      if (regRes.ok) {
        const regData = await regRes.json();
        if (regData.user) {
          setUserProfile(regData.user.userProfile);
          setAccounts(regData.user.accounts);
          setTransactions(regData.user.transactions);
        }
      }
    } catch (err) {
      console.error('Registration API error:', err);
    }
  };

  const handleAddTransaction = async (newTx: Transaction) => {
    // Optimistic Update
    setTransactions(prev => [newTx, ...prev]);
    setAccounts(prevAccounts => {
      return prevAccounts.map(acc => {
        if (acc.id === newTx.accountId || acc.isPrimary) {
          const totalCost = newTx.amount + (newTx.fee || 0) + (newTx.vat || 0);
          const newBal = newTx.type === 'inflow' ? acc.balance + newTx.amount : Math.max(0, acc.balance - totalCost);
          return { ...acc, balance: Number(newBal.toFixed(2)) };
        }
        return acc;
      });
    });

    try {
      const res = await fetch('/api/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderPhone: activeUserPhone, transaction: newTx }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.senderAccounts) setAccounts(data.senderAccounts);
        if (data.senderTransactions) setTransactions(data.senderTransactions);
      }
    } catch (err) {
      console.warn('Backend transfer failed, offline mode utilized:', err);
    }
  };

  const handleTransferComplete = (newTx: Transaction) => {
    const formattedTx: Transaction = {
      ...newTx,
      senderName: userProfile.fullName || 'Yared Nigusse Teshome',
      senderAccount: 'ETB-0997',
      receiverName: newTx.receiverName || 'Mikyas Kassa Birhanu',
      receiverAccount: newTx.receiverAccount || 'ETB-8612',
    };
    handleAddTransaction(formattedTx);
    setLastSuccessTx(formattedTx);
    setViewState('success');
  };

  const genericAccounts = accounts.map((a) => ({
    id: a.id as any,
    nameEn: a.nameEn,
    nameAm: a.nameAm,
    accountNumber: a.accountNumber,
    accountTypeEn: a.accountTypeEn,
    accountTypeAm: a.accountTypeAm,
    balance: a.balance,
    currency: a.currency,
    color: 'from-purple-900 to-amber-600',
    iconBg: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
    brandCode: 'CBE',
  }));

  return (
    <div className="min-h-screen bg-[#74117c] sm:bg-slate-950 flex items-center justify-center p-0 sm:p-4">
      {/* 1. Register Screen */}
      {viewState === 'register' && (
        <CbeRegisterScreen
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(prev => prev === 'en' ? 'am' : 'en')}
          onRegisterSuccess={handleRegisterSuccess}
          onGoToLogin={() => setViewState('login')}
        />
      )}

      {/* 2. Login Screen */}
      {viewState === 'login' && (
        <CbeLoginScreen
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(prev => prev === 'en' ? 'am' : 'en')}
          onSelectLang={(lang) => setCurrentLang(lang)}
          onLoginSuccess={() => setViewState('home')}
          onLoginWithPhone={handleLoginWithPhone}
          onGoToRegister={() => setViewState('register')}
          userName={userProfile.fullName}
          registeredPin={userProfile.pin}
          logoUrl={customLogoUrl}
        />
      )}

      {/* 3. Home Dashboard */}
      {viewState === 'home' && (
        <CbeHomeScreen
          currentLang={currentLang}
          onToggleLang={() => setCurrentLang(prev => prev === 'en' ? 'am' : 'en')}
          onSelectLang={(lang) => setCurrentLang(lang)}
          account={primaryAccount}
          userName={userProfile.fullName}
          logoUrl={customLogoUrl}
          onOpenCashOut={() => setShowCashOutModal(true)}
          onOpenMiniStatement={() => setShowMiniStatementModal(true)}
          onOpenCards={() => setShowCardsModal(true)}
          onOpenBillShare={() => setShowBillShareModal(true)}
          onOpenTransfer={() => setViewState('transfer')}
          onOpenOtherTransfers={() => setViewState('other_transfers')}
          onOpenAirtime={() => setViewState('airtime')}
          onOpenBills={() => setViewState('bills')}
          onOpenCbeBirr={() => setViewState('cbe_birr')}
          onOpenReceiveQr={() => setShowScanQrModal(true)}
          onOpenReceiveModal={() => setShowReceiveModal(true)}
          onOpenLogoModal={() => setShowLogoModal(true)}
          onOpenSearch={() => setShowSearchModal(true)}
          onOpenBranches={() => setShowBranchesModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          onOpenMyInfo={() => setViewState('my_info')}
          onLogout={() => setViewState('login')}
          transactions={transactions}
          onOpenReceipt={(tx) => setActiveReceiptModalTx(tx)}
        />
      )}

      {/* 3b. My Information Screen */}
      {viewState === 'my_info' && (
        <CbeMyInformationScreen
          currentLang={currentLang}
          userProfile={userProfile}
          onBack={() => setViewState('home')}
        />
      )}

      {/* 4. CBE Transfer Screen */}
      {viewState === 'transfer' && (
        <CbeTransferScreen
          currentLang={currentLang}
          account={primaryAccount}
          userName={userProfile.fullName}
          onBack={() => setViewState('home')}
          onTransferSuccess={handleTransferComplete}
        />
      )}

      {/* 4b. Other Transfers Screen (Matching image.png: Telebirr Agent, TeleBirr, Other Bank, Wallet, SACCO) */}
      {viewState === 'other_transfers' && (
        <CbeOtherTransfersScreen
          currentLang={currentLang}
          account={primaryAccount}
          onBack={() => setViewState('home')}
          onTransferSuccess={handleTransferComplete}
        />
      )}

      {/* 5. Airtime Screen */}
      {viewState === 'airtime' && (
        <CbeAirtimeScreen
          currentLang={currentLang}
          account={primaryAccount}
          onBack={() => setViewState('home')}
          onAirtimeSuccess={handleTransferComplete}
        />
      )}

      {/* 6. Bills & Utilities Screen */}
      {viewState === 'bills' && (
        <CbeBillsScreen
          currentLang={currentLang}
          account={primaryAccount}
          onBack={() => setViewState('home')}
          onPaymentSuccess={handleTransferComplete}
        />
      )}

      {/* 6b. CBEBirr Screen */}
      {viewState === 'cbe_birr' && (
        <CbeBirrScreen
          currentLang={currentLang}
          account={primaryAccount}
          onBack={() => setViewState('home')}
          onTransferSuccess={handleTransferComplete}
        />
      )}

      {/* 7. Success Slip with QR Code */}
      {viewState === 'success' && (
        <CbeSuccessScreen
          transaction={lastSuccessTx}
          currentLang={currentLang}
          onClose={() => setViewState('home')}
          onOpenReceiptDetails={() => setActiveReceiptModalTx(lastSuccessTx)}
        />
      )}

      {/* Modals */}
      {showOtherTransferModal && (
        <CbeTransferModal
          initialMode="other_banks"
          accounts={accounts}
          currentLang={currentLang}
          userName={userProfile.fullName}
          onClose={() => setShowOtherTransferModal(false)}
          onAddTransaction={handleAddTransaction}
          onOpenReceipt={(tx) => {
            setShowOtherTransferModal(false);
            setLastSuccessTx(tx);
            setViewState('success');
          }}
        />
      )}

      {activeReceiptModalTx && (
        <CbeReceiptSlipModal
          transaction={activeReceiptModalTx}
          currentLang={currentLang}
          onClose={() => setActiveReceiptModalTx(null)}
        />
      )}

      {showReceiveModal && (
        <CbeReceiveModal
          account={primaryAccount}
          userName={userProfile.fullName}
          currentLang={currentLang}
          onClose={() => setShowReceiveModal(false)}
        />
      )}

      {showScanQrModal && (
        <CbeScanQrModal
          currentLang={currentLang}
          onClose={() => setShowScanQrModal(false)}
          onScanSuccess={(accNum, recName) => {
            setShowScanQrModal(false);
            setViewState('transfer');
          }}
        />
      )}

      {showSmsModal && (
        <SmsParserModal
          accounts={genericAccounts}
          currentLang={currentLang}
          onClose={() => setShowSmsModal(false)}
          onAddTransaction={handleAddTransaction}
        />
      )}

      {showStatementModal && (
        <StatementModal
          accounts={genericAccounts}
          transactions={transactions}
          currentLang={currentLang}
          onClose={() => setShowStatementModal(false)}
        />
      )}

      {/* Settings Modal */}
      <CbeSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentLang={currentLang}
        onToggleLang={() => setCurrentLang(prev => prev === 'en' ? 'am' : 'en')}
        userProfile={userProfile}
        onUpdatePin={handleUpdatePin}
        onOpenLogoModal={() => setShowLogoModal(true)}
        onLogout={() => {
          setShowSettingsModal(false);
          setViewState('login');
        }}
      />

      {/* Search Modal */}
      <CbeSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        currentLang={currentLang}
        onSelectAction={(actionKey) => {
          if (actionKey === 'transfer') setViewState('transfer');
          else if (actionKey === 'receive') setShowReceiveModal(true);
          else if (actionKey === 'airtime') setViewState('airtime');
          else if (actionKey === 'other_transfers' || actionKey === 'cbebirr') setShowOtherTransferModal(true);
          else if (actionKey === 'bills') setViewState('bills');
          else if (actionKey === 'statement') setShowStatementModal(true);
        }}
      />

      {/* Branches Modal */}
      <CbeBranchesModal
        isOpen={showBranchesModal}
        onClose={() => setShowBranchesModal(false)}
        currentLang={currentLang}
        onOpenStatement={() => setShowStatementModal(true)}
      />

      {/* Cash Out Modal */}
      <CbeCashOutModal
        isOpen={showCashOutModal}
        onClose={() => setShowCashOutModal(false)}
        currentLang={currentLang}
        account={primaryAccount}
        onCashOutSuccess={(amount) => {
          setAccounts(prev => prev.map(acc => {
            if (acc.id === primaryAccount.id) {
              return { ...acc, balance: acc.balance - amount };
            }
            return acc;
          }));
        }}
      />

      {/* Mini Statement Modal */}
      <CbeMiniStatementModal
        isOpen={showMiniStatementModal}
        onClose={() => setShowMiniStatementModal(false)}
        currentLang={currentLang}
        account={primaryAccount}
        transactions={transactions}
      />

      {/* Cards Modal */}
      <CbeCardsModal
        isOpen={showCardsModal}
        onClose={() => setShowCardsModal(false)}
        currentLang={currentLang}
        account={primaryAccount}
        userName={userProfile.fullName}
      />

      {/* Bill Share Modal */}
      <CbeBillShareModal
        isOpen={showBillShareModal}
        onClose={() => setShowBillShareModal(false)}
        currentLang={currentLang}
        account={primaryAccount}
      />

      {/* CBE Logo Modal */}
      {showLogoModal && (
        <CbeLogoModal
          onClose={() => setShowLogoModal(false)}
          currentLogoUrl={customLogoUrl}
          onUpdateLogo={(newUrl) => {
            setCustomLogoUrl(newUrl);
            localStorage.setItem('cbe_custom_logo_url', newUrl);
          }}
        />
      )}
    </div>
  );
}
