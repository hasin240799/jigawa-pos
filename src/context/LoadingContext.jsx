// src/context/LoadingContext.js
import React, { createContext, useState, useContext } from 'react';

const LoadingContext = createContext();

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  // Function to show preloader
  const showLoader = () => setLoading(true);

  // Function to hide preloader with a delay
  const hideLoader = () => {
    setTimeout(() => setLoading(false), 5000); // Set delay (5 seconds)
  };

  return (
    <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
      {children}
    </LoadingContext.Provider>
  );
};
