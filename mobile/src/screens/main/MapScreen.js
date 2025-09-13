import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

// Mock data for charging stations
const mockStations = [
  {
    id: '1',
    name: 'Station République #001',
    address: '85 Rue de la République',
    distance: '150m',
    available: 3,
    inUse: 1,
    rating: 4.8,
    coordinate: {
      latitude: 48.8566,
      longitude: 2.3522,
    },
  },
  {
    id: '2',
    name: 'Station Bastille #002',
    address: '12 Place de la Bastille',
    distance: '200m',
    available: 2,
    inUse: 0,
    rating: 4.5,
    coordinate: {
      latitude: 48.8532,
      longitude: 2.3692,
    },
  },
];

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState(mockStations);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour trouver les bornes à proximité.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleStationPress = (station) => {
    setSelectedStation(station);
  };

  const handleRentStation = (station) => {
    navigation.navigate('StationDetail', { station });
  };

  const StationCard = ({ station }) => (
    <View style={styles.stationCard}>
      <View style={styles.stationHeader}>
        <View style={styles.stationIcon}>
          <Ionicons name="battery-charging" size={24} color={COLORS.primary} />
        </View>
        <View style={styles.stationInfo}>
          <Text style={styles.stationName}>{station.name}</Text>
          <Text style={styles.stationAddress}>{station.address}</Text>
          <Text style={styles.stationDistance}>{station.distance} • ~2 min</Text>
        </View>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={20} color={COLORS.gray.medium} />
        </TouchableOpacity>
      </View>
      
      <View style={styles.stationDetails}>
        <View style={styles.availabilityInfo}>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityNumber}>{station.available}</Text>
            <Text style={styles.availabilityLabel}>Disponibles</Text>
          </View>
          <View style={styles.availabilityItem}>
            <Text style={styles.availabilityNumber}>{station.inUse}</Text>
            <Text style={styles.availabilityLabel}>En charge</Text>
          </View>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={COLORS.warning} />
            <Text style={styles.rating}>{station.rating}</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.rentButton}
          onPress={() => handleRentStation(station)}
        >
          <Text style={styles.rentButtonText}>Louer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>YapluCa</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <View style={styles.profileButton}>
            <Text style={styles.profileInitial}>M</Text>
          </View>
        </View>
      </View>

      {/* Location Info */}
      <View style={styles.locationContainer}>
        <Ionicons name="location" size={16} color={COLORS.primary} />
        <Text style={styles.locationText}>Paris 11ème, Rue de la République</Text>
        <TouchableOpacity>
          <Text style={styles.changeLocationText}>Changer</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5F3' }]}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>À proximité</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F0FF' }]}>
          <Text style={styles.statNumber}>8</Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF0E8' }]}>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Favorités</Text>
        </View>
      </View>

      {/* Map or Search */}
      <View style={styles.mapContainer}>
        {location ? (
          <MapView
            style={styles.map}
            initialRegion={location}
            showsUserLocation={true}
            showsMyLocationButton={true}
          >
            {nearbyStations.map((station) => (
              <Marker
                key={station.id}
                coordinate={station.coordinate}
                onPress={() => handleStationPress(station)}
              >
                <View style={styles.markerContainer}>
                  <Ionicons name="battery-charging" size={20} color={COLORS.primary} />
                </View>
              </Marker>
            ))}
          </MapView>
        ) : (
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une borne..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Ionicons name="search" size={20} color={COLORS.gray.medium} style={styles.searchIcon} />
          </View>
        )}
      </View>

      {/* Nearby Stations */}
      <View style={styles.nearbyContainer}>
        <View style={styles.nearbyHeader}>
          <Text style={styles.nearbyTitle}>Bornes à proximité</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>Voir carte</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {nearbyStations.map((station) => (
            <StationCard key={station.id} station={station} />
          ))}
        </ScrollView>
      </View>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Ionicons name="navigate" size={24} color={COLORS.white} />
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  logo: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  notificationButton: {
    padding: SPACING.sm,
  },
  profileButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: COLORS.white,
    fontWeight: 'bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
    gap: SPACING.sm,
  },
  locationText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
  },
  changeLocationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  statCard: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  mapContainer: {
    height: 200,
    marginHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  map: {
    flex: 1,
  },
  searchContainer: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  searchInput: {
    width: '80%',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    position: 'absolute',
    right: '15%',
  },
  markerContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  nearbyContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  nearbyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  nearbyTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  seeAllText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  stationCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginRight: SPACING.md,
    width: 300,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  stationIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  stationInfo: {
    flex: 1,
  },
  stationName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  stationAddress: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  stationDistance: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  favoriteButton: {
    padding: SPACING.xs,
  },
  stationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  availabilityInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.lg,
  },
  availabilityItem: {
    alignItems: 'center',
  },
  availabilityNumber: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  availabilityLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.textSecondary,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  rating: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    fontWeight: '500',
  },
  rentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  rentButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
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
