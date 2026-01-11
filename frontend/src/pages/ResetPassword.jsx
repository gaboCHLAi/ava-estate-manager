import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useTranslation } from "react-i18next"; // დაემატა i18n

export default function ResetPassword() {
  const { t } = useTranslation(); // ჰუკის ინიციალიზაცია
  const location = useLocation();
  const navigate = useNavigate();

  const { email } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // წარმატების მოდალისთვის

  // თუ ემაილი არ გვაქვს, ვაბრუნებთ უკან
  if (!email) {
    window.location.href = "/forgotpassword";
    return null;
  }

  const handleReset = async () => {
    setFormError(""); // შეცდომის გასუფთავება ყოველ ცდაზე

    if (password !== confirmPassword) {
      return setFormError(t("passwords_dont_match"));
    }

    if (password.length < 8) {
      return setFormError(t("min_password") || "მინიმუმ 8 სიმბოლო");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/resetPassword`,
        { email, newPassword: password }
      );

      if (response.status === 200) {
        setIsSuccess(true); // ვაჩენთ მოდალს
        // 3 წამში გადავიყვანოთ ლოგინზე
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setFormError(err.response?.data?.message || "შეცდომა პაროლის შეცვლისას");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 bg-blue-400">
      {/* წარმატების მოდალი */}
      {isSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center transform animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("success_title")}
            </h2>
            <p className="text-gray-600 text-center font-medium">
              {t("password_changed_congrats")}
            </p>
            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_3s_linear]"></div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col items-center gap-5 bg-white rounded-2xl p-8 w-full max-w-md shadow-lg">
        <Link
          to="/forgotpassword"
          title="უკან დაბრუნება"
          className="self-start w-full"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-500 w-5 h-5 hover:scale-105 transition"
          />
        </Link>

        <Logo className="w-28 text-blue-500 mb-3" />

        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            {t("new_password_title")}
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            {t("user_label")} {email}
          </p>
        </div>

        <div className="w-full flex flex-col gap-3">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("enter_new_password")}
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder={t("repeat_new_password")}
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {formError && (
            <span className="text-red-500 text-sm font-medium self-start">
              {formError}
            </span>
          )}
        </div>

        <button
          onClick={handleReset}
          disabled={loading || isSuccess}
          className="w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg bg-blue-500 hover:bg-blue-600 transition disabled:bg-slate-300 mt-3"
        >
          {loading ? t("in_progress") : t("change_password_btn")}
        </button>
      </div>
    </div>
  );
}
