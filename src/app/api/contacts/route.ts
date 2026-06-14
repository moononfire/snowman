import { NextRequest, NextResponse } from "next/server";
import { ContactSource, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const VALID_SOURCES = new Set<string>(["MANUAL", "CSV_IMPORT", "GOOGLE_SCRAPE"]);

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q") ?? "";
  const sourceParam = req.nextUrl.searchParams.get("source") ?? "";
  const tagsParam = req.nextUrl.searchParams.get("tags") ?? "";
  const hasCompanyParam = req.nextUrl.searchParams.get("hasCompany") ?? "";
  const hasEmailParam = req.nextUrl.searchParams.get("hasEmail") ?? "";
  const calledParam = req.nextUrl.searchParams.get("called") ?? "";
  const source = VALID_SOURCES.has(sourceParam) ? (sourceParam as ContactSource) : null;

  const where: Prisma.ContactWhereInput = {};
  if (source) where.source = source;
  if (tagsParam) where.tags = { contains: tagsParam, mode: "insensitive" };
  if (hasCompanyParam === "yes") where.company = { not: null };
  if (hasCompanyParam === "no") where.company = null;
  if (hasEmailParam === "yes") where.email = { not: null };
  if (hasEmailParam === "no") where.email = null;
  if (calledParam === "yes") where.listContacts = { some: { status: { not: "NOT_CALLED" } } };
  if (calledParam === "no") where.listContacts = { none: { status: { not: "NOT_CALLED" } } };
  if (search) {
    where.OR = [
      { firstName: { contains: search, mode: "insensitive" } },
      { lastName: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { company: { contains: search, mode: "insensitive" } },
      { tags: { contains: search, mode: "insensitive" } },
    ];
  }

  try {
    const contacts = await prisma.contact.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        listContacts: {
          where: { status: { not: "NOT_CALLED" } },
          orderBy: { calledAt: "desc" },
          take: 1,
          select: { status: true, notes: true, calledAt: true },
        },
        _count: { select: { listContacts: true } },
      },
    });
    return NextResponse.json(contacts);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const contact = await prisma.contact.create({
    data: {
      firstName: body.firstName,
      lastName: body.lastName || null,
      phone: body.phone,
      company: body.company || null,
      position: body.position || null,
      email: body.email || null,
      preCallNote: body.preCallNote || null,
      postCallNote: body.postCallNote || null,
      tags: body.tags || null,
      source: "MANUAL",
    },
  });
  return NextResponse.json(contact, { status: 201 });
}
