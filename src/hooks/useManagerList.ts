import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchManagerList = async () => {
  const accessToken = sessionStorage.getItem("accessToken");
  if (!accessToken) throw new Error("인증 토큰이 없습니다.");

  console.log(`📌 요청: /api/manager/members`);

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/manager/members`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  console.log("✅ 응답 데이터:", response.data);
  return response.data;
};

export const useManagerListQuery = () => {
  return useQuery({
    queryKey: ["manager_list"],
    queryFn: fetchManagerList,
  });
};