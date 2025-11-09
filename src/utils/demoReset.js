import { db } from '../services/firebase';
import { collection, query, where, getDocs, deleteDoc } from 'firebase/firestore';

export const resetUserData = async (userId) => {
  try {
    // Delete all user transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', userId)
    );
    const transactionsSnapshot = await getDocs(transactionsQuery);
    
    const deletePromises = transactionsSnapshot.docs.map(doc => 
      deleteDoc(doc.ref)
    );
    
    await Promise.all(deletePromises);
    console.log('User data reset successfully');
    return true;
  } catch (error) {
    console.error('Error resetting user data:', error);
    return false;
  }
};