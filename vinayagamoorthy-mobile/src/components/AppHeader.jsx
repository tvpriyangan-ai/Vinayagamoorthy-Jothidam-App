import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { colors, fonts, radii } from '../theme/theme';

export default function AppHeader({ userName, onBack }) {
  const { signOut } = useAuth();

  return (
    <LinearGradient
      colors={[colors.parchmentLight, colors.parchmentMid, colors.parchmentDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.left}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
        ) : (
          <Image source={require('../../assets/logo.png')} style={styles.logo} />
        )}
        <View>
          <Text style={styles.brand}>VINAYAGAMOORTHY</Text>
          <Text style={styles.sub}>VEDIC ASTROLOGY</Text>
        </View>
      </View>
      <TouchableOpacity onPress={signOut} style={styles.logoutBtn}>
        <Text style={styles.logoutText}>வெளியேறு</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: 'rgba(216,180,92,0.5)',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 10, flexShrink: 1 },
  logo: { width: 38, height: 38, borderRadius: 19, borderWidth: 2, borderColor: colors.gold },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' },
  backText: { fontSize: 18, color: colors.inkBrown },
  brand: { fontFamily: fonts.heading, color: colors.inkBrown, fontSize: 13 },
  sub: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 9, letterSpacing: 1, opacity: 0.8 },
  logoutBtn: { backgroundColor: colors.gold, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radii.pill },
  logoutText: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 12 },
});
