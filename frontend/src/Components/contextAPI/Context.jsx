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

  // 1. Initial State - პირდაპირ კითხულობს სწორი Key-თ ("user")
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user"); // შეცვლილია "user"-ზე
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      return { userName: storedUser, token: storedToken };
    }
    return null;
  });

  // 2. Login - აქ იყო მთავარი ბაგი! userName-ის ნაცვლად დავარქვი "user"
  const login = ({ userName, token }) => {
    localStorage.setItem("user", userName); // Key უნდა ემთხვეოდეს წაკითხვას!
    localStorage.setItem("token", token);
    setUser({ userName, token });
  };

  // 3. useEffect - ყოველი შემთხვევისთვის, რომ სინქრონიზაცია არ დაიკარგოს
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
