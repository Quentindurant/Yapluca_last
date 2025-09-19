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

export default function PrivacyPolicyScreen({ navigation }) {
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
        <Text style={styles.headerTitle}>Politique de Confidentialité</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.lastUpdated}>Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. Responsable du traitement</Text>
          <Text style={styles.text}>
            YapluCa, société par actions simplifiée au capital de [MONTANT] euros, 
            immatriculée au RCS de [VILLE] sous le numéro [NUMÉRO], 
            dont le siège social est situé [ADRESSE COMPLÈTE].
          </Text>
          <Text style={styles.text}>
            Email : contact@yapluca.com{'\n'}
            Téléphone : [NUMÉRO DE TÉLÉPHONE]
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Données collectées</Text>
          <Text style={styles.subsectionTitle}>2.1 Données d'identification</Text>
          <Text style={styles.text}>
            • Nom et prénom{'\n'}
            • Adresse email{'\n'}
            • Numéro de téléphone (optionnel){'\n'}
            • Mot de passe (chiffré)
          </Text>
          
          <Text style={styles.subsectionTitle}>2.2 Données de géolocalisation</Text>
          <Text style={styles.text}>
            • Position GPS (uniquement avec votre consentement explicite){'\n'}
            • Historique des trajets vers les bornes de recharge{'\n'}
            • Stations favorites
          </Text>

          <Text style={styles.subsectionTitle}>2.3 Données d'utilisation</Text>
          <Text style={styles.text}>
            • Historique des locations de batteries{'\n'}
            • Préférences d'utilisation{'\n'}
            • Données de connexion (logs, adresse IP)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Finalités du traitement</Text>
          <Text style={styles.text}>
            Vos données sont traitées pour les finalités suivantes :{'\n\n'}
            • <Text style={styles.bold}>Gestion du compte utilisateur</Text> (base légale : exécution du contrat){'\n'}
            • <Text style={styles.bold}>Localisation des bornes</Text> (base légale : consentement){'\n'}
            • <Text style={styles.bold}>Amélioration du service</Text> (base légale : intérêt légitime){'\n'}
            • <Text style={styles.bold}>Communication commerciale</Text> (base légale : consentement){'\n'}
            • <Text style={styles.bold}>Respect des obligations légales</Text> (base légale : obligation légale)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. Durée de conservation</Text>
          <Text style={styles.text}>
            • <Text style={styles.bold}>Données de compte :</Text> 3 ans après la dernière connexion{'\n'}
            • <Text style={styles.bold}>Données de géolocalisation :</Text> 12 mois maximum{'\n'}
            • <Text style={styles.bold}>Historique des locations :</Text> 5 ans (obligations comptables){'\n'}
            • <Text style={styles.bold}>Logs de connexion :</Text> 12 mois maximum
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. Destinataires des données</Text>
          <Text style={styles.text}>
            Vos données peuvent être transmises à :{'\n\n'}
            • <Text style={styles.bold}>Prestataires techniques :</Text> Firebase (Google), services de géolocalisation{'\n'}
            • <Text style={styles.bold}>Partenaires :</Text> Opérateurs de bornes de recharge (données anonymisées){'\n'}
            • <Text style={styles.bold}>Autorités :</Text> Sur demande légale uniquement
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>6. Transferts internationaux</Text>
          <Text style={styles.text}>
            Certaines données peuvent être transférées vers des pays tiers dans le cadre de l'utilisation de Firebase (Google). 
            Ces transferts sont encadrés par les clauses contractuelles types de la Commission européenne.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Vos droits</Text>
          <Text style={styles.text}>
            Conformément au RGPD, vous disposez des droits suivants :{'\n\n'}
            • <Text style={styles.bold}>Droit d'accès :</Text> Obtenir une copie de vos données{'\n'}
            • <Text style={styles.bold}>Droit de rectification :</Text> Corriger vos données inexactes{'\n'}
            • <Text style={styles.bold}>Droit à l'effacement :</Text> Supprimer vos données{'\n'}
            • <Text style={styles.bold}>Droit à la limitation :</Text> Limiter le traitement{'\n'}
            • <Text style={styles.bold}>Droit à la portabilité :</Text> Récupérer vos données{'\n'}
            • <Text style={styles.bold}>Droit d'opposition :</Text> Vous opposer au traitement{'\n'}
            • <Text style={styles.bold}>Retrait du consentement :</Text> À tout moment
          </Text>
          
          <Text style={styles.text}>
            Pour exercer ces droits, contactez-nous à : privacy@yapluca.com
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>8. Sécurité des données</Text>
          <Text style={styles.text}>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées :{'\n\n'}
            • Chiffrement des données sensibles{'\n'}
            • Authentification sécurisée{'\n'}
            • Accès restreint aux données{'\n'}
            • Surveillance des accès{'\n'}
            • Sauvegarde régulière{'\n'}
            • Formation du personnel
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>9. Cookies et traceurs</Text>
          <Text style={styles.text}>
            L'application utilise des technologies similaires aux cookies pour :{'\n\n'}
            • Maintenir votre session de connexion{'\n'}
            • Mémoriser vos préférences{'\n'}
            • Analyser l'utilisation (avec votre consentement)
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>10. Réclamations</Text>
          <Text style={styles.text}>
            En cas de litige, vous pouvez saisir la CNIL :{'\n\n'}
            Commission Nationale de l'Informatique et des Libertés{'\n'}
            3 Place de Fontenoy - TSA 80715{'\n'}
            75334 PARIS CEDEX 07{'\n'}
            Téléphone : 01 53 73 22 22{'\n'}
            Site web : www.cnil.fr
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>11. Modifications</Text>
          <Text style={styles.text}>
            Cette politique peut être modifiée. Vous serez informé de toute modification importante 
            par email ou notification dans l'application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.contact}>
            Pour toute question : privacy@yapluca.com
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
  subsectionTitle: {
    fontSize: FONTS.sizes.md,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  text: {
    fontSize: FONTS.sizes.md,
    color: COLORS.text,
    lineHeight: 22,
    marginBottom: SPACING.sm,
  },
  bold: {
    fontWeight: '600',
  },
  contact: {
    fontSize: FONTS.sizes.md,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: SPACING.lg,
  },
});
