import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchManagerList = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await axios.get(
    `http://172.16.211.53:8080/api/admin/members?page=1&size=10&role=USER`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }

    
  );
  console.log(response)
  return response;
};

export const useManagerListQuery = () => {
  return useQuery({
    queryKey: ["manager_list"],
    queryFn: fetchManagerList,
    select: (result) => result?.data
  });
};
