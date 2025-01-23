"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts"; // ApexOptions 타입 가져오기

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const barChartOptions: ApexOptions = {
    chart: {
      id: "tickets-bar-chart",
      type: "bar",
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    },
    colors: ["#F56C6C"],
  };

  const barChartSeries = [
    {
      name: "발행된 티켓 수",
      data: [100, 200, 150, 300, 500, 400, 600, 800, 1000, 1200, 1500, 1800, 2000, 1700, 1500, 1300, 1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 150, 250, 350, 450],
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

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h4 className="text-lg text-gray-800 mb-4">월간 발행된 티켓 수</h4>
        <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
      </div>

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
