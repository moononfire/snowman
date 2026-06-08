import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: listId } = await params;
  const body = await req.json();
  const contactIds: string[] = body.contactIds;

  const existing = await prisma.listContact.findMany({
    where: { listId },
    select: { order: true },
    orderBy: { order: "desc" },
  });
  const maxOrder = existing[0]?.order ?? -1;

  await prisma.listContact.createMany({
    data: contactIds.map((contactId, i) => ({
      listId,
      contactId,
      order: maxOrder + 1 + i,
    })),
    skipDuplicates: true,
  });

  return NextResponse.json({ added: contactIds.length }, { status: 201 });
}
