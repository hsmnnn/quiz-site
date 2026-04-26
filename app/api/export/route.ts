import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

function checkBasicAuth(req: NextRequest): boolean {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Basic ")) return false;

  const base64 = authHeader.slice(6);
  const decoded = Buffer.from(base64, "base64").toString("utf-8");
  const [user, password] = decoded.split(":");

  const expectedUser = process.env.CSV_EXPORT_USER ?? "admin";
  const expectedPassword = process.env.CSV_EXPORT_PASSWORD ?? "changeme";

  return user === expectedUser && password === expectedPassword;
}

export async function GET(req: NextRequest) {
  if (!checkBasicAuth(req)) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Quiz Admin"',
      },
    });
  }

  const { data, error } = await supabase
    .from("quiz_results")
    .select("id, score, total, answers, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  const header = "id,score,total,answers,created_at";
  const csvRows = rows.map((row) => {
    const answersJson = JSON.stringify(row.answers).replace(/"/g, '""');
    return `${row.id},${row.score},${row.total},"${answersJson}",${row.created_at}`;
  });

  const csv = [header, ...csvRows].join("\n");

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="quiz_results_${Date.now()}.csv"`,
    },
  });
}
