import { db } from './firebase';
import { collection, addDoc, serverTimestamp, getDocs, deleteDoc, query, where } from 'firebase/firestore';

// Sample business data for demonstration
const sampleBusinesses = [
  {
    name: "Khaya's Spaza Shop",
    type: "retail",
    tier: "intermediate",
    registrationType: "manual",
    monthlyRevenue: 25000,
    location: "Soweto, Johannesburg",
    employees: 2,
    businessAge: "2-5 years",
    phoneNumber: "+27 11 123 4567",
    email: "khaya@merchantboost.com"
  },
  {
    name: "Mama Zanele's Restaurant",
    type: "restaurant",
    tier: "basic",
    registrationType: "tax",
    monthlyRevenue: 45000,
    location: "Alexandra, Johannesburg",
    employees: 5,
    businessAge: "1-2 years",
    phoneNumber: "+27 11 234 5678",
    email: "mamazanele@merchantboost.com"
  },
  {
    name: "Tech Solutions Pty Ltd",
    type: "services",
    tier: "pro",
    registrationType: "cipc",
    monthlyRevenue: 120000,
    location: "Sandton, Johannesburg",
    employees: 8,
    businessAge: "5+ years",
    phoneNumber: "+27 11 345 6789",
    email: "tech@merchantboost.com"
  }
];

// Generate sample transactions for a business
const generateSampleTransactions = (businessId, businessName, businessType) => {
  const transactions = [];
  const today = new Date();
  
  // Generate last 30 days of transactions
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Different transaction patterns based on business type
    let dailyTransactions = [];
    
    if (businessType === 'retail') {
      // Retail: Multiple small transactions per day
      const transactionCount = Math.floor(Math.random() * 8) + 3; // 3-10 transactions per day
      for (let j = 0; j < transactionCount; j++) {
        const amount = (Math.random() * 200 + 20).toFixed(2); // R20-R220
        dailyTransactions.push({
          type: Math.random() > 0.3 ? 'cash' : 'non-cash',
          amount: parseFloat(amount),
          description: `Customer purchase ${j + 1}`,
          merchant: businessName,
          date: date,
          validated: true,
          aiValidation: {
            duplicateCheck: true,
            patternMatch: true,
            fraudScore: Math.random() * 0.2
          }
        });
      }
    } else if (businessType === 'restaurant') {
      // Restaurant: Fewer but larger transactions
      const transactionCount = Math.floor(Math.random() * 5) + 2; // 2-6 transactions per day
      for (let j = 0; j < transactionCount; j++) {
        const amount = (Math.random() * 300 + 50).toFixed(2); // R50-R350
        dailyTransactions.push({
          type: Math.random() > 0.4 ? 'cash' : 'non-cash',
          amount: parseFloat(amount),
          description: `Table ${j + 1} - Food & beverages`,
          merchant: businessName,
          date: date,
          validated: true,
          aiValidation: {
            duplicateCheck: true,
            patternMatch: true,
            fraudScore: Math.random() * 0.15
          }
        });
      }
    } else {
      // Services: Fewer, larger transactions
      const transactionCount = Math.floor(Math.random() * 3) + 1; // 1-3 transactions per day
      for (let j = 0; j < transactionCount; j++) {
        const amount = (Math.random() * 1000 + 200).toFixed(2); // R200-R1200
        dailyTransactions.push({
          type: Math.random() > 0.2 ? 'non-cash' : 'cash',
          amount: parseFloat(amount),
          description: `Service payment ${j + 1}`,
          merchant: businessName,
          date: date,
          validated: true,
          aiValidation: {
            duplicateCheck: true,
            patternMatch: true,
            fraudScore: Math.random() * 0.1
          }
        });
      }
    }
    
    transactions.push(...dailyTransactions);
  }

  return transactions;
};

