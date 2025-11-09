export const createSampleData = async (userId, db) => {
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  
  const sampleTransactions = [
    {
      type: 'cash',
      amount: 2500,
      description: 'Weekly sales from store',
      merchant: 'Retail Store',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'completed',
      validated: true
    },
    {
      type: 'non-cash',
      amount: 1500,
      description: 'Online customer payment',
      merchant: 'E-commerce',
      bankName: 'FNB',
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      status: 'completed',
      validated: true
    },
    {
      type: 'receipt',
      amount: 450,
      description: 'Office supplies purchase',
      merchant: 'Stationery Store',
      date: new Date(),
      status: 'completed',
      validated: true
    }
  ];

  try {
    // Add sample transactions
    for (const transaction of sampleTransactions) {
      await addDoc(collection(db, 'transactions'), {
        userId,
        ...transaction,
        createdAt: serverTimestamp()
      });
    }

    console.log('Sample data created successfully!');
  } catch (error) {
    console.error('Error creating sample data:', error);
  }
};