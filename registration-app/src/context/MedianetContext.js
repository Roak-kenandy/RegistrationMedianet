// src/context/MedianetContext.js
import { createContext, useContext, useState, useEffect } from 'react';

const MedianetContext = createContext();

export const useMedianet = () => useContext(MedianetContext);

const getLocalStorageSafe = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const setLocalStorageSafe = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Skip if in private mode
  }
};

export const MedianetProvider = ({ children }) => {
  const [isMedianetCompleted, setIsMedianetCompleted] = useState(false);

  useEffect(() => {
    const stored = getLocalStorageSafe('medianetCompleted');
    if (stored === 'true') {
      setIsMedianetCompleted(true);
    }
  }, []);

  const completeMedianet = () => {
    setIsMedianetCompleted(true);
    setLocalStorageSafe('medianetCompleted', 'true');
  };

  return (
    <MedianetContext.Provider value={{ isMedianetCompleted, completeMedianet }}>
      {children}
    </MedianetContext.Provider>
  );
};
