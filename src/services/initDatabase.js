import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const initializeDemoData = async (userId) => {
  try {
    // Add some sample transactions for the demo user
    const sampleTransactions = [
      {
        userId: userId,
        type: 'cash',
        amount: 2500,
        description: 'Weekly store sales',
        receiptNumber: 'RCP-001',
        date: serverTimestamp(),
        status: 'completed',
        validated: true
      },
      {
        userId: userId,
        type: 'non-cash',
        amount: 1500,
        description: 'Online customer payments',
        bankName: 'FNB',
        date: serverTimestamp(),
        status: 'completed',
        validated: true
      },
      {
        userId: userId,
        type: 'receipt',
        amount: 450,
        description: 'Office supplies',
        merchant: 'Stationery Store',
        category: 'Supplies',
        date: serverTimestamp(),
        status: 'completed',
        validated: true
      }
    ];

    for (const transaction of sampleTransactions) {
      await addDoc(collection(db, 'transactions'), transaction);
    }

    console.log('Demo data initialized successfully!');
    return true;
  } catch (error) {
    console.error('Error initializing demo data:', error);
    return false;
  }
};