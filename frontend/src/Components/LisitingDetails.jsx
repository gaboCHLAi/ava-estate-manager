import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getGeorgianDate } from "../utils/formatDate";
import axios from "axios";
import { useTranslation } from "react-i18next";
// Swiper იმპორტები
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const ListingDetail = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/listings/getList/${id}`,
          { params: { lang: i18n.language } }
        );
        setItem(response.data);
        setLoading(false);
      } catch (error) {
        console.error("შეცდომა:", error);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, i18n.language]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!item)
    return (
      <div className="text-center py-20 text-gray-500">
        {t("listing_not_found")}
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        {/* Header Section (იგივე რჩება) */}
        <nav className="flex mb-4 text-sm text-gray-400 gap-2 font-medium">
          <span>{t("home")}</span> / <span>{t("listings")}</span> /{" "}
          <span className="text-blue-600">{t("details")}</span>
        </nav>

        {/* Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- SLIDER SECTION START --- */}
            <div className="relative rounded-[40px] overflow-hidden shadow-2xl  w-full  h-[250px] md:h-[450px] lg:h-[550px] bg-white border border-white">
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                className="h-full w-full"
              >
                {item.image && item.image.length > 0 ? (
                  item.image.map((imgUrl, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={`http://localhost:5000${imgUrl}`}
                        alt={`პროდუქტის ფოტო ${index + 1}`}
                        object-cover
                        className="w-full h-full object-cover    "
                      />
                    </SwiperSlide>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                    {t("no_photo")}
                  </div>
                )}
              </Swiper>
            </div>
            <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 ">
              <div className="self-start">
                <p className="text-slate-500 mt-2 flex items-center gap-2">
                  <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-600">
                    ID: {id}
                  </span>
                  📍 {item.location}, {item.city}
                </p>
              </div>
              <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between gap-6">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase font-bold tracking-widest text-start">
                    {t("price")}
                  </p>
                  <p className="text-3xl font-black text-blue-600">
                    ${item.price?.toLocaleString()}
                  </p>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-200">
                  {t("contact")}
                </button>
              </div>
            </div>
            <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <span className="w-8 h-1 bg-blue-600 rounded-full" />
                {t("description")}
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">
                {item.description}
              </p>
            </div>
          </div>

          {/* Right Side: Stats & Contact (იგივე რჩება) */}
          <div className="space-y-6">
            <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
              <h4 className="text-lg font-bold text-slate-900 mb-6">
                {t("features")}
              </h4>
              <div className="grid grid-cols-1 gap-4">
                {[
                  { label: t("status"), value: item.status, icon: "🏷️" },
                  { label: t("area"), value: `${item.area_m2} მ²`, icon: "📏" },
                  {
                    label: t("floor"),
                    value: `${item.floor} / ${item.total_floors}`,
                    icon: "🏢",
                  },
                  {
                    label: t("published"),
                    value: getGeorgianDate(item.created_at),
                    icon: "📅",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-white w-10 h-10 flex items-center justify-center rounded-xl shadow-sm">
                        {stat.icon}
                      </span>
                      <span className="text-slate-500 font-medium">
                        {stat.label}
                      </span>
                    </div>
                    <span className="font-bold text-slate-800 ml-4 break-all">
                      {stat.value || "N/A"}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mb-2">
                  {t("contact_info")}
                </p>
                <h4 className="text-2xl font-bold mb-6">
                  {item.contact_name || "მფლობელი"}
                </h4>
                <a
                  href={`tel:${item.contact_phone}`}
                  className="flex items-center gap-4 bg-white/10 hover:bg-white/20 transition-all p-4 rounded-2xl border border-white/10 group-hover:border-blue-500/50"
                >
                  <span className="text-2xl transition-transform group-hover:scale-110">
                    📞
                  </span>
                  <span className="text-xl font-bold italic tracking-tight">
                    {item.contact_phone}
                  </span>
                </a>
              </div>
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-3xl group-hover:bg-blue-600/30 transition-all duration-700"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
