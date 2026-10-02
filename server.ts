import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STATE_FILE = path.join(__dirname, 'shared_banking_state.json');

// Default initial registry of users
const DEFAULT_STATE = {
  users: {
    "0911824902": {
      userProfile: {
        fullName: 'Yared Nigusse Teshome',
        accountNumber: '1000348298657',
        phone: '0911824902',
        pin: '1234',
      },
      accounts: [
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
      ],
      transactions: [
        {
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
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'completed',
          note: 'MB Transfer',
          channel: 'CBE Mobile App',
          hash: '0x8f2a1b9c3e4d5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0',
        }
      ]
    },
    "0912345678": {
      userProfile: {
        fullName: 'Abebe Kebede Wolde',
        accountNumber: '1000348291111',
        phone: '0912345678',
        pin: '1111',
      },
      accounts: [
        {
          id: 'cbe-primary',
          nameEn: 'CBE Saving Account',
          nameAm: 'የኢትዮጵያ ንግድ ባንክ የቁጠባ ሒሳብ',
          accountNumber: '1000348291111',
          accountTypeEn: 'Saving Account - 1*********1111',
          accountTypeAm: 'የቁጠባ ሒሳብ - 1*********1111',
          balance: 100.00, // 100 ETB for other users
          currency: 'ETB',
          isPrimary: true,
        },
        {
          id: 'cbe-birr',
          nameEn: 'CBE Birr Wallet',
          nameAm: 'ንግድ ባንክ ብር (CBE Birr)',
          accountNumber: '0912345678',
          accountTypeEn: 'Mobile Wallet Account',
          accountTypeAm: 'የሞባይል ዋሌት ሒሳብ',
          balance: 0.00,
          currency: 'ETB',
          isPrimary: false,
        }
      ],
      transactions: []
    }
  }
};

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const content = fs.readFileSync(STATE_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      if (parsed.users) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading state file, resetting to defaults:', err);
  }
  saveState(DEFAULT_STATE);
  return DEFAULT_STATE;
}

