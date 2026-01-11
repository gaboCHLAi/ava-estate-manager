import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function SignUp() {
  const { t } = useTranslation();
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const [formErrors, setFormError] = useState({});
  const [serverError, setServerError] = useState("");
  const [isSucceed, setIsSucceed] = useState(false);
  const navigate = useNavigate();
  // დავამატოთ useRef თუ ის გჭირდება, წინააღმდეგ შემთხვევაში წაშალე handleRegister-დან
  const validRef = useRef(false);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    );

  const formValidation = () => {
    let validation = {};
    if (!name) validation.name = t("first_name");
    if (!lastName) validation.lastName = t("last_name");
    if (!validateEmail(email)) validation.email = t("invalid_email");
    if (!email) validation.email = t("email_required");
    if (!validatePassword(password)) validation.password = t("min_password");
    if (password !== repeatPassword)
      validation.repeatPassword = t("passwords_do_not_match");

    setFormError(validation);
    return Object.keys(validation).length === 0;
  };

  useEffect(() => {
    const fieldValues = { name, lastName, email, password, repeatPassword };

    // აქ ვიყენებთ setFormError-ს და არა formErrors-ს
    setFormError((prevErrors) => {
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
  }, [name, lastName, email, password, repeatPassword]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setSubmiting(true);
    setServerError("");

    if (validRef.current) validRef.current = true;

    if (!formValidation()) {
      setSubmiting(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/register`,
        { name, lastName, email, password }
      );
      if (validRef.current) validRef.current = false;
      setIsSucceed(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Registration error:", error);
      setServerError(
        error.response?.data?.message || "❌ რეგისტრაცია ვერ მოხერხდა"
      );
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 bg-blue-400">
      {isSucceed && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-green-100 flex flex-col items-center transform animate-in zoom-in duration-300 scale-110">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <i className="fas fa-check text-4xl text-green-500"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("success_title")}
            </h2>
            <p className="text-gray-600 text-center font-medium">
              {t("registration_success")}
            </p>
            <div className="mt-6 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 animate-[progress_2s_linear]"></div>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col items-center gap-5 bg-white rounded-2xl p-8 w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-lg h-auto md:min-h-[750px] shadow-lg">
        <Link to="/login" className="self-start w-full">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-500 w-5 h-5 transition hover:scale-105"
          />
        </Link>

        <Logo className="w-28 text-blue-500 mb-3" />
        <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
          {t("create_account")}
        </h1>

        <form onSubmit={handleRegister} className="w-full flex flex-col gap-3">
          {/* სერვერის შეცდომის ჩვენება ფორმის დასაწყისში */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-lg text-sm text-center font-medium">
              {serverError}
            </div>
          )}

          <input
            placeholder={t("first_name")}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setName(e.target.value)}
          />
          {formErrors.name && (
            <span className="text-red-500 text-sm">{formErrors.name}</span>
          )}

          <input
            placeholder={t("last_name")}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setLastName(e.target.value)}
          />
          {formErrors.lastName && (
            <span className="text-red-500 text-sm">{formErrors.lastName}</span>
          )}

          <input
            placeholder={t("email_placeholder")}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setEmail(e.target.value)}
          />
          {formErrors.email && (
            <span className="text-red-500 text-sm">{formErrors.email}</span>
          )}

          <input
            placeholder={t("password_placeholder")}
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setPassword(e.target.value)}
          />
          {formErrors.password && (
            <span className="text-red-500 text-sm">{formErrors.password}</span>
          )}

          <input
            placeholder={t("repeat_password_placeholder")}
            type="password"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 outline-none"
            onChange={(e) => setRepeatPassword(e.target.value)}
          />
          {formErrors.repeatPassword && (
            <span className="text-red-500 text-sm">
              {formErrors.repeatPassword}
            </span>
          )}

          <button
            disabled={submiting}
            className="w-full py-3 text-white font-semibold text-lg rounded-2xl bg-blue-500 hover:bg-blue-600 transition disabled:bg-gray-400 mt-3"
          >
            {submiting ? t("in_progress") : t("register")}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-2">
          {t("already_have_account")}{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            {t("login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
