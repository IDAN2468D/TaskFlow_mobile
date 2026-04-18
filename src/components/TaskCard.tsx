import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, LayoutAnimation, ActivityIndicator } from 'react-native';
import { MotiView, AnimatePresence } from 'moti';
import { 
  ChevronDown, 
  Trash2,
  Sparkles,
  BrainCircuit,
  Zap,
  Clock,
  ArrowLeft
} from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../context/ThemeContext';

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

  const progressPercent = useMemo(() => {
    if (!task.subTasks || task.subTasks.length === 0) return 0;
    const done = task.subTasks.filter(st => st.status === 'Done').length;
    return Math.round((done / task.subTasks.length) * 100);
  }, [task.subTasks]);

  const priorityConfig = {
    High: {
      bg: "bg-rose-500/10",
      text: "text-rose-400",
      indicator: "#f43f5e"
    },
    Medium: {
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      indicator: "#fbbf24"
    },
    Low: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      indicator: "#10b981"
    },
  };

  const statusConfig = {
    Todo: { color: "#94a3b8", label: "בתכנון" },
    InProgress: { color: themeColors.primary, label: "בביצוע" },
    Done: { color: "#10b981", label: "הושלם" }
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
      from={{ opacity: 0, translateY: 15 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ delay: index * 50 }}
      className={`rounded-outer mb-4 overflow-hidden bg-surface-low border border-white/5 ${task.status === 'Done' ? 'opacity-40' : ''}`}
    >
      <View className="p-5">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <View style={{ backgroundColor: currentPriority.indicator }} className="w-1.5 h-1.5 rounded-full" />
            <Text className={`${currentPriority.text} text-[10px] font-bold uppercase tracking-widest`}>{task.priority}_PRIORITY</Text>
          </View>
          <TouchableOpacity 
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              onDelete(task._id);
            }}
            className="w-8 h-8 rounded-full bg-surface-mid items-center justify-center border border-white/5"
          >
            <Trash2 color="#f43f5e" size={14} />
          </TouchableOpacity>
        </View>

        <Text className="text-xl font-bold text-text-main text-right mb-2 tracking-tight">{task.title}</Text>
        
        {task.description && (
          <Text className="text-text-dim text-sm text-right mb-4 leading-5 font-bold" numberOfLines={2}>
            {task.description}
          </Text>
        )}

        {task.subTasks.length > 0 && (
          <View className="mb-5">
            <View className="flex-row items-center justify-between mb-2">
               <Text className="text-text-dim text-[10px] font-bold uppercase tracking-widest">PROGRESS</Text>
               <Text className="text-text-main text-[10px] font-bold">{progressPercent}%</Text>
            </View>
            <View className="h-1 bg-surface-mid rounded-full overflow-hidden">
              <MotiView 
                from={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                className="h-full bg-primary"
              />
            </View>
          </View>
        )}

        <View className="flex-row items-center justify-between mt-1">
          <TouchableOpacity
            onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onToggleStatus(task._id, task.status);
            }}
            className="flex-row items-center px-4 py-2.5 rounded-inner bg-surface-mid border border-white/5"
          >
            <View style={{ backgroundColor: currentStatus.color }} className="w-2 h-2 rounded-full mr-2" />
            <Text style={{ color: currentStatus.color }} className="text-xs font-bold">{currentStatus.label}</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            <TouchableOpacity
                onPress={handleInsights}
                disabled={loadingInsights}
                className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5"
            >
                {loadingInsights ? <ActivityIndicator size="small" color={themeColors.primary} /> : (
                <BrainCircuit size={18} color={themeColors.primary} />
                )}
            </TouchableOpacity>
            
            <TouchableOpacity
                onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                    setExpanded(!expanded);
                }}
                className="w-10 h-10 rounded-inner bg-surface-mid items-center justify-center border border-white/5"
            >
                <ChevronDown size={18} color="#fff" style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }} />
            </TouchableOpacity>
          </View>
        </View>

        <AnimatePresence>
          {expanded && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-5 pt-5 border-t border-white/5"
            >
              <View className="flex-row items-center gap-2 mb-3">
                <Sparkles size={14} color={themeColors.primary} />
                <Text className="text-primary text-[10px] font-bold uppercase tracking-widest">AI_ANALYSIS_INTEL</Text>
              </View>
              <Text className="text-text-main text-sm text-right leading-6 italic font-bold">
                {task.aiInsights || "מערכת AI מנתחת את הנתונים ומסנתזת המלצות פעולה..."}
              </Text>
              
              {task.subTasks.length > 0 && (
                <View className="mt-5 gap-y-2">
                   {task.subTasks.map(st => (
                      <TouchableOpacity 
                        key={st._id}
                        onPress={() => onToggleSubtask(task._id, st._id)}
                        className="flex-row items-center gap-3 bg-surface-mid/50 p-3 rounded-inner border border-white/5"
                      >
                         <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${st.status === 'Done' ? 'bg-primary border-primary' : 'border-white/20'}`}>
                            {st.status === 'Done' && <Zap size={10} color="#fff" fill="#fff" />}
                         </View>
                         <Text className={`text-right flex-1 font-bold ${st.status === 'Done' ? 'text-text-dim line-through' : 'text-text-main'}`}>{st.title}</Text>
                      </TouchableOpacity>
                   ))}
                </View>
              )}
            </MotiView>
          )}
        </AnimatePresence>
      </View>
    </MotiView>
  );
}
