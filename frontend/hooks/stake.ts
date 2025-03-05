import { useQuery } from "@tanstack/react-query";

export const useFetchStakeData = () => {
  const fetchStakeData = async () => {
    const data = await fetch("/api/stake", { cache: "no-store" });

    const response = await data.json();

    return response.data;
  };

  return useQuery({
    queryKey: ["stakeData"],
    queryFn: fetchStakeData,
    refetchInterval: false,
  });
};
