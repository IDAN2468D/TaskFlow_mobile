import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { 
  Calendar, 
  ChevronDown, 
  Lightbulb, 
  CheckCircle2, 
  Circle,
  Clock,
  Tag as TagIcon,
  Trash2,
  AlertTriangle,
  ArrowRight,
  BrainCircuit,
  Zap,
  Sparkles
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';

interface SubTask {
  _id: string;
  title: string;
  status: 'Todo' | 'InProgress' | 'Done';
  estimatedTime?: number;
}

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate?: string;
  tags?: string[];
  estimatedTime?: number;
  subTasks: SubTask[];
  aiInsights?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onToggleStatus: (id: string, current: string) => void;
  onDelete: (id: string) => void;
  onToggleSubtask: (taskId: string, subId: string) => void;
  onGetInsights: (taskId: string) => Promise<void>;
}

import { useTheme } from '../context/ThemeContext';

export default function TaskCard({ 
  task, 
  index, 
  onToggleStatus, 
  onDelete, 
  onToggleSubtask, 
  onGetInsights 
}: TaskCardProps) {
  const { colors: themeColors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const [loadingInsights, setLoadingInsights] = useState(false);

  // Calculate Progress
  const progressPercent = useMemo(() => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const done = task.subTasks.filter(st => st.status === 'Done').length;
    return Math.round((done / task.subTasks.length) * 100);
  }, [task.subTasks]);

  const priorityConfig = {
    High: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      border: "border-rose-500/30",
      glow: "shadow-rose-500/40",
      indicator: "#fb7185"
    },
    Medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      border: "border-amber-500/30",
      glow: "shadow-amber-500/40",
      indicator: "#fbbf24"
    },
    Low: {
      bg: themeColors.primary + '1A',
      text: "text-slate-400",
      border: "border-white/10",
      glow: "",
      indicator: themeColors.primary
    },
  };

  const statusConfig = {
    Todo: {
      color: "#94a3b8",
      bg: "bg-slate-500/10",
      border: "border-slate-500/20",
      label: "ממתין"
    },
    InProgress: {
      color: themeColors.primary,
      bg: themeColors.primary + '33',
      border: "border-white/10",
      label: "בביצוע"
    },
    Done: {
      color: "#10b981",
      bg: "bg-emerald-500/20",
      border: "border-emerald-500/40",
      label: "בוצע"
    }
  };

  const currentPriority = priorityConfig[task.priority] || priorityConfig.Medium;
  const currentStatus = statusConfig[task.status] || statusConfig.Todo;

  const handleInsights = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (task.aiInsights && !expanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(true);
      return;
    }
    
    setLoadingInsights(true);
    try {
      await onGetInsights(task._id);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded(true);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.9, translateY: 20 }}
      animate={{ opacity: 1, scale: 1, translateY: 0 }}
      transition={{ type: 'spring', delay: index * 50 }}
      className={`rounded-[36px] mb-6 p-[1.5px] overflow-hidden shadow-2xl ${task.status === 'Done' ? 'opacity-60' : ''}`}
    >
      {/* Dynamic Border Gradient based on Priority */}
      <LinearGradient 
        colors={[currentPriority.indicator, 'rgba(255,255,255,0.05)', 'transparent']} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
        className="absolute inset-0" 
      />

      <View className="bg-[#0f172a] rounded-[35px] overflow-hidden p-6">
        <LinearGradient 
          colors={['rgba(255,255,255,0.03)', 'transparent']} 
          className="absolute inset-0" 
        />
        
        {/* Header Area */}
        <View className="flex-row-reverse justify-between items-start mb-4 z-10">
          <View className="flex-1 ml-4">
            <View className="flex-row-reverse items-center gap-2 mb-1">
              {task.priority === 'High' && <MotiView animate={{ opacity: [0.4, 1, 0.4] }} transition={{ loop: true, duration: 1500 }}><Zap size={14} color="#fb7185" fill="#fb7185" /></MotiView>}
              <Text className={`${currentPriority.text} text-[11px] font-black uppercase tracking-[2px]`}>{task.priority}</Text>
            </View>
            <Text className="text-[22px] font-black text-white text-right leading-none tracking-tight">{task.title}</Text>
          </View>
          
          <TouchableOpacity 
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
              onDelete(task._id);
            }}
            className="w-10 h-10 bg-white/5 rounded-2xl items-center justify-center border border-white/10"
          >
            <Trash2 color="#ef4444" size={18} />
          </TouchableOpacity>
        </View>

        {/* Status & Time */}
        <View className="flex-row-reverse items-center gap-4 mb-6 z-10">
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              onToggleStatus(task._id, task.status);
            }}
            style={{ borderColor: currentStatus.color + '40' }}
            className={`flex-row-reverse items-center px-4 py-2 rounded-2xl border ${currentStatus.bg}`}
          >
            <View style={{ backgroundColor: task.status === 'InProgress' ? themeColors.primary : task.status === 'Done' ? '#10b981' : '#94a3b8' }} className="w-2 h-2 rounded-full mr-2" />
            <Text style={{ color: currentStatus.color }} className="text-[13px] font-black uppercase tracking-widest">{currentStatus.label}</Text>
          </TouchableOpacity>

          {task.estimatedTime && (
            <View className="flex-row-reverse items-center gap-2 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
              <Clock size={14} color="#64748b" />
              <Text className="text-[13px] font-black text-slate-500">{task.estimatedTime}m</Text>
            </View>
          )}
        </View>

        {/* Progress Bar (Visible if there are subtasks) */}
        {task.subTasks.length > 0 && (
          <View className="mb-6 z-10 px-1">
            <View className="flex-row-reverse justify-between items-center mb-2">
              <Text className="text-white/40 text-[11px] font-black uppercase tracking-widest">התקדמות</Text>
              <Text style={{ color: themeColors.primary }} className="text-[11px] font-black">{progressPercent}%</Text>
            </View>
            <View className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
              <MotiView 
                from={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full"
                style={{ backgroundColor: themeColors.primary }}
              />
            </View>
          </View>
        )}

        {/* Description */}
        {task.description && (
          <Text className="text-[15px] text-slate-400 text-right font-bold leading-[22px] mb-6 z-10" numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {/* Subtasks List */}
        <View className="gap-3 mb-6 z-10">
          {task.subTasks.slice(0, 3).map((st) => (
            <TouchableOpacity 
              key={st._id}
              activeOpacity={0.7}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggleSubtask(task._id, st._id);
              }}
              className={`flex-row-reverse items-center justify-between p-4 rounded-2xl border ${st.status === 'Done' ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-white/5 border-white/10'}`}
            >
              <View className="flex-row-reverse items-center flex-1 gap-4">
                <View style={{ backgroundColor: st.status === 'Done' ? '#10b981' : 'transparent', borderColor: st.status === 'Done' ? '#10b981' : 'rgba(255,255,255,0.2)' }} className="w-6 h-6 rounded-lg items-center justify-center border-2">
                  {st.status === 'Done' && <CheckCircle2 size={14} color="#fff" strokeWidth={3} />}
                </View>
                <Text className={`text-[15px] text-right font-bold flex-1 ${st.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                  {st.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {task.subTasks.length > 3 && (
            <TouchableOpacity 
              className="self-end px-4 py-1.5 rounded-full border"
              style={{ backgroundColor: themeColors.primary + '1A', borderColor: themeColors.primary + '33' }}
            >
              <Text style={{ color: themeColors.primary }} className="text-[11px] font-black">+{task.subTasks.length - 3} משימות נוספות&rlm;</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Footer */}
        <View className="flex-row-reverse justify-between items-center pt-5 border-t border-white/5 z-10">
          <View className="flex-row-reverse items-center gap-3">
            <View className="w-10 h-10 bg-white/5 rounded-2xl items-center justify-center border border-white/10">
               <Calendar size={18} color={themeColors.primary} />
            </View>
            <View>
              <Text className="text-white/40 text-[9px] font-black uppercase tracking-wider text-right">מועד סיום</Text>
              <Text className="text-white/80 text-[13px] font-black text-right">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString('he-IL') : 'ללא יעד'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleInsights}
            disabled={loadingInsights}
            style={{ backgroundColor: themeColors.primary }}
            className="flex-row-reverse items-center gap-3 px-6 py-3 rounded-2xl shadow-xl shadow-black/50"
          >
            {loadingInsights ? <ActivityIndicator size="small" color="#fff" /> : (
              <>
                <BrainCircuit size={18} color="#fff" strokeWidth={2.5} />
                <Text className="text-[13px] font-black text-white">תובנות</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Insights Expansion */}
        <AnimatePresence>
          {expanded && (
            <MotiView
              from={{ opacity: 0, scale: 0.95, translateY: 10 }}
              animate={{ opacity: 1, scale: 1, translateY: 0 }}
              exit={{ opacity: 0, scale: 0.95, translateY: 10 }}
              className="mt-6 p-6 rounded-[32px] overflow-hidden"
            >
              <LinearGradient colors={[themeColors.primary + '33', themeColors.background]} className="absolute inset-0" />
              <View className="flex-row-reverse justify-between items-center mb-4 z-10">
                <View className="flex-row-reverse items-center gap-2">
                  <Sparkles size={16} color={themeColors.primary} />
                  <Text style={{ color: themeColors.primary }} className="text-[11px] font-black uppercase tracking-[2px]">ניתוח AI מתקדם</Text>
                </View>
                <TouchableOpacity onPress={() => {
                   LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                   setExpanded(false);
                }} className="w-8 h-8 bg-white/10 rounded-full items-center justify-center">
                   <ChevronDown size={14} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text className="text-[15px] text-white/90 font-bold text-right leading-[24px] italic z-10">
                {task.aiInsights || "מייצר תובנות אסטרטגיות למשימה זו..."}
              </Text>
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </MotiView>
  );
}

// Helper for Activity Indicator since it was used in code but not imported in previous scope correctly
import { ActivityIndicator } from 'react-native';
