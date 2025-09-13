import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

const mockUser = {
  name: 'Marie Dubois',
  email: 'marie.dubois@email.com',
  phone: '+33 6 12 34 56 78',
  rating: 4.8,
  locations: 127,
};

const mockRentalHistory = [
  {
    id: '1',
    location: 'Gare Saint-Lazare',
    duration: 'Il y a 3 heures • 45 min',
    price: '2.50€',
  },
  {
    id: '2',
    location: 'Centre Commercial',
    duration: 'Il y a 1 jour • 20 min',
    price: '4.00€',
  },
];

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: () => {
          // TODO: Implement logout logic
          console.log('Logout');
        }}
      ]
    );
  };

  const ProfileSection = ({ title, children }) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );

  const ProfileItem = ({ icon, label, value, onPress, rightComponent }) => (
    <TouchableOpacity style={styles.profileItem} onPress={onPress}>
      <View style={styles.profileItemLeft}>
        <Ionicons name={icon} size={20} color={COLORS.textSecondary} />
        <Text style={styles.profileItemLabel}>{label}</Text>
      </View>
      {rightComponent || (
        <View style={styles.profileItemRight}>
          {value && <Text style={styles.profileItemValue}>{value}</Text>}
          <Ionicons name="chevron-forward" size={16} color={COLORS.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const RentalHistoryItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.historyIcon}>
        <Ionicons name="battery-charging" size={16} color={COLORS.primary} />
      </View>
      <View style={styles.historyInfo}>
        <Text style={styles.historyLocation}>{item.location}</Text>
        <Text style={styles.historyDuration}>{item.duration}</Text>
      </View>
      <Text style={styles.historyPrice}>{item.price}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mon Profil</Text>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {/* User Info */}
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MD</Text>
            <View style={styles.onlineIndicator} />
          </View>
          <Text style={styles.userName}>{mockUser.name}</Text>
          <Text style={styles.userEmail}>{mockUser.email}</Text>
          <View style={styles.userStats}>
            <View style={styles.statItem}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.statValue}>{mockUser.rating}</Text>
            </View>
            <Text style={styles.statSeparator}>•</Text>
            <Text style={styles.statText}>{mockUser.locations} locations</Text>
          </View>
        </View>

        {/* Personal Information */}
        <ProfileSection title="Informations personnelles">
          <ProfileItem
            icon="person-outline"
            label="Nom complet"
            value={mockUser.name}
            onPress={() => {}}
          />
          <ProfileItem
            icon="mail-outline"
            label="Email"
            value={mockUser.email}
            onPress={() => {}}
          />
          <ProfileItem
            icon="call-outline"
            label="Téléphone"
            value={mockUser.phone}
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Rental History */}
        <ProfileSection title="Historique des locations">
          {mockRentalHistory.map((item) => (
            <RentalHistoryItem key={item.id} item={item} />
          ))}
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Voir tout</Text>
          </TouchableOpacity>
        </ProfileSection>

        {/* Payment & Billing */}
        <ProfileSection title="Caution & Paiement">
          <View style={styles.cautionCard}>
            <View style={styles.cautionHeader}>
              <Ionicons name="shield-checkmark" size={20} color={COLORS.success} />
              <Text style={styles.cautionTitle}>Caution active</Text>
            </View>
            <Text style={styles.cautionAmount}>20.00€</Text>
            <Text style={styles.cautionSubtext}>Prêt pour vos locations</Text>
          </View>
          <ProfileItem
            icon="card-outline"
            label="Méthode de paiement"
            value="•••• 4532"
            onPress={() => {}}
          />
          <ProfileItem
            icon="receipt-outline"
            label="Factures"
            onPress={() => {}}
            rightComponent={
              <TouchableOpacity style={styles.downloadButton}>
                <Text style={styles.downloadText}>Télécharger</Text>
              </TouchableOpacity>
            }
          />
        </ProfileSection>

        {/* Settings */}
        <ProfileSection title="Paramètres">
          <ProfileItem
            icon="notifications-outline"
            label="Notifications"
            rightComponent={
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: COLORS.gray.medium, true: COLORS.primary }}
                thumbColor={COLORS.white}
              />
            }
          />
          <ProfileItem
            icon="lock-closed-outline"
            label="Confidentialité (RGPD)"
            onPress={() => {}}
          />
          <ProfileItem
            icon="help-circle-outline"
            label="Aide & Support"
            onPress={() => {}}
          />
        </ProfileSection>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  moreButton: {
    padding: SPACING.sm,
  },
  userInfo: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    position: 'relative',
  },
  avatarText: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.success,
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  userStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  statValue: {
    fontSize: FONTS.sizes.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  statSeparator: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  statText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  profileItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  profileItemLabel: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
  },
  profileItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  profileItemValue: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  historyIcon: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  historyInfo: {
    flex: 1,
  },
  historyLocation: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  historyDuration: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  historyPrice: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  seeAllButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '500',
  },
  cautionCard: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  cautionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  cautionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  cautionAmount: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.success,
    marginBottom: SPACING.xs,
  },
  cautionSubtext: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
  },
  downloadButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.sm,
  },
  downloadText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
  },
  logoutText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.error,
    fontWeight: '500',
  },
});
