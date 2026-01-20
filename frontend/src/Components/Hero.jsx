import React, { useState, useEffect, useRef } from "react";
import { useStatus } from "./contextAPI/Context";
import Tbilisi from "../assets/tbilisi.jpg";
import ListingsPage from "./listingsPage";
import axios from "axios";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(0);
  const [results, setResults] = useState([]);
  const [dealType, setDealType] = useState([]);
  const [propertys, setPropertys] = useState([]);

  const { t, i18n } = useTranslation();
  const {
    activeDealType,
    setActiveDealType,
    activeProperty,
    setActiveProperty,
    searchTerm,
    setSearchTerm,
    setMinPrice,
    setMaxPrice,
    minPrice,
    maxPrice,
  } = useStatus();

  const menuRef = useRef(null);
  useEffect(() => {
    if (!searchTerm) {
      setResults([]);
      return;
    }
    if (searchTerm === selectedCity) {
      setResults([]);
      return;
    }
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://nominatim.openstreetmap.org/search",
          {
            params: {
              q: searchTerm,
              format: "json",
              addressdetails: 1,
              limit: 1,
              countrycodes: "ge",
              "accept-language": i18n.language === "ka" ? "ka" : "en",
            },
          },
        );
        console.log("movidaa", selectedCity);

        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    const debounce = setTimeout(fetchResults, 600);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCity, i18n.language]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const config = { params: { lang: i18n.language } };
        const [propertyRes, dealRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/property-type`,
            config,
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/deal_type`, config),
        ]);
        setPropertys(propertyRes.data);
        setDealType(dealRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchData();
  }, [i18n.language]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>

        <div className="text-gray-700 text-sm font-medium tracking-wide">
          {t("is_waking_up")}
        </div>

        <div className="text-gray-400 text-xs">{t("may_take_a_minute")}</div>
      </div>
    );

  return (
    <div className="mainContainer   px-4 sm:px-6 lg:px-8 mx-auto ">
      <div
        className="w-full h-80 sm:h-96 lg:h-[700px] rounded-[20px] bg-cover bg-center bg-no-repeat relative flex justify-center items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.35), rgba(0,0,0,0.35)), url(${Tbilisi})`,
        }}
      >
        <div
          className="w-[90%] sm:w-[70%] bg-white bg-opacity-90 p-6 rounded-xl shadow-lg z-10"
          ref={menuRef}
        >
          <input
            type="text"
            placeholder="Street, city, region"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {results.length > 0 && (
            <ul className="bg-white shadow rounded p-4 max-h-48 overflow-y-auto mb-4">
              {results.map((res, i) => {
                const neighbourhood = res.address?.neighbourhood || "";
                const city = res.address?.city || "";
                return (
                  <li
                    key={`${res.place_id}-${i}`}
                    className="mb-2 border-b pb-1 cursor-pointer hover:bg-blue-50 rounded px-2"
                    onClick={() => {
                      const chosenName =
                        `${res.address?.neighbourhood || ""} ${
                          res.address?.city || ""
                        }`.trim() || res.display_name;

                      setSelectedCity(chosenName);
                      setSearchTerm(chosenName);
                      setResults([]);
                    }}
                  >
                    {neighbourhood && city
                      ? `${neighbourhood}, ${city}`
                      : city || neighbourhood}
                  </li>
                );
              })}
            </ul>
          )}

          {/* --- MOBILE DROPDOWNS (Hidden on Desktop) --- */}
          <div className="md:hidden flex flex-col gap-3 mb-4">
            {/* Deal Type Dropdown */}
            <div className="relative">
              <div
                onClick={() => setActiveDropdown(activeDropdown === 1 ? 0 : 1)}
                className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span className="text-gray-700">
                  {dealType.find((d) => activeDealType.includes(d.id))?.name ||
                    "გარიგების ტიპი"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 1 ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {activeDropdown === 1 && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-xl z-[60] max-h-40 overflow-y-auto">
                  {dealType.map((d) => (
                    <div
                      key={d.id}
                      onClick={() => {
                        setActiveDealType([d.id]);
                        setActiveDropdown(0);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                        activeDealType.includes(d.id)
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : ""
                      }`}
                    >
                      {d.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Property Type Dropdown */}
            <div className="relative">
              <div
                onClick={() => setActiveDropdown(activeDropdown === 2 ? 0 : 2)}
                className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
              >
                <span className="text-gray-700">
                  {propertys.find((p) => activeProperty.includes(p.id))?.name ||
                    "ქონების ტიპი"}
                </span>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    activeDropdown === 2 ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {activeDropdown === 2 && (
                <div className="absolute w-full mt-1 bg-white border rounded-lg shadow-xl z-[60] max-h-40 overflow-y-auto">
                  {propertys.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        setActiveProperty([p.id]);
                        setActiveDropdown(0);
                      }}
                      className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                        activeProperty.includes(p.id)
                          ? "bg-blue-50 text-blue-600 font-bold"
                          : ""
                      }`}
                    >
                      {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* --- DESKTOP BUTTONS (Hidden on Mobile) --- */}
          <div className="hidden md:block">
            <div className="flex flex-wrap gap-3 mb-3">
              {dealType.map((d) => (
                <button
                  key={d.id}
                  onClick={() =>
                    setActiveDealType((prev) =>
                      prev.includes(d.id)
                        ? prev.filter((id) => id !== d.id)
                        : [...prev, d.id],
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeDealType.includes(d.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {d.name}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-3 mb-3">
              {propertys.map((property) => (
                <button
                  key={property.id}
                  onClick={() =>
                    setActiveProperty((prev) =>
                      prev.includes(property.id)
                        ? prev.filter((id) => id !== property.id)
                        : [...prev, property.id],
                    )
                  }
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    activeProperty.includes(property.id)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  {property.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Inputs */}
          <div className="flex items-center gap-3 mt-4">
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="დან"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                $
              </span>
            </div>
            <div className="h-[2px] w-4 bg-gray-300"></div>
            <div className="relative flex-1">
              <input
                type="number"
                placeholder="მდე"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full pl-3 pr-8 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                $
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ListingsPage />
      </div>
    </div>
  );
};

export default Hero;
