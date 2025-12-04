"use client";

import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { CryptoService } from "../../../lib/crypto-service";
import { CONFIG } from "../../../lib/config";
import { useRouter } from "next/navigation";
import { fetchData } from "../../../lib/functions";

/* ---------------------- PASSWORD RULES ---------------------- */
const passwordPattern = /^(?=.?[A-Z])(?=.?[a-z])(?=.*?[0-9]).{8,}$/;

export default function ChangePassword() {
  const router = useRouter();

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
    mismatch: "",
  });

  /* ---------------------- HANDLE INPUT CHANGE ---------------------- */
  const handleInput = (e: any) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ---------------------- FORM VALIDATION ---------------------- */
  const validate = () => {
    let ok = true;
    const err = {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
      mismatch: "",
    };

    if (!form.currentPassword) {
      err.currentPassword = "Current Password is required.";
      ok = false;
    }

    if (!form.newPassword) {
      err.newPassword = "New Password is required.";
      ok = false;
    } else if (!passwordPattern.test(form.newPassword)) {
      err.newPassword = "Password must be 8+ chars with letters & numbers.";
      ok = false;
    }

    if (!form.confirmNewPassword) {
      err.confirmNewPassword = "Confirm Password is required.";
      ok = false;
    } else if (form.newPassword !== form.confirmNewPassword) {
      err.mismatch = "Passwords do not match.";
      ok = false;
    }

    if (
      form.currentPassword &&
      form.newPassword &&
      form.currentPassword === form.newPassword
    ) {
      err.newPassword = "New password cannot be same as old password.";
      err.currentPassword = "New password cannot be same as old password.";
      ok = false;
    }

    setErrors(err);
    return ok;
  };

  /* ---------------------- CHANGE PASSWORD API USING fetchData() ---------------------- */
  const changePassword = async () => {
    if (!validate()) return;

    setIsLoading(true);

    const payload = {
      newPassword: form.newPassword,
      oldPassword: form.currentPassword,
    };

    try {
      // Encrypt payload like your old project
      const encrypted = await CryptoService.encryptJSON1(payload);
      const finalPayload = {
        data: encrypted.iv + "###" + encrypted.payload,
      };

      // Use your global fetchData()
      await fetchData({
        url: CONFIG.changeUserPassword,
        payload: finalPayload,
        
      });
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /* ---------------------- UI ---------------------- */
  return (
    <div className="w-full min-h-screen flex flex-col items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]">
      <div className="bg-linear-to-b from-[#f4b501] to-[#f68700] w-full flex justify-center items-center p-[5px]">
        <a className="font-semibold uppercase relative top-px">
          Change Password
        </a>
      </div>

      <div className="w-full flex justify-center items-center mt-px md:mt-18 md:ml-6 mb-10 px-1.5">
        <div className="mt-4 w-full md:w-[323.75px] p-[22px] px-[17px]">
          {/* Current Password */}
          <div className="mt-2 relative">
            <input
              type={showCurrent ? "text" : "password"}
              name="currentPassword"
              value={form.currentPassword}
              onChange={handleInput}
              placeholder="Current Password"
              className="w-full px-6 outline-none h-[51.81px] py-3 rounded-sm text-[16px] font-semibold border border-white text-white placeholder-white"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(!showCurrent)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            >
              {showCurrent ? <FaEye /> : <FaEyeSlash />}
            </button>
            <p className="text-red-300 text-sm mt-1">
              {errors.currentPassword}
            </p>
          </div>

          {/* New Password */}
          <div className="mt-[18px] relative">
            <input
              type={showNew ? "text" : "password"}
              name="newPassword"
              value={form.newPassword}
              onChange={handleInput}
              placeholder="New Password"
              className="w-full px-6 outline-none py-3 h-[51.81px] rounded-sm text-[16px] font-semibold border border-white text-white placeholder-white"
            />
            <button
              type="button"
              onClick={() => setShowNew(!showNew)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            >
              {showNew ? <FaEye /> : <FaEyeSlash />}
            </button>
            <p className="text-red-300 text-sm mt-1">{errors.newPassword}</p>
          </div>

          {/* Confirm Password */}
          <div className="mt-[18px] relative">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmNewPassword"
              value={form.confirmNewPassword}
              onChange={handleInput}
              placeholder="Confirm Password"
              className="w-full px-6 outline-none py-3 h-[51.81px] rounded-sm text-[16px] font-semibold border border-white text-white placeholder-white"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
            >
              {showConfirm ? <FaEye /> : <FaEyeSlash />}
            </button>
            <p className="text-red-300 text-sm mt-1">
              {errors.confirmNewPassword}
            </p>
            <p className="text-red-300 text-sm">{errors.mismatch}</p>
          </div>

          {/* Submit */}
          <div className="mt-[18px]">
            <button
              type="button"
              onClick={changePassword}
              disabled={isLoading}
              className="bg-linear-to-b from-[#f4b501] to-[#f68700] w-full block my-2 px-3.5 py-2.5 rounded-sm text-[17px] font-semibold uppercase tracking-[1px] text-black"
            >
              {isLoading ? "Processing..." : "Change Password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
