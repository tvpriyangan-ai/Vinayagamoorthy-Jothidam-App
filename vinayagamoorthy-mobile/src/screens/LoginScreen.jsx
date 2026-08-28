import { useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AppBackground from '../components/AppBackground';
import ParchmentCard from '../components/ParchmentCard';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import { login, extractErrorMessage } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { colors, fonts } from '../theme/theme';

export default function LoginScreen({ navigation }) {
  const { signIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError('');
    setLoading(true);
    try {
      const { data } = await login({ username, password });
      await signIn(data.access_token, data.user_id);
      // No manual navigation needed — the root navigator switches
      // stacks automatically once isLoggedIn flips to true.
    } catch (err) {
      setError(extractErrorMessage(err, 'உள்நுழைவு தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Image source={require('../../assets/logo.png')} style={styles.logo} />
            <Text style={styles.brand}>VINAYAGAMOORTHY</Text>
            <Text style={styles.brandSub}>JOTHIDAM</Text>
            <Text style={styles.tagline}>Vedic Astrology Software</Text>
          </View>

          <ParchmentCard>
            <Text style={styles.cardTitle}>உள்நுழைவு</Text>

            <FormField
              label="பயனர் பெயர் (Username)"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
            <FormField
              label="கடவுச்சொல் (Password)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <GoldButton
              title={loading ? 'சிறிது காத்திருக்கவும்...' : 'உள்நுழையவும்'}
              onPress={handleLogin}
              loading={loading}
              style={{ marginTop: 8 }}
            />

            <View style={styles.linksRow}>
              <Text style={styles.link} onPress={() => navigation.navigate('ForgotPassword')}>
                கடவுச்சொல் மறந்துவிட்டீர்களா?
              </Text>
              <Text style={[styles.link, { fontFamily: fonts.bodyBold }]} onPress={() => navigation.navigate('Signup')}>
                புதிய கணக்கு
              </Text>
            </View>
          </ParchmentCard>

          <Text style={styles.footer}>© 2026 Vinayagamoorthy Jothidam. TVP Creations</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20 },
  logo: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: colors.gold, marginBottom: 10 },
  brand: { fontFamily: fonts.display, color: colors.gold, fontSize: 22, letterSpacing: 1 },
  brandSub: { fontFamily: fonts.heading, color: colors.gold, fontSize: 13, letterSpacing: 4, marginTop: 2 },
  tagline: { fontFamily: fonts.manuscript, color: colors.goldBright, fontSize: 13, marginTop: 6, opacity: 0.85 },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 19, textAlign: 'center', marginBottom: 14 },
  error: { fontFamily: fonts.body, color: colors.alertRed, fontSize: 13, marginBottom: 8 },
  linksRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 },
  link: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, textDecorationLine: 'underline' },
  footer: { fontFamily: fonts.body, color: colors.gold, fontSize: 11, textAlign: 'center', marginTop: 20, opacity: 0.6 },
});
