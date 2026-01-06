import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FaSearch, FaMapMarkerAlt, FaHome, FaTag } from "react-icons/fa";

export default function AdvancedFilter() {
  const { t, i18n } = useTranslation();

  // States for Dropdowns
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [dealTypes, setDealTypes] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter Values
  const [filters, setFilters] = useState({
    propertyTypeId: "",
    dealTypeId: "",
    conditionId: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    rooms: "",
    city: "",
  });

  // Fetching options exactly like your CreateListing
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const config = { params: { lang: i18n.language } };
        const [propRes, dealRes, condRes] = await Promise.all([
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/property-type`,
            config
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/deal_type`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/condition`, config),
        ]);
        setPropertyTypes(propRes.data);
        setDealTypes(dealRes.data);
        setConditions(condRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };
    fetchOptions();
  }, [i18n.language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return (
      <div className="text-center mt-20 animate-pulse">{t("loading")}...</div>
    );

  return (
    <div className="max-w-5xl mx-auto p-8 mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
      <div className="flex items-center gap-4 mb-10">
        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
          <FaSearch size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800">
          Advanced Search
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 1. Property Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-semibold ml-1">
            <FaHome className="text-blue-500 text-sm" /> {t("real_estate")}
          </label>
          <select
            name="propertyTypeId"
            value={filters.propertyTypeId}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none appearance-none cursor-pointer"
          >
            <option value="">{t("all_types")}</option>
            {propertyTypes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* 2. Deal Type */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-semibold ml-1">
            <FaTag className="text-blue-500 text-sm" /> {t("deal_type")}
          </label>
          <select
            name="dealTypeId"
            value={filters.dealTypeId}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
          >
            <option value="">{t("any_deal")}</option>
            {dealTypes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Location */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-gray-700 font-semibold ml-1">
            <FaMapMarkerAlt className="text-blue-500 text-sm" /> {t("location")}
          </label>
          <input
            type="text"
            name="city"
            placeholder={t("city")}
            value={filters.city}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
          />
        </div>

        {/* 4. Price Range */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-gray-700 font-semibold ml-1">
            {t("price_range")} ($)
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="minPrice"
              placeholder={t("min")}
              className="flex-1 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="maxPrice"
              placeholder={t("max")}
              className="flex-1 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 5. Rooms */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold ml-1">
            {t("rooms")}
          </label>
          <select
            name="rooms"
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
          >
            <option value="">{t("any")}</option>
            {[1, 2, 3, 4, "5+"].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </div>

        {/* 6. Area Range */}
        <div className="md:col-span-2 space-y-2">
          <label className="block text-gray-700 font-semibold ml-1">
            {t("area_m2")}
          </label>
          <div className="flex gap-4">
            <input
              type="number"
              name="minArea"
              placeholder={t("min_area")}
              className="flex-1 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={handleInputChange}
            />
            <input
              type="number"
              name="maxArea"
              placeholder={t("max_area")}
              className="flex-1 px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
              onChange={handleInputChange}
            />
          </div>
        </div>

        {/* 7. Condition */}
        <div className="space-y-2">
          <label className="block text-gray-700 font-semibold ml-1">
            {t("condition")}
          </label>
          <select
            name="conditionId"
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-white rounded-xl shadow-sm border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none cursor-pointer"
          >
            <option value="">{t("any_condition")}</option>
            {conditions.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-10 flex gap-4">
        <button
          onClick={() => window.location.reload()} // Reset Logic
          className="flex-1 py-4 bg-gray-100 text-gray-600 font-bold rounded-2xl hover:bg-gray-200 transition duration-300"
        >
          {t("reset")}
        </button>
        <button className="flex-[2] py-4 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold text-lg rounded-2xl shadow-lg hover:scale-[1.02] active:scale-[0.98] transition duration-300">
          {t("show_results")}
        </button>
      </div>
    </div>
  );
}
