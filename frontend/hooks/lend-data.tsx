import { useQuery } from "@tanstack/react-query";

export const useGetLendingData = () => {
  const getLendingData = async () => {
    const response = await fetch("/api/lend");

    const data = await response.json();

    return data.data;
  };

  return useQuery({
    queryKey: ["lendingData"],
    queryFn: getLendingData,
    refetchOnWindowFocus: false,
  });
};
