import { NextResponse } from "next/server";
import { checkAuthDatabaseHealth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbOk = await checkAuthDatabaseHealth();
  const payload = {
    status: dbOk ? "ok" : "degraded",
    database: dbOk ? "connected" : "unreachable",
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(payload, {
    status: dbOk ? 200 : 503,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
