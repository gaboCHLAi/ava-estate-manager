import { useState, useEffect, useRef } from "react";
import { FaImages, FaTrashAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useStatus } from "../Components/contextAPI/Context";
import { useTranslation } from "react-i18next";

export default function CreateListing() {
  const [propertyTypeId, setPropertyTypeId] = useState(1);
  const [dealTypeId, setDealTypeId] = useState(1);
  const [statusId, setStatusId] = useState(1);
  const [conditionId, setConditionId] = useState(1);
  const [price, setPrice] = useState("");
  const [PPQ, setPPQ] = useState("");
  const [areaMQ, setAreaQM] = useState("");
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
  const [isVerified, setIsVerified] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [isSucceed, setIsSucceed] = useState(false);
  const { t, i18n } = useTranslation();
  const { images, setImages } = useStatus();
  const navigate = useNavigate();
  const myRef = useRef(false);
  const locationRef = useRef(null);
  const priceRef = useRef(null);
  const areaRef = useRef(null);
  const roomsRef = useRef(null);
  const floorRef = useRef(null);
  const totalFloorRef = useRef(null);
  const descriptionRef = useRef(null);
  const imagesRef = useRef(null);
  const contactRef = useRef(null);
  const validateForm = () => {
    let formErrors = {};
    console.log("ვალიდაციის მომენტში price არის:", price);
    if (!price) formErrors.price = t("required");
    if (!areaMQ) formErrors.areaMQ = t("required");
    if (selectedRoom.length === 0) formErrors.room = t("required");
    if (!floor) formErrors.floor = t("required");
    if (!totalFloor) formErrors.totalFloor = t("required");
    if (!description) formErrors.description = t("required");
    if (!name) formErrors.name = t("required");
    if (!phone || phone.trim() === "") {
      formErrors.phone = t("required");
    } else if (phone.length < 9) {
      formErrors.phone = t("invalid_number");
    }
    if (!code) formErrors.code = t("required");
    if (!selectedCity) formErrors.city = t("required");
    if (images.length === 0) formErrors.images = t("required");

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  useEffect(() => {
    // ვქმნით ობიექტს, სადაც წერია რომელი ცვლადი რომელ ერორს შეესაბამება
    const fieldValues = {
      price,
      areaMQ,
      room: selectedRoom.length > 0 ? selectedRoom : "",
      floor,
      totalFloor,
      description,
      name,
      phone: phone && phone.length >= 9 ? phone : "",
      code,
      city: selectedCity,
      images: images.length > 0 ? images : "",
    };

    // ვამოწმებთ, რომელიმე ველზე თუ არის ერორი და ამავდროულად თუ შეივსო ეს ველი
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };
      let hasChanged = false;

      Object.keys(fieldValues).forEach((key) => {
        // თუ ამ ველზე გვაქვს ერორი და ახლა ვხედავთ რომ ველი ცარიელი აღარ არის
        if (newErrors[key] && fieldValues[key]) {
          delete newErrors[key]; // ვშლით მხოლოდ ამ კონკრეტულ ერორს
          hasChanged = true;
        }
      });

      return hasChanged ? newErrors : prevErrors;
    });
  }, [
    price,
    areaMQ,
    selectedRoom,
    floor,
    totalFloor,
    description,
    name,
    phone,
    code,
    selectedCity,
    images,
  ]);

  const rooms = [
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

  useEffect(() => {
    if (!searchTerm) {
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
              limit: 5,
              countrycodes: "ge",
              "accept-language": i18n.language === "ka" ? "ka" : "en",
            },
          },
        );

        console.log("dailogaaaaa", response.data);
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };
    let debounce = null;
    if (selectedCity?.display_name != searchTerm) {
      debounce = setTimeout(fetchResults, 600);
    }
    return () => clearTimeout(debounce);
  }, [searchTerm]);
  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const config = { params: { lang: i18n.language } };
        const [
          dealTypeIdRes,
          propertyTypeRes,
          citiesRes,
          statusRes,
          ConditionRes,
        ] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/deal_type`, config),
          axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/property-type`,
            config,
          ),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/cities`),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/status`, config),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/condition`, config),
        ]);
        setDealType(dealTypeIdRes.data);
        setPropertyType(propertyTypeRes.data);
        setCities(citiesRes.data);
        setStatus(statusRes.data);
        setCondition(ConditionRes.data);
        setLoading(false);
      } catch (error) {
        console.error("Dropdown error:", error);
      }
    };
    fetchDropdowns();
  }, [i18n.language]);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages((prevImages) => [...prevImages, ...files]);
    e.target.value = null;
  };

  const removeImage = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  // 1. კოდის გაგზავნის ფუნქცია
  const handleRequestCode = async () => {
    if (!phone || phone.length < 9) {
      return;
    }

    setVerificationLoading(true);
    try {
      const respons = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/listings/send-otp`,
        {
          phone: phone,
        },
      );

      const receivedCode = respons.data.otpCode;

      setIsCodeSent(true);
      setIsVerified(receivedCode);
      setCode(String(receivedCode));
      setIsVerified(respons.data.otpCode);
    } catch (error) {
      console.error("SMS Error:", error);
      alert("კოდის გაგზავნა ვერ მოხერხდა. სცადეთ მოგვიანებით.");
    } finally {
      setVerificationLoading(false);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmiting(true);

    // 1. ვალიდაცია და სქროლი
    if (!validateForm()) {
      setSubmiting(false);

      if (errors.city) {
        locationRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.price) {
        priceRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.areaMQ) {
        areaRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.room) {
        roomsRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.floor || errors.totalFloor) {
        floorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.description) {
        descriptionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.images) {
        imagesRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      } else if (errors.name || errors.phone) {
        contactRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }

      return; // აქ წყდება ფუნქცია, თუ ვალიდაცია ვერ გაიარა
    }

    // 2. მონაცემების მომზადება (ეს ხაზები უკვე სწორად ფუნქციის შიგნითაა)
    const formData = new FormData();
    formData.append("property_type_id", Number(propertyTypeId));
    formData.append("deal_type_id", Number(dealTypeId));
    formData.append("status_id", Number(statusId));
    formData.append("condition_id", Number(conditionId));
    formData.append("city_id", selectedCity?.place_id || "");
    formData.append(
      "location",
      selectedCity?.address?.city || selectedCity?.address?.neighbourhood || "",
    );
    formData.append("price", Number(price));
    formData.append("price_per_m2", Number(PPQ));
    formData.append("area_m2", Number(areaMQ));
    formData.append("rooms", Number(selectedRoom));
    formData.append("bedrooms", Number(selectedBedroom));
    formData.append("floor", Number(floor));
    formData.append("totalFloors", Number(totalFloor));
    formData.append("description", description);
    formData.append("contact_name", name);
    formData.append("contact_phone", phone);
    formData.append("contact_code", code);
    formData.append(
      "neighbourhood",
      selectedCity?.address?.neighbourhood || "",
    );
    formData.append("city_name", selectedCity?.address?.city || "");

    images.forEach((image) => {
      formData.append("images", image);
    });

    // 3. გაგზავნა
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/listings`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.status === 201 || response.status === 200) {
        setImages([]);
        setIsSucceed(true);
        setSubmiting(false);
        setTimeout(() => {
          navigate("/myCards");
        }, 2000);
      }
    } catch (error) {
      setSubmiting(false);
      if (error.response) {
        const serverError = error.response.data;
        if (error.response.status === 500) {
          alert("სერვერული შეცდომა! სცადეთ მოგვიანებით.");
        } else {
          alert(
            `შეცდომა: ${serverError?.message || "უცნობია"}. ${serverError?.detail || ""}`,
          );
        }
      } else {
        console.error("Client Error:", error.message);
        alert("მოთხოვნა ვერ გაიგზავნა. შეამოწმეთ ინტერნეტი.");
      }
    }
  };
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  return (
    <div>
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
              {t("listing_add_success")}
            </p>
            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_2s_linear]"></div>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-10">
          {t("add_new_listing")}
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
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/5"
                      onClick={() => setActiveDropdown(0)}
                    ></div>
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
                  </>
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
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/5"
                      onClick={() => setActiveDropdown(0)}
                    ></div>
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
                  </>
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
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/5"
                      onClick={() => setActiveDropdown(0)}
                    ></div>
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
                  </>
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
                  <>
                    <div
                      className="fixed inset-0 z-40 bg-black/5"
                      onClick={() => setActiveDropdown(0)}
                    ></div>
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
                  </>
                )}
              </div>
            </div>
          </div>
          <div ref={locationRef}>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("location")}
            </label>
            <input
              type="text"
              placeholder={`${t("street")}, ${t("city")}, ${t("neighborhood")}`}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
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
          <div className="flex flex-wrap gap-4">
            <div className="flex flex-1 gap-0.5">
              <div className="flex-1 min-w-[49%]" ref={priceRef}>
                <label className="block text-gray-700 font-semibold mb-2">
                  {t("price")} ($)
                </label>
                <input
                  type="number"
                  placeholder={t("price")}
                  className="w-full px-4 py-3 mb-4 rounded-tl-lg rounded-bl-lg
                           shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
                  value={
                    areaMQ && PPQ
                      ? Math.round(Number(areaMQ) * Number(PPQ))
                      : price
                  }
                  onChange={(e) => setPrice(e.target.value)}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm  ">{errors.price}</span>
                )}
              </div>
              <div className="flex-1 min-w-[49%]">
                <label className="block text-gray-700 font-semibold mb-2">
                  {t("price_m2")}
                </label>
                <input
                  type="number"
                  placeholder={t("price_per_m2")}
                  className="w-full px-4 py-3 mb-4   shadow focus:outline-none focus:ring-2 focus:ring-blue-400 rounded-tr-lg rounded-br-lg"
                  value={
                    price && areaMQ
                      ? Math.round(Number(price) / Number(areaMQ))
                      : PPQ
                  }
                  onChange={(e) => setPPQ(e.target.value)}
                  disabled
                />
              </div>
            </div>
            <div className="flex-1" ref={areaRef}>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("area_m2")}
              </label>
              <input
                type="number"
                placeholder={t("example_area")}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 "
                value={areaMQ}
                onChange={(e) => setAreaQM(e.target.value)}
              />
              {errors.areaMQ && (
                <span className="text-red-500 text-sm  ">{errors.areaMQ}</span>
              )}
            </div>
          </div>
          <div ref={roomsRef}>
            <label className=" block text-gray-700 font-semibold mb-2">
              {t("rooms")}
            </label>

            {rooms.map((R) => (
              <button
                key={R.id}
                type="button"
                onClick={() =>
                  setSelectedRoom((prev) =>
                    prev.includes(R.id)
                      ? prev.filter((id) => id !== R.id)
                      : [R.id],
                  )
                }
                className={`mx-1 px-4 py-3 rounded-xl border shadow-sm outline-none
               ${
                 selectedRoom.includes(R.id)
                   ? "border-blue-400 text-blue-500"
                   : "border-gray_300"
               }  
              `}
              >
                {R.room}
              </button>
            ))}
            {errors.room && (
              <span className="text-red-500 text-sm block ">{errors.room}</span>
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
          <div className="flex flex-wrap gap-4" ref={floorRef}>
            <div className="flex-1">
              <label className="block text-gray-700 font-semibold mb-2">
                {t("floor")}
              </label>
              <input
                type="number"
                placeholder={t("example_floor")}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 "
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
              />
              {errors.floor && (
                <span className="text-red-500 text-sm  ">{errors.floor}</span>
              )}
            </div>
            <div className="flex-1" ref={totalFloorRef}>
              <label className="block text-gray-700 font-semibold mb-2">
                {t("total_floors")}
              </label>
              <input
                type="number"
                placeholder={t("example_total_floor")}
                className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400 "
                value={totalFloor}
                onChange={(e) => setTotalFloor(e.target.value)}
              />
              {errors.totalFloor && (
                <span className="text-red-500 text-sm  ">
                  {errors.totalFloor}
                </span>
              )}
            </div>
          </div>
          <div>
            <label
              className="block text-gray-700 font-semibold mb-2"
              ref={descriptionRef}
            >
              {t("description")}
            </label>
            <textarea
              rows="4"
              placeholder={t("write_description")}
              className="w-full px-4 py-3 mb-4 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && (
              <span className="text-red-500 text-sm  ">
                {errors.description}
              </span>
            )}
          </div>
          <div className="space-y-4">
            <label className="text-sm font-bold text-gray-600 ml-1 block">
              {t("upload_photos")}
            </label>

            <div
              ref={imagesRef}
              className={`relative border-2 border-dashed rounded-[2rem] p-8 transition-all duration-300 group
    ${
      images.length > 0
        ? "border-blue-200 bg-blue-50/10"
        : "border-gray-200 bg-gray-50/50 hover:border-blue-400 hover:bg-blue-50/30"
    }`}
            >
              <input
                type="file"
                multiple
                name="images"
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
                <p className="text-gray-400 text-xs mt-1 italic">
                  {t("showcase_property")}
                </p>
              </label>

              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
                  {images.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border-2 border-white"
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview-${i}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />

                      {/* წაშლის ღილაკი */}
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm text-red-500 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white flex items-center justify-center"
                      >
                        <FaTrashAlt className="text-xs" />
                      </button>

                      {/* ფოტოს ზომის ინდიკატორი (ვიზუალური ეფექტისთვის) */}
                      <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex items-end p-2">
                        <span className="text-[10px] text-white font-medium">
                          {t("photo")} #{i + 1}
                        </span>
                      </div>
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
          <div ref={contactRef}>
            <label className="block text-gray-700 font-semibold mb-2">
              {t("contact_information")}
            </label>
            <div className="flex flex-col sm:flex-row flex-wrap gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={t("name")}
                  className=" w-full px-4 py-3 mb-4 flex-1 rounded-xl  focus:ring-2 focus:ring-blue-400 outline-none  shadow "
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  value={name}
                />
                {errors.name && (
                  <span className="text-red-500 text-sm  ">{errors.name}</span>
                )}
              </div>
              <div className=" w-full flex-1  ">
                <input
                  type="number"
                  placeholder={t("number")}
                  className=" w-full   px-4 py-3 mb-4   rounded-xl  focus:ring-2 focus:ring-blue-400 outline-none  shadow "
                  onChange={(e) => {
                    setPhone(e.target.value);
                  }}
                  disabled={isCodeSent}
                  value={phone}
                />
                {errors.phone && (
                  <span className="text-red-500 text-sm  ">{errors.phone}</span>
                )}
              </div>

              <div className=" flex-1 relative h-[48px]">
                <input
                  type="number"
                  placeholder={t("code")}
                  className=" w-full px-4 py-3 mb-4 flex-1 rounded-xl  focus:ring-2 focus:ring-blue-400 outline-none  shadow "
                  onChange={(e) => setCode(e.target.value)}
                  value={code}
                />
                {errors.code && (
                  <span className="text-red-500 text-sm  ">{errors.code}</span>
                )}
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
            className={`w-full py-4 text-white font-bold text-lg rounded-2xl shadow-lg transform transition  
    ${
      submiting
        ? "bg-gradient-to-r from-blue-400 to-blue-500 opacity-70 cursor-not-allowed"
        : "bg-gradient-to-r from-blue-500 to-blue-700 hover:scale-105"
    }
  `}
            disabled={submiting}
          >
            {submiting ? t("sending") : t("add_listing")}
          </button>
        </form>
      </div>
    </div>
  );
}
