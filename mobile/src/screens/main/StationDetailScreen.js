import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { chargeNowAPI } from '../../services/api';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const batteryTypes = [
  {
    id: 'premium',
    name: 'Batterie Premium',
    capacity: '20000 mAh',
    type: 'Charge rapide',
    price: '2.50€/jour',
    chargeTime: '~4h',
    battery: 98,
    color: COLORS.primary,
  },
  {
    id: 'standard',
    name: 'Batterie Standard',
    capacity: '10000 mAh',
    type: 'Charge normale',
    price: '1.50€/jour',
    chargeTime: '~2h',
    battery: 76,
    color: COLORS.warning,
  },
];

export default function StationDetailScreen({ navigation, route }) {
  const { station } = route.params;
  const [selectedBattery, setSelectedBattery] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSelectBattery = (battery) => {
    setSelectedBattery(battery);
  };

  const handleRentBattery = async () => {
    if (!selectedBattery) {
      Alert.alert('Sélection requise', 'Veuillez sélectionner une batterie');
      return;
    }
    
    Alert.alert(
      'Confirmer la location',
      `Louer ${selectedBattery.name} pour ${selectedBattery.price} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Confirmer', 
          onPress: async () => {
            setLoading(true);
            try {
              // Create rental order with ChargeNow API
              const orderData = {
                stationId: station.id,
                batteryType: selectedBattery.id,
                userId: user?.uid,
                price: selectedBattery.price,
                duration: '1 day'
              };
              
              const result = await chargeNowAPI.createRentOrder(orderData);
              
              Alert.alert('Succès', 'Batterie louée avec succès !', [
                { text: 'OK', onPress: () => navigation.goBack() }
              ]);
            } catch (error) {
              console.error('Rental error:', error);
              Alert.alert('Erreur', 'Impossible de louer la batterie. Veuillez réessayer.');
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  const BatteryCard = ({ battery }) => (
    <TouchableOpacity
      style={[
        styles.batteryCard,
        selectedBattery?.id === battery.id && styles.batteryCardSelected
      ]}
      onPress={() => handleSelectBattery(battery)}
    >
      <View style={styles.batteryHeader}>
        <View style={[styles.batteryIcon, { backgroundColor: `${battery.color}20` }]}>
          <Ionicons name="battery-charging" size={24} color={battery.color} />
        </View>
        <View style={styles.batteryInfo}>
          <Text style={styles.batteryName}>{battery.name}</Text>
          <Text style={styles.batterySpecs}>{battery.capacity} - {battery.type}</Text>
        </View>
        <Text style={styles.batteryPercentage}>{battery.battery}%</Text>
      </View>
      
      <View style={styles.batteryProgress}>
        <View 
          style={[
            styles.batteryProgressBar, 
            { 
              width: `${battery.battery}%`,
              backgroundColor: battery.color 
            }
          ]} 
        />
      </View>
      
      <View style={styles.batteryDetails}>
        <View style={styles.batteryDetailItem}>
          <Ionicons name="time-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.batteryDetailText}>Temps de charge: {battery.chargeTime}</Text>
        </View>
        <Text style={styles.batteryPrice}>{battery.price}</Text>
      </View>
      
      <TouchableOpacity 
        style={[
          styles.selectButton,
          selectedBattery?.id === battery.id && styles.selectButtonSelected
        ]}
        onPress={() => handleSelectBattery(battery)}
      >
        <Text style={[
          styles.selectButtonText,
          selectedBattery?.id === battery.id && styles.selectButtonTextSelected
        ]}>
          {selectedBattery?.id === battery.id ? 'Sélectionnée' : 'Sélectionner cette batterie'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

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
        <Text style={styles.headerTitle}>{station.name}</Text>
        <TouchableOpacity style={styles.favoriteButton}>
          <Ionicons name="heart-outline" size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Station Info */}
        <View style={styles.stationInfo}>
          <View style={styles.statusContainer}>
            <View style={styles.statusIndicator} />
            <Text style={styles.statusText}>Station disponible</Text>
            <Text style={styles.updateTime}>Mise à jour: 12:34</Text>
          </View>
          
          <View style={styles.addressContainer}>
            <Text style={styles.addressLabel}>Adresse</Text>
            <Text style={styles.addressText}>{station.address}</Text>
            <TouchableOpacity style={styles.navigationButton}>
              <Ionicons name="navigate" size={16} color={COLORS.primary} />
              <Text style={styles.navigationText}>Itinéraire</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Available Batteries */}
        <View style={styles.batteriesSection}>
          <Text style={styles.sectionTitle}>Batteries disponibles</Text>
          
          {batteryTypes.map((battery) => (
            <BatteryCard key={battery.id} battery={battery} />
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      {selectedBattery && (
        <View style={styles.bottomAction}>
          <View style={styles.selectedInfo}>
            <Text style={styles.selectedBatteryName}>{selectedBattery.name}</Text>
            <Text style={styles.selectedBatteryPrice}>{selectedBattery.price}</Text>
          </View>
          <TouchableOpacity 
            style={[styles.rentButton, loading && styles.rentButtonDisabled]} 
            onPress={handleRentBattery}
            disabled={loading}
          >
            <Text style={styles.rentButtonText}>
              {loading ? 'Location en cours...' : 'Louer maintenant'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
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
  favoriteButton: {
    padding: SPACING.sm,
  },
  content: {
    flex: 1,
  },
  stationInfo: {
    backgroundColor: COLORS.white,
    margin: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SPACING.sm,
  },
  statusText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
    flex: 1,
  },
  updateTime: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  addressContainer: {
    gap: SPACING.sm,
  },
  addressLabel: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '500',
    color: COLORS.text,
  },
  addressText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  navigationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: SPACING.xs,
    marginTop: SPACING.sm,
  },
  navigationText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  batteriesSection: {
    paddingHorizontal: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  batteryCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  batteryCardSelected: {
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  batteryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  batteryIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  batteryInfo: {
    flex: 1,
  },
  batteryName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  batterySpecs: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  batteryPercentage: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  batteryProgress: {
    height: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 3,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  batteryProgressBar: {
    height: '100%',
    borderRadius: 3,
  },
  batteryDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  batteryDetailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  batteryDetailText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  batteryPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  selectButton: {
    backgroundColor: COLORS.surface,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  selectButtonSelected: {
    backgroundColor: COLORS.primary,
  },
  selectButtonText: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectButtonTextSelected: {
    color: COLORS.white,
  },
  bottomAction: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  selectedInfo: {
    flex: 1,
  },
  selectedBatteryName: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedBatteryPrice: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  rentButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  rentButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
  rentButtonDisabled: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.7,
  },
});
