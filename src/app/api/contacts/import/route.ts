import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows: Record<string, string>[] = body.rows;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Brak danych" }, { status: 400 });
  }

  const created = await prisma.contact.createMany({
    data: rows.map((r) => ({
      firstName: r.firstName || r.first_name || r.imie || r.imię || "",
      lastName: r.lastName || r.last_name || r.nazwisko || null,
      phone: r.phone || r.telefon || r.tel || "",
      company: r.company || r.firma || null,
      position: r.position || r.stanowisko || null,
      email: r.email || r.mail || null,
      preCallNote: r.preCallNote || r.note || r.notatka || null,
      tags: r.tags || r.tagi || null,
      source: "CSV_IMPORT" as const,
    })).filter((r) => r.firstName && r.phone),
    skipDuplicates: false,
  });

  return NextResponse.json({ created: created.count }, { status: 201 });
}
