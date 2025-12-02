"use client"
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ChangePassword() {

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <div>
      <div className="w-full min-h-screen flex flex-col items-center bg-[linear-gradient(180deg,#030a12,#444647_42%,#58595a)]">
        <div className='bg-linear-to-b from-[#f4b501] to-[#f68700] w-full flex justify-center items-center p-[5px]'>
          <a className="font-semibold uppercase relative top-[1px]">Change Password</a>
        </div>

        <div className="w-full flex justify-center items-center mt-[1px] md:mt-18 md:ml-6 mb-10 px-[6px] md-[px-0]">
          <div className="mt-4 w-full md:w-[323.75px] p-[22px] px-[17px]">

            <div className="mt-2">
              {/* <input type="text" className="w-0 h-0 opacity-0 absolute top-0 right-0" /> */}

              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
                  placeholder="Current Password"
                  className="w-full px-6 outline-none h-[51.81px] py-3 rounded-[4px] text-[16px] font-semibold border border-white focus:ring-2 focus:ring-blue-300 text-white placeholder-white"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                >
                  {showCurrent ? <FaEye className='w-[18px]' /> : <FaEyeSlash className='w-[18px]'/>}
                </button>
              </div>
            </div>
            <div className="mt-[18px] relative">
              <input
                type={showNew ? "text" : "password"}
                name="newPassword"
                placeholder="New Password"
                className="w-full px-6 outline-none py-3 h-[51.81px] rounded-[4px] text-[16px] font-semibold border border-white focus:ring-2 focus:ring-blue-300 text-white placeholder-white"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white "
              >
                {showNew ? <FaEye className='w-[18px]' /> : <FaEyeSlash className='w-[18px]'/>}
              </button>
            </div>

            <div className="mt-[18px] relative">
              <input
                type={showConfirm ? "text" : "password"}
                name="confirmNewPassword"
                placeholder="Confirm Password"
                className="w-full px-6 outline-none py-3 h-[51.81px] rounded-[4px] text-[16px] font-semibold border border-white focus:ring-2 focus:ring-blue-300 text-white placeholder-white"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-[18px] text-white"
              >
                {showConfirm ? <FaEye className='w-[18px]' /> : <FaEyeSlash className='w-[18px]'/>}
              </button>
            </div>

            <div className="mt-[18px]">
              <button
                type="submit"
                className="bg-linear-to-b from-[#f4b501] to-[#f68700] w-full block my-2 px-[14px] py-[10px] rounded-[4px] text-[17px] font-semibold uppercase tracking-[1px] text-black
                "
              >
                Change Password
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  )
}