function saveState(data: any) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving state file:', err);
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());

  // API Route: Register a new user
  app.post('/api/register', (req, res) => {
    const { fullName, accountNumber, phone, pin } = req.body;
    if (!fullName || !accountNumber || !phone || !pin) {
      return res.status(400).json({ error: 'Missing registration details' });
    }

    const state = loadState();
    const cleanPhone = phone.trim();

    // If user already exists, load them. Otherwise, initialize them with 100 ETB starting balance
    if (!state.users[cleanPhone]) {
      const isYared = cleanPhone === '0911824902';
      state.users[cleanPhone] = {
        userProfile: { fullName, accountNumber, phone: cleanPhone, pin },
        accounts: [
          {
            id: 'cbe-primary',
            nameEn: 'CBE Saving Account',
            nameAm: 'የኢትዮጵያ ንግድ ባንክ የቁጠባ ሒሳብ',
            accountNumber,
            accountTypeEn: `Saving Account - 1*********${accountNumber.slice(-4)}`,
            accountTypeAm: `የቁጠባ ሒሳብ - 1*********${accountNumber.slice(-4)}`,
            balance: isYared ? 5000000.00 : 100.00, // 5 Million for Yared, 100 ETB for newly registered users
            currency: 'ETB',
            isPrimary: true,
          },
          {
            id: 'cbe-birr',
            nameEn: 'CBE Birr Wallet',
            nameAm: 'ንግድ ባንክ ብር (CBE Birr)',
            accountNumber: cleanPhone,
            accountTypeEn: 'Mobile Wallet Account',
            accountTypeAm: 'የሞባይል ዋሌት ሒሳብ',
            balance: isYared ? 14820.50 : 0.00,
            currency: 'ETB',
            isPrimary: false,
          }
        ],
        transactions: []
      };
      saveState(state);
    }

    res.json({ success: true, user: state.users[cleanPhone] });
  });

  // API Route: Get specific user state (loaded dynamically by their phone number session)
  app.get('/api/state', (req, res) => {
    const phone = (req.query.phone as string) || "0911824902"; // default fallback to Yared
    const state = loadState();
    const user = state.users[phone] || state.users["0911824902"];
    res.json(user);
  });

  // API Route: Update state for a specific user
  app.post('/api/state/update', (req, res) => {
    const { phone, userProfile, accounts, transactions } = req.body;
    const cleanPhone = phone || "0911824902";
    
    const state = loadState();
    if (!state.users[cleanPhone]) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (userProfile) state.users[cleanPhone].userProfile = userProfile;
    if (accounts) state.users[cleanPhone].accounts = accounts;
    if (transactions) state.users[cleanPhone].transactions = transactions;

    saveState(state);
    res.json({ success: true, user: state.users[cleanPhone] });
  });

  // API Route: Dynamic CBE-to-CBE transfer between registered users!
  app.post('/api/transfer', (req, res) => {
    const { senderPhone, transaction } = req.body;
    const cleanSenderPhone = senderPhone || "0911824902";

    if (!transaction) {
      return res.status(400).json({ error: 'Missing transaction details' });
    }

    const state = loadState();
    const sender = state.users[cleanSenderPhone];
    if (!sender) {
      return res.status(404).json({ error: 'Sender user not found' });
    }

    const recAcc = transaction.receiverAccount.replace(/\D/g, ''); // Extract numbers
    
    // Check if the receiver belongs to ANY registered user on our server (by account number, phone, or name)!
    let receiverPhoneKey: string | null = null;
    for (const pKey of Object.keys(state.users)) {
      const uProfile = state.users[pKey].userProfile;
      const accNum = uProfile.accountNumber;
      const uPhone = uProfile.phone;
      const uName = uProfile.fullName.toLowerCase();
      const recName = (transaction.receiverName || '').toLowerCase();

      if (
        (recAcc && (accNum === recAcc || accNum.endsWith(recAcc) || uPhone === recAcc || uPhone.endsWith(recAcc))) ||
        (recName && uName.includes(recName))
      ) {
        receiverPhoneKey = pKey;
        break;
      }
    }

    const amount = Number(transaction.amount);

    // 1. Process Sender Deduction (Debit)
    sender.accounts = sender.accounts.map((acc: any) => {
      if (acc.id === transaction.accountId || acc.isPrimary) {
        const totalCost = amount + (transaction.fee || 0) + (transaction.vat || 0);
        const newBal = Math.max(0, acc.balance - totalCost);
        return { ...acc, balance: Number(newBal.toFixed(2)) };
      }
      return acc;
    });

    const senderTx = {
      ...transaction,
      type: 'outflow',
      timestamp: new Date().toISOString()
    };
    sender.transactions = [senderTx, ...sender.transactions];

    // 2. If receiver is a registered user, process Receiver Addition (Credit in real-time!)
    if (receiverPhoneKey) {
      const receiver = state.users[receiverPhoneKey];
      receiver.accounts = receiver.accounts.map((acc: any) => {
        if (acc.id === 'cbe-primary' || acc.isPrimary) {
          const newBal = acc.balance + amount;
          return { ...acc, balance: Number(newBal.toFixed(2)) };
        }
        return acc;
      });

      const receiverTx = {
        ...transaction,
        id: 'FT-REC-' + Math.floor(100000 + Math.random() * 900000),
        senderName: sender.userProfile.fullName,
        senderAccount: `ETB-${sender.userProfile.accountNumber.slice(-4)}`,
        receiverName: receiver.userProfile.fullName,
        receiverAccount: `ETB-${receiver.userProfile.accountNumber.slice(-4)}`,
        type: 'inflow',
        category: 'Incoming Transfer',
        timestamp: new Date().toISOString()
      };
      receiver.transactions = [receiverTx, ...receiver.transactions];
    }

    saveState(state);
    res.json({
      success: true,
      senderAccounts: sender.accounts,
      senderTransactions: sender.transactions
    });
  });

  // API Route: Reset server state
  app.post('/api/state/reset', (req, res) => {
    saveState(DEFAULT_STATE);
    res.json({ success: true, state: DEFAULT_STATE });
  });

  const isProd = process.env.NODE_ENV === 'production';
  
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Full-Stack CBE Server running at http://localhost:${PORT}`);
  });
}

startServer();
