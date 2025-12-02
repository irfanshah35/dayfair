"use client";
import React, { useEffect, useState, useRef } from "react";
interface ExposureModalProps {
    open: boolean;
    onClose: () => void;
}

export default function ExposureModal({ open, onClose }: ExposureModalProps) {
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
    }, [open]);


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

    // if (!open) return null;
    return (
        <div>
            <div className="fixed text-black inset-0 pt-3.5 bg-black/50 flex items-center min-[992px]:items-start justify-center z-50">
                <div
                    ref={modalRef}
                    className={`
          bg-white mx-[7px] max-[768px]:w-[500px] max-h-screen [@media(min-width:992px)]:w-[71.5%] shadow-lg overflow-y-auto no-scrollbar
          transform transition-all duration-300 ease-out
          ${open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
        `}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-2.5 h-[49px] md:py-0! bg-[linear-gradient(180deg,#000000,#000000_42%,#000000)] text-white [@media(min-width:992px)]:h-[47px]">
                        <h1 className="text-xl font-medium relative top-[-1px]">My Market</h1>
                        <button
                            onClick={onClose}
                            className="bg-transparent border-0 p-0 text-[35px] cursor-pointer [@media(min-width:992px)]:text-[33px]"
                        >
                            ×
                        </button>
                    </div>


                    <div className="p-3">
                        <table className="w-full border-collapse border border-black/12.5">
                            <thead>
                                <tr>
                                    <th className="p-[2px] md:px-3 md:py-[7px] h-[40px] text-center text-black border border-black/12.5 text-sm md:text-base">
                                        Sport Name
                                    </th>
                                    <th className="p-[2px] md:px-3 md:py-[7px] h-[40px] text-center text-black border border-black/12.5 text-sm md:text-base">
                                        Event Name
                                    </th>
                                    <th className="p-[2px] md:px-3 md:py-[7px] h-[40px] text-center text-black border border-black/12.5 text-sm md:text-base">
                                        Market Name
                                    </th>
                                    <th className="p-[2px] md:px-3 md:py-[7px] h-[40px] text-center text-black border border-black/12.5 text-sm md:text-base">
                                        Trade
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <tr>
                                    <td
                                        colSpan={5}
                                        className="px-2 py-1.5 md:px-3 md:py-[7px] h-[40px] text-center border text-black border-black/12.5 bg-transparent text-xs md:text-base"
                                    >
                                        No real-time records found
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
