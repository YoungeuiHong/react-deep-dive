import { sql } from "@vercel/postgres";
import { SubscriptionInfo } from "@/app/pwa-todo/types";

export async function POST(req: Request) {
  const { subscription } = await req.json();
  const data = await sql`
        INSERT INTO pwa_subscription (subscription)
        VALUES (${subscription})
    `;
  return Response.json({ success: data.rowCount === 1 });
}

export async function GET() {
  const data = await sql<SubscriptionInfo>`
    SELECT *
    FROM pwa_subscription
    ORDER BY id
  `;
  return Response.json(data.rows);
}
