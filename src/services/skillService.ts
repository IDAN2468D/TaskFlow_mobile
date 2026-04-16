import api from './api';

export interface Skill {
  _id: string;
  name: string;
  category?: string;
  color?: string;
  xp?: number;
  level?: number;
}

export interface SkillsData {
  success: boolean;
  allSkills: Skill[];
  userSkills: Skill[];
}

export const skillService = {
  /**
   * Fetch all system skills and current user skills
   */
  getSkills: async (): Promise<SkillsData | null> => {
    try {
      const response = await api.get('/bridge/user/skills');
      return response.data;
    } catch (error) {
      console.error('[skillService] getSkills Error:', error);
      return null;
    }
  },

  /**
   * Assign a skill to the user
   */
  assignSkill: async (skillId: string): Promise<boolean> => {
    try {
      const response = await api.post('/bridge/user/skills', { skillId, action: 'assign' });
      return response.data.success;
    } catch (error) {
      console.error('[skillService] assignSkill Error:', error);
      return false;
    }
  },

  /**
   * Remove a skill from the user
   */
  removeSkill: async (skillId: string): Promise<boolean> => {
    try {
      const response = await api.post('/bridge/user/skills', { skillId, action: 'remove' });
      return response.data.success;
    } catch (error) {
      console.error('[skillService] removeSkill Error:', error);
      return false;
    }
  }
};
