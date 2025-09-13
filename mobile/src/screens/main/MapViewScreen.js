import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  FlatList,
  Image,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { chargingStationAPI, openRouteServiceAPI } from '../../services/api';
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

  const selectStation = (station) => {
    setSelectedStation(station);
  };

  const clearSelection = () => {
    setSelectedStation(null);
  };

  const goToStationDetail = (station) => {
    navigation.navigate('StationDetail', { station });
  };

  const getDirectionsToStation = async (station) => {
    if (!location) return;

    try {
      Alert.alert(
        'Navigation',
        `Ouvrir l'itinéraire vers ${station.name} dans votre app de navigation ?`,
        [
          { text: 'Annuler', style: 'cancel' },
          { 
            text: 'Ouvrir', 
            onPress: () => {
              // This would open external navigation app
              console.log('Opening navigation to:', station.name);
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error with navigation:', error);
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

      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapHeader}>
          <Ionicons name="map" size={48} color={COLORS.primary} />
          <Text style={styles.mapTitle}>Vue Carte Interactive</Text>
          <Text style={styles.mapSubtitle}>
            Fonctionnalité disponible avec un build de développement
          </Text>
        </View>
        
        {location && (
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              📍 Position actuelle: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
            <Text style={styles.stationCount}>
              🔋 {nearbyStations.length} bornes trouvées à proximité
            </Text>
          </View>
        )}
      </View>

      {/* Stations List */}
      <ScrollView style={styles.stationsList}>
        <Text style={styles.listTitle}>Bornes à proximité</Text>
        {nearbyStations.map((station) => (
          <TouchableOpacity
            key={station.id}
            style={[
              styles.stationCard,
              selectedStation?.id === station.id && styles.selectedStationCard
            ]}
            onPress={() => selectStation(station)}
          >
            <View style={styles.stationCardHeader}>
              <View style={styles.stationIcon}>
                <Ionicons 
                  name="battery-charging" 
                  size={24} 
                  color={station.available > 0 ? COLORS.success : COLORS.error} 
                />
              </View>
              <View style={styles.stationCardInfo}>
                <Text style={styles.stationCardName}>{station.name}</Text>
                <Text style={styles.stationCardAddress}>{station.address}</Text>
                <View style={styles.stationCardStats}>
                  <Text style={styles.availableText}>
                    {station.available} disponibles
                  </Text>
                  <Text style={styles.distanceText}>
                    {location ? calculateDistance(
                      location.latitude,
                      location.longitude,
                      station.coordinate.latitude,
                      station.coordinate.longitude
                    ) : 0}m
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.navigationIcon}
                onPress={() => getDirectionsToStation(station)}
              >
                <Ionicons name="navigate" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
            
            {selectedStation?.id === station.id && (
              <View style={styles.expandedInfo}>
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.detailButton}
                    onPress={() => goToStationDetail(station)}
                  >
                    <Text style={styles.detailButtonText}>Voir détails</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.routeButton}
                    onPress={() => getDirectionsToStation(station)}
                  >
                    <Ionicons name="navigate" size={16} color={COLORS.white} />
                    <Text style={styles.routeButtonText}>Itinéraire</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  mapPlaceholder: {
    flex: 1,
    backgroundColor: COLORS.surface,
    margin: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  mapHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  mapTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    textAlign: 'center',
  },
  mapSubtitle: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  locationInfo: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    gap: SPACING.sm,
  },
  locationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  stationCount: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.primary,
  },
  stationsList: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  listTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  stationCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  selectedStationCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  stationCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stationCardInfo: {
    flex: 1,
  },
  stationCardName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationCardAddress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  stationCardStats: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  availableText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.success,
    fontWeight: '500',
  },
  distanceText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  navigationIcon: {
    padding: SPACING.sm,
  },
  expandedInfo: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
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
