import { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  useFonts as useCinzel,
  Cinzel_500Medium,
  Cinzel_700Bold,
} from '@expo-google-fonts/cinzel';
import {
  useFonts as useCinzelDecorative,
  CinzelDecorative_700Bold,
} from '@expo-google-fonts/cinzel-decorative';
import {
  useFonts as useCatamaran,
  Catamaran_400Regular,
  Catamaran_500Medium,
  Catamaran_600SemiBold,
  Catamaran_700Bold,
} from '@expo-google-fonts/catamaran';
import {
  useFonts as useCormorant,
  CormorantGaramond_500Medium_Italic,
} from '@expo-google-fonts/cormorant-garamond';

import { AuthProvider, useAuth } from './src/context/AuthContext';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import JathagamScreen from './src/screens/JathagamScreen';
import MatchingScreen from './src/screens/MatchingScreen';
import LuckyNotesScreen from './src/screens/LuckyNotesScreen';
import TemplesScreen from './src/screens/TemplesScreen';
import PanchangamScreen from './src/screens/PanchangamScreen';
import DoshaScreen from './src/screens/DoshaScreen';
import TransitScreen from './src/screens/TransitScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ComingSoonScreen from './src/screens/ComingSoonScreen';
import { colors } from './src/theme/theme';

SplashScreen.preventAutoHideAsync();

const Stack = createNativeStackNavigator();

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null; // splash screen still visible

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
          <Stack.Screen name="Jathagam" component={JathagamScreen} />
          <Stack.Screen name="Matching" component={MatchingScreen} />
          <Stack.Screen name="LuckyNotes" component={LuckyNotesScreen} />
          <Stack.Screen name="Temples" component={TemplesScreen} />
          <Stack.Screen name="Panchangam" component={PanchangamScreen} />
          <Stack.Screen name="Dosha" component={DoshaScreen} />
          <Stack.Screen name="Transit" component={TransitScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          {/* Still placeholder — content library not built yet */}
          <Stack.Screen name="ComingSoon" component={ComingSoonScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  const [cinzelLoaded] = useCinzel({ Cinzel_500Medium, Cinzel_700Bold });
  const [cinzelDecLoaded] = useCinzelDecorative({ CinzelDecorative_700Bold });
  const [catamaranLoaded] = useCatamaran({
    Catamaran_400Regular, Catamaran_500Medium, Catamaran_600SemiBold, Catamaran_700Bold,
  });
  const [cormorantLoaded] = useCormorant({ CormorantGaramond_500Medium_Italic });

  const fontsLoaded = cinzelLoaded && cinzelDecLoaded && catamaranLoaded && cormorantLoaded;

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <View style={{ flex: 1, backgroundColor: colors.inkBlack }} onLayout={onLayoutRootView}>
        <AuthProvider>
          <NavigationContainer>
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
      </View>
    </SafeAreaProvider>
  );
}
