import { TRANSACTION } from "@/constants/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactions = () => {
  const transactions = async () => {
    const response = await fetch("/api/transactions");

    const data = await response.json();

    console.log("data: ", data);

    return data.data;
  };

  return useQuery({
    queryKey: [TRANSACTION.GET_TRANSACTIONS],
    queryFn: transactions,
    refetchOnWindowFocus: false,
  });
};
