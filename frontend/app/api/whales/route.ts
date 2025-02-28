import { whaleData } from "@/constants/data";

export async function GET() {
  const data = whaleData;

  return Response.json({
    status: 200,
    data: data,
  });
}
