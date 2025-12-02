"use client";

import React, { useState, useEffect, useRef } from "react";
import {  FaCalendarAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { FaRegCalendarDays } from "react-icons/fa6";

const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const YEAR_SELECT_CUTOFF = 2025;

const normalize = (d?: Date | null): Date | null => {
  if (!d) return null;
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

const monthIndex = (y: number, m: number) => y * 12 + m;

const CustomCalendar = ({
  selected,
  onChange,
  startDate,
  endDate,
  selectsEnd = false,
  minDate,
  maxDate = new Date(),
  placeholderText = "Select date",
  dateFormat = "yyyy-MM-dd",
  isClearable = true,
  readOnly = true,
  autoComplete = "off",
}: any) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(selected || null);
  const [currentMonth, setCurrentMonth] = useState<number>((selected || new Date()).getMonth());
  const [currentYear, setCurrentYear] = useState<number>((selected || new Date()).getFullYear());
  const [calendarOpen, setCalendarOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"date" | "year">("date");
  const calendarRef = useRef<HTMLDivElement>(null);

  const _min = normalize(minDate);
  const _max = normalize(maxDate) || normalize(new Date())!;
  const today = normalize(new Date())!;

  useEffect(() => {
    if (selected) {
      const s = normalize(selected)!;
      const clamped = _min && s < _min ? _min : _max && s > _max ? _max : s;
      setSelectedDate(clamped);
      setCurrentMonth(clamped.getMonth());
      setCurrentYear(clamped.getFullYear());
    }
  }, [selected]);

  const toggleCalendar = () => {
    setCalendarOpen((v) => !v);
    setActiveTab("date");
  };

  const handleOutsideClick = (e: MouseEvent) => {
    if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
      setCalendarOpen(false);
      setActiveTab("date");
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const canGoPrevMonth = () => {
    if (!_min) return true;
    const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
    return monthIndex(prevY, prevM) >= monthIndex(_min.getFullYear(), _min.getMonth());
  };

  const canGoNextMonth = () => {
    if (!_max) return true;
    const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
    return monthIndex(nextY, nextM) <= monthIndex(_max.getFullYear(), _max.getMonth());
  };

  const isDateDisabled = (y: number, m: number, d: number) => {
    const dt = normalize(new Date(y, m, d))!;
    if (_min && dt < _min) return true;
    if (_max && dt > _max) return true;
    if (selectsEnd && startDate && dt < normalize(startDate)!) return true;
    return false;
  };

  const handlePrevMonth = () => {
    if (!canGoPrevMonth()) return;
    if (currentMonth === 0) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(11);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (!canGoNextMonth()) return;
    if (currentMonth === 11) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(0);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handlePrevYearRange = () => {
    const target = currentYear - 25;
    const minY = _min ? _min.getFullYear() : -Infinity;
    setCurrentYear(Math.max(target, minY));
  };

  const handleNextYearRange = () => {
    const target = currentYear + 25;
    setCurrentYear(target);
  };

  const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0'); // Add leading zero if needed
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Add leading zero if needed
  const year = date.getFullYear();
  return `${day}-${month}-${year}`; // Format as dd-MM-yyyy
};


  const handleDateSelect = (day: number, isOtherMonth: boolean, disabled: boolean) => {
    if (disabled || isOtherMonth) return;
    const date = new Date(currentYear, currentMonth, day);
    const n = normalize(date)!;

    if (selectsEnd && startDate) {
      if (n >= normalize(startDate)!) {
        setSelectedDate(n);
        onChange(n);
        setCalendarOpen(false);
      }
    } else {
      setSelectedDate(n);
      onChange(n);
      setCalendarOpen(false);
    }
  };

  const handleYearSelect = (year: number) => {
    if (year > YEAR_SELECT_CUTOFF) return;
    if (_min && year < _min.getFullYear()) return;
    setCurrentYear(year);

    if (_min && year === _min.getFullYear() && currentMonth < _min.getMonth()) {
      setCurrentMonth(_min.getMonth());
    }
    setActiveTab("date");
  };

  const handleToday = () => {
    const t = today;
    if (_min && t < _min) return;
    setCurrentYear(t.getFullYear());
    setCurrentMonth(t.getMonth());
    setSelectedDate(t);
    onChange(t);
    setCalendarOpen(false);
  };

  const handleClear = () => {
    setSelectedDate(null);
    onChange(null);
  };

  const getDaysInMonth = (year: number, month: number): number =>
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number): number =>
    (new Date(year, month, 1).getDay() + 6) % 7;

  const getCalendarDays = (): any[] => {
    const days: any[] = [];
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    const startDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthIndex = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevMonthDays = getDaysInMonth(prevMonthYear, prevMonthIndex);
    for (let i = 0; i < startDay; i++) {
      const day = prevMonthDays - startDay + i + 1;
      days.push({
        day,
        isCurrentMonth: false,
        isOtherMonth: true,
        disabled: isDateDisabled(prevMonthYear, prevMonthIndex, day),
      });
    }

    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        isOtherMonth: false,
        disabled: isDateDisabled(currentYear, currentMonth, i),
      });
    }

    const remaining = 42 - days.length;
    const nextMonthYear = currentMonth === 11 ? currentYear + 1 : currentYear;
    const nextMonthIndex = currentMonth === 11 ? 0 : currentMonth + 1;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        isOtherMonth: true,
        disabled: isDateDisabled(nextMonthYear, nextMonthIndex, i),
      });
    }
    return days;
  };

  const generateYears = () => {
    const minY = _min ? _min.getFullYear() : 1900;
    const blockStart = Math.max(minY, currentYear - ((currentYear - minY) % 25));
    const start = blockStart;
    const end = start + 24;

    const years: number[] = [];
    for (let y = start; y <= end; y++) years.push(y);
    return years;
  };

  const calendarDays = getCalendarDays();
  const years = generateYears();

  const renderDateView = () => (
    <>
      <div className="flex items-center justify-between mb-2 px-1">
        <button
  onClick={handlePrevMonth}
  disabled={!canGoPrevMonth()}
  className={`w-6 h-6 flex items-center justify-center rounded pl-3 ${!canGoPrevMonth() ? "opacity-40 cursor-not-allowed" : "text-black cursor-pointer"}`}
  aria-label="Previous month"
  type="button"
>
  <FaChevronLeft className="text-black text-[22px]" />
</button>
        <div className="text-[16px] font-medium text-gray-800">
          <span className="cursor-pointer" onClick={() => setActiveTab("date")}>
            {months[currentMonth]} &nbsp;
          </span>
          <span onClick={() => setActiveTab("year")} className="cursor-pointer">
            {currentYear}
          </span>
        </div>

  

<button
  onClick={handleNextMonth}
  disabled={!canGoNextMonth()}
  className={`w-6 h-6 flex items-center justify-center rounded pr-3 ${!canGoNextMonth() ? "opacity-40 cursor-not-allowed" : "text-black cursor-pointer"}`}
  aria-label="Next month"
  type="button"
>
  <FaChevronRight className="text-black text-[22px]" />
</button>

      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day, index) => (
          <div key={day} className="h-6 flex items-center justify-center text-[13px] p-[4px] font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((dayObj, index) => {
          const isSelected = !!selectedDate && dayObj.isCurrentMonth && selectedDate.getDate() === dayObj.day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
          const dayOfWeek = index % 7;
        const baseText = dayObj.isCurrentMonth
  ? dayOfWeek === 6 // Saturday
    ? "text-gray-800 hover:bg-gray-100" // Add same hover effect for Saturday
    : dayOfWeek === 5 // Friday
    ? "text-gray-800 hover:bg-gray-100"
    : "text-gray-800 hover:bg-gray-100"
  : "text-gray-400 cursor-not-allowed";


          const disabledClasses = dayObj.disabled ? "opacity-40 cursor-not-allowed hover:bg-transparent" : "";

          return (
            <button
              key={index}
              type="button"
              onClick={() => handleDateSelect(dayObj.day, dayObj.isOtherMonth, dayObj.disabled)}
              disabled={!dayObj.isCurrentMonth || dayObj.disabled}
              className={`h-6 flex items-center justify-center text-xs rounded px-1 ${baseText} ${disabledClasses} ${isSelected ? "border-blue-400! border" : ""} ${dayObj.isCurrentMonth && today.getDate() === dayObj.day && today.getMonth() === currentMonth && today.getFullYear() === currentYear ? "underline" : ""}`}
            >
              {dayObj.day}
            </button>
          );
        })}
      </div>
    </>
  );

  const renderYearView = () => (
    <>
      <div className="flex items-center justify-between px-1">
        <button
          onClick={handlePrevYearRange}
          disabled={currentYear <= YEAR_SELECT_CUTOFF}
          className={`w-6 h-6 flex items-center justify-center rounded pl-3 ${currentYear <= YEAR_SELECT_CUTOFF ? "opacity-40 cursor-not-allowed" : "text-gray-600"}`}
          aria-label="Previous year range"
          type="button"
        >
          <img src="/assets/account-statement/arro.svg" alt="" className="w-[16px] h-[22px]" />
        </button>

        <div className="text-[16px] font-medium text-gray-800">
          <span className="cursor-pointer" onClick={() => setActiveTab("date")}>
            {months[currentMonth]} &nbsp;
          </span>
          <span onClick={() => setActiveTab("year")} className="cursor-pointer">
            {currentYear}
          </span>
        </div>

        <button
          onClick={handleNextYearRange}
          disabled={currentYear >= YEAR_SELECT_CUTOFF}
          className={`w-6 h-6 flex items-center justify-center rounded pr-3 ${currentYear >= YEAR_SELECT_CUTOFF ? "opacity-40 cursor-not-allowed" : "text-gray-600"}`}
          aria-label="Next year range"
          type="button"
        >
          <img src="/assets/account-statement/arro.svg" alt="" className="w-[16px] h-[22px] rotate-180" />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-1 p-1">
        {years.map((year) => {
          const disabled = year > YEAR_SELECT_CUTOFF || (_min ? year < _min.getFullYear() : false);
          return (
            <button
              key={year}
              type="button"
              onClick={() => handleYearSelect(year)}
              disabled={disabled}
              className={`h-6 flex items-center justify-center text-[14px] text-black p-[4px] rounded ${disabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-100"} ${year === currentYear ? "bg-blue-400 text-black" : "text-[#ccc]"}`}
            >
              {year}
            </button>
          );
        })}
      </div>
    </>
  );

  return (
    <div className="md:w-full lg:w-full md:w-3/12 w-full relative">
      <div className="flex items-center c bg-[#e5e7ea] rounded-[4px] border-[#c8ced2] overflow-hidden max-w-[733.79px]">
        <input
          readOnly={readOnly}
          autoComplete={autoComplete}
          onClick={toggleCalendar}
          value={selectedDate ? formatDate(selectedDate) : ""}
          placeholder={placeholderText}
          className="form-control my-date-picker h-[38px] text-[16px]! text-[#555] py-[6px]  pl-[5px]! w-full bg-white! placeholder:text-[#5c6873] border-2 border-gray-300! rounded-tr-none! rounded-br-none! focus:outline-none rounded-none"
          name="datepicker"
        />

        <button
          type="button"
          onClick={toggleCalendar}
          className="btnpicker btnpickerenabled h-[38px] min-w-[40px]  bg-[#c8ced2] flex items-center justify-center hover:bg-[#b8bec2] transition ml-[-2px]"
        >
  <FaRegCalendarDays  className="text-black text-[18px] mb-[1px]" />
        </button>
      </div>

      {calendarOpen && (
        <div ref={calendarRef} className="absolute z-50 mt-3 w-64 bg-white border pt-[1px] border-gray-300 shadow-lg rounded-md max-w-[252px]! min-h-[232px]!">
          {activeTab === "date" ? renderDateView() : renderYearView()}
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
