import { View, Text, StyleSheet } from 'react-native';
import AppBackground from '../components/AppBackground';
import AppHeader from '../components/AppHeader';
import ParchmentCard from '../components/ParchmentCard';
import GoldButton from '../components/GoldButton';
import { colors, fonts } from '../theme/theme';

export default function ComingSoonScreen({ route, navigation }) {
  const title = route?.params?.title || 'இந்த பகுதி';

  return (
    <AppBackground>
      <AppHeader onBack={() => navigation.goBack()} />
      <View style={styles.center}>
        <ParchmentCard>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.sub}>இந்த பகுதி விரைவில் கிடைக்கும் — தற்போது உருவாக்கப்பட்டு வருகிறது.</Text>
          <GoldButton title="டாஷ்போர்டுக்குத் திரும்பவும்" onPress={() => navigation.goBack()} style={{ marginTop: 16 }} />
        </ParchmentCard>
      </View>
    </AppBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 19, textAlign: 'center', marginBottom: 10 },
  sub: { fontFamily: fonts.manuscript, color: colors.inkBrown, fontSize: 14, textAlign: 'center' },
});
