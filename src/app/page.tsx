import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Phone, ListChecks, Users, CalendarClock, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { pl } from "date-fns/locale";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [lists, contactCount, followUps, totalCalled] = await Promise.all([
    prisma.list.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { listContacts: { select: { status: true } } },
    }),
    prisma.contact.count(),
    prisma.listContact.findMany({
      where: { followUpAt: { not: null, gte: new Date() }, status: "CALLBACK" },
      orderBy: { followUpAt: "asc" },
      take: 5,
      include: { contact: true, list: true },
    }),
    prisma.listContact.count({ where: { status: { not: "NOT_CALLED" } } }),
  ]);

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard icon={<Users className="h-5 w-5 text-blue-600" />} label="Kontakty" value={contactCount} />
        <StatCard icon={<ListChecks className="h-5 w-5 text-indigo-600" />} label="Listy" value={lists.length} />
        <StatCard icon={<Phone className="h-5 w-5 text-green-600" />} label="Przeprowadzone rozmowy" value={totalCalled} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-foreground">Ostatnie listy</h2>
            <Link href="/lists" className="text-sm text-blue-600 hover:underline">Wszystkie</Link>
          </div>
          <div className="space-y-2">
            {lists.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">
                Brak list.{" "}
                <Link href="/lists" className="text-blue-600 hover:underline">Utwórz pierwszą</Link>
              </p>
            )}
            {lists.map((list) => {
              const total = list.listContacts.length;
              const called = list.listContacts.filter((lc) => lc.status !== "NOT_CALLED").length;
              return (
                <Link
                  key={list.id}
                  href={`/lists/${list.id}`}
                  className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-blue-400 hover:shadow-sm transition-all group"
                >
                  <div>
                    <p className="font-medium text-sm text-foreground">{list.name}</p>
                    <p className="text-xs text-muted-foreground">{called}/{total} zadzwoniono</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-blue-500" />
                </Link>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-3">
            <CalendarClock className="h-4 w-4 text-orange-500" />
            <h2 className="font-semibold text-foreground">Nadchodzące oddzwonienia</h2>
          </div>
          <div className="space-y-2">
            {followUps.length === 0 && (
              <p className="text-sm text-muted-foreground py-4 text-center">Brak zaplanowanych oddzwonień</p>
            )}
            {followUps.map((fu) => (
              <Link
                key={fu.id}
                href={`/lists/${fu.listId}`}
                className="flex items-center justify-between p-3 bg-card rounded-lg border border-border hover:border-orange-300 transition-all"
              >
                <div>
                  <p className="font-medium text-sm text-foreground">
                    {fu.contact.firstName} {fu.contact.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{fu.list.name}</p>
                </div>
                <span className="text-xs font-medium text-orange-600">
                  {fu.followUpAt ? format(fu.followUpAt, "d MMM", { locale: pl }) : ""}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-card rounded-lg border border-border p-4 flex items-center gap-4">
      <div className="p-2 bg-muted rounded-lg">{icon}</div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
