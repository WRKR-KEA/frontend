"use client";

import React, { useState, useEffect } from "react";
import { TicketList } from "@/components/Tickets/ticketList_ManagerHome";
import Skeleton from "@/components/Skeleton";
import SkeletonNet from "@/components/SkeletonNet";
import axios from "axios";

type Ticket = {
  ticketId: string;
  ticketSerialNumber: string;
  status: string;
  title: string;
  firstCategory: string;
  secondCategory: string;
  userNickname: string;
  managerNickname: string | "―";
  requestedDate: string;
  updatedDate: string;
};

const fetchManagerRequests = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/tickets/main/requests`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.result;
};

const fetchManagerPins = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("Access token is missing. Please log in again.");
  }
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/tickets/main/pins`;
  const response = await axios.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data.result;
};

export default function ManagerHomePage() {
  const maxTicketsToShow = 10;
  const [pinTickets, setPinTickets] = useState<Ticket[]>([]);
  const [requestTickets, setRequestTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [pinData, requestData] = await Promise.all([
          fetchManagerPins(),
          fetchManagerRequests(),
        ]);
        setPinTickets(pinData || []);
        setRequestTickets(requestData || []);
      } catch (err: any) {
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return <Skeleton width="100%" height="100%" />;
  }

  if (error) {
    return <SkeletonNet width="100%" height="100%" />;
  }

  return (
    <div className="pt-4 pl-6 pr-6 pb-4 flex flex-col space-y-4">
      <h2 className="text-lg font-semibold">고정된 티켓</h2>
      {isLoading ? (
        <Skeleton width="100%" height="40%" />
      ) : (
        <TicketList
          tickets={pinTickets}
          maxTicketsToShow={maxTicketsToShow}
          page={1}
          showUpdateDate={true}
          showRequestDate={false}
        />
      )}

      <h2 className="text-lg font-semibold">최근 티켓 요청 현황</h2>
      {isLoading ? (
        <Skeleton width="100%" height="40%" />
      ) : (
        <TicketList
          tickets={requestTickets}
          maxTicketsToShow={maxTicketsToShow}
          page={1}
          showUpdateDate={false}
          showRequestDate={true}
        />
      )}
    </div>
  );
}