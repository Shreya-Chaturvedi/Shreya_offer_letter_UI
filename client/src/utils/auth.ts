interface User {
  username: string;
  passwordHash: string;
}

const STORAGE_KEY = 'offer_letter_users';
const AUTH_KEY = 'offer_letter_current_user';

// Simple hash function using built-in crypto API
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

const getUsers = (): User[] => {
  const users = localStorage.getItem(STORAGE_KEY);
  return users ? JSON.parse(users) : [];
};

export const saveUser = async (username: string, password: string): Promise<boolean> => {
  const users = getUsers();
  
  // Check if user already exists
  if (users.some(user => user.username === username)) {
    return false;
  }
  
  const passwordHash = await hashPassword(password);
  users.push({ username, passwordHash });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  return true;
};

export const authenticateUser = async (username: string, password: string): Promise<boolean> => {
  const users = getUsers();
  const passwordHash = await hashPassword(password);
  const user = users.find(u => u.username === username && u.passwordHash === passwordHash);
  
  if (user) {
    localStorage.setItem(AUTH_KEY, username);
    return true;
  }
  
  return false;
};

export const getCurrentUser = (): string | null => {
  return localStorage.getItem(AUTH_KEY);
};

export const logout = (): void => {
  localStorage.removeItem(AUTH_KEY);
};

export const isAuthenticated = (): boolean => {
  return getCurrentUser() !== null;
};
