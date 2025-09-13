import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useAuth } from '../../context/AuthContext';
import { chargingStationAPI, navigationAPI } from '../../services/api';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function MapViewScreen({ navigation, route }) {
  const [location, setLocation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin de votre localisation pour afficher les bornes à proximité.');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation.coords);
      await loadNearbyStations(currentLocation.coords.latitude, currentLocation.coords.longitude);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir votre localisation');
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
          latitude: station.shop.latitude,
          longitude: station.shop.longitude,
          available: station.cabinet.emptySlots,
          total: station.cabinet.slots,
          rating: '4.5',
          distance: '235m',
          price: station.priceStrategy.price,
          currency: station.priceStrategy.currencySymbol,
        }));
        setNearbyStations(transformedStations);
      }
    } catch (error) {
      console.error('Error loading stations:', error);
    }
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  const handleGetDirections = async (station) => {
    if (!location) return;

    try {
      const startCoords = { latitude: location.latitude, longitude: location.longitude };
      const endCoords = { latitude: parseFloat(station.latitude), longitude: parseFloat(station.longitude) };
      
      Alert.alert(
        'Navigation',
        `Ouvrir l'itinéraire vers ${station.name} ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Google Maps', 
            onPress: () => {
              const url = `https://www.google.com/maps/dir/?api=1&destination=${endCoords.latitude},${endCoords.longitude}`;
              // Linking.openURL(url);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error getting directions:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir l\'itinéraire');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Chargement de la carte...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} translucent={false} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Image 
            source={require('../../../assets/logo-removebg-preview.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={() => Alert.alert('Position', `Lat: ${location?.latitude?.toFixed(4)}, Lng: ${location?.longitude?.toFixed(4)}`)}
          >
            <Ionicons name="locate" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerSubtitle}>Carte des bornes</Text>
      </View>

      {/* Interactive Map */}
      {location && (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          {/* User Location Marker */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Ma position"
            description="Vous êtes ici"
            pinColor={COLORS.primary}
          />
          
          {/* Station Markers */}
          {nearbyStations.map((station) => (
            <Marker
              key={station.id}
              coordinate={{
                latitude: parseFloat(station.latitude),
                longitude: parseFloat(station.longitude),
              }}
              title={station.name}
              description={station.address}
            >
              <View style={styles.customMarker}>
                <Ionicons name="battery-charging" size={24} color={COLORS.white} />
              </View>
              <Callout style={styles.callout}>
                <View style={styles.calloutContent}>
                  <Text style={styles.calloutTitle}>{station.name}</Text>
                  <Text style={styles.calloutAddress}>{station.address}</Text>
                  <View style={styles.calloutStats}>
                    <Text style={styles.calloutStat}>
                      ✅ {station.available} disponibles
                    </Text>
                    <Text style={styles.calloutStat}>
                      ⭐ {station.rating}
                    </Text>
                  </View>
                  <TouchableOpacity 
                    style={styles.calloutButton}
                    onPress={() => handleStationSelect(station)}
                  >
                    <Text style={styles.calloutButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
      )}

      {/* Quick Station Info */}
      {selectedStation && (
        <View style={styles.quickInfo}>
          <View style={styles.quickInfoHeader}>
            <Text style={styles.quickInfoTitle}>{selectedStation.name}</Text>
            <TouchableOpacity 
              style={styles.closeButton}
              onPress={() => setSelectedStation(null)}
            >
              <Ionicons name="close" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
          <Text style={styles.quickInfoAddress}>{selectedStation.address}</Text>
          <View style={styles.quickInfoStats}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{selectedStation.available}</Text>
              <Text style={styles.quickStatLabel}>Disponibles</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{selectedStation.rating}</Text>
              <Text style={styles.quickStatLabel}>Note</Text>
            </View>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatNumber}>{selectedStation.distance}</Text>
              <Text style={styles.quickStatLabel}>Distance</Text>
            </View>
          </View>
          <View style={styles.quickActions}>
            <TouchableOpacity 
              style={styles.routeButton}
              onPress={() => handleGetDirections(selectedStation)}
            >
              <Ionicons name="navigate" size={16} color={COLORS.white} />
              <Text style={styles.routeButtonText}>Itinéraire</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.detailsButton}
              onPress={() => navigation.navigate('StationDetail', { station: selectedStation })}
            >
              <Text style={styles.detailsButtonText}>Détails</Text>
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
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  logo: {
    height: 28,
    width: 100,
  },
  headerSubtitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
    textAlign: 'center',
  },
  locationButton: {
    padding: SPACING.sm,
  },
  map: {
    flex: 1,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  customMarker: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  callout: {
    width: 250,
  },
  calloutContent: {
    padding: SPACING.sm,
  },
  calloutTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  calloutAddress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  calloutStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  calloutStat: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  calloutButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
  },
  quickInfo: {
    backgroundColor: COLORS.white,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    elevation: 4,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickInfoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  quickInfoTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  closeButton: {
    padding: SPACING.xs,
  },
  quickInfoAddress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  quickInfoStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.md,
  },
  quickStat: {
    alignItems: 'center',
  },
  quickStatNumber: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  quickStatLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  quickActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  routeButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
    flex: 1,
  },
  routeButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.white,
  },
  detailsButton: {
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    flex: 1,
  },
  detailsButtonText: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
});
