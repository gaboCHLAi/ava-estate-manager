import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaChartLine,
  FaImages,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

const ManageListing = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/listings/getUserListingById/${id}`,
          {
            params: { lang: i18n.language },
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setItem(response.data);
        console.log("hii", response.data);
        setLoading(false);
      } catch (error) {
        console.error("შეცდომა:", error);
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, i18n.language]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/listings/delete/${id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      // წაშლის შემდეგ გადავიყვანოთ მომხმარებელი
      navigate("/myCards");
    } catch (error) {
      alert("შეცდომა წაშლისას");
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!item)
    return <div className="text-center mt-20">განცხადება ვერ მოიძებნა</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* წაშლის დადასტურების მოდალი */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-red-50 flex flex-col items-center transform animate-in zoom-in duration-300 max-w-sm w-full mx-4">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <FaTrashAlt className="text-3xl text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
              წაშლა?
            </h2>
            <p className="text-gray-500 text-center font-medium mb-8">
              ნამდვილად გსურთ ამ განცხადების სამუდამოდ წაშლა?
            </p>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all"
              >
                არა
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-lg shadow-red-200 transition-all flex items-center justify-center"
              >
                {isDeleting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "კი, წაშალე"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-w-4xl mx-auto p-8 mt-12 bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-xl border border-gray-200">
        {/* ზედა ნაწილი: სათაური და ფასი */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              {item.title || item.city}
            </h1>
            <p className="text-blue-600 font-bold text-xl mt-1">
              ${Number(item.price).toLocaleString()}
            </p>
          </div>
          {/* სტატუსი (აქტიური) */}
          <div className="px-6 py-2 rounded-full font-bold text-sm shadow-sm bg-green-100 text-green-600">
            ● აქტიური
          </div>
        </div>

        {/* 1. სტატისტიკის ბლოკი (Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 text-xl">
              <FaEye />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">{t("views")}</p>
              <p className="text-2xl font-bold text-gray-800">
                {item.views || 0}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-50 rounded-xl flex items-center justify-center text-pink-500 text-xl">
              <i className="fas fa-heart"></i>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">
                {t("favorites")}
              </p>
              <p className="text-2xl font-bold text-gray-800">
                {item.favorites || 0}
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-500 text-xl">
              <FaChartLine />
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium">კონვერსია</p>
              <p className="text-2xl font-bold text-gray-800">3.2%</p>
            </div>
          </div>
        </div>

        {/* 2. მოქმედებების პანელი (Main Actions) */}
        <div className="space-y-4">
          <label className="block text-gray-700 font-bold mb-4 ml-1">
            მართვის ხელსაწყოები
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* რედაქტირების ღილაკი */}
            <button
              onClick={() => navigate(`/editList/${id}`)}
              className="flex items-center justify-center gap-3 py-4 bg-white border-2 border-blue-500 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-sm"
            >
              <FaEdit /> {t("edit_listing")}
            </button>

            {/* მეორე ღილაკი (შეგიძლია სხვა რამისთვის გამოიყენო, მაგ. "მთავარზე გამოჩენა") */}
            <button className="flex items-center justify-center gap-3 py-4 font-bold rounded-2xl transition-all shadow-sm text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105">
              <FaImages /> სურათების მართვა
            </button>
          </div>

          {/* წაშლის ღილაკი */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-center gap-3 py-4 mt-4 border-2 border-dashed border-red-200 text-red-500 font-bold rounded-2xl hover:bg-red-50 transition-all group"
          >
            <FaTrashAlt className="group-hover:shake" /> განცხადების წაშლა
          </button>
        </div>

        {/* 3. მინი-ინფორმაცია (Preview Card) */}
        <div className="mt-12 p-6 bg-blue-50/50 rounded-[2rem] border border-blue-100">
          <div className="flex items-start gap-6">
            <div className="w-32 h-24 bg-gray-200 rounded-2xl overflow-hidden shadow-inner">
              {item.image && item.image[0] ? (
                <img
                  src={`http://localhost:5000${item.image[0]}`}
                  className="w-full h-full object-cover"
                  alt="Property"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <FaImages size={24} />
                </div>
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-700">განცხადება აქტიურია</h3>
              <p className="text-sm text-gray-500 mt-1 italic">
                თქვენი განცხადება განახლდა ბოლოს:{" "}
                {new Date(item.created_at).toLocaleDateString()}. ხომ არ გსურთ
                ფასის შეცვლა მეტი ნახვისთვის?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageListing;
