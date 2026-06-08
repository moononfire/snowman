import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const contact = await prisma.contact.findUnique({ where: { id } });
  if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(contact);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const contact = await prisma.contact.update({
    where: { id },
    data: {
      firstName: body.firstName,
      lastName: body.lastName || null,
      phone: body.phone,
      company: body.company || null,
      position: body.position || null,
      email: body.email || null,
      preCallNote: body.preCallNote || null,
      tags: body.tags || null,
    },
  });
  return NextResponse.json(contact);
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.contact.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
