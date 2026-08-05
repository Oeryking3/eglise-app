import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { HeaderWithBack } from '@/components/HeaderWithBack';
import { colors, spacing } from '@/theme/tokens';

function Section({ title, children }: { title: string; children: string }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.sectionText}>{children}</Text>
    </View>
  );
}

export default function ConfidentialiteScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderWithBack title="Politique de confidentialité" />
      <ScrollView contentContainerStyle={styles.content}>
        <Section title="Qui gère tes données">
          L'église que tu choisis à l'inscription est responsable de tes données. Elle utilise
          cette application pour gérer la vie de la communauté (membres, événements, agenda,
          carte de membre).
        </Section>

        <Section title="Quelles données sont collectées">
          Nom, prénom, email, mot de passe, date de naissance, sexe, lieu de résidence, groupe
          sanguin et photo de carte (si tu remplis ta carte de membre), numéro de téléphone (si
          tu effectues un paiement), et un identifiant technique de ton appareil pour t'envoyer
          des notifications.
        </Section>

        <Section title="Pourquoi ces données">
          Créer et gérer ton compte membre, générer ta carte de membre, te permettre de
          participer aux événements et de gérer ton agenda personnel, traiter tes paiements, et
          t'envoyer une notification quand un événement important est publié.
        </Section>

        <Section title="Qui d'autre y a accès">
          Personne en dehors de l'administrateur de ton église et du responsable principal de
          l'application. Tes données ne sont ni vendues ni partagées à des fins publicitaires.
          Deux prestataires techniques y accèdent uniquement pour faire fonctionner le service :
          CinetPay pour traiter un paiement, et Expo pour livrer les notifications sur ton
          téléphone.
        </Section>

        <Section title="Combien de temps elles sont gardées">
          Tant que ton compte existe. Si l'espace de ton église est supprimé par le responsable
          principal, toutes les données associées (membres, paiements, événements) sont
          supprimées définitivement.
        </Section>

        <Section title="Tes droits">
          Tu peux demander à voir, corriger ou supprimer tes données à tout moment en contactant
          l'administrateur de ton église, qui peut modifier ou supprimer ton compte depuis son
          espace admin.
        </Section>

        <Section title="Sécurité">
          Ton mot de passe est chiffré et n'est jamais visible, même par les administrateurs. Les
          connexions à l'application sont sécurisées.
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: spacing.xxl,
    paddingBottom: 60,
  },
  section: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 13,
    color: colors.textLight,
    lineHeight: 20,
  },
});
