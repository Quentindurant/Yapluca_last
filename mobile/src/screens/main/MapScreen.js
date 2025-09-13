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
// import MapView, { Marker } from 'expo-maps'; // Temporarily disabled
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useAuth } from '../../context/AuthContext';
import { chargingStationAPI } from '../../services/api';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function MapScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState(null);
  const [nearbyStations, setNearbyStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

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
    }
  };

  const loadNearbyStations = async (latitude, longitude) => {
    try {
      setLoading(true);
      const response = await chargingStationAPI.getNearbyStations(latitude, longitude);
      
      if (response.code === 0 && response.data) {
        // Transform API data to match our UI format
        const transformedStations = response.data.map((station) => ({
          id: station.shop.id,
          name: station.shop.name,
          address: station.shop.address,
          distance: calculateDistance(latitude, longitude, parseFloat(station.shop.latitude), parseFloat(station.shop.longitude)),
          available: station.cabinet.emptySlots,
          inUse: station.cabinet.busySlots,
          rating: 4.5, // Default rating since not provided by API
          coordinate: {
            latitude: parseFloat(station.shop.latitude),
            longitude: parseFloat(station.shop.longitude),
          },
          priceStrategy: station.priceStrategy,
          batteries: station.batteries,
          cabinet: station.cabinet,
          shop: station.shop
        }));
        
        setNearbyStations(transformedStations);
      }
    } catch (error) {
      console.error('Error loading nearby stations:', error);
      Alert.alert('Erreur', 'Impossible de charger les bornes à proximité');
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    if (distance < 1) {
      return `${Math.round(distance * 1000)}m`;
    } else {
      return `${distance.toFixed(1)}km`;
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
            <Text style={styles.profileInitial}>
              {userData?.name ? userData.name.charAt(0).toUpperCase() : 'U'}
            </Text>
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
          <Text style={styles.statNumber}>{nearbyStations.length}</Text>
          <Text style={styles.statLabel}>À proximité</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#E8F0FF' }]}>
          <Text style={styles.statNumber}>
            {nearbyStations.reduce((sum, station) => sum + station.available, 0)}
          </Text>
          <Text style={styles.statLabel}>Disponibles</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFF0E8' }]}>
          <Text style={styles.statNumber}>
            {userData?.profile?.favoriteStations?.length || 0}
          </Text>
          <Text style={styles.statLabel}>Favorités</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une borne..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <Ionicons name="search" size={20} color={COLORS.gray.medium} style={styles.searchIcon} />
      </View>

      {/* Nearby Stations */}
      <View style={styles.nearbyContainer}>
        <View style={styles.nearbyHeader}>
          <Text style={styles.nearbyTitle}>Bornes à proximité</Text>
          <TouchableOpacity onPress={() => navigation.navigate('MapView')}>
            <Text style={styles.seeAllText}>Voir carte</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Chargement des bornes...</Text>
            </View>
          ) : nearbyStations.length > 0 ? (
            nearbyStations.map((station) => (
              <StationCard key={station.id} station={station} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Aucune borne trouvée à proximité</Text>
            </View>
          )}
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
  searchContainer: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    position: 'relative',
  },
  searchInput: {
    width: '100%',
    padding: SPACING.md,
    paddingRight: 50,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon: {
    position: 'absolute',
    right: SPACING.md,
    top: SPACING.md,
  },
  mapPlaceholder: {
    textAlign: 'center',
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.lg,
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
  loadingContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  loadingText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  emptyContainer: {
    padding: SPACING.lg,
    alignItems: 'center',
    justifyContent: 'center',
    width: 250,
  },
  emptyText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});
