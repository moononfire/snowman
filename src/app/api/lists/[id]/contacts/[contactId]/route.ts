import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; contactId: string }> }
) {
  const { id: listId, contactId } = await params;
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
  const { id: listId, contactId } = await params;
  await prisma.listContact.delete({
    where: { listId_contactId: { listId, contactId } },
  });
  return new NextResponse(null, { status: 204 });
}
