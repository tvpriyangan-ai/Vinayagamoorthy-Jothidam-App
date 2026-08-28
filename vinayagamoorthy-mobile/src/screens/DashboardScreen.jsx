import { useEffect, useState, useCallback, useRef } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import AppBackground from '../components/AppBackground';
import AppHeader from '../components/AppHeader';
import ParchmentCard from '../components/ParchmentCard';
import RopeDivider from '../components/RopeDivider';
import FormField from '../components/FormField';
import GoldButton from '../components/GoldButton';
import {
  getMyProfile, getMyJathagam, getTodayPanchangam,
  sendChatMessage, getChatHistory,
} from '../api/client';
import { colors, fonts, radii } from '../theme/theme';

const QUICK_START_ITEMS = [
  { key: 'meditation', label: 'தியானம்' },
  { key: 'yoga', label: 'யோகா' },
  { key: 'diet', label: 'உணவு' },
  { key: 'ayurveda', label: 'ஆயுர்வேதம்' },
  { key: 'dosha', label: 'தோஷ பரிகாரங்கள்', screen: 'Dosha' },
  { key: 'vastu', label: 'வாஸ்து' },
  { key: 'books', label: 'புத்தகங்கள்' },
];

const FEATURE_GRID = [
  { key: 'jathagam', label: 'Full Jathagam', sub: 'Create & View', screen: 'Jathagam' },
  { key: 'matching', label: 'Matching & Advices', sub: 'Compatibility Analysis', screen: 'Matching' },
  { key: 'lucky', label: 'Lucky Notes', sub: 'Personalized Notes', screen: 'LuckyNotes' },
  { key: 'temples', label: 'Temples & Pujas', sub: 'Pariharam & Pujas', screen: 'Temples' },
  { key: 'panchangam', label: 'Panchangam', sub: 'Daily Panchangam', screen: 'Panchangam' },
  { key: 'transit', label: 'Transit Predictions', sub: 'Planet Movements', screen: 'Transit' },
];

