import { useMutation } from "@tanstack/react-query";

export type WarpPayload = {
  name: string;
  title: string;
  description: string;
  preview: string;
  contractAddress: string;
  abi: string;
};

export const useCreateWarp = () => {
  const createWarp = async (payload: WarpPayload) => {
    // console.log("abasi: ", payload.abi["enpoint"]);
    let obj = {};
    eval("obj =" + payload.abi);

    console.log("obj: ", obj);

    const data = await fetch("/api/create-warp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...payload,
        abi: JSON.stringify(obj),
      }),
    });

    const response = await data.json();

    console.log("response is: ", response);

    return response;
  };

  return useMutation({
    mutationKey: ["createWarp"],
    mutationFn: createWarp,
  });
};
