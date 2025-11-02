import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);

  const login = (userData, userRoles = []) => {
    setUser(userData);
    setRoles(Array.isArray(userRoles) ? userRoles : []);
  };

  const logout = () => {
    setUser(null);
    setRoles([]);
  };

  const value = useMemo(
    () => ({
      user,
      roles,
      login,
      logout,
      isAuthenticated: Boolean(user),
      hasRole: (role) => roles.includes(role),
    }),
    [user, roles]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;

