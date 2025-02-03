import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API_KEY = process.env.REACT_APP_API_KEY_EN_SANG;
const PARAMS = process.env.REACT_APP_PARAMS_DEFAULT;

const fetchBestCamping = () => {
  return axios.get(`basedList?serviceKey=${API_KEY}&${PARAMS}&numOfRows=500`);
};

export const useBestCampListQuery = () => {
  return useQuery({
    queryKey: ["camping_detail"],
    queryFn: fetchBestCamping,
    select: (result) => result?.data.response?.body.items.item,
  });
};