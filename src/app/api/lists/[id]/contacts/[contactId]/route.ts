import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: listId, contactId } = await params;
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || (list.userId && list.userId !== session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const lc = await prisma.listContact.update({
    where: { listId_contactId: { listId, contactId } },
    data: {
      status: body.status,
      notes: body.notes ?? undefined,
      followUpAt: body.followUpAt ? new Date(body.followUpAt) : undefined,
      calledAt: body.calledAt ? new Date(body.calledAt) : new Date(),
    },
    include: { contact: true },
  });
  return NextResponse.json(lc);
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: listId, contactId } = await params;
  const list = await prisma.list.findUnique({ where: { id: listId } });
  if (!list || (list.userId && list.userId !== session.user.id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.listContact.delete({
    where: { listId_contactId: { listId, contactId } },
  });
  return new NextResponse(null, { status: 204 });
}