// Generate sample receipts
const generateSampleReceipts = (businessId, businessName) => {
  const receipts = [];
  const suppliers = ['Office Depot', 'Local Market', 'Supplier Co.', 'Wholesaler Inc.'];
  const categories = ['Supplies', 'Equipment', 'Utilities', 'Marketing', 'Professional Services'];
  
  for (let i = 0; i < 15; i++) {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    receipts.push({
      type: 'receipt',
      amount: parseFloat((Math.random() * 500 + 50).toFixed(2)), // R50-R550
      description: `${categories[Math.floor(Math.random() * categories.length)]} purchase`,
      merchant: suppliers[Math.floor(Math.random() * suppliers.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
      date: date,
      validated: true,
      receiptNumber: `RCP-${1000 + i}`,
      ocrData: {
        amount: (Math.random() * 500 + 50).toFixed(2),
        date: date.toISOString().split('T')[0],
        merchant: suppliers[Math.floor(Math.random() * suppliers.length)],
        confidence: 0.85 + Math.random() * 0.1
      },
      aiValidation: {
        duplicateCheck: true,
        patternMatch: true,
        fraudScore: Math.random() * 0.1
      }
    });
  }
  
  return receipts;
};

// Main function to setup database
export const setupDemoDatabase = async () => {
  try {
    console.log('🚀 Starting database setup...');
    
    // Clear existing demo data
    await clearDemoData();
    
    // Create sample businesses and their data
    for (const business of sampleBusinesses) {
      console.log(`📊 Setting up data for: ${business.name}`);
      
      // Create business user profile
      const businessDoc = await addDoc(collection(db, 'users'), {
        ...business,
        createdAt: serverTimestamp(),
        consent: {
          incubators: true,
          municipalities: Math.random() > 0.5,
          lenders: true,
          insurers: Math.random() > 0.5
        },
        sampleDataCreated: true
      });
      
      const businessId = businessDoc.id;
      
      // Generate transactions
      const transactions = generateSampleTransactions(businessId, business.name, business.type);
      for (const transaction of transactions) {
        await addDoc(collection(db, 'transactions'), {
          ...transaction,
          userId: businessId,
          createdAt: serverTimestamp()
        });
      }
      
      // Generate receipts
      const receipts = generateSampleReceipts(businessId, business.name);
      for (const receipt of receipts) {
        await addDoc(collection(db, 'transactions'), {
          ...receipt,
          userId: businessId,
          createdAt: serverTimestamp()
        });
      }
      
      console.log(`✅ ${business.name}: ${transactions.length} transactions, ${receipts.length} receipts`);
    }
    
    console.log('🎉 Database setup completed successfully!');
    console.log('📊 Sample businesses created:');
    sampleBusinesses.forEach(business => {
      console.log(`   • ${business.name} (${business.tier} tier)`);
    });
    
    return true;
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    return false;
  }
};

// Clear existing demo data
export const clearDemoData = async () => {
  try {
    console.log('🧹 Clearing existing demo data...');
    
    // Get all demo users
    const usersQuery = query(collection(db, 'users'));
    const usersSnapshot = await getDocs(usersQuery);
    
    const deletePromises = [];
    
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      
      // Only delete demo/sample data
      if (userData.sampleDataCreated || userData.email?.includes('merchantboost.com')) {
        // Delete user's transactions
        const transactionsQuery = query(
          collection(db, 'transactions'),
          where('userId', '==', userDoc.id)
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);
        
        transactionsSnapshot.docs.forEach(doc => {
          deletePromises.push(deleteDoc(doc.ref));
        });
        
        // Delete user
        deletePromises.push(deleteDoc(userDoc.ref));
      }
    }
    
    await Promise.all(deletePromises);
    console.log('✅ Demo data cleared successfully');
    return true;
  } catch (error) {
    console.error('❌ Error clearing demo data:', error);
    return false;
  }
};

// Add sample transaction for current user
export const addSampleTransaction = async (userId, type = 'cash') => {
  try {
    const descriptions = {
      cash: ['Daily sales', 'Customer payment', 'Market sales', 'Store revenue'],
      'non-cash': ['Online payment', 'Bank transfer', 'Digital payment', 'Mobile money'],
      receipt: ['Office supplies', 'Equipment purchase', 'Utility payment', 'Marketing materials']
    };
    
    const transaction = {
      userId: userId,
      type: type,
      amount: parseFloat((Math.random() * 300 + 50).toFixed(2)),
      description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
      merchant: type === 'receipt' ? 'Supplier Co.' : 'Your Business',
      date: serverTimestamp(),
      validated: true,
      aiValidation: {
        duplicateCheck: true,
        patternMatch: true,
        fraudScore: Math.random() * 0.1
      },
      createdAt: serverTimestamp()
    };
    
    if (type === 'cash') {
      transaction.qrCode = `MB-QR-${Date.now()}`;
      transaction.receiptNumber = `RCP-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    
    if (type === 'receipt') {
      transaction.receiptNumber = `RCP-${Math.floor(1000 + Math.random() * 9000)}`;
      transaction.category = ['Supplies', 'Equipment', 'Utilities', 'Marketing'][Math.floor(Math.random() * 4)];
      transaction.ocrData = {
        amount: transaction.amount.toFixed(2),
        date: new Date().toISOString().split('T')[0],
        merchant: transaction.merchant,
        confidence: 0.85 + Math.random() * 0.1
      };
    }
    
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    console.log('✅ Sample transaction added:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('❌ Error adding sample transaction:', error);
    return null;
  }
};