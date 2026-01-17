import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("ავტორიზაცია საჭიროა");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/listings/getProfile`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        // ვვარაუდობთ, რომ ბექენდიდან მოდის: response.data.user = { name, lastName, email, phone, _id }
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        setError(
          err.response?.data?.message || "მონაცემების წამოღება ვერ მოხერხდა",
        );
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-[32px] shadow-2xl shadow-red-100 border border-red-50 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
            ⚠️
          </div>
          <p className="text-slate-800 font-bold text-lg mb-6">{error}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all active:scale-95"
          >
            ავტორიზაცია
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-20 pt-12 px-4 font-sans text-slate-900">
      {/* მთავარი კონტეინერი გვერდის გასაყოფად */}
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* მარცხენა ნავიგაციის პანელი */}
        <div className="lg:w-72 w-full shrink-0 hidden md:block">
          <div className="bg-white rounded-[32px] border border-slate-100 p-4 shadow-sm  ">
            <div className="space-y-2">
              <Link
                to="/"
                className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
              >
                🏠 {t("back_to_home")}
              </Link>
              <Link
                to="/myCards"
                className="block px-6 py-4 text-sm font-bold text-slate-700 hover:bg-slate-50 rounded-2xl transition-all"
              >
                📁 {t("my_listings")}
              </Link>
              <Link
                to="/profile"
                className="block px-6 py-4 text-sm font-bold bg-indigo-50 text-indigo-600 rounded-2xl transition-all"
              >
                👤 {t("profile")}
              </Link>
              <div className="border-t border-slate-50 my-2"></div>
              <button
                onClick={() => (isOpen ? setIsOpen(false) : setIsOpen(true))}
                className="w-full text-left px-6 py-4 text-sm font-bold text-indigo-600 hover:bg-red-50 rounded-2xl transition-all"
              >
                🛡️ {t("security_settings")}
              </button>
              {isOpen && (
                <Link to="/forgotPassword">
                  <button className="w-full text-left px-6 py-4 text-sm font-bold text-indigo-600 hover:bg-red-50 rounded-2xl transition-all">
                    {t("change_password")}
                  </button>
                </Link>
              )}
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

        {/* მარჯვენა კონტენტი - შენი ორიგინალი ცვლადებით */}
        <div className="flex-1">
          <div className="bg-white rounded-[48px] shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="h-52 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 relative">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
            </div>

            <div className="px-8 md:px-12 pb-12">
              <div className="relative flex flex-col md:flex-row justify-between items-center md:items-end -mt-20 gap-6">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
                  <div className="p-2 bg-white rounded-[40px] shadow-2xl">
                    <div className="w-40 h-40 bg-slate-50 rounded-[36px] border border-slate-100 flex items-center justify-center text-5xl font-black text-indigo-600 shadow-inner tracking-tighter">
                      {user?.first_name?.charAt(0)}
                      {user?.last_name?.charAt(0)}
                    </div>
                  </div>
                  <div className="text-center md:text-left mb-2">
                    <h1 className="text-4xl font-black tracking-tight mb-2">
                      {user?.first_name} {user?.last_name}
                    </h1>
                    <div className="flex items-center gap-2 justify-center md:justify-start">
                      <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                      <span className="text-slate-500 font-bold text-sm uppercase tracking-widest">
                        Verified User
                      </span>
                    </div>
                  </div>
                </div>
                <button className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 mb-2">
                  {t("edit")}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-16">
                <div className="p-8 rounded-[36px] bg-slate-50 border border-slate-100 hover:bg-white transition-all group">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    {t("first_and_last_name")}
                  </p>
                  <div className="flex items-center gap-4 text-slate-800">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      👤
                    </div>
                    <p className="font-bold text-lg">
                      {user?.first_name} {user?.last_name}
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-[36px] bg-slate-50 border border-slate-100 hover:bg-white transition-all group">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    {t("email")}
                  </p>
                  <div className="flex  items-center gap-4 text-slate-800">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      📧
                    </div>
                    <p className="font-bold text-lg break-all">{user?.email}</p>
                  </div>
                </div>

                <div className="p-8 rounded-[36px] bg-slate-50 border border-slate-100 hover:bg-white transition-all group">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    {t("phone")}
                  </p>
                  <div className="flex items-center gap-4 text-slate-800">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      📞
                    </div>
                    <p className="font-bold text-lg">
                      {user?.phone || t("not_specified")}
                    </p>
                  </div>
                </div>

                <div className="p-8 rounded-[36px] bg-slate-50 border border-slate-100 hover:bg-white transition-all group">
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-3">
                    {t("identifier")}
                  </p>
                  <div className="flex items-center gap-4 text-slate-800">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      🔑
                    </div>
                    <p className="font-bold text-lg">
                      #{user?.id?.toString().slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 px-2"></div>
        </div>
      </div>
    </div>
  );
}
