import { createContext, useContext } from 'react';

export const AppContext = createContext({
  isSidebarOpen: true,
  toggleSidebar: () => {},
});

export const useAppContext = () => useContext(AppContext);