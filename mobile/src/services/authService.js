import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const authService = {
  // Register new user
  register: async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile
      await updateProfile(user, {
        displayName: userData.name
      });

      // Save additional user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: userData.name,
        email: email,
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        acceptedTerms: true,
        profile: {
          rating: 5.0,
          totalRentals: 0,
          favoriteStations: []
        }
      });

      return { success: true, user };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, error: error.message };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get additional user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.exists() ? userDoc.data() : null;

      // Store user session
      await AsyncStorage.setItem('userSession', JSON.stringify({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      }));

      return { success: true, user, userData };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  },

  // Logout user
  logout: async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('userSession');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  },

  // Get current user
  getCurrentUser: () => {
    return auth.currentUser;
  },

  // Listen to auth state changes
  onAuthStateChange: (callback) => {
    return onAuthStateChanged(auth, callback);
  },

  // Get user data from Firestore
  getUserData: async (uid) => {
    try {
      if (!uid) {
        return null;
      }
      const userDoc = await getDoc(doc(db, 'users', uid));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      // Silently handle error to avoid console spam
      return null;
    }
  },

  // Check if user session exists
  checkSession: async () => {
    try {
      const session = await AsyncStorage.getItem('userSession');
      return session ? JSON.parse(session) : null;
    } catch (error) {
      console.error('Error checking session:', error);
      return null;
    }
  }
};

export default authService;
