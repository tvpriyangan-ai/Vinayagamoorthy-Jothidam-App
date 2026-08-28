import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, fonts, radii } from '../theme/theme';

export default function FormField({ label, style, inputStyle, ...inputProps }) {
  return (
    <View style={[styles.wrap, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        placeholderTextColor="rgba(58,40,18,0.5)"
        style={[styles.input, inputStyle]}
        {...inputProps}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: {
    fontFamily: fonts.bodySemibold,
    color: colors.inkBrown,
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    fontFamily: fonts.body,
    backgroundColor: 'rgba(255,255,255,0.55)',
    borderWidth: 1,
    borderColor: 'rgba(107,78,46,0.5)',
    borderRadius: radii.sm,
    paddingVertical: 10,
    paddingHorizontal: 12,
    color: colors.inkBrown,
    fontSize: 15,
  },
});
