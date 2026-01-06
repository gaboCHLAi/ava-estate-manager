import React, { useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../Components/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [showCodeInput, setShowCodeInput] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErr, setValidationErr] = useState(false);
  const navigate = useNavigate();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValidation = () => {
    if (!email) {
      return setValidationErr(t("email_required"));
    }
    if (!validateEmail(email)) {
      return setValidationErr(t("invalid_email"));
    }
    setValidationErr("");
    return true;
  };
  useEffect(() => {
    if (validationErr) {
      setValidationErr("");
    }
  }, [email]);
  const handleVerification = async (e) => {
    e.preventDefault();
    const isValid = formValidation();

    if (!isValid) return;

    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/emailVerification`,
        {
          email,
        }
      );
      if (response.status === 200) {
        alert("კოდი გაიგზავნა თქვენს მეილზე!");
        setShowCodeInput(true);
      }
    } catch (error) {
      console.error("ვერიფიკაცია ვერ შესრულდა:", error);
      alert(error.response?.data?.message || "მოხდა შეცდომა ");
    } finally {
      setSubmitting(false);
    }
  };
  const handleCodeCheck = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verifyCode`,
        { email, code }
      );
      if (response.status === 200) {
        navigate("/resetPassword", { state: { email } });
      }
    } catch (error) {
      alert(error.response?.data?.message || "არასწორი კოდი");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 bg-blue-400">
      {/* Card */}
      <div
        className="
          flex flex-col items-center gap-5 bg-white rounded-2xl p-8
          w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md
          h-auto md:h-[500px] shadow-lg
        "
      >
        {/* Back link */}
        <Link to="/login" className="self-start w-full">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-500 w-5 h-5 transform transition duration-200 hover:scale-105"
          />
        </Link>

        {/* Logo */}
        <Logo className="w-28 text-blue-500 mb-3" />

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {t("password_recovery")}
        </h1>

        {/* Inputs */}
        <form
          type="submit"
          className="w-full"
          onSubmit={showCodeInput ? handleCodeCheck : handleVerification}
        >
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder={t("email_placeholder")}
              type="text"
              className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErr && (
              <span className="text-red-500 font-sm">{validationErr}</span>
            )}
            {showCodeInput && (
              <input
                placeholder={t("one_time_code")}
                type="text"
                className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setCode(e.target.value.trim())}
              />
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg bg-blue-500
                     hover:bg-blue-600 transform transition duration-200 hover:scale-105 mt-3"
          >
            {showCodeInput ? t("send_code") : t("verification")}
          </button>
          <Link to="/resetPassword " className="w-full"></Link>
        </form>
      </div>
    </div>
  );
}
