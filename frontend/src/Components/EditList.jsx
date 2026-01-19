import { useState, useEffect, useRef } from "react";
import { FaImages, FaTrashAlt } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useStatus } from "../Components/contextAPI/Context";
import { useTranslation } from "react-i18next";

export default function EditList() {
  const [propertyTypeId, setPropertyTypeId] = useState("");
  const [dealTypeId, setDealTypeId] = useState("");
  const [statusId, setStatusId] = useState("");
  const [conditionId, setConditionId] = useState("");
  const [price, setPrice] = useState("");
  const [PPQ, setPPQ] = useState("");
  const [areaMQ, setAreaMQ] = useState("");
  const [room, setRoom] = useState("");
  const [floor, setFloor] = useState("");
  const [totalFloor, setTotalFloor] = useState("");
  const [description, setDescription] = useState("");
  const [dealType, setDealType] = useState([]);
  const [propertyType, setPropertyType] = useState([]);
  const [status, setStatus] = useState([]);
  const [cities, setCities] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [condition, setCondition] = useState([]);
  const [submiting, setSubmiting] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState([]);
  const [selectedBedroom, setSelectedBedroom] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSucceed, setIsSucceed] = useState(false);
  const [showNoChangesModal, setShowNoChangesModal] = useState(false);
  const { t, i18n } = useTranslation();
  const { images, setImages } = useStatus();
  const navigate = useNavigate();
  const { id } = useParams();
  const initialDataRef = useRef(null);

  const validateForm = () => {
    let formErrors = {};
    if (!price) formErrors.price = t("required");
    if (!areaMQ) formErrors.areaMQ = t("required");
    if (selectedRoom.length === 0) formErrors.room = t("required");
    if (!floor) formErrors.floor = t("required");
    if (!totalFloor) formErrors.totalFloor = t("required");
    if (!description) formErrors.description = t("required");
    if (!name) formErrors.name = t("required");
    if (!phone) formErrors.phone = t("required");
    if (!selectedCity || !searchTerm) formErrors.city = t("required");
    if (images.length === 0) formErrors.images = t("required");
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  // --- მონაცემების წამოღება ---
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const config = { params: { lang: i18n.language } };
        const token = localStorage.getItem("token");

        // პარალელური მოთხოვნები
        const [dealRes, propRes, citiesRes, statRes, condRes, listingRes] =
          await Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/deal_type`, config),
            axios.get(
              `${import.meta.env.VITE_BACKEND_URL}/property-type`,
              config,
            ),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/cities`),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/status`, config),
            axios.get(`${import.meta.env.VITE_BACKEND_URL}/condition`, config),
            axios.get(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/listings/getUserListingById/${id}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              },
            ),
          ]);
        setDealType(dealRes.data);
        setPropertyType(propRes.data);
        setCities(citiesRes.data);
        console.log("es aris logi", citiesRes.data);

        setStatus(statRes.data);
        setCondition(condRes.data);

        // Listing დატა
        const data = listingRes.data;
        initialDataRef.current = {
          property_type_id: data.property_type_id,
          deal_type_id: data.deal_type_id,
          status_id: data.status_id,
          condition_id: data.condition_id,
          price: String(data.price),
          area_m2: String(data.area_m2),
          rooms: data.rooms,
          bedrooms: data.bedrooms,
          floor: String(data.floor),
          total_floors: String(data.total_floors),
          description: data.description,
          contact_name: data.contact_name,
          contact_phone: data.contact_phone,
          location: data.location,
          imagesLength: data.image?.length || 0,
        };
        setPropertyTypeId(data.property_type_id);
        setDealTypeId(data.deal_type_id);
        setStatusId(data.status_id);
        setConditionId(data.condition_id);
        setPrice(data.price);
        setAreaMQ(data.area_m2);
        setSelectedRoom([data.rooms]);
        setSelectedBedroom(data.bedrooms);
        setFloor(data.floor);
        setTotalFloor(data.total_floors);
        setDescription(data.description);
        setName(data.contact_name);
        setPhone(data.contact_phone);
        setSearchTerm(data.location);
        console.log(data.location);

        setSelectedCity(data.city);
        console.log(data.city);

        if (data.image) setImages(data.image);
        console.log("yvela aqaa", data);

        setLoading(false);
      } catch (error) {
        console.error("Fetch Error:", error);
        setLoading(false);
      }
    };
    fetchAllData();
  }, [id, i18n.language]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    if (selectedCity && selectedCity.display_name === searchTerm) {
      setResults([]);
      return;
    }
    if (initialDataRef.current?.location === searchTerm) {
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
              limit: 5,
              countrycodes: "ge",
              "accept-language": i18n.language === "ka" ? "ka" : "en",
            },
          },
        );
        setResults(response.data);
      } catch (error) {
        console.error("Search error:", error);
      }
    };

    const debounce = setTimeout(fetchResults, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm, selectedCity]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleRequestCode = async () => {
    if (!phone || phone.length < 9) {
      return;
    }
    setVerificationLoading(true);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/listings/send-otp`,
        { phone },
      );
      setIsCodeSent(true);
      setCode(String(resp.data.otpCode));
    } catch (error) {
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    if (!validateForm()) {
      setSubmiting(false);
      return;
    }
    const currentData = {
      property_type_id: propertyTypeId,
      deal_type_id: dealTypeId,
      status_id: statusId,
      condition_id: conditionId,
      price: String(price),
      area_m2: String(areaMQ),
      rooms: selectedRoom[0],
      bedrooms: selectedBedroom,
      floor: String(floor),
      total_floors: String(totalFloor),
      description: description,
      contact_name: name,
      contact_phone: phone,
      location: searchTerm,
      imagesLength: images.length,
    };
    const isChanged =
      JSON.stringify(initialDataRef.current) !== JSON.stringify(currentData);

    if (!isChanged) {
      setShowNoChangesModal(true);
      setSubmiting(false);
      return;
    }
    const formData = new FormData();
    formData.append("property_type_id", propertyTypeId);
    formData.append("deal_type_id", dealTypeId);
    formData.append("status_id", statusId);
    formData.append("condition_id", conditionId);
    formData.append("city_id", selectedCity?.place_id || "");
    formData.append("location", searchTerm);
    formData.append("price", price);
    formData.append("area_m2", areaMQ);
    formData.append("rooms", selectedRoom[0] || room);
    formData.append("floor", floor);
    formData.append("totalFloors", totalFloor);
    formData.append("description", description);
    formData.append("contact_name", name);
    formData.append("contact_phone", phone);
    formData.append(
      "neighbourhood",
      selectedCity?.address?.neighbourhood || "",
    );
    formData.append("city_name", selectedCity?.address?.city || "");
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/listings/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      setIsSucceed(true);
      setTimeout(() => {
        navigate("/myCards");
      }, 2000);
    } catch (error) {
      alert(error.response?.data?.message || "❌ მოხდა შეცდომა");
    } finally {
      setSubmiting(false);
    }
  };

  const roomsArr = [
    { id: 1, room: 1 },
    { id: 2, room: 2 },
    { id: 3, room: 3 },
    { id: 4, room: 4 },
    { id: 5, room: 5 },
    { id: 6, room: 6 },
    { id: 7, room: 7 },
    { id: 8, room: 8 },
    { id: 9, room: 9 },
    { id: 10, room: "10+" },
  ];

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  {
  }
  return (
    <div>
      {showNoChangesModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full mx-4 transform animate-in zoom-in duration-300 flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-info-circle text-3xl text-blue-500"></i>
            </div>
            <p className="text-gray-500 text-center mb-6">
              {t("no_changes_desc") || "თქვენ არაფერი შეგიცვლიათ მონაცემებში."}
            </p>
            <button
              onClick={() => setShowNoChangesModal(false)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-lg active:scale-95"
            >
              OK
            </button>
          </div>
        </div>
      )}
      {isSucceed && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100 flex flex-col items-center transform animate-in zoom-in duration-300 scale-110">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("success_title")}
            </h2>
            <p className="text-gray-600 text-center font-medium">
              {t("listing_update_success")}
            </p>
            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_2s_linear]"></div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          {t("edit_listing")}
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. უძრავი ქონება */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 ml-1">
                {t("real_estate")}
              </label>
              <div className="relative">
                <div
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 1 ? 0 : 1)
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {propertyType.find((p) => p.id == propertyTypeId)?.name ||
                      "აირჩიეთ"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${
                      activeDropdown === 1 ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {activeDropdown === 1 && (
                  <div className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {propertyType.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setPropertyTypeId(p.id);
                          setActiveDropdown(0);
                        }}
                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        {p.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. გარიგების ტიპი */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 ml-1">
                {t("deal_type")}
              </label>
              <div className="relative">
                <div
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 2 ? 0 : 2)
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {dealType.find((d) => d.id == dealTypeId)?.name ||
                      "აირჩიეთ"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${
                      activeDropdown === 2 ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {activeDropdown === 2 && (
                  <div className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {dealType.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          setDealTypeId(d.id);
                          setActiveDropdown(0);
                        }}
                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        {d.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. სტატუსი */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 ml-1">
                {t("status")}
              </label>
              <div className="relative">
                <div
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 3 ? 0 : 3)
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {status.find((s) => s.id == statusId)?.name || "აირჩიეთ"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${
                      activeDropdown === 3 ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {activeDropdown === 3 && (
                  <div className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {status.map((s) => (
                      <div
                        key={s.id}
                        onClick={() => {
                          setStatusId(s.id);
                          setActiveDropdown(0);
                        }}
                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        {s.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 4. მდგომარეობა */}
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2 ml-1">
                {t("condition")}
              </label>
              <div className="relative">
                <div
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 4 ? 0 : 4)
                  }
                  className="w-full px-4 py-3 bg-white rounded-lg shadow border border-gray-100 cursor-pointer flex justify-between items-center"
                >
                  <span className="text-gray-700">
                    {condition.find((c) => c.id == conditionId)?.name ||
                      "აირჩიეთ"}
                  </span>
                  <i
                    className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${
                      activeDropdown === 4 ? "rotate-180" : ""
                    }`}
                  ></i>
                </div>
                {activeDropdown === 4 && (
                  <div className="absolute left-0 right-0 mt-3 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                    {condition.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setConditionId(c.id);
                          setActiveDropdown(0);
                        }}
                        className="px-4 py-3 text-sm font-medium text-gray-600 hover:bg-blue-50 hover:text-blue-600 cursor-pointer border-b border-gray-50 last:border-0"
                      >
                        {c.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ლოკაცია */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("location")}
            </label>
            <input
              type="text"
              placeholder={`${t("street")}, ${t("city")}, ${t("neighborhood")}`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setSelectedCity(null);
              }}
              className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {results.length > 0 && (
              <ul className="bg-white shadow rounded p-4 max-h-48 overflow-y-auto mb-4">
                {results.map((res) => (
                  <li
                    key={res.place_id}
                    className="mb-2 border-b pb-1 cursor-pointer hover:bg-blue-50 rounded px-2"
                    onClick={() => {
                      setSearchTerm(res.display_name);
                      setSelectedCity(res);
                      setResults([]);
                    }}
                  >
                    {res.display_name}
                  </li>
                ))}
              </ul>
            )}
            {errors.city && (
              <span className="text-red-500 text-sm">{errors.city}</span>
            )}
          </div>

          {/* ფასი და ფართი */}
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-1 gap-0.5">
              <div className="flex-1 min-w-[49%]">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t("price")} ($)
                </label>
                <input
                  type="number"
                  placeholder={t("price")}
                  className="w-full px-4 py-3 mb-4 rounded-tl-lg rounded-bl-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">{errors.price}</span>
                )}
              </div>
              <div className="flex-1 min-w-[49%]">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t("price_m2")}
                </label>
                <input
                  type="number"
                  placeholder={t("price_per_m2")}
                  className="w-full px-4 py-3 mb-4 shadow focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-tr-lg rounded-br-lg"
                  value={
                    price && areaMQ
                      ? Math.round(Number(price) / Number(areaMQ))
                      : PPQ
                  }
                  disabled
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                {t("area_m2")}
              </label>
              <input
                type="number"
                placeholder={t("example_area")}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={areaMQ}
                onChange={(e) => setAreaMQ(e.target.value)}
              />
              {errors.areaMQ && (
                <span className="text-red-500 text-sm">{errors.areaMQ}</span>
              )}
            </div>
          </div>

          {/* ოთახები */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("rooms")}
            </label>
            {roomsArr.map((R) => (
              <button
                key={R.id}
                type="button"
                onClick={() => setSelectedRoom([R.id])}
                className={`mx-1 px-4 py-3 rounded-xl border shadow-sm outline-none ${
                  selectedRoom.includes(R.id)
                    ? "border-blue-400 text-blue-500"
                    : "border-gray_300"
                }`}
              >
                {R.room}
              </button>
            ))}
            {errors.room && (
              <span className="text-red-500 text-sm block">{errors.room}</span>
            )}
          </div>
          {selectedRoom.length > 0 && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("bedrooms")}
              </label>
              {[...Array(selectedRoom[0]).keys()].map((i) => {
                const value = i + 1;
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setSelectedBedroom(value)}
                    className={`mx-1 px-4 py-3 rounded-xl border shadow-sm outline-none
              ${
                selectedBedroom === value
                  ? "border-blue-500 text-blue-500"
                  : "border-gray-300"
              }
            `}
                  >
                    {value === 10 ? "10+" : value}
                  </button>
                );
              })}
            </div>
          )}
          {/* სართულები */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                {t("floor")}
              </label>
              <input
                type="number"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.floor && (
                <span className="text-red-500 text-sm">{errors.floor}</span>
              )}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                {t("total_floors")}
              </label>
              <input
                type="number"
                value={totalFloor}
                onChange={(e) => setTotalFloor(e.target.value)}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              {errors.totalFloor && (
                <span className="text-red-500 text-sm">
                  {errors.totalFloor}
                </span>
              )}
            </div>
          </div>

          {/* აღწერა */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("description")}
            </label>
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.description && (
              <span className="text-red-500 text-sm">{errors.description}</span>
            )}
          </div>

          {/* სურათების ატვირთვა */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-600 ml-1 block">
              {t("upload_photos")}
            </label>
            <div
              className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all duration-300 group ${
                images.length > 0
                  ? "border-blue-200 bg-blue-50/10"
                  : "border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="fileInput"
                accept="image/*"
              />
              <label
                htmlFor="fileInput"
                className="flex flex-col items-center justify-center cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FaImages className="text-2xl text-blue-500" />
                </div>
                <p className="text-gray-700 font-bold">{t("select_photos")}</p>
              </label>
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white"
                    >
                      <img
                        src={img}
                        alt="preview"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white flex items-center justify-center"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {errors.images && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold mt-2 ml-2">
                <i className="fas fa-exclamation-circle"></i>
                <span>{errors.images}</span>
              </div>
            )}
          </div>

          {/* საკონტაქტო */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("contact_information")}
            </label>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t("name")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow"
                />
                {errors.name && (
                  <span className="text-red-500 text-sm">{errors.name}</span>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  placeholder={t("number")}
                  value={phone}
                  disabled={isCodeSent}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow"
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm">{errors.phone}</span>
                )}
              </div>
              <div className="flex-1 relative h-[48px]">
                <input
                  type="number"
                  placeholder={t("code")}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 mb-4 rounded-xl focus:ring-2 focus:ring-blue-400 outline-none shadow"
                />
                {!isCodeSent ? (
                  <button
                    type="button"
                    onClick={handleRequestCode}
                    disabled={verificationLoading}
                    className="absolute right-1 top-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    {verificationLoading ? "..." : t("get_code")}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsCodeSent(false)}
                    className="absolute right-1 top-2 px-3 py-1.5 bg-gray-400 text-white rounded-lg text-sm"
                  >
                    {t("change")}
                  </button>
                )}
              </div>
            </div>
          </div>

          <button
            disabled={submiting}
            className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transform transition ${
              submiting
                ? "bg-gradient-to-r from-blue-400 to-blue-500 opacity-70 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105"
            }`}
          >
            {submiting ? "ინახება..." : "ცვლილების შენახვა"}
          </button>
        </form>
      </div>
    </div>
  );
}
