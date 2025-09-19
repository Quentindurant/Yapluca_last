import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

export class GDPRCompliance {
  static CONSENT_KEYS = {
    ESSENTIAL: 'essential',
    GEOLOCATION: 'geolocation',
    ANALYTICS: 'analytics',
    MARKETING: 'marketing',
  };

  static async getConsents() {
    try {
      const consents = await AsyncStorage.getItem('user_consents');
      return consents ? JSON.parse(consents) : {
        essential: true,
        geolocation: false,
        analytics: false,
        marketing: false,
        timestamp: null,
      };
    } catch (error) {
      console.error('Error getting consents:', error);
      return null;
    }
  }

  static async saveConsents(consents) {
    try {
      const consentData = {
        ...consents,
        timestamp: new Date().toISOString(),
      };
      await AsyncStorage.setItem('user_consents', JSON.stringify(consentData));
      return true;
    } catch (error) {
      console.error('Error saving consents:', error);
      return false;
    }
  }

  static async hasGeolocationConsent() {
    const consents = await this.getConsents();
    return consents?.geolocation === true;
  }

  static async requestLocationPermission() {
    const hasConsent = await this.hasGeolocationConsent();
    if (!hasConsent) {
      return { granted: false, reason: 'consent_required' };
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return { 
        granted: status === 'granted',
        reason: status !== 'granted' ? 'permission_denied' : null
      };
    } catch (error) {
      return { granted: false, reason: 'error', error };
    }
  }

  static async logDataAccess(dataType, purpose, userId = null) {
    try {
      const logEntry = {
        timestamp: new Date().toISOString(),
        dataType,
        purpose,
        userId,
        userAgent: 'YapluCa Mobile App',
      };
      
      // Store locally for audit purposes
      const existingLogs = await AsyncStorage.getItem('data_access_logs');
      const logs = existingLogs ? JSON.parse(existingLogs) : [];
      logs.push(logEntry);
      
      // Keep only last 100 entries to avoid storage bloat
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      await AsyncStorage.setItem('data_access_logs', JSON.stringify(logs));
      
      // In production, also send to secure audit server
      // await this.sendToAuditServer(logEntry);
      
      return true;
    } catch (error) {
      console.error('Error logging data access:', error);
      return false;
    }
  }

  static async getUserDataExport(userId) {
    try {
      // Collect all user data for export
      const userData = {
        exportDate: new Date().toISOString(),
        userId,
        consents: await this.getConsents(),
        accessLogs: await AsyncStorage.getItem('data_access_logs'),
        userPreferences: await AsyncStorage.getItem('user_preferences'),
        // Add other user data as needed
      };

      return userData;
    } catch (error) {
      console.error('Error exporting user data:', error);
      return null;
    }
  }

  static async deleteUserData(userId) {
    try {
      // Remove all user-related data
      const keysToRemove = [
        'user_consents',
        'data_access_logs',
        'user_preferences',
        'user_session',
        'favorite_stations',
        'rental_history',
        // Add other keys as needed
      ];

      await AsyncStorage.multiRemove(keysToRemove);
      
      // Log the deletion for audit purposes
      await this.logDataAccess('user_data', 'deletion', userId);
      
      return true;
    } catch (error) {
      console.error('Error deleting user data:', error);
      return false;
    }
  }

  static async checkConsentExpiry() {
    const consents = await this.getConsents();
    if (!consents?.timestamp) return false;

    const consentDate = new Date(consents.timestamp);
    const now = new Date();
    const monthsElapsed = (now - consentDate) / (1000 * 60 * 60 * 24 * 30);

    // Consent expires after 13 months (CNIL recommendation)
    return monthsElapsed > 13;
  }

  static async shouldShowConsentBanner() {
    const consents = await this.getConsents();
    const isExpired = await this.checkConsentExpiry();
    
    return !consents?.timestamp || isExpired;
  }

  static getDataRetentionPeriods() {
    return {
      accountData: '3 years after last login',
      geolocationData: '12 months maximum',
      rentalHistory: '5 years (legal obligation)',
      connectionLogs: '12 months maximum',
      marketingData: 'Until consent withdrawal',
      analyticsData: '25 months maximum',
    };
  }

  static getDataProcessingPurposes() {
    return {
      essential: {
        purpose: 'Account management and service provision',
        legalBasis: 'Contract execution',
        dataTypes: ['email', 'name', 'password_hash'],
      },
      geolocation: {
        purpose: 'Find nearby charging stations',
        legalBasis: 'Consent',
        dataTypes: ['gps_coordinates', 'location_history'],
      },
      analytics: {
        purpose: 'Service improvement and usage analysis',
        legalBasis: 'Legitimate interest',
        dataTypes: ['usage_statistics', 'performance_metrics'],
      },
      marketing: {
        purpose: 'Commercial communications',
        legalBasis: 'Consent',
        dataTypes: ['email', 'preferences', 'interaction_history'],
      },
    };
  }
}

export default GDPRCompliance;
