import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../../constants/theme';

export default function TermsOfServiceScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Conditions d'Utilisation</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Objet</Text>
          <Text style={styles.text}>
            Les présentes conditions générales d'utilisation (CGU) régissent l'utilisation de l'application mobile YapluCa, 
            éditée par la société YapluCa, permettant la localisation et la réservation de batteries portables de recharge.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Acceptation des conditions</Text>
          <Text style={styles.text}>
            L'utilisation de l'application YapluCa implique l'acceptation pleine et entière des présentes CGU. 
            Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser l'application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Description du service</Text>
          <Text style={styles.text}>
            YapluCa est une application mobile gratuite qui permet :{'\n\n'}
            • La géolocalisation des bornes de recharge de batteries portables{'\n'}
            • La consultation des disponibilités en temps réel{'\n'}
            • La navigation vers les bornes{'\n'}
            • La gestion d'un compte utilisateur{'\n'}
            • L'historique des utilisations
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Conditions d'accès</Text>
          <Text style={styles.text}>
            L'application est accessible :{'\n\n'}
            • Aux personnes physiques majeures{'\n'}
            • Aux mineurs avec autorisation parentale{'\n'}
            • Disposant d'un smartphone compatible{'\n'}
            • Acceptant la géolocalisation pour les services de proximité
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Création de compte</Text>
          <Text style={styles.text}>
            Pour utiliser certaines fonctionnalités, vous devez créer un compte en fournissant :{'\n\n'}
            • Une adresse email valide{'\n'}
            • Un mot de passe sécurisé{'\n'}
            • Vos nom et prénom{'\n\n'}
            Vous vous engagez à fournir des informations exactes et à les maintenir à jour.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Utilisation de la géolocalisation</Text>
          <Text style={styles.text}>
            L'application utilise votre position géographique pour :{'\n\n'}
            • Localiser les bornes à proximité{'\n'}
            • Calculer les distances et itinéraires{'\n'}
            • Améliorer la pertinence des résultats{'\n\n'}
            Vous pouvez désactiver la géolocalisation dans les paramètres de votre appareil, 
            mais certaines fonctionnalités seront limitées.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Obligations de l'utilisateur</Text>
          <Text style={styles.text}>
            Vous vous engagez à :{'\n\n'}
            • Utiliser l'application conformément à sa destination{'\n'}
            • Ne pas porter atteinte aux droits de tiers{'\n'}
            • Ne pas diffuser de contenu illicite{'\n'}
            • Respecter les conditions d'utilisation des bornes{'\n'}
            • Signaler tout dysfonctionnement ou contenu inapproprié
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Disponibilité du service</Text>
          <Text style={styles.text}>
            YapluCa s'efforce d'assurer la disponibilité de l'application 24h/24 et 7j/7. 
            Cependant, des interruptions peuvent survenir pour :{'\n\n'}
            • Maintenance technique{'\n'}
            • Mise à jour de l'application{'\n'}
            • Cas de force majeure{'\n'}
            • Défaillance des réseaux de télécommunication
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Propriété intellectuelle</Text>
          <Text style={styles.text}>
            L'application YapluCa, son contenu, sa structure et son design sont protégés par le droit d'auteur. 
            Toute reproduction, représentation, modification ou adaptation est interdite sans autorisation expresse.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Données personnelles</Text>
          <Text style={styles.text}>
            Le traitement de vos données personnelles est régi par notre Politique de Confidentialité, 
            conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Responsabilité</Text>
          <Text style={styles.text}>
            YapluCa ne saurait être tenu responsable :{'\n\n'}
            • Des dommages directs ou indirects liés à l'utilisation{'\n'}
            • De l'indisponibilité temporaire du service{'\n'}
            • Des erreurs dans les informations fournies{'\n'}
            • Des dysfonctionnements des bornes de recharge{'\n'}
            • De la perte de données due à un dysfonctionnement technique
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>12. Modification des CGU</Text>
          <Text style={styles.text}>
            YapluCa se réserve le droit de modifier les présentes CGU à tout moment. 
            Les utilisateurs seront informés des modifications par notification dans l'application 
            ou par email. L'utilisation continue de l'application vaut acceptation des nouvelles conditions.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>13. Résiliation</Text>
          <Text style={styles.text}>
            Vous pouvez supprimer votre compte à tout moment depuis les paramètres de l'application. 
            YapluCa peut suspendre ou supprimer un compte en cas de non-respect des présentes CGU.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>14. Droit applicable</Text>
          <Text style={styles.text}>
            Les présentes CGU sont soumises au droit français. 
            En cas de litige, les tribunaux français seront seuls compétents.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.contact}>
            Contact : legal@yapluca.com
          </Text>
        </View>
      </ScrollView>
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
  section: {
    marginBottom: SPACING.xl,
  },
  lastUpdated: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    marginVertical: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  text: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  contact: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
