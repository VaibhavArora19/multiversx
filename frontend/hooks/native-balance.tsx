"use client";
import { useQuery } from "@tanstack/react-query";

export const useGetNativeBalance = () => {
  const getNativeBalance = async () => {
    const response = await fetch("/api/native");
    const data = await response.json();

    console.log("data: ", data);

    return data.data;
  };

  return useQuery({
    queryKey: ["nativeBalance"],
    queryFn: getNativeBalance,
    // refetchOnWindowFocus: false,
  });
};