export default function DashboardScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [chart, setChart] = useState(null);
  const [panchangam, setPanchangam] = useState(null);
  const [loadError, setLoadError] = useState('');

  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatScrollRef = useRef(null);

  const loadAll = useCallback(async () => {
    try {
      const [profileRes, chartRes, panchangamRes, historyRes] = await Promise.all([
        getMyProfile(), getMyJathagam(), getTodayPanchangam(), getChatHistory(),
      ]);
      setProfile(profileRes.data);
      setChart(chartRes.data);
      setPanchangam(panchangamRes.data);
      setChatMessages(historyRes.data);
    } catch (err) {
      setLoadError('தகவல்களை ஏற்றுவதில் சிக்கல்.');
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  async function handleSendChat() {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatMessages((m) => [...m, { role: 'user', content: userText }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const { data } = await sendChatMessage(userText);
      setChatMessages((m) => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setChatMessages((m) => [...m, {
        role: 'assistant',
        content: 'மன்னிக்கவும், தற்போது பதிலளிக்க முடியவில்லை.',
      }]);
    } finally {
      setChatLoading(false);
    }
  }

  function goTo(screenName, title) {
    if (screenName) navigation.navigate(screenName);
    else navigation.navigate('ComingSoon', { title });
  }

  return (
    <AppBackground>
      <AppHeader userName={profile?.name} />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {!!loadError && <Text style={styles.errorText}>{loadError}</Text>}

          <ParchmentCard style={styles.card}>
            <Text style={styles.cardTitle}>PROFILE</Text>
            <View style={styles.avatarWrap}>
              <View style={styles.avatar}><Text style={{ fontSize: 28 }}>👤</Text></View>
            </View>
            {profile ? (
              <>
                <Row label="பெயர்" value={profile.name} />
                <Row label="பிறந்த தேதி" value={profile.birth.date} />
                <Row label="பிறந்த நேரம்" value={profile.birth.time} />
                <Row label="பிறந்த இடம்" value={profile.birth.place} />
                <Row label="நட்சத்திரம்" value={chart?.nakshatra} />
                <Row label="ராசி" value={chart?.rasi} />
                <Row label="லக்கனம்" value={chart?.ascendant?.rasi_name_ta} />
              </>
            ) : <ActivityIndicator color={colors.gold} />}
            <GoldButton title="View / Edit Profile" onPress={() => goTo('Profile')} style={{ marginTop: 10 }} />
          </ParchmentCard>

          <ParchmentCard style={styles.card}>
            <Text style={styles.cardTitle}>உடனே ஆரம்பிக்கவும்</Text>
            {QUICK_START_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.key}
                style={styles.listItem}
                onPress={() => goTo(item.screen, item.label)}
              >
                <Text style={styles.listItemText}>{item.label}</Text>
                <Text style={styles.listItemArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </ParchmentCard>

          <ParchmentCard style={styles.card}>
            <Text style={styles.cardTitle}>TODAY</Text>
            {panchangam ? (
              <>
                <Text style={styles.dateSub}>{panchangam.date} · {panchangam.vaaram}</Text>
                <Row label="திதி" value={`${panchangam.tithi.name_ta} (${panchangam.tithi.paksha})`} />
                <Row label="நட்சத்திரம்" value={`${panchangam.nakshatra.name_ta} பாதம் ${panchangam.nakshatra.pada}`} />
                <Row label="யோகம்" value={panchangam.yoga.name_ta} />
                <Row label="சூரிய உதயம்" value={panchangam.sunrise} />
                <Row label="ராகு காலம்" value={`${panchangam.rahu_kalam.start} - ${panchangam.rahu_kalam.end}`} />
              </>
            ) : <ActivityIndicator color={colors.gold} />}
            <GoldButton title="முழு பஞ்சாங்கம்" onPress={() => goTo('Panchangam')} style={{ marginTop: 10 }} />
          </ParchmentCard>

          <ParchmentCard style={styles.card}>
            <Text style={styles.cardTitle}>CHAT WITH VINAYAGAMOORTHY!</Text>
            <ScrollView
              style={styles.chatBox}
              ref={chatScrollRef}
              onContentSizeChange={() => chatScrollRef.current?.scrollToEnd({ animated: true })}
              nestedScrollEnabled
            >
              {chatMessages.length === 0 && (
                <Text style={styles.chatPlaceholder}>உங்கள் ஜாதகம் பற்றி எதுவும் கேளுங்கள்...</Text>
              )}
              {chatMessages.map((m, i) => (
                <View key={i} style={[styles.bubbleRow, { justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }]}>
                  <View style={[styles.bubble, { backgroundColor: m.role === 'user' ? colors.gold : 'rgba(255,255,255,0.5)' }]}>
                    <Text style={styles.bubbleText}>{m.content}</Text>
                  </View>
                </View>
              ))}
              {chatLoading && <ActivityIndicator color={colors.gold} style={{ marginTop: 6 }} />}
            </ScrollView>
            <View style={styles.chatInputRow}>
              <FormField
                value={chatInput}
                onChangeText={setChatInput}
                placeholder="Type here..."
                style={{ flex: 1, marginBottom: 0 }}
              />
              <TouchableOpacity onPress={handleSendChat} style={styles.sendBtn} disabled={chatLoading}>
                <Text style={{ color: colors.inkBrown, fontSize: 16 }}>➤</Text>
              </TouchableOpacity>
            </View>
          </ParchmentCard>

          <RopeDivider knots={3} />

          <View style={styles.grid}>
            {FEATURE_GRID.map((f) => (
              <TouchableOpacity key={f.key} style={styles.gridItem} onPress={() => goTo(f.screen)}>
                <ParchmentCard decorated={false} style={styles.gridCard}>
                  <Text style={styles.gridLabel}>{f.label}</Text>
                  <Text style={styles.gridSub}>{f.sub}</Text>
                </ParchmentCard>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.footer}>© 2026 Vinayagamoorthy Jothidam. TVP Creations</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppBackground>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}:</Text>
      <Text style={styles.rowValue}>{value || '—'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 14, paddingBottom: 30 },
  errorText: { fontFamily: fonts.body, color: colors.goldBright, textAlign: 'center', marginBottom: 10 },
  card: { marginBottom: 14 },
  cardTitle: { fontFamily: fonts.headingMedium, color: colors.parchmentHeading, fontSize: 15, textAlign: 'center', marginBottom: 10, letterSpacing: 0.5 },
  avatarWrap: { alignItems: 'center', marginBottom: 8 },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(0,0,0,0.1)', borderWidth: 2, borderColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 3 },
  rowLabel: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13, opacity: 0.75 },
  rowValue: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, flexShrink: 1, textAlign: 'right' },
  listItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)', borderWidth: 1, borderColor: 'rgba(107,78,46,0.3)',
    borderRadius: radii.sm, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8,
  },
  listItemText: { fontFamily: fonts.bodyMedium, color: colors.inkBrown, fontSize: 14 },
  listItemArrow: { color: colors.inkBrown, fontSize: 16 },
  dateSub: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 12, textAlign: 'center', opacity: 0.7, marginBottom: 6 },
  chatBox: { minHeight: 80, maxHeight: 220, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: radii.sm, padding: 8, marginBottom: 8, overflow: 'hidden' },
  chatPlaceholder: { fontFamily: fonts.manuscript, color: colors.inkBrown, textAlign: 'center', marginTop: 20, opacity: 0.6 },
  bubbleRow: { flexDirection: 'row', marginBottom: 6 },
  bubble: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10, maxWidth: '85%' },
  bubbleText: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 13 },
  chatInputRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8 },
  gridItem: { width: '47%' },
  gridCard: { alignItems: 'center', justifyContent: 'center', paddingVertical: 18, minHeight: 80 },
  gridLabel: { fontFamily: fonts.bodySemibold, color: colors.inkBrown, fontSize: 13, textAlign: 'center' },
  gridSub: { fontFamily: fonts.body, color: colors.inkBrown, fontSize: 11, opacity: 0.7, textAlign: 'center', marginTop: 2 },
  footer: { fontFamily: fonts.body, color: colors.gold, fontSize: 10, textAlign: 'center', marginTop: 16, opacity: 0.6 },
});
