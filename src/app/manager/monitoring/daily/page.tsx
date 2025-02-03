"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // ApexOptions 타입 가져오기
import { Calendar } from "react-date-range";
import "react-date-range/dist/styles.css"; // 기본 스타일
import "react-date-range/dist/theme/default.css"; // 테마 스타일
import "./custom-datepicker.css"; // 커스터마이징된 CSS
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function DailyMonitoring() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date()); // 단일 날짜 상태

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    setIsCalendarOpen(false); // 날짜 선택 후 달력 닫기
  };

  const formattedDate = selectedDate.toLocaleDateString();

  const lineChartOptions: ApexOptions = {
    chart: {
      id: "tickets-line-chart",
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    },
    stroke: {
      curve: "smooth",
    },
    colors: ["#F56C6C"],
  };

  const lineChartSeries = [
    {
      name: "발행된 티켓 수",
      data: [100, 200, 150, 300, 500, 400, 600, 800, 1000, 1200, 1500, 1800, 2000, 1700, 1500, 1300, 1100, 1000, 900, 800, 700, 1600, 500, 400],
    },
  ];

  const donutChartOptions: ApexOptions = {
    chart: {
      type: "donut",
    },
    labels: ["햄버거", "도넛", "아이스크림", "캔디"],
    colors: ["#2D2D2D", "#AEDAFF", "#A7E9AF", "#FFB5B5"],
    legend: {
      position: "right",
    },
  };

  const donutChartSeries = [52.1, 22.8, 13.9, 11.2];

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* 상단 바 */}
      <div className="flex items-center justify-between z-1000">
        <h2 className="text-md font-semibold">일간 모니터링</h2>
        <div className="relative">
          {/* 달력 버튼 */}
          <button
            className="flex items-center text-sm font-medium text-[#6E61CA] hover:text-[#5A50A8] px-4 py-2 rounded-md"
            onClick={toggleCalendar}
          >
            <span>{formattedDate}</span>
            <img
              src="/calendarIcon.png"
              alt="Calendar Icon"
              className="w-5 h-5 ml-2"
            />
          </button>

          {/* 달력 */}
          {isCalendarOpen && (
            <div className="absolute top-12 right-0 z-50 bg-white border shadow-lg rounded-md">
              <Calendar
                date={selectedDate}
                onChange={handleDateChange}
                color="#6E61CA"
              />
            </div>
          )}

        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 전체 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">1,006</p>
        </div>
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 처리 완료된 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">700</p>
        </div>
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 반려된 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">98</p>
        </div>
        <div className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 처리중 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">108</p>
        </div>
      </div>

      {/* 라인 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg text-gray-800 mb-4">시간 당 발행된 티켓 수</h4>
        <Chart options={lineChartOptions} series={lineChartSeries} type="line" height={300} />
      </div>

      {/* 도넛 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg text-gray-800 mb-4">티켓 카테고리</h4>
          <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={300} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg text-gray-800 mb-4">티켓 카테고리</h4>
          <Chart options={donutChartOptions} series={donutChartSeries} type="donut" height={300} />
        </div>
      </div>
    </div>
  );
}
