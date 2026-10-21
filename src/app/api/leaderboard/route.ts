import { getLeaderboard } from "@/lib/leaderboard";

export async function GET() {
  return Response.json(await getLeaderboard());
}
