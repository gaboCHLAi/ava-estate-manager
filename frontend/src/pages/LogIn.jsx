import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../Components/Logo";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { useStatus } from "../Components/contextAPI/Context";
export default function LogIn() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submiting, setSubmiting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const { login } = useStatus();
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
      password
    );

  const formValidation = () => {
    const errors = {};

    if (!email) {
      errors.email = t("email_required");
    } else if (!validateEmail(email)) {
      errors.email = t("invalid_email");
    }

    if (!password) {
      errors.password = t("password_required");
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    const fieldValues = { email, password };
    setFormErrors((prevErrors) => {
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
  }, [email, password]);

  const handleLogIn = async (e) => {
    e.preventDefault();

    // 1. ჯერ ვამოწმებთ ფრონტის ვალიდაციას
    if (!formValidation()) return;

    setSubmiting(true);
    setServerError(""); // ვასუფთავებთ ზოგად ერორს

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
        { email, password }
      );

      login({
        userName: response.data.user.first_name,
        token: response.data.token,
      });

      navigate(from, { replace: true });
    } catch (error) {
      const message = error.response?.data?.message;

      // 2. ვამოწმებთ ბექენდიდან მოსულ კონკრეტულ შეცდომის Key-ს
      if (message === "user_not_found") {
        setFormErrors((prev) => ({ ...prev, email: t("user_not_found") }));
      } else if (message === "invalid_password") {
        setFormErrors((prev) => ({ ...prev, password: t("invalid_password") }));
      } else {
        setServerError(t("auth_failed"));
      }
    } finally {
      setSubmiting(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-blue-400">
      {serverError && (
        <div className="w-full p-3 mb-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg text-center">
          {serverError}
        </div>
      )}
      <form
        onSubmit={handleLogIn}
        className="flex flex-col items-center gap-6 bg-white rounded-2xl p-8 w-full max-w-md shadow-lg"
      >
        <Link to="/" className="self-start w-full">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-500 w-5 h-5 hover:scale-105"
          />
        </Link>
        <Logo className="w-32 text-blue-500 mb-5" />

        <input
          placeholder={t("email_placeholder")}
          type="text"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setEmail(e.target.value)}
        />
        {formErrors.email && (
          <span className="text-red-500 font-sm self-start">
            {formErrors.email}
          </span>
        )}

        <input
          placeholder={t("password_placeholder")}
          type="password"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => setPassword(e.target.value)}
        />
        {formErrors.password && (
          <span className="text-red-500 font-sm self-start">
            {formErrors.password}
          </span>
        )}

        <Link
          to="/forgotpassword"
          className="self-end text-blue-500 text-sm hover:underline"
        >
          {t("forgot_password")}
        </Link>

        <button
          disabled={submiting}
          className="w-full py-3 text-white font-semibold text-lg rounded-2xl bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 mt-3"
        >
          {submiting ? t("in_progress...") : t("login")}
        </button>

        <p className="text-sm text-gray-500 mt-2">
          {t("dont_have_account_yet")}{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            {t("register")}
          </Link>
        </p>
      </form>
    </div>
  );
}
