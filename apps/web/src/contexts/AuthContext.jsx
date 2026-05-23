
import React, { createContext, useContext, useState, useEffect } from 'react';
import pb from '@/lib/pocketbaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (pb.authStore.isValid) {
      setCurrentUser(pb.authStore.model);
    }
    setInitialLoading(false);
  }, []);

  const login = async (email, password) => {
    const authData = await pb.collection('users').authWithPassword(email, password, { $autoCancel: false });
    setCurrentUser(authData.record);
    return authData;
  };

  const signup = async (email, password, passwordConfirm, name) => {
    const user = await pb.collection('users').create({
      email,
      password,
      passwordConfirm,
      name
    }, { $autoCancel: false });
    await login(email, password);
    return user;
  };

  const logout = () => {
    pb.authStore.clear();
    setCurrentUser(null);
  };

  const updateProfile = async (data) => {
    const updated = await pb.collection('users').update(currentUser.id, data, { $autoCancel: false });
    setCurrentUser(updated);
    return updated;
  };

  const value = {
    currentUser,
    isAuthenticated: !!currentUser,
    initialLoading,
    login,
    signup,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
