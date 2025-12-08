"use client";
import React, { useEffect, useState, useRef } from "react";

interface RulesModalProps {
  open: boolean;
  onClose: () => void;
  rules?: string | null
  isHeaderRules?: boolean;
}

export default function RulesModal({ 
  open, 
  onClose, 
  rules = null,
  isHeaderRules = false 
}: RulesModalProps) {
  const [show, setShow] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onClose]);

  // Handle slide-down animation
  useEffect(() => {
    if (open) {
      setShow(true);
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setShow(false), 300);
      document.body.style.overflow = "auto";
      return () => clearTimeout(timer);
    }
  }, [open]);

  if (!show) return null;

  return (
    <div>
      <div className="fixed text-black inset-0 pt-3.5 bg-black/50 flex items-center min-[992px]:items-start justify-center z-50">
        <div
          ref={modalRef}
          className={`
          bg-white mx-[7px] max-[768px]:w-[500px] max-h-screen [@media(min-width:992px)]:w-[83.3%] shadow-lg overflow-y-auto no-scrollbar [@media(min-width:992px)]:max-h-[96vh]
          transform transition-all duration-300 ease-out
          ${open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-2.5 h-[49px] md:py-0! bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white [@media(min-width:992px)]:h-[50px]">
            <h1 className="text-xl font-medium">Rules</h1>
            <button
              onClick={onClose}
              className="bg-transparent border-0 p-0 text-[35px] cursor-pointer [@media(min-width:992px)]:text-[33px]"
            >
              ×
            </button>
          </div>

          {/* Dynamic Content */}
          <div className="p-3 pt-9 md:pt-14 pb-9 md:pb-3 text-[15px] [@media(min-width:992px)]:text-[12px] [@media(min-width:992px)]:pt-[13px]">
            {rules ? (
              <div
                className="rules-content"
                dangerouslySetInnerHTML={{ __html: rules }}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No rules available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}