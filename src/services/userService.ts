import api from './api';

export const getUserSettings = async () => {
  try {
    const response = await api.get('/bridge/user/focus');
    return response.data;
  } catch (error) {
    console.error('[userService] getUserSettings Error:', error);
    throw error;
  }
};

export const toggleFocusMode = async () => {
  try {
    const response = await api.post('/bridge/user/focus');
    return response.data;
  } catch (error) {
    console.error('[userService] toggleFocusMode Error:', error);
    throw error;
  }
};
