import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  HiUser,
  HiViewList,
  HiLogout,
  HiPlusCircle,
  HiLogin,
} from "react-icons/hi";

export default function PhoneMenu({ isOpen, onClose, user, handleLogout }) {
  const { t, i18n } = useTranslation();
  return (
    <div
      className={` fixed inset-0 z-[100] flex justify-end transition-opacity duration-300 ${
        isOpen
          ? "opacity-100 pointer-events-auto"
          : "opacity-0 pointer-events-none"
      }`}
    >
      {/* ფონი (Overlay) */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* თეთრი პანელი */}
      <div
        className={`relative w-full h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ზედა თავი */}
        <div className="p-6 border-b bg-gray-50 pt-20 flex justify-between">
          <div>
            <p className="text-[10px] text-blue-600 font-bold uppercase tracking-[2px] mb-1">
              {t("menu")}
            </p>
            <p className="text-xl font-extrabold text-gray-800 truncate">
              {user || "სტუმარი"}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              const newLang = i18n.language === "ka" ? "en" : "ka";
              i18n.changeLanguage(newLang);
              localStorage.setItem("i18nextLng", newLang);
            }}
            className="px-3 py-1 border rounded hover:bg-gray-200 transition text-blue-600 font-bold"
          >
            {i18n.language === "ka" ? "EN" : "KA"}
          </button>
        </div>

        {/* ლინკები */}
        <nav className="flex-1 p-4 space-y-3 mt-4">
          {/* თუ მომხმარებელი არ არის შესული - ჩანს მხოლოდ "შესვლა" */}
          {!user ? (
            <div>
              <Link
                to="/login"
                onClick={onClose}
                className="flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <div className="bg-blue-50 p-2 rounded-lg">
                  <HiLogin className="text-xl text-blue-600" />
                </div>
                <span className="font-semibold">
                  {t("login")} / {t("register")}
                </span>
              </Link>
              <Link
                to="/add-listing"
                onClick={onClose}
                className="flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <div className="bg-green-50 p-2 rounded-lg">
                  <HiPlusCircle className="text-xl text-green-600" />
                </div>
                <span className="font-semibold">{t("add_announcement")}</span>
              </Link>
            </div>
          ) : (
            /* თუ მომხმარებელი შესულია - ჩანს სრული მენიუ */
            <>
              <Link
                to="/add-listing"
                onClick={onClose}
                className="flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <div className="bg-green-50 p-2 rounded-lg">
                  <HiPlusCircle className="text-xl text-green-600" />
                </div>
                <span className="font-semibold">{t("add_announcement")}</span>
              </Link>
              <Link
                to="/myCards"
                onClick={onClose}
                className="flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <div className="bg-blue-50 p-2 rounded-lg">
                  <HiViewList className="text-xl text-blue-600" />
                </div>
                <span className="font-semibold">{t("my_listings")}</span>
              </Link>

              <Link
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-4 p-4 text-gray-700 hover:bg-gray-100 rounded-2xl transition-all active:scale-95"
              >
                <div className="bg-orange-50 p-2 rounded-lg">
                  <HiUser className="text-xl text-orange-600" />
                </div>
                <span className="font-semibold">{t("profile")}</span>
              </Link>
            </>
          )}
        </nav>

        {/* გასვლის ღილაკი - მხოლოდ შესული მომხმარებლისთვის */}
        {user && (
          <div className="p-6 border-t">
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="flex items-center justify-center gap-3 w-full p-4 bg-red-50 text-red-600 rounded-2xl transition-all hover:bg-red-100 font-bold active:scale-95"
            >
              <HiLogout className="text-xl" />
              <span>{t("log_out")}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
