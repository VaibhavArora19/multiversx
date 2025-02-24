"use client";

import { ELIZA_ADDRESS } from "@/constants";
import { MESSAGE } from "@/constants/react-query";
import { useMutation } from "@tanstack/react-query";

export const useSendMessage = () => {
  const sendMessage = async (payload: { agentId: string; message: string }) => {
    try {
      const formData = new FormData();

      formData.append("text", payload.message);
      formData.append("userId", "user");
      formData.append("roomId", `default-room-${payload.agentId}`);

      const data = await fetch(`${ELIZA_ADDRESS}/${payload.agentId}/message`, {
        method: "POST",
        body: formData,
      });

      const response = await data.json();

      return response;
    } catch (error) {
      console.error("err: ", error);
    }
  };

  return useMutation({
    mutationKey: [MESSAGE.SEND_MESSAGE],
    mutationFn: sendMessage,
  });
};
