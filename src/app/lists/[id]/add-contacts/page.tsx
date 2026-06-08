"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactsBrowser } from "@/components/contacts-browser";

type ListData = {
  id: string;
  name: string;
  description: string | null;
  listContacts: { contactId: string }[];
};

export default function AddContactsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [list, setList] = useState<ListData | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/lists/${id}`)
      .then((r) => r.json())
      .then(setList);
  }, [id]);

  async function addToList() {
    if (!selected.size) return;
    setSaving(true);
    await fetch(`/api/lists/${id}/contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contactIds: [...selected] }),
    });
    setSaving(false);
    router.push(`/lists/${id}`);
  }

  if (!list) return <div className="p-8 text-muted-foreground">Ładowanie...</div>;

  const existingIds = list.listContacts.map((lc) => lc.contactId);

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <Link
        href={`/lists/${id}`}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        <ArrowLeft className="h-4 w-4" />
        {list.name}
      </Link>

      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dodaj kontakty do listy</h1>
          <p className="text-sm text-muted-foreground mt-1">
            <span className="font-medium text-foreground">{list.name}</span>
            {existingIds.length > 0 && (
              <span className="ml-2 text-muted-foreground">
                · {existingIds.length} kontaktów już na liście (ukryte)
              </span>
            )}
          </p>
        </div>
        <Button onClick={addToList} disabled={!selected.size || saving}>
          {saving
            ? "Dodawanie..."
            : selected.size > 0
            ? `Dodaj ${selected.size} kontaktów`
            : "Dodaj kontakty"}
        </Button>
      </div>

      <ContactsBrowser
        selectable
        excludeIds={existingIds}
        selected={selected}
        onSelectionChange={setSelected}
      />

      {selected.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border border-border shadow-lg rounded-full px-6 py-3 flex items-center gap-4 z-40">
          <span className="text-sm font-medium text-foreground">
            {selected.size} zaznaczonych
          </span>
          <Button size="sm" onClick={addToList} disabled={saving}>
            {saving ? "Dodawanie..." : "Dodaj do listy"}
          </Button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Wyczyść
          </button>
        </div>
      )}
    </div>
  );
}
