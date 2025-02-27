import { BALANCE } from "@/constants/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetBalance = () => {
  const balance = async () => {
    const response = await fetch("/api/balance");

    const data = await response.json();

    console.log("data: ", data);

    return data.data as Array<any>;
  };

  return useQuery({
    queryKey: [BALANCE.GET_BALANCE],
    queryFn: balance,
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
