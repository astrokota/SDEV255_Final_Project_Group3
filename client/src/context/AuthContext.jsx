
import { createContext, useState } from 'react';


export const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  // Checks localStorage so the user stays logged in after refreshing the page
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  // This function is called by the Login Page
  const login = (newToken, newRole) => {
    localStorage.setItem('token', newToken);
    localStorage.setItem('role', newRole);
    setToken(newToken);
    setRole(newRole);
  };

  // This function is called by the Logout button
  const logout = () => {
    localStorage.clear();
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};