import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: listId } = await params;
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || (list.userId && list.userId !== session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

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
