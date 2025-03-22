import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserInfo {
  [key: string]: any; 
}

interface UserContextType {
  userId: string | null;
  userType: number | null;
  userInfo: UserInfo | null;
  userEmail: string | null;
  setUser: (id: string, type: number, info: UserInfo | null ,userEmail: string | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userType, setUserType] = useState<number | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const setUser = (id: string, type: number, info: UserInfo | null, email: string | null) => {
    setUserId(id);
    setUserType(type);
    setUserInfo(info);
    setUserEmail(email);
  };

  const logout = () => {
    setUserId(null);
    setUserType(null);
    setUserInfo(null);
    setUserEmail(null);
  };

  return (
    <UserContext.Provider value={{ userId, userType, userInfo, setUser, logout, userEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserProvider;
