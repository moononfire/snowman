import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type GoogleContact = {
  firstName?: string;
  first_name?: string;
  lastName?: string;
  last_name?: string;
  phone?: string;
  telefon?: string;
  company?: string;
  firma?: string;
  position?: string;
  stanowisko?: string;
  email?: string;
  note?: string;
  tags?: string;
};

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rows: GoogleContact[] = body.rows;

  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Brak danych" }, { status: 400 });
  }

  const data = rows
    .map((r) => ({
      firstName: r.firstName || r.first_name || "",
      lastName: r.lastName || r.last_name || null,
      phone: r.phone || r.telefon || "",
      company: r.company || r.firma || null,
      position: r.position || r.stanowisko || null,
      email: r.email || null,
      preCallNote: r.note || null,
      tags: r.tags || null,
      source: "GOOGLE_SCRAPE" as const,
    }))
    .filter((r) => r.firstName && r.phone);

  if (data.length === 0) {
    return NextResponse.json({ error: "Brak prawidłowych rekordów (wymagane: firstName, phone)" }, { status: 400 });
  }

  const created = await prisma.contact.createMany({ data, skipDuplicates: false });

  return NextResponse.json({ created: created.count }, { status: 201 });
}
