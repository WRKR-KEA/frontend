import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategoryList = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await axios.get(
    `http://172.16.211.53:8080/api/admin/categories`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
    
  );
  return response;
};

export const useCategoryListQuery = () => {
  return useQuery({
    queryKey: ["category_list"],
    queryFn: fetchCategoryList,
    select: (result) => result?.data
  });
};
