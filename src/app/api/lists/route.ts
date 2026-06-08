import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const lists = await prisma.list.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { listContacts: true } },
      listContacts: {
        select: { status: true },
      },
    },
  });
  return NextResponse.json(lists);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const list = await prisma.list.create({
    data: {
      name: body.name,
      description: body.description || null,
    },
  });
  return NextResponse.json(list, { status: 201 });
}
