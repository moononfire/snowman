import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const list = await prisma.list.findUnique({
    where: { id },
    include: {
      listContacts: {
        orderBy: { order: "asc" },
        include: { contact: true },
      },
    },
  });
  if (!list) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(list);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const list = await prisma.list.update({
    where: { id },
    data: { name: body.name, description: body.description || null },
  });
  return NextResponse.json(list);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.list.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
