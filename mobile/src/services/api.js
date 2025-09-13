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

  // Get nearby stations (currently using mock data - replace with real endpoint when available)
  getNearbyStations: async (latitude, longitude, radius = 5000) => {
    try {
      // This would be the real API call when available
      // const response = await api.get(`/stations/nearby?lat=${latitude}&lng=${longitude}&radius=${radius}`);
      
      // IMPORTANT: Currently using mock data with realistic coordinates around user location
      // Generate stations near the user's actual location
      const mockStations = [
        {
          shop: {
            id: "BJD60151",
            name: "Station République #001",
            address: "85 Rue de la République, 75011 Paris",
            city: "Paris",
            province: "Île-de-France",
            latitude: (latitude + 0.002).toString(),
            longitude: (longitude + 0.001).toString(),
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
              name: "Station Centre #002",
              address: "12 Avenue des Champs, Centre-ville",
              city: "Local",
              province: "Region",
              latitude: (latitude - 0.003).toString(),
              longitude: (longitude + 0.002).toString(),
              openingTime: "24/7",
              price: 2.0,
              deposit: 20,
              freeMinutes: 5,
              dailyMaxPrice: 12
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
              { slotNum: 2, vol: 88, batteryId: "BAT005" }
            ],
            priceStrategy: {
              price: 2.0,
              priceMinute: 0.04,
              depositAmount: 20,
              freeMinutes: 5,
              dailyMaxPrice: 12,
              currency: "EUR",
              currencySymbol: "€"
            }
          }
      ];

      return {
        code: 0,
        msg: "success",
        data: mockStations
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
