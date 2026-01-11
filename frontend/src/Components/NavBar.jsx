import { useTranslation } from "react-i18next";
import { HiMenu, HiX } from "react-icons/hi";
import PhoneMenu from "./PhoneMenu";
import Logo from "./Logo";
import { Link, useNavigate } from "react-router-dom";
import { useStatus } from "./contextAPI/Context";
import React, { useState, useEffect, useRef } from "react";

export default function NavBar({ menuRef, activeDropdown }) {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout, user } = useStatus();
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen || activeDropdown !== 0) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, activeDropdown]);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate("/");
  };

  return (
    /* 1. გარე მთავარი ფენა - ფიქსირებული და სრული სიგანის */
    <div className="fixed top-0 left-0 w-full z-50 bg-white border-b border-slate-150">
      {/* 2. ზედა სექციის კონტეინერი (1440px-ზე შეზღუდული) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex justify-between items-center py-4">
          {/* მარცხენა მხარე: ლოგო */}
          <Link
            to="/"
            className="hover:scale-105 transition-transform duration-150 shrink-0"
          >
            <Logo className="w-32 text-blue-500" />
          </Link>

          {/* მარჯვენა მხარე: ღილაკები */}
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4">
              <Link to="/add-listing">
                <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-lg hover:bg-blue-50 transition font-medium">
                  {t("add_announcement")}
                </button>
              </Link>

              {/* მომხმარებლის მენიუ */}
              <div ref={userMenuRef} className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center gap-2  border-blue-600 bg-blue-100 text-blue-600 px-5 py-[8.8px] rounded-lg hover:bg-blue-200 transition shadow-md"
                    >
                      <span className="font-medium">
                        {user?.userName || "Guest"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          isOpen ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[60]">
                        <Link to="/myCards" onClick={() => setIsOpen(false)}>
                          <span className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b border-gray-50">
                            {t("my_listings")}
                          </span>
                        </Link>
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <span className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                            {t("profile")}
                          </span>
                        </Link>
                        <div className="border-t border-gray-100">
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition font-medium"
                          >
                            {t("log_out")}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link to="/login">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                      {t("login")}
                    </button>
                  </Link>
                )}
              </div>

              {/* ენის გადამრთველი */}
              <button
                type="button"
                onClick={() => {
                  const newLang = i18n.language === "ka" ? "en" : "ka";
                  i18n.changeLanguage(newLang);
                  localStorage.setItem("i18nextLng", newLang);
                  window.location.reload();
                }}
                className="px-3 py-[10.24px] border border-gray-200 rounded hover:bg-gray-50 transition text-blue-600 font-bold text-sm"
              >
                {i18n.language === "ka" ? "EN" : "KA"}
              </button>
            </div>

            {/* MOBILE BURGER */}
            <div className="md:hidden flex items-center">
              <button
                className="text-3xl text-gray-700 relative z-[101]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <HiX /> : <HiMenu />}
              </button>
              <PhoneMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                user={user}
                handleLogout={handleLogout}
              />
            </div>
          </div>
        </header>
      </div>

      {/* 3. გამყოფი ხაზი, რომელიც სრულ სიგანეზე მიდის */}
      <div className="w-full border-t border-slate-100">
        {/* 4. ქვედა მენიუს კონტეინერი (ისევ 1440px-ზე გაცენტრირებული) */}
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 hidden md:block">
          <nav>
            <ul className="flex flex-wrap gap-8 py-3 text-sm text-gray-500 font-medium">
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#mortgage">{t("mortgage")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#agencies">{t("agencies")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#new-projects">{t("new_projects")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#measurement">{t("measurement")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#valuation">{t("valuation")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#news">{t("news")}</a>
              </li>
              <li className="hover:text-blue-600 transition-colors cursor-pointer">
                <a href="#statistics">{t("price_statistics")}</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
