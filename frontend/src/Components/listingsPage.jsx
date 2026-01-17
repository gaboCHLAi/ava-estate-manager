import { useEffect, useState } from "react";
import axios from "axios";
import { useStatus } from "./contextAPI/Context";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function ListingsPage() {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const {
    activeDealType,
    activeProperty,
    activeCity,
    listings,
    setListings,
    searchTerm,
    minPrice,
    maxPrice,
  } = useStatus();

  const [debouncedMinPrice, setDebouncedMinPrice] = useState(minPrice);
  const [debouncedMaxPrice, setDebouncedMaxPrice] = useState(maxPrice);

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedMinPrice(minPrice);
      setDebouncedMaxPrice(maxPrice);
    }, 500);
    return () => clearTimeout(handler);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/listings/getListings`,
          {
            dealTypeId: activeDealType,
            propertyId: activeProperty,
            searchTerm: searchTerm,
            minPrice: debouncedMinPrice,
            maxPrice: debouncedMaxPrice,
          },
          { params: { lang: i18n.language } },
        );
        setListings(response.data);
        setLoading(false);
        setCurrentPage(1);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [
    activeDealType,
    activeProperty,
    setListings,
    activeCity,
    searchTerm,
    i18n.language,
    debouncedMinPrice,
    debouncedMaxPrice,
  ]);

  // --- PAGINATION LOGIC ---
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = listings.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(listings.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (listings.length === 0)
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center bg-white rounded-[40px] border-2 border-dashed border-slate-100 m-6">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl">🔍</span>
        </div>
        <h3 className="font-black text-slate-900 mb-2">
          {t("no_listings_found")}
        </h3>
        <button
          onClick={() => window.location.reload()}
          className="mt-8 text-blue-600 font-bold hover:underline font-ka"
        >
          🔄 {t("clear_filters")}
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {currentCards.map((item) => (
            <div
              onClick={() => navigate(`/listing/${item.id}`)}
              key={item.id}
              className="group bg-white rounded-[40px] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="relative h-64 overflow-hidden">
                <Slider
                  dots={false}
                  infinite={item.image?.length > 1}
                  speed={500}
                  slidesToShow={1}
                  slidesToScroll={1}
                  className="h-full w-full"
                >
                  {Array.isArray(item.image) && item.image.length > 0 ? (
                    item.image.map((img, index) => (
                      <div key={index} className="h-64">
                        <img
                          src={`${import.meta.env.VITE_BACKEND_IMG_URL}${img}`}
                          alt={item.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {console.log(`${img}`)}
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-64 bg-slate-100 text-slate-400 font-bold">
                      {t("no_photo")}
                    </div>
                  )}
                </Slider>
                <div className="absolute top-5 left-5 z-10">
                  <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black text-slate-800 uppercase tracking-widest">
                    {item.status || "აქტიური"}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="mb-4">
                  <h2 className="text-xl font-black text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-slate-400 text-sm flex items-center gap-1">
                    📍 {item.city}, {item.location}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {t("area")}
                    </p>
                    <p className="text-sm font-bold text-slate-800">
                      {item.area_m2 || "---"} მ²
                    </p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {t("type")}
                    </p>
                    <p className="text-sm font-bold text-slate-800 truncate">
                      {item.property_type || "ბინა"}
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {t("price")}
                    </p>
                    <p className="text-2xl font-black text-blue-600">
                      ${item.price?.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-12 mb-10">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-600 disabled:opacity-30 hover:bg-blue-50 transition-colors"
            >
              ←
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`w-12 h-12 rounded-2xl font-black transition-all duration-300 ${
                  currentPage === num
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110"
                    : "bg-white text-slate-400 border border-slate-100 hover:border-blue-200"
                }`}
              >
                {num}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-600 disabled:opacity-30 hover:bg-blue-50 transition-colors"
            >
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
