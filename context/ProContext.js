import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProContext = createContext();

export const ProProvider = ({ children }) => {
  const [isProUser, setIsProUser] = useState(false);

  useEffect(() => {
    const checkPro = async () => {
      const value = await AsyncStorage.getItem("isProUser");
      setIsProUser(value === "true");
    };
    checkPro();
  }, []);

  const markAsPro = async () => {
    await AsyncStorage.setItem("isProUser", "true");
    setIsProUser(true);
  };

  return (
    <ProContext.Provider value={{ isProUser, markAsPro }}>
      {children}
    </ProContext.Provider>
  );
};

export const usePro = () => useContext(ProContext);
