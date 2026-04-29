import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FoodProvider } from '../context/FoodContext';
import SplashScreen from '../screens/SplashScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import SurveyScreen from '../screens/survey/SurveyScreen';
import HomeScreen from '../screens/home/HomeScreen';
import CameraScreen from '../screens/analysis/CameraScreen';
import ResultScreen from '../screens/analysis/ResultScreen';
import SearchScreen from '../screens/search/SearchScreen';
import ProfileEditScreen from '../screens/settings/ProfileEditScreen';
import QRPassportScreen from '../screens/passport/QRPassportScreen';
import SettingsSidebar from '../components/SettingsSidebar';
import { AnalysisResult } from '../services/anthropic';
import { SavedFood } from '../services/storage';
import { Colors } from '../constants/colors';

type Screen = 'home' | 'camera' | 'result' | 'saved_result' | 'search' | 'search_result' | 'profile_edit' | 'qr_passport';

function AuthenticatedApp() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'camera' | 'search'>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string | undefined>();
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | undefined>();
  const [viewingFood, setViewingFood] = useState<SavedFood | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const goHome = () => {
    setScreen('home');
    setActiveTab('home');
  };

  if (screen === 'camera') {
    return (
      <CameraScreen
        onResult={(result, imageBase64) => {
          setAnalysisResult(result);
          setAnalysisImage(imageBase64);
          setScreen('result');
        }}
        onCancel={goHome}
      />
    );
  }

  if (screen === 'result' && analysisResult) {
    return (
      <ResultScreen
        result={analysisResult}
        imageBase64={analysisImage}
        onBack={goHome}
        onSaved={() => {}}
      />
    );
  }

  if (screen === 'saved_result' && viewingFood) {
    return (
      <ResultScreen
        result={viewingFood.analysisResult}
        imageBase64={viewingFood.imageBase64}
        imageUrl={viewingFood.imageUrl}
        savedFood={viewingFood}
        onBack={() => { setScreen('home'); setViewingFood(null); }}
      />
    );
  }

  if (screen === 'search') {
    return (
      <SearchScreen
        onResult={(result, imageUrl) => {
          setAnalysisResult(result);
          setAnalysisImage(undefined);
          setAnalysisImageUrl(imageUrl ?? undefined);
          setScreen('search_result');
        }}
        onCancel={goHome}
      />
    );
  }

  if (screen === 'search_result' && analysisResult) {
    return (
      <ResultScreen
        result={analysisResult}
        imageUrl={analysisImageUrl}
        onBack={() => { setScreen('search'); }}
        onSaved={() => {}}
      />
    );
  }

  if (screen === 'profile_edit') {
    return <ProfileEditScreen onBack={goHome} />;
  }

  if (screen === 'qr_passport') {
    return <QRPassportScreen onBack={goHome} />;
  }

  return (
    <View style={styles.appContainer}>
      <HomeScreen
        onNavigateToAnalysis={(food) => {
          if (food) {
            setViewingFood(food);
            setScreen('saved_result');
          }
        }}
        onOpenSettings={() => setShowSidebar(true)}
      />

      {/* Fixed bottom tab bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabBtn}
          onPress={goHome}
        >
          <Text style={[styles.tabIcon, activeTab === 'home' && styles.tabIconActive]}>🏠</Text>
          <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>{t.home}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtnCenter}
          onPress={() => { setActiveTab('camera'); setScreen('camera'); }}
        >
          <View style={styles.cameraBtn}>
            <Text style={styles.cameraBtnIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabBtn}
          onPress={() => { setActiveTab('search'); setScreen('search'); }}
        >
          <Text style={[styles.tabIcon, activeTab === 'search' && styles.tabIconActive]}>🔍</Text>
          <Text style={[styles.tabLabel, activeTab === 'search' && styles.tabLabelActive]}>{t.search}</Text>
        </TouchableOpacity>
      </View>

      {/* Settings sidebar overlay */}
      <SettingsSidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onMyProfile={() => setScreen('profile_edit')}
        onQRPassport={() => { setShowSidebar(false); setScreen('qr_passport'); }}
      />
    </View>
  );
}

export default function AppNavigator() {
  const { user, loading, hasSurveyCompleted } = useAuth();
  const [splashDone, setSplashDone] = useState(false);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');

  if (!splashDone || loading) {
    return <SplashScreen onFinish={() => setSplashDone(true)} />;
  }

  if (!user) {
    if (authTab === 'signin') {
      return <SignInScreen onSignUp={() => setAuthTab('signup')} />;
    }
    return <SignUpScreen onSignIn={() => setAuthTab('signin')} />;
  }

  if (!hasSurveyCompleted) {
    return <SurveyScreen />;
  }

  return (
    <FoodProvider>
      <AuthenticatedApp />
    </FoodProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: { flex: 1 },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: Colors.tabBar,
    paddingBottom: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    alignItems: 'flex-end',
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  tabBtnCenter: {
    flex: 1,
    alignItems: 'center',
    marginBottom: 8,
  },
  tabIcon: { fontSize: 22, opacity: 0.4 },
  tabIconActive: { opacity: 1 },
  tabLabel: { fontSize: 11, color: Colors.tabInactive, fontWeight: '500' },
  tabLabelActive: { color: Colors.tabActive, fontWeight: '700' },
  cameraBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  cameraBtnIcon: { fontSize: 26 },
});
