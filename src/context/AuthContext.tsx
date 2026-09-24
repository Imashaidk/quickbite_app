import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  campusCardBalance: number;
  isGuest: boolean;
  avatarUrl: string;
}

interface AuthContextType {
  user: UserProfile;
  loginAsStudent: (email: string, studentId: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const DEFAULT_STUDENT: UserProfile = {
  name: 'Kavindu Perera',
  studentId: 'ST-2024-8831',
  email: 'kavindu.p@campus.ac.lk',
  campusCardBalance: 2500,
  isGuest: false,
  avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
};

const GUEST_USER: UserProfile = {
  name: 'Campus Visitor',
  studentId: 'GUEST-001',
  email: 'visitor@canteen.ac.lk',
  campusCardBalance: 0,
  isGuest: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_STUDENT);

  const loginAsStudent = (email: string, studentId: string) => {
    setUser({
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      studentId: studentId || 'ST-2024-8831',
      email: email || 'student@campus.ac.lk',
      campusCardBalance: 2500,
      isGuest: false,
      avatarUrl: DEFAULT_STUDENT.avatarUrl,
    });
  };

  const loginAsGuest = () => {
    setUser(GUEST_USER);
  };

  const logout = () => {
    setUser(GUEST_USER);
  };

  return (
    <AuthContext.Provider value={{ user, loginAsStudent, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
