const TOKEN_KEY = 'viet_auth_token';
const USER_KEY = 'viet_user_data';

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authService = {
  setToken: (token: string) => {
    if (authService.isValidTokenFormat(token)) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      console.error('Invalid token format provided');
    }
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token && !authService.isValidTokenFormat(token)) {
      console.warn('Invalid token found in storage, removing');
      authService.removeToken();
      return null;
    }
    return token;
  },

  isValidTokenFormat: (token: string): boolean => {
    if (!token) return false;
    // Basic JWT format validation (header.payload.signature)
    return token.includes('.') && token.split('.').length === 3;
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) return null;
    
    try {
      return JSON.parse(userData);
    } catch {
      return null;
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => {
    const token = authService.getToken();
    const user = authService.getUser();
    return !!token && !!user && authService.isValidTokenFormat(token);
  },

  isAdmin: (): boolean => {
    const user = authService.getUser();
    return user?.role === 'admin' && authService.isAuthenticated();
  },

  clear: () => {
    authService.removeToken();
    authService.removeUser();
  }
};
