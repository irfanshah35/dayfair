"use client";
import { useToast } from "@/components/common/toast/toast-context";
import { useAuthStore } from "@/lib/store/authStore";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function MLoginPage() {
  const { loginUser } = useAuthStore();
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: any) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.username) {
      setError("Please enter username");
      return;
    }
    if (!formData.password) {
      setError("Please enter password");
      return;
    }

    setError("");

    await loginUser(
      formData.username,
      formData.password,
      showToast // pass toast fn
    );
  };
  return (
    <div
      id="app"
      className="min-h-screen text-black bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]"
    >
      <div className="login w-full h-screen bg-cover flex justify-center items-center flex-col flex-wrap relative">
        <div>
          <Link href="/" className="absolute top-5  right-5 text-white">
            <IoClose size={24} className="cursor-pointer" />
          </Link>
        </div>
        <div className="wrapper w-full ">
          <div className="container-fluid mt-0 mx-auto max-md:mb-[32.5%]">
            <div className="w-full flex justify-center">
              <div className="flex flex-col gap-1.5 max-[321]:w-[199.69px] w-[300px]">
                {/* Login Form */}
                <div className="bg-white rounded-lg px-4 pt-[26px] shadow-lg pb-[19px]">
                  {error && (
                    <div
                      role="alert"
                      className="bg-[#f8d7da] border border-[#f1aeb5] px-3 py-3 rounded relative mb-3"
                    >
                      <ul className="list-none list-inside text-[12px]">
                        <li className="pl-6">{error}</li>
                      </ul>
                    </div>
                  )}
                  <form
                    onSubmit={handleSubmit}
                    role="form"
                    autoComplete="off"
                    method="post"
                    className="space-y-5"
                  >
                    {/* Username */}
                    <div className="form-group">
                      <input
                        name="username"
                        placeholder="User Name"
                        type="text"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-[9px] py-[9.5px] border-b border-black outline-0 placeholder-black tracking-[0.4px] opacity-80"
                      />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                      <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-[9px] py-[9.5px] border-b border-black outline-0 placeholder-black tracking-[0.4px] opacity-80"
                      />
                    </div>

                    {/* Submit Button */}
                    <div className="form-group text-center">
                      <button
                        type="submit"
                        className="w-full bg-[linear-gradient(-180deg,#f4b501_0%,#f68700_100%)] py-[4.5px] border border-black text-black px-4 flex items-center justify-center gap-3"
                      >
                        Login
                        <span>
                          <svg
                            className="-rotate-90"
                            xmlns="http://www.w3.org/2000/svg"
                            width="16px"
                            height="16px"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9H19L12 16L5 9H10V3H14V9Z"></path>
                          </svg>
                        </span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* Android App Box */}
                <div className="bg-white rounded-lg px-4 pt-1 pb-1">
                  <div className="logoApplication flex items-center">
                    <Image
                      src="/login/androidblack.png"
                      className="w-[50px] h-[55px] relative top-[-3px]"
                      alt="Android App"
                    />
                    <div className="flex flex-col ml-4.5">
                      <span className="text-lg text-black   font-medium">
                        Download Our
                      </span>
                      <span className="text-[23px] text-black font-medium">
                        Android App
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
