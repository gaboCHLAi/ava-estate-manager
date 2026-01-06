import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "../Components/Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();

  // ForgotPassword გვერდიდან გადმოცემული მონაცემები
  const { email } = location.state || {};

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // თუ მომხმარებელი პირდაპირ ამ ბმულზე შემოვიდა (ვალიდაციის გარეშე), დავაბრუნოთ უკან
  if (!email) {
    window.location.href = "/forgotPassword";
    return null;
  }

  const handleReset = async () => {
    if (password !== confirmPassword) {
      return alert("პაროლები არ ემთხვევა!");
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/resetPassword`,
        {
          email,
          newPassword: password,
        }
      );

      if (response.status === 200) {
        alert("პაროლი წარმატებით განახლდა");
        navigate("/login");
      }
    } catch (err) {
      alert(err.response?.data?.message || "შეცდომა პაროლის შეცვლისას");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 sm:px-8 bg-blue-400">
      {/* Card - ზუსტად იგივე სტილები */}
      <div
        className="
          flex flex-col items-center gap-5 bg-white rounded-2xl p-8
          w-full sm:w-3/4 md:w-2/3 lg:w-1/2 xl:w-1/3 max-w-md
          h-auto md:h-[500px] shadow-lg
        "
      >
        {/* Back link */}
        <Link
          to="/forgotPassword"
          title="უკან დაბრუნება"
          className="self-start w-full"
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-blue-500 w-5 h-5 transform transition duration-200 hover:scale-105"
          />
        </Link>

        {/* Logo */}
        <Logo className="w-28 text-blue-500 mb-3" />

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-1">
            ახალი პაროლი
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            მომხმარებელი: {email}
          </p>
        </div>

        {/* Inputs */}
        <div className="w-full flex flex-col gap-3">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="შეიყვანეთ ახალი პაროლი"
            type="password"
            className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="გაიმეორეთ ახალი პაროლი"
            type="password"
            className="w-full px-4 py-3 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleReset}
          disabled={loading}
          type="button"
          className="w-full py-3 text-white font-semibold text-lg rounded-2xl shadow-lg bg-blue-500
                     hover:bg-blue-600 transform transition duration-200 hover:scale-105 mt-3 disabled:bg-slate-300"
        >
          {loading ? "მუშავდება..." : "პაროლის შეცვლა"}
        </button>
      </div>
    </div>
  );
}
