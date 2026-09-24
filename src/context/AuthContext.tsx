import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  studentId: string;
  email: string;
  campusCardBalance: number;
  isGuest: boolean;
  avatarInitials: string;
}

interface AuthContextType {
  user: UserProfile;
  loginAsStudent: (email: string, studentId: string) => void;
  loginAsGuest: () => void;
  logout: () => void;
}

const DEFAULT_STUDENT: UserProfile = {
  name: 'Kavindu Perera',
  studentId: 'IM/2023/099',
  email: 'kavindu-im23099@kln.ac.lk',
  campusCardBalance: 1000,
  isGuest: false,
  avatarInitials: 'KP',
};

const GUEST_USER: UserProfile = {
  name: 'Campus Visitor',
  studentId: 'KLN-GUEST',
  email: 'visitor@kln.ac.lk',
  campusCardBalance: 0,
  isGuest: true,
  avatarInitials: 'CV',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(DEFAULT_STUDENT);

  const loginAsStudent = (email: string, studentId: string) => {
    setUser({
      name: email.split('@')[0].replace('.', ' ').toUpperCase(),
      studentId: studentId || 'IM/2023/099',
      email: email || 'kavindu-im23099@kln.ac.lk',
      campusCardBalance: 1000,
      isGuest: false,
      avatarInitials: 'KP',
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
