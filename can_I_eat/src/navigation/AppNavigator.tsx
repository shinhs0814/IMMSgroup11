import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
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
import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
import QRPassportScreen from '../screens/passport/QRPassportScreen';
import MenuAnalysisScreen from '../screens/analysis/MenuAnalysisScreen';
import MealHistoryScreen from '../screens/history/MealHistoryScreen';
import FamilyProfilesScreen from '../screens/family/FamilyProfilesScreen';
import SettingsSidebar from '../components/SettingsSidebar';
import TabBar from '../components/TabBar';
import { AnalysisResult, MenuAnalysisItem } from '../services/anthropic';
import { SavedFood } from '../services/storage';
import { Restaurant } from '../types/restaurant';
import { Colors } from '../constants/colors';

type Screen =
  | 'home'
  | 'camera'
  | 'result'
  | 'saved_result'
  | 'search'
  | 'search_result'
  | 'profile_edit'
  | 'restaurant_detail'
  | 'qr_passport'
  | 'menu_result'
  | 'history'
  | 'family_profiles';

function AuthenticatedApp() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'home' | 'camera' | 'search'>('home');
  const [screen, setScreen] = useState<Screen>('home');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [analysisImage, setAnalysisImage] = useState<string | undefined>();
  const [analysisImageUrl, setAnalysisImageUrl] = useState<string | undefined>();
  const [viewingFood, setViewingFood] = useState<SavedFood | null>(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [menuItems, setMenuItems] = useState<MenuAnalysisItem[]>([]);
  const [menuImage, setMenuImage] = useState<string>('');
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
        onMenuResult={(items, imageBase64) => {
          setMenuItems(items);
          setMenuImage(imageBase64);
          setScreen('menu_result');
        }}
        onCancel={goHome}
      />
    );
  }

  if (screen === 'menu_result') {
    return (
      <MenuAnalysisScreen
        items={menuItems}
        imageBase64={menuImage}
        onBack={goHome}
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
        onRestaurantSelect={(restaurant) => {
          setSelectedRestaurant(restaurant);
          setScreen('restaurant_detail');
        }}
      />
    );
  }

  if (screen === 'restaurant_detail' && selectedRestaurant) {
    return (
      <RestaurantDetailScreen
        restaurant={selectedRestaurant}
        onBack={() => setScreen('search')}
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

  if (screen === 'history') {
    return <MealHistoryScreen onOpenSettings={() => setShowSidebar(true)} onBack={goHome} />;
  }

  if (screen === 'family_profiles') {
    return <FamilyProfilesScreen onBack={goHome} />;
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
        onOpenHistory={() => setScreen('history')}
        onScan={() => { setActiveTab('camera'); setScreen('camera'); }}
      />

      <TabBar
        active={activeTab === 'camera' ? 'home' : activeTab as 'home' | 'search'}
        onHome={goHome}
        onScan={() => { setActiveTab('camera'); setScreen('camera'); }}
        onSearch={() => { setActiveTab('search'); setScreen('search'); }}
      />

      {/* Settings sidebar overlay */}
      <SettingsSidebar
        visible={showSidebar}
        onClose={() => setShowSidebar(false)}
        onMyProfile={() => setScreen('profile_edit')}
        onQRPassport={() => { setShowSidebar(false); setScreen('qr_passport'); }}
        onFamilyProfiles={() => setScreen('family_profiles')}
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
  appContainer: { flex: 1, backgroundColor: Colors.bg },
});
