import { createContext, useContext, useMemo, useState } from 'react';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, options = {}) => {
    setToast({ message, type: options.type ?? 'info', duration: options.duration ?? 3000 });
  };

  const clearToast = () => setToast(null);

  const value = useMemo(
    () => ({
      isLoading,
      setIsLoading,
      toast,
      showToast,
      clearToast,
    }),
    [isLoading, toast]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }

  return context;
};

export default AppContext;

