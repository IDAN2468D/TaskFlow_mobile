import React from 'react';
import { View, Text } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

interface TaskRiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
}

export const TaskRiskBadge: React.FC<TaskRiskBadgeProps> = ({ level }) => {
  const config = {
    Low: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', label: 'סיכון נמוך' },
    Medium: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', label: 'סיכון בינוני' },
    High: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', label: 'סיכון גבוה' },
  };

  const current = config[level];

  return (
    <View className={`${current.bg} ${current.border} border px-2.5 py-1 rounded-full flex-row-reverse items-center gap-1.5`}>
      <AlertCircle color={level === 'High' ? '#fb7185' : level === 'Medium' ? '#fbbf24' : '#34d399'} size={12} />
      <Text className={`${current.text} text-[10px] font-black uppercase tracking-wider`}>{current.label}</Text>
    </View>
  );
};
