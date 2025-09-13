import axios from 'axios';

// Base API configuration
const API_BASE_URL = process.env.EXPO_PUBLIC_CHARGENOW_BASE_URL;
const AUTH_KEY = process.env.EXPO_PUBLIC_API_SERVICE_AUTH_KEY;

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Authorization': AUTH_KEY,
    'Content-Type': 'application/json',
  },
});

// API endpoints
export const chargingStationAPI = {
  // Get device/cabinet information
  getDeviceInfo: async (deviceId) => {
    try {
      const response = await api.get(`/rent/cabinet/query?deviceId=${deviceId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching device info:', error);
      throw error;
    }
  },

  // Create rent order
  createRentOrder: async (orderData) => {
    try {
      const response = await api.post('/rent/order/create', orderData);
      return response.data;
    } catch (error) {
      console.error('Error creating rent order:', error);
      throw error;
    }
  },

  // Get nearby stations (mock implementation - replace with real endpoint)
  getNearbyStations: async (latitude, longitude, radius = 5000) => {
    try {
      // This would be the real API call when available
      // const response = await api.get(`/stations/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      
      // For now, return mock data with real API structure
      return {
        code: 0,
        msg: "success",
        data: [
          {
            shop: {
              id: "BJD60151",
              name: "Station République #001",
              address: "85 Rue de la République, 75011 Paris",
              city: "Paris",
              province: "Île-de-France",
              latitude: "48.8566",
              longitude: "2.3522",
              openingTime: "24/7",
              price: 2.5,
              deposit: 20,
              freeMinutes: 5,
              dailyMaxPrice: 15
            },
            cabinet: {
              id: "BJD60151",
              online: true,
              slots: 8,
              emptySlots: 3,
              busySlots: 5,
              qrCode: "BJD60151_QR"
            },
            batteries: [
              { slotNum: 1, vol: 98, batteryId: "BAT001" },
              { slotNum: 2, vol: 85, batteryId: "BAT002" },
              { slotNum: 3, vol: 76, batteryId: "BAT003" }
            ],
            priceStrategy: {
              price: 2.5,
              priceMinute: 0.05,
              depositAmount: 20,
              freeMinutes: 5,
              dailyMaxPrice: 15,
              currency: "EUR",
              currencySymbol: "€"
            }
          },
          {
            shop: {
              id: "BJD60152",
              name: "Station Bastille #002",
              address: "12 Place de la Bastille, 75011 Paris",
              city: "Paris",
              province: "Île-de-France",
              latitude: "48.8532",
              longitude: "2.3692",
              openingTime: "24/7",
              price: 1.5,
              deposit: 20,
              freeMinutes: 5,
              dailyMaxPrice: 10
            },
            cabinet: {
              id: "BJD60152",
              online: true,
              slots: 6,
              emptySlots: 2,
              busySlots: 4,
              qrCode: "BJD60152_QR"
            },
            batteries: [
              { slotNum: 1, vol: 92, batteryId: "BAT004" },
              { slotNum: 2, vol: 67, batteryId: "BAT005" }
            ],
            priceStrategy: {
              price: 1.5,
              priceMinute: 0.03,
              depositAmount: 20,
              freeMinutes: 5,
              dailyMaxPrice: 10,
              currency: "EUR",
              currencySymbol: "€"
            }
          }
        ]
      };
    } catch (error) {
      console.error('Error fetching nearby stations:', error);
      throw error;
    }
  }
};

// OpenRouteService API for navigation
export const navigationAPI = {
  getDirections: async (startCoords, endCoords) => {
    try {
      const response = await axios.get('https://api.openrouteservice.org/v2/directions/driving-car', {
        params: {
          api_key: process.env.EXPO_PUBLIC_OPENROUTESERVICE_API_KEY,
          start: `${startCoords.longitude},${startCoords.latitude}`,
          end: `${endCoords.longitude},${endCoords.latitude}`
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching directions:', error);
      throw error;
    }
  },

  getDistance: async (startCoords, endCoords) => {
    try {
      const response = await axios.get('https://api.openrouteservice.org/v2/matrix/driving-car', {
        headers: {
          'Authorization': process.env.EXPO_PUBLIC_OPENROUTESERVICE_API_KEY,
          'Content-Type': 'application/json'
        },
        data: {
          locations: [
            [startCoords.longitude, startCoords.latitude],
            [endCoords.longitude, endCoords.latitude]
          ],
          metrics: ["distance", "duration"]
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error calculating distance:', error);
      throw error;
    }
  }
};

export default api;
