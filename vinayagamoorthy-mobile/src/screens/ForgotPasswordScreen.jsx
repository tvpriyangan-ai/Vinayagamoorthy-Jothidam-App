import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import AppBackground from '../components/AppBackground';
import ParchmentCard from '../components/ParchmentCard';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import { forgotPassword, resetPassword, extractErrorMessage } from '../api/client';
import { colors, fonts } from '../theme/theme';

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRequest() {
    setError('');
    setLoading(true);
    try {
      const { data } = await forgotPassword({ identifier });
      setMessage(data.message);
      setStep('reset');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleReset() {
    setError('');
    setLoading(true);
    try {
      await resetPassword({ identifier, otp, new_password: newPassword });
      setMessage('கடவுச்சொல் மாற்றப்பட்டது! இப்போது உள்நுழையவும்.');
    } catch (err) {
      setError(extractErrorMessage(err, 'OTP தவறானது அல்லது காலாவதியானது.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppBackground>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ParchmentCard>
            <Text style={styles.title}>கடவுச்சொல் மறந்துவிட்டீர்களா?</Text>

            {step === 'request' ? (
              <>
                <FormField label="மின்னஞ்சல் / மொபைல்" value={identifier} onChangeText={setIdentifier} autoCapitalize="none" />
                {!!error && <Text style={styles.error}>{error}</Text>}
                <GoldButton title={loading ? 'அனுப்புகிறது...' : 'OTP அனுப்பவும்'} onPress={handleRequest} loading={loading} />
              </>
            ) : (
              <>
                {!!message && <Text style={styles.info}>{message}</Text>}
                <FormField label="OTP" value={otp} onChangeText={setOtp} keyboardType="number-pad" />
                <FormField label="புதிய கடவுச்சொல்" value={newPassword} onChangeText={setNewPassword} secureTextEntry />
                {!!error && <Text style={styles.error}>{error}</Text>}
                <GoldButton title={loading ? 'மாற்றப்படுகிறது...' : 'கடவுச்சொல் மாற்றவும்'} onPress={handleReset} loading={loading} />
              </>
            )}

            <Text style={styles.backLink} onPress={() => navigation.navigate('Login')}>
              உள்நுழைவுக்குத் திரும்பவும்
            </Text>
          </ParchmentCard>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 20 },
  title: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 18, textAlign: 'center', marginBottom: 14 },
  error: { fontFamily: fonts.body, color: colors.alertRed, fontSize: 13, marginBottom: 8 },
  info: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, marginBottom: 10, opacity: 0.85 },
  backLink: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, textAlign: 'center', marginTop: 16, textDecorationLine: 'underline' },
});
