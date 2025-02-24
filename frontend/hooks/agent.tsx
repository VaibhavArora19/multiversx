"use client";

import { ELIZA_ADDRESS } from "@/constants";
import { AGENT } from "@/constants/react-query";
import { useQuery } from "@tanstack/react-query";

export const useGetAgents = () => {
  const getAgents = async () => {
    const data = await fetch(`${ELIZA_ADDRESS}/agents`);

    const response = await data.json();

    return response;
  };

  return useQuery({
    queryKey: [AGENT.GET_AGENTS],
    queryFn: getAgents,
  });
};
