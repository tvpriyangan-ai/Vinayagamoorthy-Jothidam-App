/**
 * DESIGN SYSTEM — Vinayagamoorthy Jothidam (Mobile)
 * ------------------------------------------------------------------
 * Mirrors the web app's palm-leaf manuscript aesthetic: dark vignette
 * background, warm parchment cards, gold ornamental trim. React Native
 * has no CSS gradients/pseudo-elements, so gradients use expo-linear-gradient
 * and the "rope divider" is a simple styled View instead of a repeating
 * CSS pattern.
 */

export const colors = {
  inkBlack: '#150d07',
  emberBrown: '#2c1c0f',
  parchmentDark: '#6b4e2e',
  parchmentMid: '#a9814f',
  parchmentLight: '#d9b978',
  gold: '#d8b45c',
  goldBright: '#f0d68a',
  inkBrown: '#3a2812',
  parchmentHeading: '#6b4514',
  alertRed: '#7a2318',
  successGreen: '#2d5a2d',
};

export const fonts = {
  display: 'CinzelDecorative_700Bold',   // brand wordmark
  heading: 'Cinzel_700Bold',              // section headings on dark bg
  headingMedium: 'Cinzel_500Medium',
  body: 'Catamaran_400Regular',           // default body text (Tamil-capable)
  bodyMedium: 'Catamaran_500Medium',
  bodySemibold: 'Catamaran_600SemiBold',
  bodyBold: 'Catamaran_700Bold',
  manuscript: 'CormorantGaramond_500Medium_Italic',
};

export const spacing = {
  xs: 4, sm: 8, md: 12, lg: 16, xl: 24, xxl: 32,
};

export const radii = {
  sm: 8, md: 12, lg: 14, pill: 999,
};
