import React, { createContext, useContext, useState, useEffect } from "react";

const StatusContext = createContext();

export const StatusProvider = ({ children }) => {
  const [activeProperty, setActiveProperty] = useState([]);
  const [activeDealType, setActiveDealType] = useState([]);
  const [listings, setListings] = useState([]);
  const [activeCity, setActiveCity] = useState(null);
  const [searchCity, setSearchCity] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [images, setImages] = useState([]);
  const [user, setUser] = useState(null);

  const login = ({ userName, token }) => {
    localStorage.setItem("userName", userName); // შენს key-ში უნდა იყოს userName
    localStorage.setItem("token", token);
    setUser({ userName, token });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser({ userName: storedUser, token: storedToken });
    }
  }, []);
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <StatusContext.Provider
      value={{
        user,
        login,
        logout,
        activeDealType,
        setActiveDealType,
        activeProperty,
        setActiveProperty,
        listings,
        setListings,
        activeCity,
        setActiveCity,
        searchCity,
        setSearchCity,
        searchTerm,
        setSearchTerm,
        images,
        setImages,
        setMinPrice,
        setMaxPrice,
        minPrice,
        maxPrice,
      }}
    >
      {children}
    </StatusContext.Provider>
  );
};

export const useStatus = () => useContext(StatusContext);
