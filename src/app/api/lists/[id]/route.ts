import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function getOwnedList(id: string, userId: string) {
  const list = await prisma.list.findUnique({ where: { id } });
  if (!list) return null;
  if (list.userId && list.userId !== userId) return null;
  return list;
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnedList(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      listContacts: {
        orderBy: { order: "asc" },
        include: { contact: true },
      },
    },
  });
  return NextResponse.json(list);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnedList(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const list = await prisma.list.update({
    where: { id },
    data: { name: body.name, description: body.description || null },
  });
  return NextResponse.json(list);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const owned = await getOwnedList(id, session.user.id);
  if (!owned) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.list.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
