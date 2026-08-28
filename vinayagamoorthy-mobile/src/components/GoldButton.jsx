import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts, radii } from '../theme/theme';

export default function GoldButton({ title, onPress, loading, disabled, style }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={[{ opacity: disabled || loading ? 0.6 : 1 }, style]}
    >
      <LinearGradient
        colors={[colors.goldBright, colors.gold]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color={colors.inkBrown} />
        ) : (
          <Text style={styles.text}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radii.pill,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#8a6a34',
  },
  text: {
    fontFamily: fonts.bodySemibold,
    color: colors.inkBrown,
    fontSize: 15,
    letterSpacing: 0.3,
  },
});
