import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useTranslation } from "react-i18next";
const MyListings = () => {
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { t } = useTranslation();
  useEffect(() => {
    const fetchMyListings = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/listings/getMyListings`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        console.log("aqaaa", response.data);
        setUser(response.data.user);
        setListings(response.data.listsOfUser);
        setLoading(false);
      } catch (err) {
        setError("განცხადებების ჩატვირთვა ვერ მოხერხდა");
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      {/* მთავარი კონტეინერი გვერდის გასაყოფად */}
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* მარცხენა ნავიგაციის პანელი (იგივე რაც პროფილზე) */}
        <div className="lg:w-72 w-full shrink-0 hidden md:block">
          <div className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm ">
            <div className="space-y-2 ">
              <Link
                to="/"
                className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
              >
                🏠 {t("back_to_home")}
              </Link>
              <Link
                to="/myCards"
                className="block px-6 py-4 text-sm font-bold bg-blue-50 text-blue-600 rounded-2xl transition-all border border-blue-100/50"
              >
                📁 {t("my_listings")}
              </Link>
              <Link
                to="/profile"
                className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
              >
                👤 {t("profile")}
              </Link>
              <div className="border-t border-slate-50 my-2"></div>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full text-left px-6 py-4 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all"
              >
                🚪 {t("log_out")}
              </button>
            </div>
          </div>
        </div>

        {/* მარჯვენა კონტენტი (შენი ორიგინალი კოდი) */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-200">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                  {user?.first_name || "მომხმარებელი"}
                  <span className="text-sm font-medium bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                    ID: #{user?.id || "---"}
                  </span>
                </h2>
                <p className="text-slate-500 mt-1 font-medium">
                  {t("you_have")}{" "}
                  <span className="text-blue-600 font-bold">
                    {listings.length || 0}
                  </span>{" "}
                  {t("active_listing")}
                </p>
              </div>
            </div>

            <Link to="/add-listing">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[24px] font-bold transition-all active:scale-95 shadow-xl shadow-blue-100 flex items-center gap-2">
                <span>+</span> {t("new_listing")}
              </button>
            </Link>
          </div>

          {listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {listings.map((item) => (
                <div
                  key={item.id}
                  className="hover:cursor-pointer group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden flex flex-col"
                >
                  {/* Image Section */}
                  <div className="relative h-64 overflow-hidden">
                    <Swiper
                      modules={[Navigation, Pagination, Autoplay]}
                      autoplay={{ delay: 5000 }}
                      className="h-full w-full"
                    >
                      {item.image && item.image.length > 0 ? (
                        item.image.map((imgUrl, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={imgUrl}
                              alt={`პროდუქტის ფოტო ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </SwiperSlide>
                        ))
                      ) : (
                        <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                          {t("no_photo")}
                        </div>
                      )}

                      <div className="absolute top-5 left-5 z-10">
                        <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-800 uppercase tracking-widest shadow-sm">
                          {item.status || "აქტიური"}
                        </span>
                      </div>
                    </Swiper>
                  </div>

                  {/* Content Section */}
                  <div
                    className="p-8 flex flex-col flex-1"
                    onClick={() => navigate(`/manageListing/${item.id}`)}
                  >
                    <h3 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-slate-400 text-sm mb-6 flex items-center gap-1">
                      📍 {item.city}, {item.location}
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-8">
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {t("area")}
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.area_m2} მ²
                        </p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          {t("floor")}
                        </p>
                        <p className="text-sm font-bold text-slate-800">
                          {item.floor}/{item.total_floors}
                        </p>
                      </div>
                    </div>

                    <div className="mt-auto gap-9 pt-6 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                          {t("price")}
                        </p>
                        <p className="text-2xl font-black text-blue-600">
                          ${item.price?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => navigate(`/listing/${item.id}`)}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-2 rounded-2xl font-bold transition"
                      >
                        დეტალები
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-[48px] p-20 border-2 border-dashed border-slate-200 text-center">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
                📦
              </div>
              <h4 className="text-2xl font-black text-slate-900 mb-2">
                {t("you_have_no_listings")}
              </h4>
              <p className="text-slate-500 mb-8 max-w-xs mx-auto">
                {t("add_first_listing")}
              </p>
              <Link to="/add-listing">
                <button className="bg-blue-600 text-white px-10 py-4 rounded-[24px] font-bold shadow-xl shadow-blue-100">
                  {t("add_now")}
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListings;
