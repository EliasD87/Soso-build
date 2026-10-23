import { getLeaderboard, parseSource } from "@/lib/leaderboard";

export async function GET(request: Request) {
  const source = parseSource(new URL(request.url).searchParams.get("source")) ?? undefined;
  return Response.json(await getLeaderboard(source));
}
