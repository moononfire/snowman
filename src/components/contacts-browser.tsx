"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CONTACT_SOURCE_LABELS, CONTACT_SOURCE_COLORS } from "@/lib/types";

type ContactSource = "MANUAL" | "CSV_IMPORT" | "GOOGLE_SCRAPE";

export type Contact = {
  id: string;
  firstName: string;
  lastName: string | null;
  phone: string;
  company: string | null;
  position: string | null;
  email: string | null;
  preCallNote: string | null;
  tags: string | null;
  source: ContactSource;
};

const SOURCE_FILTERS = [
  { value: "", label: "Wszystkie źródła" },
  { value: "MANUAL", label: "Ręczne" },
  { value: "CSV_IMPORT", label: "CSV" },
  { value: "GOOGLE_SCRAPE", label: "Google" },
] as const;

const COMPANY_FILTERS = [
  { value: "", label: "Wszystkie" },
  { value: "yes", label: "Z firmą" },
  { value: "no", label: "Bez firmy" },
] as const;

const EMAIL_FILTERS = [
  { value: "", label: "Wszystkie" },
  { value: "yes", label: "Z emailem" },
  { value: "no", label: "Bez emaila" },
] as const;

interface ContactsBrowserProps {
  selectable?: boolean;
  excludeIds?: string[];
  selected: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  rowActions?: (contact: Contact) => ReactNode;
  refreshKey?: number;
}

export function ContactsBrowser({
  selectable = false,
  excludeIds = [],
  selected,
  onSelectionChange,
  rowActions,
  refreshKey = 0,
}: ContactsBrowserProps) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
  const [tagsFilter, setTagsFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");
  const [loading, setLoading] = useState(true);

  const excludeIdsKey = excludeIds.join(",");

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (sourceFilter) params.set("source", sourceFilter);
    if (tagsFilter) params.set("tags", tagsFilter);
    if (companyFilter) params.set("hasCompany", companyFilter);
    if (emailFilter) params.set("hasEmail", emailFilter);
    const res = await fetch(`/api/contacts?${params}`);
    if (res.ok) {
      const all: Contact[] = await res.json();
      const excludeSet = new Set(excludeIdsKey ? excludeIdsKey.split(",") : []);
      setContacts(excludeSet.size ? all.filter((c) => !excludeSet.has(c.id)) : all);
    }
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, sourceFilter, tagsFilter, companyFilter, emailFilter, excludeIdsKey, refreshKey]);

  useEffect(() => {
    const t = setTimeout(fetchContacts, 200);
    return () => clearTimeout(t);
  }, [fetchContacts]);

  function toggleContact(id: string) {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    onSelectionChange(next);
  }

  function toggleAll() {
    const allIds = contacts.map((c) => c.id);
    const allSelected = allIds.every((id) => selected.has(id));
    const next = new Set(selected);
    if (allSelected) {
      allIds.forEach((id) => next.delete(id));
    } else {
      allIds.forEach((id) => next.add(id));
    }
    onSelectionChange(next);
  }

  const allSelected = contacts.length > 0 && contacts.every((c) => selected.has(c.id));
  const someSelected = !allSelected && contacts.some((c) => selected.has(c.id));
  const hasFilters = search || sourceFilter || tagsFilter || companyFilter || emailFilter;
  const colCount = 5 + (selectable ? 1 : 0) + (rowActions ? 1 : 0);

  return (
    <div>
      <div className="space-y-3 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Szukaj po nazwie, telefonie, firmie, tagach..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {SOURCE_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setSourceFilter(f.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                sourceFilter === f.value
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
          <Input
            className="h-8 text-sm w-44"
            placeholder="Filtruj po tagach..."
            value={tagsFilter}
            onChange={(e) => setTagsFilter(e.target.value)}
          />

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Firma:</span>
            {COMPANY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setCompanyFilter(f.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  companyFilter === f.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-muted-foreground">Email:</span>
            {EMAIL_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setEmailFilter(f.value)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  emailFilter === f.value
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted border-b border-border">
            <tr>
              {selectable && (
                <th className="px-4 py-3 w-10">
                  <button
                    onClick={toggleAll}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mx-auto ${
                      allSelected
                        ? "bg-blue-600 border-blue-600"
                        : someSelected
                        ? "bg-blue-400 border-blue-400"
                        : "border-border hover:border-blue-400"
                    }`}
                  >
                    {(allSelected || someSelected) && <Check className="h-3 w-3 text-white" />}
                  </button>
                </th>
              )}
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Imię i nazwisko</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Telefon</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Firma</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Źródło</th>
              {rowActions && <th className="px-4 py-3 w-20" />}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading && (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-muted-foreground">
                  Ładowanie...
                </td>
              </tr>
            )}
            {!loading && contacts.length === 0 && (
              <tr>
                <td colSpan={colCount} className="px-4 py-8 text-center text-muted-foreground">
                  {hasFilters ? "Brak wyników dla wybranych filtrów" : "Brak kontaktów."}
                </td>
              </tr>
            )}
            {contacts.map((c) => (
              <tr
                key={c.id}
                className={`hover:bg-muted/50 ${selectable ? "cursor-pointer select-none" : ""} ${
                  selectable && selected.has(c.id) ? "bg-blue-500/5" : ""
                }`}
                onClick={selectable ? () => toggleContact(c.id) : undefined}
              >
                {selectable && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => toggleContact(c.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors mx-auto ${
                        selected.has(c.id) ? "bg-blue-600 border-blue-600" : "border-border"
                      }`}
                    >
                      {selected.has(c.id) && <Check className="h-3 w-3 text-white" />}
                    </button>
                  </td>
                )}
                <td className="px-4 py-3 font-medium text-foreground">
                  <span>
                    {c.firstName} {c.lastName}
                  </span>
                  {c.position && (
                    <span className="ml-1 text-muted-foreground font-normal">· {c.position}</span>
                  )}
                  {c.tags && (
                    <span className="ml-2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {c.tags}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-foreground">{c.phone}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.company ?? "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.email ?? "—"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      CONTACT_SOURCE_COLORS[c.source]
                    }`}
                  >
                    {CONTACT_SOURCE_LABELS[c.source]}
                  </span>
                </td>
                {rowActions && (
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-1 justify-end">
                      {rowActions(c)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
