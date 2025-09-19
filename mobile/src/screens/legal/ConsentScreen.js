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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function ConsentScreen({ navigation, route }) {
  const { onConsentGiven } = route.params || {};
  const [consents, setConsents] = useState({
    essential: true, // Always required
    geolocation: false,
    analytics: false,
    marketing: false,
  });

  const handleConsentChange = (type, value) => {
    if (type === 'essential') return; // Cannot be disabled
    setConsents(prev => ({ ...prev, [type]: value }));
  };

  const saveConsents = async () => {
    try {
      await AsyncStorage.setItem('user_consents', JSON.stringify({
        ...consents,
        timestamp: new Date().toISOString(),
      }));
      
      if (onConsentGiven) {
        onConsentGiven(consents);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de sauvegarder vos préférences');
    }
  };

  const ConsentItem = ({ title, description, type, required = false }) => (
    <View style={styles.consentItem}>
      <View style={styles.consentHeader}>
        <Text style={styles.consentTitle}>{title}</Text>
        {required && <Text style={styles.requiredLabel}>Obligatoire</Text>}
      </View>
      <Text style={styles.consentDescription}>{description}</Text>
      <View style={styles.consentToggle}>
        <Text style={styles.toggleLabel}>
          {consents[type] ? 'Autorisé' : 'Refusé'}
        </Text>
        <Switch
          value={consents[type]}
          onValueChange={(value) => handleConsentChange(type, value)}
          trackColor={{ false: COLORS.gray.light, true: COLORS.primary }}
          thumbColor={consents[type] ? COLORS.white : COLORS.gray.medium}
          disabled={required}
        />
      </View>
    </View>
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
        <Text style={styles.headerTitle}>Gestion des Consentements</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.intro}>
          <Ionicons name="shield-checkmark" size={48} color={COLORS.primary} />
          <Text style={styles.introTitle}>Vos données, vos choix</Text>
          <Text style={styles.introText}>
            Conformément au RGPD, vous avez le contrôle sur vos données personnelles. 
            Choisissez les traitements que vous autorisez.
          </Text>
        </View>

        <ConsentItem
          title="Fonctionnement essentiel"
          description="Données nécessaires au fonctionnement de l'application : authentification, gestion du compte, sécurité."
          type="essential"
          required={true}
        />

        <ConsentItem
          title="Géolocalisation"
          description="Utilisation de votre position pour localiser les bornes à proximité et calculer les itinéraires."
          type="geolocation"
        />

        <ConsentItem
          title="Analyses et statistiques"
          description="Collecte de données d'usage anonymisées pour améliorer l'application et comprendre son utilisation."
          type="analytics"
        />

        <ConsentItem
          title="Communications marketing"
          description="Envoi d'informations sur nos nouveaux services, offres spéciales et actualités YapluCa."
          type="marketing"
        />

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Vous pouvez modifier ces préférences à tout moment dans les paramètres de l'application.
          </Text>
        </View>

        <View style={styles.rightsSection}>
          <Text style={styles.rightsTitle}>Vos droits RGPD</Text>
          <Text style={styles.rightsText}>
            • Droit d'accès à vos données{'\n'}
            • Droit de rectification{'\n'}
            • Droit à l'effacement{'\n'}
            • Droit à la portabilité{'\n'}
            • Droit d'opposition{'\n'}
            • Retrait du consentement
          </Text>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => navigation.navigate('PrivacyPolicy')}
          >
            <Text style={styles.contactButtonText}>En savoir plus</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.saveButton} onPress={saveConsents}>
          <Text style={styles.saveButtonText}>Enregistrer mes préférences</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
    paddingBottom: SPACING.md,
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
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  intro: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  introTitle: {
    fontSize: FONTS.sizes.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  introText: {
    fontSize: FONTS.sizes.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  consentItem: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  consentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  consentTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  requiredLabel: {
    fontSize: FONTS.sizes.xs,
    color: COLORS.warning,
    backgroundColor: `${COLORS.warning}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    fontWeight: '500',
  },
  consentDescription: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  consentToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLabel: {
    fontSize: FONTS.sizes.md,
    fontWeight: '500',
    color: COLORS.text,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginVertical: SPACING.lg,
  },
  infoText: {
    flex: 1,
    fontSize: FONTS.sizes.sm,
    color: COLORS.text,
    marginLeft: SPACING.sm,
    lineHeight: 20,
  },
  rightsSection: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  rightsTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  rightsText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  contactButton: {
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  footer: {
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
  },
});
