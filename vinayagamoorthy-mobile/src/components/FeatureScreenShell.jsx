import { Text, StyleSheet, ScrollView } from 'react-native';
import AppBackground from './AppBackground';
import AppHeader from './AppHeader';
import { colors, fonts } from '../theme/theme';

export default function FeatureScreenShell({ title, subtitle, navigation, children }) {
  return (
    <AppBackground>
      <AppHeader onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{title}</Text>
        {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {children}
        <Text style={styles.footer}>© 2026 Vinayagamoorthy Jothidam. TVP Creations</Text>
      </ScrollView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 14, paddingBottom: 30 },
  title: { fontFamily: fonts.heading, color: colors.gold, fontSize: 20, marginBottom: 2 },
  subtitle: { fontFamily: fonts.manuscript, color: colors.goldBright, fontSize: 13, opacity: 0.85, marginBottom: 12 },
  footer: { fontFamily: fonts.body, color: colors.gold, fontSize: 10, textAlign: 'center', marginTop: 16, opacity: 0.6 },
});
