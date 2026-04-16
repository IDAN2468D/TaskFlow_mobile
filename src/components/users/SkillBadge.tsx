import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { X } from "lucide-react-native";
import { MotiView } from "moti";

interface SkillBadgeProps {
  name: string;
  color?: string;
  xp?: number;
  level?: number;
  onRemove?: () => void;
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, color = "#6366f1", xp = 0, level = 1, onRemove }) => {
  // Simplified progress calculation for UI
  const nextLevelXp = level * 100 * Math.pow(1.2, level - 1);
  const currentLevelXp = (level - 1) * 100 * Math.pow(1.2, Math.max(0, level - 2));
  const progress = Math.min(100, Math.max(5, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100));

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="flex-row-reverse items-center px-4 py-3 rounded-[20px] overflow-hidden mb-3 ml-2 min-w-[120px]"
      style={{ 
        backgroundColor: `${color}10`, 
        borderWidth: 1, 
        borderColor: `${color}30`,
      }}
    >
      <View className="flex-row-reverse items-center justify-between w-full">
        <View className="flex-row-reverse items-center gap-2">
           <View className="w-6 h-6 rounded-lg items-center justify-center" style={{ backgroundColor: `${color}30` }}>
              <Text className="text-[10px] font-black" style={{ color: color }}>L{level}</Text>
           </View>
           <Text className="text-white font-bold text-[14px]">
             {name}
           </Text>
        </View>
        
        {onRemove && (
          <TouchableOpacity 
            onPress={onRemove}
            className="p-1 rounded-full bg-white/5"
          >
            <X size={14} color={color} strokeWidth={3} />
          </TouchableOpacity>
        )}
      </View>

      {/* Progress Bar (RTL) */}
      <View className="absolute bottom-0 right-0 left-0 h-[3px] bg-white/[0.05]">
          <MotiView 
            from={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', damping: 15 }}
            className="h-full rounded-full"
            style={{ backgroundColor: color }}
          />
      </View>
    </MotiView>
  );
};

export default SkillBadge;
