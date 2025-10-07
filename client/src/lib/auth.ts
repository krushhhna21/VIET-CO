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
    // Ensure token is clean (no extra whitespace or characters)
    const cleanToken = token.trim();
    console.log('Setting token:', cleanToken ? 'TOKEN_SET' : 'EMPTY_TOKEN');
    localStorage.setItem(TOKEN_KEY, cleanToken);
  },

  getToken: (): string | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('Getting token:', token ? 'TOKEN_EXISTS' : 'NO_TOKEN');
    return token ? token.trim() : null;
  },

  removeToken: () => {
    console.log('Removing token');
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser: (user: User) => {
    console.log('Setting user:', user.username);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const userData = localStorage.getItem(USER_KEY);
    if (!userData) {
      console.log('No user data found');
      return null;
    }
    
    try {
      const user = JSON.parse(userData);
      console.log('Getting user:', user.username);
      return user;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  removeUser: () => {
    console.log('Removing user');
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: (): boolean => {
    const hasToken = !!authService.getToken();
    const hasUser = !!authService.getUser();
    console.log('Auth check - Token:', hasToken, 'User:', hasUser);
    return hasToken && hasUser;
  },

  isAdmin: (): boolean => {
    const user = authService.getUser();
    const isAdmin = user?.role === 'admin';
    console.log('Admin check:', isAdmin, 'User role:', user?.role);
    return isAdmin;
  },

  clear: () => {
    console.log('Clearing all auth data');
    authService.removeToken();
    authService.removeUser();
  },

  // Debug function to check current auth state
  debug: () => {
    const token = authService.getToken();
    const user = authService.getUser();
    console.log('Auth Debug:', {
      hasToken: !!token,
      tokenLength: token ? token.length : 0,
      tokenStart: token ? token.substring(0, 10) + '...' : 'NO_TOKEN',
      user: user ? { username: user.username, role: user.role } : 'NO_USER',
      isAuthenticated: authService.isAuthenticated(),
      isAdmin: authService.isAdmin()
    });
    return { token, user };
  }
};
