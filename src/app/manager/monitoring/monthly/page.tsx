'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './custom-datepicker.css';
import {
  fetchManagerStatistics,
  getTicketStatusSummery,
  postManagerStatistics,
  postSecondCategoryManagerStatistics,
} from '@/services/manager';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });
const getCssVariable = (variable: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export default function Dashboard() {
  type ticketCountByCategory = {
    categoryName: string;
    categoryId: string;
    count: number;
  };
  type ticketCountByStatus = {
    targetDate: string;
    count: number;
  };
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const formattedDate = `${selectedDate.getFullYear()}-${(selectedDate.getMonth() + 1)
  .toString()
  .padStart(2, '0')}-01`;

  const [firstCategoryDonutChartSeries, setFirstCategoryDonutChartSeries] = useState<number[]>([]);
  const [firstCategoryDonutChartLabels, setFirstCategoryDonutChartLabels] = useState<string[]>([]);
  const [firstCategoryCategoryId, setFirstCategoryCategoryId] = useState<string[]>([]);
  const [firstCategoryDonutChartOptions, setFirstCategoryDonutChartOptions] = useState<ApexOptions>({
    chart: { type: 'donut' },
    labels: [],
    legend: { position: 'right' },
  });
  const [secondCategoryTicketCount, setSecondCategoryTicketCount] = useState<ticketCountByCategory[]>([]);
  const [selectedDonutChartCategoryId, setSelectedDonutChartCategoryId] = useState<string>();
  const [ticketCountByCategory, setTicketCountByCategory] = useState<ticketCountByCategory[]>([]);
  const [secondCategoryDonutChartSeries, setSecondCategoryDonutChartSeries] = useState<number[]>([1]);
  const [secondCategoryDonutChartLabels, setSecondCategoryDonutChartLabels] = useState<string[]>([]);
  const [secondCategoryCategoryId, setSecondCategoryCategoryId] = useState<string[]>([]);
  const [secondCategoryDonutChartOptions, setSecondCategoryDonutChartOptions] = useState<ApexOptions>({
    colors: ['#BDBDBD'],
    chart: { type: 'donut' },
    labels: ['init'],
    legend: {
      position: 'right',
      show: false,
    },
    tooltip: {
      enabled: false,
    },
    dataLabels: {
      enabled: false,
    },
  });
  const [ticketCardData, setTicketCardData] = useState
  < {
    accept: number,
    complete: number,
    reject: number,
    request: number,
    date: string,
  } > ({
    accept: 0,
    complete: 0,
    reject: 0,
    request: 0,
    date: '',
  });

  const [barChartData, setBarChartData] = useState<ticketCountByStatus[]>([]);
  const [barChartStatusFilter, setBarChartStatusFilter] = useState<string>();
  const [barChartOptions, setBarChartOptions] = useState<ApexOptions>({
    chart: {
      id: 'tickets-bar-chart',
      type: 'bar',
    },
    xaxis: {
      categories: [],
    },
  });
  const [barChartSeries, setBarChartSeries] = useState<{ name: string, data: number[] }>();

  /**
   * 1차 카테고리별 티겟 개수를 가져옵니다.
   * @param date 조회할 날짜
   * */
  const fetchTicketCountByCategory = async (date: string) => {
    try {
      console.log('date:', date);
      const res = await postManagerStatistics('MONTHLY', { date });
      setTicketCountByCategory(res.result.statisticData.firstCategoryTicketCount);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  /**
   * 1차 카테고리 도넛 차트의 라벨을 클릭하면 해당 카테고리의 2차 카테고리 도넛 차트 데이터를 가져옵니다.
   * @param categoryId 1차 카테고리 ID
   * @param date 조회할 날짜
   * */
  const asyncSecondCategoryDonutChartData = async (date: string, categoryId: string) => {
    try {
      const res = await postSecondCategoryManagerStatistics('MONTHLY', categoryId, { date });
      console.log('res:', res);
      setSecondCategoryTicketCount(res.result.statisticData.firstCategoryTicketCount);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  /**
   * 티켓 상태별 티켓 개수 데이터를 가져옵니다.
   * */
  const fetchTicketCardData = async (date: string) => {
    try {
      const data = await getTicketStatusSummery('MONTHLY', date);
      setTicketCardData(data.result);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  const toggleCalendar = () => {
    setIsCalendarOpen(!isCalendarOpen);
  };

  const handleDateChange = (date: Date | null) => {
    if (!date) return;
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const asyncBarChartData = async (date: string, ticketStatusFilter: string) => {
    try {
      const data = await fetchManagerStatistics(date, 'MONTHLY', ticketStatusFilter);
      setBarChartData(data.data.result.countList);
    } catch (error) {
      console.error('API 요청 실패:', error);
    }
  };

  const getBarChartColor = (status: string) => {
    switch (status) {
      case 'REQUEST':
        return getCssVariable('--request');
      case 'COMPLETE':
        return getCssVariable('--complete');
      case 'REJECT':
        return getCssVariable('--reject');
      case 'IN_PROGRESS':
        return getCssVariable('--in-progress');
      default:
        return getCssVariable('--request');
    }
  };

  useEffect(() => {
    if (ticketCountByCategory.length > 0) {
      const dynamicColors = ticketCountByCategory.map((_, index) => {
        const colors = [
          getCssVariable('--main-1'),
          getCssVariable('--main-2'),
          getCssVariable('--complete'),
          getCssVariable('--sub-1'),
          getCssVariable('--sub-2'),
        ];
        return colors[index % colors.length];
      });

      const updatedLabels = ticketCountByCategory.map((item) => item.categoryName);
      const updatedSeries = ticketCountByCategory.map((item) => item.count);
      const updatedCategoryIds = ticketCountByCategory.map((item) => item.categoryId);

      setFirstCategoryDonutChartSeries(updatedSeries);
      setFirstCategoryDonutChartLabels(updatedLabels);
      setFirstCategoryCategoryId(updatedCategoryIds);

      setFirstCategoryDonutChartOptions({
        chart: {
          type: 'donut',
          events: {
            dataPointSelection: async (event, chartContext, { dataPointIndex }) => {
              const selectedCategoryId = updatedCategoryIds[dataPointIndex];
              setSelectedDonutChartCategoryId(selectedCategoryId);
              console.log(`Selected categoryId: ${selectedCategoryId}`);
            },
          },
        },
        labels: updatedLabels,
        colors: dynamicColors,
        legend: {
          position: 'right',
          show: true,
        },
      });
    }
  }, [ticketCountByCategory]);

  useEffect(() => {
    if (selectedDonutChartCategoryId == undefined) return;
    asyncSecondCategoryDonutChartData(formattedDate, selectedDonutChartCategoryId);
  }, [selectedDonutChartCategoryId]);

  useEffect(() => {
    if (secondCategoryTicketCount.length > 0) {
      const dynamicColors = secondCategoryTicketCount.map((_, index) => {
        const colors = [
          getCssVariable('--main-1'),
          getCssVariable('--complete'),
          getCssVariable('--sub-1'),
          getCssVariable('--main-2'),
          getCssVariable('--sub-2'),
        ];
        return colors[index % colors.length];
      });

      const updatedLabels = secondCategoryTicketCount.map((item) => item.categoryName);
      const updatedSeries = secondCategoryTicketCount.map((item) => item.count);
      const updatedCategoryIds = secondCategoryTicketCount.map((item) => item.categoryId);
      console.log('updatedSeries:', updatedSeries);
      console.log('updatedLabels:', updatedLabels);
      setSecondCategoryDonutChartSeries(updatedSeries);
      setSecondCategoryDonutChartLabels(updatedLabels);
      setSecondCategoryCategoryId(updatedCategoryIds);

      setSecondCategoryDonutChartOptions({
        chart: {
          type: 'donut',
        },
        labels: updatedLabels,
        colors: dynamicColors,
        legend: {
          position: 'right',
          show: true,
        },
        tooltip: {
          enabled: true,
        },
        dataLabels: {
          enabled: true,
        },
      });
    }
  }, [secondCategoryTicketCount]);

  useEffect(() => {
    asyncBarChartData(formattedDate, barChartStatusFilter);
    fetchTicketCardData(formattedDate);
    fetchTicketCountByCategory(formattedDate);
  }, [formattedDate]);

  useEffect(() => {
    asyncBarChartData(formattedDate, barChartStatusFilter);
  }, [barChartStatusFilter]);

  useEffect(() => {

    const updatedBarChartSeries = barChartData.map((value) => value.count);
    setBarChartSeries({ name: '티켓 개수', data: updatedBarChartSeries });
    const dynamicCategories = Array.from({ length: barChartData.length }, (_, i) => `${i + 1}`);

    setBarChartOptions(prevOptions => ({
      ...prevOptions,
      xaxis: {
        ...prevOptions.xaxis,
        categories: dynamicCategories,
        title: {
          text: '일',
          offsetX: 500,
        },
      },
      yaxis:{
        title: {
          text: '티켓 개수',
          offsetY:0,
        },
      },
      colors: [getBarChartColor(barChartStatusFilter)],
    }));
  }, [barChartData]);

  return (
    <div className="flex flex-col gap-8 p-8">
      {/* 상단 바 */}
      <div className="flex items-center justify-between relative z-50">
        <h2 className="text-md font-semibold">월간 모니터링</h2>
        <div className="relative">
          {/* 달력 버튼 */}
          <button
            className="flex items-center text-sm font-medium text-main-2 hover:text-main-1 px-4 py-2 rounded-md"
            onClick={toggleCalendar}
          >
            <span>{selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월</span>
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
          onClick={() => setBarChartStatusFilter('REQUEST')}
          className="bg-gradient-to-b bg-request p-6 rounded-lg shadow-md text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg">
          <h3 className="text-lg text-gray-800 mb-2">월간 요청 티켓</h3>
          <p className="text-2xl font-bold text-gray-800">{ticketCardData.request}</p>
        </div>
        <div
          onClick={() => setBarChartStatusFilter('COMPLETE')}
          className="bg-gradient-to-b bg-complete p-6 rounded-lg shadow-md text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg">
          <h3 className="text-lg text-gray-800 mb-2">월간 처리 완료된 티켓</h3>
          <p className="text-2xl font-bold text-gray-800">{ticketCardData.complete}</p>
        </div>
        <div
          onClick={() => setBarChartStatusFilter('REJECT')}
          className="bg-gradient-to-b bg-reject p-6 rounded-lg shadow-md text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg">
          <h3 className="text-lg text-gray-800 mb-2">월간 반려된 티켓</h3>
          <p className="text-2xl font-bold text-gray-800">{ticketCardData.reject}</p>
        </div>
        <div
          onClick={() => setBarChartStatusFilter('IN_PROGRESS')}
          className="bg-gradient-to-b bg-inProgress p-6 rounded-lg shadow-md text-center cursor-pointer transform transition-transform hover:scale-105 hover:shadow-lg">
          <h3 className="text-lg text-gray-800 mb-2">월간 처리중 티켓</h3>
          <p className="text-2xl font-bold text-gray-800">{ticketCardData.accept}</p>
        </div>
      </div>


      {/* 바 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-md relative z-10">
        <h4 className="text-lg text-gray-800 mb-4">월간 발행된 티켓 수</h4>
        <Chart options={barChartOptions} series={[barChartSeries]} type="bar" height={300} />
      </div>

      {/* 도넛 차트 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg text-gray-800 mb-4">티켓 카테고리</h4>
          {firstCategoryDonutChartSeries.length > 0 ? (
            <Chart
              options={firstCategoryDonutChartOptions}
              series={firstCategoryDonutChartSeries}
              type="donut"
              height={350}
            />
          ) : (
            <p>Loading chart data...</p>
          )}
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg text-gray-800 mb-4">티켓 카테고리</h4>
          <Chart options={secondCategoryDonutChartOptions} series={secondCategoryDonutChartSeries}
                 type="donut" height={300} />
        </div>
      </div>
    </div>
  );
}
