import api from './api';

export interface SubTask {
  _id: string;
  title: string;
  status: 'Todo' | 'InProgress' | 'Done';
  estimatedTime: number;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'Todo' | 'InProgress' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string;
  tags: string[];
  estimatedTime: number;
  subTasks: SubTask[];
  aiInsights?: string;
  createdAt: string;
  updatedAt: string;
  error?: string;
}

export interface BriefingCriticalTask {
  id: string;
  title: string;
  priority: 'Low' | 'Medium' | 'High';
  dueDate: string | null;
  estimatedTime: number;
  subTasksTotal: number;
  subTasksDone: number;
}

export interface DailyBriefing {
  briefing: {
    greeting: string;
    focusArea: string;
    strategicTip: string;
    motivationalQuote: string;
    yesterdaySummary: string;
  };
  stats: {
    totalActive: number;
    highPriorityCount: number;
    overdueCount: number;
    completedYesterday: number;
    completedThisWeek: number;
    productivityScore: number;
  };
  criticalTasks: BriefingCriticalTask[];
  generatedAt: string;
}

export interface GamificationLevel {
  level: number;
  xpRequired: number;
  title: string;
  titleEn: string;
  emoji: string;
}

export interface GamificationAchievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface GamificationProgress {
  progress: {
    xp: number;
    level: number;
    totalTasksCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string;
    weeklyXp: number;
  };
  level: GamificationLevel;
  progressToNextLevel: number;
  xpToNextLevel: number;
  achievements: GamificationAchievement[];
  isActiveToday: boolean;
  levels: GamificationLevel[];
}

export interface XPAwardResult {
  xpEarned: number;
  totalXp: number;
  level: GamificationLevel;
  leveledUp: boolean;
  currentStreak: number;
  newAchievements: {
    id: string;
    title: string;
    description: string;
    emoji: string;
  }[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface ChatResponse {
  text: string;
  context?: {
    activeTasksCount: number;
    overdueCount: number;
    highPriorityCount: number;
  };
}

export interface WeeklyReview {
  summary: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  tagStats: { name: string; count: number }[];
  dailyStats: { day: string; count: number }[];
  aiInsight: string;
}

export const taskService = {
  getTasks: async (): Promise<Task[]> => {
    try {
      const response = await api.post('/bridge/get-tasks');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetTasks failed:', error.response?.data || error.message);
      return [];
    }
  },

  updateTask: async (taskId: string, updates: Partial<Task>): Promise<Task | null> => {
    try {
      const response = await api.post('/bridge/update-task', { taskId, updates });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] UpdateTask failed:', error.response?.data || error.message);
      return null;
    }
  },

  createTaskWithAI: async (prompt: string): Promise<any> => {
    try {
      const response = await api.post('/bridge/decompose', { prompt });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] CreateWithAI failed:', error.response?.data || error.message);
      return null;
    }
  },

  generatePRD: async (idea: string): Promise<any> => {
    try {
      const response = await api.post('/bridge/generate-prd', { idea });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GeneratePRD failed:', error.response?.data || error.message);
      return null;
    }
  },

  getTopTask: async (): Promise<Task | null> => {
    try {
      const response = await api.get('/bridge/get-top-task');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetTopTask failed:', error.response?.data || error.message);
      return null;
    }
  },

  deleteTask: async (taskId: string): Promise<boolean> => {
    try {
      await api.delete('/bridge/update-task', { data: { taskId } });
      return true;
    } catch (error: any) {
      console.error('[TaskService] DeleteTask failed:', error.response?.data || error.message);
      return false;
    }
  },

  toggleSubtask: async (taskId: string, subtaskId: string): Promise<Task | null> => {
    try {
      const response = await api.post('/bridge/toggle-subtask', { taskId, subtaskId });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] ToggleSubtask failed:', error.response?.data || error.message);
      return null;
    }
  },

  generateInsights: async (taskId: string): Promise<Task | null> => {
    try {
      const response = await api.post('/bridge/generate-insights', { taskId });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GenerateInsights failed:', error.response?.data || error.message);
      return null;
    }
  },

  getDailyBriefing: async (): Promise<DailyBriefing | null> => {
    try {
      const response = await api.get('/bridge/daily-briefing');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetDailyBriefing failed:', error.response?.data || error.message);
      return null;
    }
  },

  getStats: async (): Promise<{ user: { name: string; email: string; avatar?: string | null }; activeTasks: number; completedTasks: number; aiActions: number } | null> => {
    try {
      const response = await api.get('/bridge/stats');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetStats failed:', error.response?.data || error.message);
      return null;
    }
  },

  getGamificationProgress: async (): Promise<GamificationProgress | null> => {
    try {
      const response = await api.get('/bridge/gamification');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetGamification failed:', error.response?.data || error.message);
      return null;
    }
  },

  awardTaskXP: async (taskId: string): Promise<XPAwardResult | null> => {
    try {
      const response = await api.post('/bridge/gamification', { taskId });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] AwardXP failed:', error.response?.data || error.message);
      return null;
    }
  },

  sendChatMessage: async (message: string, history: ChatMessage[]): Promise<ChatResponse | null> => {
    try {
      const response = await api.post('/bridge/chat', { message, history });
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] Chat failed:', error.response?.data || error.message);
      return null;
    }
  },

  getWeeklyReview: async (): Promise<WeeklyReview | null> => {
    try {
      const response = await api.get('/bridge/weekly-review');
      return response.data;
    } catch (error: any) {
      console.error('[TaskService] GetWeeklyReview failed:', error.response?.data || error.message);
      return null;
    }
  },
};

