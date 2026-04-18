import React from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  StatusBar
} from 'react-native';
import { MotiView } from 'moti';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import { makeRedirectUri } from 'expo-auth-session';
import { Mail, Lock, User, ArrowLeft, Zap, Globe } from 'lucide-react-native';
import { useAuth } from '../hooks/useAuth';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

import { useTheme } from '../context/ThemeContext';

export default function AuthScreen() {
  const { colors: themeColors } = useTheme();
  const { 
    isLogin, 
    email, 
    setEmail, 
    password, 
    setPassword, 
    name, 
    setName, 
    loading, 
    error, 
    handleAuth, 
    handleGoogleLogin,
    toggleMode 
  } = useAuth();

  const handleGoogleLoginPress = async () => {
    try {
      // 1. The local return URL for Expo Go and APK
      const returnUrl = makeRedirectUri({ 
        scheme: 'taskflow-ai',
        path: 'oauthredirect' 
      });

      // 2. The proxy redirect URL that Google is allowed to redirect to
      const proxyRedirectUri = 'https://auth.expo.io/@kazam11/mobile';

      // 3. The actual Google Auth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` + 
        `client_id=${process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID_WEB}&` +
        `redirect_uri=${encodeURIComponent(proxyRedirectUri)}&` +
        `response_type=id_token&` +
        `scope=${encodeURIComponent('profile email openid')}&` +
        `nonce=${Math.random().toString(36).substring(7)}`;

      // 4. Wrap everything in the Expo Proxy Start URL
      const proxyStartUrl = `https://auth.expo.io/@kazam11/mobile/start?` + 
        `authUrl=${encodeURIComponent(googleAuthUrl)}&` + 
        `returnUrl=${encodeURIComponent(returnUrl)}`;

      console.log('Sending via Proxy...');

      // 5. Open the session
      const result = await WebBrowser.openAuthSessionAsync(proxyStartUrl, returnUrl);

      if (result.type === 'success') {
        const url = result.url;
        const idToken = url.match(/id_token=([^&]+)/)?.[1];
        if (idToken) {
          handleGoogleLogin(idToken);
        }
      }
    } catch (e) {
      console.error('Google Login Error:', e);
    }
  };

  return (
    <View className="flex-1 bg-obsidian">
      <StatusBar barStyle="light-content" />
      <LinearGradient 
        colors={[themeColors.primary + '26', 'transparent']} 
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 600 }} 
      />
      
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        <MotiView
          from={{ opacity: 0, scale: 0.95, translateY: 15 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'spring', damping: 18 }}
          className="rounded-outer bg-surface-low p-6 border border-white/5 overflow-hidden relative shadow-2xl"
        >
          <LinearGradient
            colors={[themeColors.primary + '1A', 'transparent']}
            className="absolute inset-0"
          />
          
          {/* Header */}
          <View className="items-start mb-8 mt-2">
            <View className="w-14 h-14 border border-white/5 rounded-inner bg-surface-mid justify-center items-center mb-4 relative overflow-hidden shadow-sm">
               <LinearGradient colors={[themeColors.primary + '33', 'transparent']} className="absolute inset-0" />
               <Zap color={themeColors.primary} size={28} fill={themeColors.primary} />
            </View>
            <Text className="text-text-main text-4xl font-black tracking-tighter">TaskFlow AI</Text>
            <View className="flex-row items-center gap-1.5 mt-2">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-2xl" />
                <Text className="text-text-dim text-[10px] font-black uppercase tracking-widest opacity-60">
                  {isLogin ? 'SECURE_ACCESS_ESTABLISHED' : 'NEW_STRATEGIST_PROTOCOL'}
                </Text>
            </View>
          </View>

          {/* Form */}
          <View className="gap-5">
            {!isLogin && (
              <MotiView
                from={{ height: 0, opacity: 0 }}
                animate={{ height: 54, opacity: 1 }}
                className="flex-row items-center rounded-inner bg-surface-mid/50 px-4 border border-white/5 gap-3"
              >
                <User color={themeColors.primary} size={18} />
                <TextInput
                  placeholder="שם מלא"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                  value={name}
                  onChangeText={setName}
                  className="flex-1 h-full text-text-main text-[15px] font-bold"
                />
              </MotiView>
            )}

            <View className="flex-row items-center rounded-inner bg-surface-mid/50 px-4 border border-white/5 gap-3">
              <Mail color={themeColors.primary} size={18} />
              <TextInput
                placeholder="כתובת אימייל"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                className="flex-1 h-[54px] text-text-main text-[15px] font-bold"
              />
            </View>

            <View className="flex-row items-center rounded-inner bg-surface-mid/50 px-4 border border-white/5 gap-3">
              <Lock color={themeColors.primary} size={18} />
              <TextInput
                placeholder="סיסמה"
                placeholderTextColor="rgba(255,255,255,0.2)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                className="flex-1 h-[54px] text-text-main text-[15px] font-bold"
              />
            </View>

            {error ? (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                className="bg-red-500/10 p-4 rounded-inner border border-red-500/20"
              >
                <Text className="text-red-400 text-[13px] font-black text-center">{error}</Text>
              </MotiView>
            ) : null}

            <TouchableOpacity 
              className={`flex-row h-[60px] rounded-outer justify-center items-center mt-3 gap-3 overflow-hidden shadow-xl shadow-primary/20 ${loading ? 'opacity-70' : ''}`}
              onPress={handleAuth}
              disabled={loading}
            >
              <LinearGradient colors={[themeColors.primary, themeColors.secondary]} start={{x: 0, y: 0}} end={{x: 1, y: 1}} className="absolute inset-0" />
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Text className="text-white text-lg font-black tracking-tight">{isLogin ? 'התחברות למערכת' : 'יצירת חשבון חדש'}</Text>
                  <ArrowLeft color="#fff" size={20} strokeWidth={3} style={{ transform: [{ rotate: '180deg' }] }} />
                </>
              )}
            </TouchableOpacity>

            <View className="flex-row items-center gap-4 my-2 opacity-30">
              <View className="flex-1 h-[1px] bg-white/20" />
              <Text className="text-text-dim text-[10px] font-black uppercase tracking-[3px]">או</Text>
              <View className="flex-1 h-[1px] bg-white/20" />
            </View>

            <TouchableOpacity 
              className="flex-row bg-surface-mid border border-white/10 h-[56px] rounded-inner justify-center items-center gap-3 relative overflow-hidden shadow-sm"
              onPress={handleGoogleLoginPress}
              disabled={loading}
            >
              <LinearGradient colors={['rgba(255,255,255,0.03)', 'transparent']} className="absolute inset-0" />
              <Globe color="#e2e8f0" size={18} />
              <Text className="text-text-main text-[15px] font-black tracking-tight">התחברות עם Google</Text>
            </TouchableOpacity>
          </View>

          {/* Footer toggle */}
          <TouchableOpacity 
            onPress={toggleMode}
            className="mt-8 flex-row justify-center items-center gap-2"
          >
            <Text className="text-text-dim text-[14px] font-bold opacity-60">
              {isLogin ? "חדש במערכת?" : "כבר רשום?"}
            </Text>
            <Text style={{ color: themeColors.primary }} className="text-[14px] font-black uppercase tracking-wider">
              {isLogin ? 'צור חשבון' : 'התחבר'}
            </Text>
          </TouchableOpacity>
        </MotiView>
      </KeyboardAvoidingView>
    </View>
  );
}
