import { useQuery } from "@tanstack/react-query";

export const useGetWhales = () => {
  const getWhales = async () => {
    const response = await fetch("/api/whales");
    const data = await response.json();

    return data.data;
  };

  return useQuery({
    queryKey: ["whales"],
    queryFn: getWhales,
  });
};
