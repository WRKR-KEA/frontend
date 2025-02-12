import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchCategoryList = async () => {
  const accessToken = sessionStorage.getItem("accessToken");

  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/admin/categories`,
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
