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
  const [isSent, setIsSent] = useState(false);
  const [incorrectCode, setIncorrectCode] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const formValidation = () => {
    let validation = {};

    // მეილის ვალიდაცია ყოველთვის საჭიროა
    if (!email) {
      validation.email = t("email_required");
    } else if (!validateEmail(email)) {
      validation.email = t("invalid_email");
    }

    // თუ კოდის შეყვანის ეტაპზე ვართ
    if (showCodeInput) {
      if (!code) {
        validation.code = t("code_required") || "შეიყვანეთ კოდი";
      } else if (incorrectCode) {
        validation.code = t("invalid_code");
      }
    }

    setValidationErr(validation);
    return Object.keys(validation).length === 0;
  };
  useEffect(() => {
    const fieldValues = { email, code };
    setIncorrectCode(false);
    setValidationErr((prevErrors) => {
      const newErrors = { ...prevErrors };
      let hasChanged = false;

      Object.keys(fieldValues).forEach((key) => {
        if (newErrors[key] && fieldValues[key]) {
          delete newErrors[key];
          hasChanged = true;
        }
      });

      return hasChanged ? newErrors : prevErrors;
    });
  }, [email, code]);
  const handleVerification = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setServerError("");

    if (!formValidation()) {
      setSubmitting(false);
      return;
    }
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/emailVerification`,
        {
          email,
        }
      );
      if (response.status === 200) {
        setIsSent(true);
        setShowCodeInput(true);
        setTimeout(() => {
          setIsSent(false);
        }, 2000);
      }
    } catch (error) {
      console.error("ვერიფიკაცია ვერ შესრულდა:", error);
      setServerError(
        error.response?.data?.message ||
          "❌ ასეთი მეილით მომხარებელი არ ასებობს"
      );
    } finally {
      setSubmitting(false);
    }
  };
  const handleCodeCheck = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // ჯერ ვამოწმებთ არის თუ არა საერთოდ შეყვანილი კოდი
    if (!code) {
      setValidationErr((prev) => ({
        ...prev,
        code: t("code_required") || "შეიყვანეთ კოდი",
      }));
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/verifyCode`,
        { email, code }
      );
      if (response.status === 200) {
        navigate("/resetPassword", { state: { email } });
      }
    } catch (error) {
      setValidationErr((prev) => ({ ...prev, code: t("invalid_code") }));
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 bg-blue-400">
      {isSent && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100 flex flex-col items-center transform animate-in zoom-in duration-300 scale-110">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("success_title")}
            </h2>
            <p className="text-gray-600 text-center font-medium">
              {t("code_sent_success")}
            </p>
            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_2s_linear]"></div>
            </div>
          </div>
        </div>
      )}
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
          {serverError && (
            <div className="bg-red-50 my-1 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center font-medium">
              {serverError}
            </div>
          )}
          <div className="w-full flex flex-col gap-3">
            <input
              placeholder={t("email_placeholder")}
              type="text"
              className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onChange={(e) => setEmail(e.target.value)}
            />
            {validationErr.email && (
              <span className="text-red-500 font-sm">
                {validationErr.email}
              </span>
            )}
            {showCodeInput && (
              <input
                placeholder={t("one_time_code")}
                type="text"
                className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                onChange={(e) => setCode(e.target.value.trim())}
              />
            )}
            {validationErr.code && (
              <span className="text-red-500 font-sm">{validationErr.code}</span>
            )}
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg bg-blue-500
                     hover:bg-blue-600 transform transition duration-200 hover:scale-105 mt-3 disabled:bg-gray-400 mt-3"
          >
            {submitting
              ? t("in_progress")
              : showCodeInput
              ? t("send_code")
              : t("verification")}
          </button>
          <Link to="/resetPassword " className="w-full"></Link>
        </form>
      </div>
    </div>
  );
}
