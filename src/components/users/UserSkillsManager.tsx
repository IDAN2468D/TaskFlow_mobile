import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { Code2, Plus, X, Layers } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface UserSkillsManagerProps {
  onNavigate?: (path: string) => void;
}

interface Skill {
  id: string;
  name: string;
  category: string;
}

export default function UserSkillsManager({ onNavigate }: UserSkillsManagerProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  
  // Mock skills data for UI
  const [skills, setSkills] = useState<Skill[]>([
    { id: '1', name: 'Next.js 15', category: 'Frontend' },
    { id: '2', name: 'Expo', category: 'Mobile' },
    { id: '3', name: 'MongoDB', category: 'Database' },
  ]);

  const handleRemoveSkill = (idToRemove: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setSkills(prev => prev.filter(skill => skill.id !== idToRemove));
  };

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const newSkill: Skill = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSkillName.trim(),
        category: 'General'
      };
      setSkills(prev => [...prev, newSkill]);
      setNewSkillName('');
      setIsAdding(false);
    }
  };

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: 350 }}
      className="w-full bg-[#121214]/60 p-6 rounded-[32px] border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <LinearGradient colors={['rgba(255,255,255,0.02)', 'transparent']} className="absolute inset-0" />
      
      <View className="flex-row-reverse justify-between items-center mb-6 relative z-10">
        <View className="flex-row-reverse items-center gap-3">
          <View className="w-12 h-12 bg-indigo-500/10 rounded-2xl items-center justify-center border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
            <Layers size={24} color="#818cf8" />
          </View>
          <View className="items-end">
            <Text className="text-white font-black text-[22px] tracking-tight">מיומנויות וסקילים</Text>
            <Text className="text-slate-500 text-[12px] font-bold">הצג את הארכיטקטורה הטכנית שלך</Text>
          </View>
        </View>
        
        <TouchableOpacity 
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setIsAdding(!isAdding);
          }}
          className={`w-12 h-12 rounded-2xl items-center justify-center border ${isAdding ? 'bg-red-500/20 border-red-400/30' : 'bg-indigo-500/20 border-indigo-400/30'}`}
        >
          {isAdding ? (
            <X size={24} color="#f87171" strokeWidth={3} />
          ) : (
            <Plus size={24} color="#818cf8" strokeWidth={3} />
          )}
        </TouchableOpacity>
      </View>

      <AnimatePresence>
        {isAdding && (
          <MotiView
            from={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 80, marginBottom: 20 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <View className="flex-row-reverse items-center bg-white/5 rounded-2xl border border-white/10 p-2 pr-4">
              <View className="flex-1">
                <TextInput
                  autoFocus
                  placeholder="הכנס שם של מיומנות (למשל: Python)"
                  placeholderTextColor="rgba(255,255,255,0.3)"
                  style={{ color: '#fff', textAlign: 'right', fontWeight: 'bold' }}
                  value={newSkillName}
                  onChangeText={setNewSkillName}
                  onSubmitEditing={handleAddSkill}
                />
              </View>
              <TouchableOpacity 
                onPress={handleAddSkill}
                className="bg-indigo-500 px-4 py-2 rounded-xl"
              >
                <Text className="text-white font-black text-[14px]">הוסף</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        )}
      </AnimatePresence>

      {skills.length === 0 ? (
        <View className="bg-white/5 p-4 rounded-2xl border border-white/5 items-center">
          <Text className="text-slate-400 text-right font-bold">לא הוגדרו מיומנויות. לחץ על + כדי להוסיף.</Text>
        </View>
      ) : (
        <View className="flex-row-reverse flex-wrap gap-3 relative z-10">
          {skills.map((skill) => (
            <MotiView 
              key={skill.id}
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              className="flex-row-reverse items-center gap-2 pl-4 pr-3 py-2.5 bg-[#18181b]/80 rounded-[18px] border border-white/10 shadow-lg"
            >
              <View className="bg-indigo-500/20 p-1.5 rounded-lg border border-indigo-500/20">
                <Code2 size={14} color="#818cf8" />
              </View>
              <Text className="text-white font-black text-[15px] tracking-tight">{skill.name}</Text>
              <TouchableOpacity 
                onPress={() => handleRemoveSkill(skill.id)}
                className="ml-1 p-1"
              >
                <X size={14} color="#ef4444" strokeWidth={3} />
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      )}
    </MotiView>
  );
}