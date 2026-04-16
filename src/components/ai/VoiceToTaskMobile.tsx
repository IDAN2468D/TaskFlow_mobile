import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, InteractionManager } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Mic, Square, Sparkles } from 'lucide-react-native';
import api from '../../services/api';
import { MotiView, MotiText } from 'moti';

/**
 * VoiceToTaskMobile Component
 * Mobile-optimized voice interface using expo-av and high-performance animations.
 * Features a simulation fallback if native modules are missing.
 */
export default function VoiceToTaskMobile() {
  const [recording, setRecording] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
  }, []);

  async function startRecording() {
    let AudioModule;
    let isMock = false;
    try {
      AudioModule = require('expo-av').Audio;
      if (!AudioModule) throw new Error('Native module missing');
    } catch (e) {
      console.warn('VoiceToTaskMobile: Using Mock Audio');
      isMock = true;
    }

    if (isMock) {
      setRecording({ isMock: true });
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      return;
    }

    try {
      const permission = await AudioModule.requestPermissionsAsync();
      if (permission.status !== 'granted') return;

      await AudioModule.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const { recording } = await AudioModule.Recording.createAsync(
        AudioModule.RecordingOptionsPresets.HIGH_QUALITY
      );
      setRecording(recording);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (err) {
      console.error('Failed to start recording', err);
      // Fallback to mock
      setRecording({ isMock: true });
    }
  }

  async function stopRecording() {
    if (!recording) return;

    if (recording.isMock) {
      setRecording(null);
      handleParseVoice('mock-uri');
      return;
    }

    setRecording(null);
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri) {
        handleParseVoice(uri);
      }
    } catch (e) {
      console.error('Stop recording failed', e);
      handleParseVoice('error-uri');
    }
  }

  async function handleParseVoice(uri: string) {
    setIsProcessing(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    try {
      // Simulate API processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Voice parsing error', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsProcessing(false);
    }
  }

  if (!isReady) return null;

  return (
    <View style={{
      backgroundColor: 'rgba(24, 24, 27, 0.8)',
      borderRadius: 32,
      padding: 24,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.05)',
      overflow: 'hidden'
    }}>
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginBottom: 24 }}>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={{ color: '#fff', fontSize: 20, fontWeight: '900', textAlign: 'right' }}>סיוע קולי AI&rlm;</Text>
          <Text style={{ color: '#71717a', fontSize: 13, textAlign: 'right' }}>הפוך רעיון למשימה בשנייה&rlm;</Text>
        </View>
        <Sparkles size={24} color="#6366f1" />
      </View>

      <TouchableOpacity
        onPress={() => {
          recording ? stopRecording() : startRecording();
        }}
        activeOpacity={0.8}
        style={{
          height: 80,
          backgroundColor: recording ? 'rgba(244, 63, 94, 0.15)' : '#6366f1',
          borderRadius: 20,
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: recording ? 1 : 0,
          borderColor: '#f43f5e',
        }}
      >
        {isProcessing ? (
          <ActivityIndicator color="#fff" />
        ) : recording ? (
          <>
            <Square size={24} color="#f43f5e" fill="#f43f5e" />
            <MotiText
              from={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, duration: 800 }}
              style={{ color: '#f43f5e', fontWeight: '900', marginRight: 12, fontSize: 16 }}
            >
              הקלטה פעילה...&rlm;
            </MotiText>
          </>
        ) : (
          <>
            <Mic size={24} color="#fff" />
            <Text style={{ color: '#fff', fontWeight: '900', marginRight: 12, fontSize: 16 }}>הקלט משימה&rlm;</Text>
          </>
        )}
      </TouchableOpacity>

      {isProcessing && (
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginTop: 20, alignItems: 'center' }}
        >
          <Text style={{ color: '#6366f1', fontSize: 12, fontWeight: '700', letterSpacing: 1 }}>
            ה-AI מעבד את הקול שלך...&rlm;
          </Text>
        </MotiView>
      )}
    </View>
  );
}
