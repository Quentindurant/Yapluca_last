import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ExpoMap } from 'expo-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { chargingStationAPI, openRouteServiceAPI } from '../../services/api';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function MapViewScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const mapRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour afficher la carte.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const locationData = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setLocation(locationData);
      
      // Load nearby stations
      await loadNearbyStations(locationData.latitude, locationData.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre position');
    } finally {
      setLoading(false);
    }
  };

  const loadNearbyStations = async (latitude, longitude) => {
    try {
      const response = await chargingStationAPI.getNearbyStations(latitude, longitude);
      
      if (response.code === 0 && response.data) {
        const transformedStations = response.data.map((station) => ({
          id: station.shop.id,
          name: station.shop.name,
          address: station.shop.address,
          available: station.cabinet.emptySlots,
          inUse: station.cabinet.busySlots,
          coordinate: {
            latitude: parseFloat(station.shop.latitude),
            longitude: parseFloat(station.shop.longitude),
          },
          shop: station.shop,
          cabinet: station.cabinet,
          batteries: station.batteries,
        }));
        
        setNearbyStations(transformedStations);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return Math.round(distance * 1000); // Distance in meters
  };

  const showRouteToStation = async (station) => {
    if (!location) return;

    try {
      setLoading(true);
      const directions = await openRouteServiceAPI.getDirections(
        [location.longitude, location.latitude],
        [station.coordinate.longitude, station.coordinate.latitude]
      );

      if (directions && directions.features && directions.features[0]) {
        const coordinates = directions.features[0].geometry.coordinates.map(coord => ({
          latitude: coord[1],
          longitude: coord[0],
        }));
        
        setRouteCoordinates(coordinates);
        setShowRoute(true);
        setSelectedStation(station);

        // Animate to show route
        if (mapRef.current) {
          mapRef.current.animateCamera({
            center: {
              latitude: (location.latitude + station.coordinate.latitude) / 2,
              longitude: (location.longitude + station.coordinate.longitude) / 2,
            },
            zoom: 13,
          });
        }
      }
    } catch (error) {
      console.error('Error getting directions:', error);
      Alert.alert('Erreur', 'Impossible de calculer l\'itinéraire');
    } finally {
      setLoading(false);
    }
  };

  const clearRoute = () => {
    setRouteCoordinates([]);
    setShowRoute(false);
    setSelectedStation(null);
  };

  const goToStationDetail = (station) => {
    navigation.navigate('StationDetail', { station });
  };

  const centerOnUser = () => {
    if (location && mapRef.current) {
      mapRef.current.animateCamera({
        center: {
          latitude: location.latitude,
          longitude: location.longitude,
        },
        zoom: 15,
      });
    }
  };

  if (loading && !location) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Carte des bornes</Text>
        <TouchableOpacity 
          style={styles.centerButton}
          onPress={centerOnUser}
        >
          <Ionicons name="locate" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      {location && (
        <ExpoMap
          ref={mapRef}
          style={styles.map}
          initialCameraPosition={{
            target: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
            zoom: 15,
          }}
          showsUserLocation={true}
          onMapPress={() => clearRoute()}
        >
          {/* Station Markers */}
          {nearbyStations.map((station) => (
            <ExpoMap.Marker
              key={station.id}
              coordinate={{
                latitude: station.coordinate.latitude,
                longitude: station.coordinate.longitude,
              }}
              title={station.name}
              snippet={`${station.available} bornes disponibles`}
              onPress={() => showRouteToStation(station)}
            />
          ))}

          {/* Route Polyline */}
          {showRoute && routeCoordinates.length > 0 && (
            <ExpoMap.Polyline
              coordinates={routeCoordinates}
              strokeColor={COLORS.primary}
              strokeWidth={4}
            />
          )}
        </ExpoMap>
      )}

      {/* Selected Station Info */}
      {selectedStation && (
        <View style={styles.stationInfo}>
          <View style={styles.stationHeader}>
            <View style={styles.stationDetails}>
              <Text style={styles.stationName}>{selectedStation.name}</Text>
              <Text style={styles.stationAddress}>{selectedStation.address}</Text>
              <View style={styles.stationStats}>
                <View style={styles.statItem}>
                  <Ionicons name="battery-charging" size={16} color={COLORS.success} />
                  <Text style={styles.statText}>{selectedStation.available} disponibles</Text>
                </View>
                <View style={styles.statItem}>
                  <Ionicons name="location" size={16} color={COLORS.textSecondary} />
                  <Text style={styles.statText}>
                    {calculateDistance(
                      location.latitude, 
                      location.longitude,
                      selectedStation.coordinate.latitude,
                      selectedStation.coordinate.longitude
                    )}m
                  </Text>
                </View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={clearRoute}
            >
              <Ionicons name="close" size={24} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              style={styles.detailButton}
              onPress={() => goToStationDetail(selectedStation)}
            >
              <Text style={styles.detailButtonText}>Voir détails</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.routeButton}
              onPress={() => showRouteToStation(selectedStation)}
            >
              <Ionicons name="navigate" size={16} color={COLORS.white} />
              <Text style={styles.routeButtonText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('Accueil')}
      >
        <Ionicons name="list" size={24} color={COLORS.white} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'center',
  },
  centerButton: {
    padding: SPACING.sm,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  stationMarker: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: 40,
    minHeight: 40,
  },
  selectedMarker: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '20',
  },
  markerText: {
    fontSize: FONTS.sizes.xs,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: 2,
  },
  stationInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stationDetails: {
    flex: 1,
  },
  stationName: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationAddress: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  stationStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  closeButton: {
    padding: SPACING.sm,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  detailButton: {
    flex: 1,
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  detailButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  routeButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  routeButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.white,
  },
  fab: {
    position: 'absolute',
    right: SPACING.lg,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
