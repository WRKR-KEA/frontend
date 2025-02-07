'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import {
  fetchManagerStatistics, getTicketStatusSummery,
  postManagerStatistics,
} from '@/services/manager';
import { string } from 'postcss-selector-parser'; // 커스터마이징된 CSS

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
export default function Dashboard() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
  .toString()
  .padStart(2, '0')}-01`;
  const [ticketStatusSummery, setTicketStatusSummery] = useState({
    total: 0,
    completed: 0,
    rejected: 0,
    inProgress: 0,
    date: '',
  });
  const [ticketCountByCategory, setTicketCountByCategory] = useState({});
  const fetchTicketCountByCategory = async (date: string) => {
    try {
      const data = await postManagerStatistics('MONTHLY', { date });
      setTicketCountByCategory(data);
      // console.log('카테고리별', ticketCountByCategory);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  useEffect(() => {
    fetchTicketCountByCategory(formattedDate);
  }, [formattedDate]);

  const [barChartData, setBarChardData] = useState({});

  const fetchBarChartData = async (date: string) => {
    try {
      const data = await fetchManagerStatistics({ date } , 'MONTHLY', '');
      setBarChardData(data);
      // console.log(data);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  useEffect(() => {
    fetchBarChartData(formattedDate);
  }, [formattedDate]);


  const fetchTicketData = async (date: string) => {
    try {
      const data = await getTicketStatusSummery('MONTHLY', date);
      console.log("티켓 데이타", data)
      setTicketStatusSummery(data);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  useEffect(() => {
    fetchTicketData(formattedDate);
  }, [formattedDate]);

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };


  const barChartOptions: ApexOptions = {
    chart: {
      id: 'tickets-bar-chart',
      type: 'bar',
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, i) => `Day ${i + 1}`),
    },
    colors: ['#F56C6C'],
  };

  const barChartSeries = [
    {
      name: '발행된 티켓 수',
      data: [100, 200, 150, 300, 500, 400, 600, 800, 1000, 1200, 1500, 1800, 2000, 1700, 1500, 1300, 1100, 1000, 900, 800, 700, 600, 500, 400, 300, 200, 100, 150, 250, 350, 450],
    },
  ];

  const donutChartOptions: ApexOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['햄버거', '도넛', '아이스크림', '캔디'],
    colors: ['#2D2D2D', '#AEDAFF', '#A7E9AF', '#FFB5B5'],
    legend: {
      position: 'right',
    },
  };

  const donutChartSeries = [52.1, 22.8, 13.9, 11.2];

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* 상단 바 */}
      <div className="flex items-center justify-between relative z-50">
        <h2 className="text-md font-semibold">월간 모니터링</h2>
        <div className="relative">
          {/* 달력 버튼 */}
          <button
            className="flex items-center text-sm font-medium text-[#6E61CA] px-4 py-2 rounded-md"
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
            <div className="absolute top-12 right-0 bg-white border shadow-lg rounded-md p-4">
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="yyyy-MM" // YYYY-MM 형식
                showMonthYearPicker // 월/연도 선택 모드
                inline // 인라인 달력 표시
              />
            </div>
          )}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div
          className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 전체 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">1,006</p>
        </div>
        <div
          className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 처리 완료된 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">700</p>
        </div>
        <div
          className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 반려된 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">98</p>
        </div>
        <div
          className="bg-gradient-to-b from-blue-100 to-blue-200 p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg text-gray-800 mb-2">일간 처리중 티켓</h3>
          <p className="text-2xl font-bold text-blue-600">108</p>
        </div>
      </div>

      {/* 바 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
        <h4 className="text-lg text-gray-800 mb-4">월간 발행된 티켓 수</h4>
        <Chart options={barChartOptions} series={barChartSeries} type="bar" height={300} />
      </div>

      {/* 도넛 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
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
