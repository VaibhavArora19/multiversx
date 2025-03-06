import { useQuery } from "@tanstack/react-query";

export const useGetWarps = () => {
  const getWarps = async () => {
    const data = await fetch(`/api/warps`);

    const response = await data.json();

    return response.data;
  };

  return useQuery({
    queryKey: ["warps"],
    queryFn: getWarps,
    refetchOnWindowFocus: false,
  });
};
