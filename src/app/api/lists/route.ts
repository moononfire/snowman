import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const lists = await prisma.list.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { listContacts: true } },
      listContacts: { select: { status: true } },
    },
  });
  return NextResponse.json(lists);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const list = await prisma.list.create({
    data: {
      name: body.name,
      description: body.description || null,
      userId: session.user.id,
    },
  });
  return NextResponse.json(list, { status: 201 });
}
