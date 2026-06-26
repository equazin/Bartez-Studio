"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminSpinner } from "../../../../../../components/admin/AdminUI";
import { QuoteEditor, type QuoteEditorValue } from "../../QuoteEditor";

export default function EditQuotePage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<QuoteEditorValue | null>(null);

  useEffect(() => {
    fetch(`/api/admin/quotes/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        const q = j.data;
        if (!q) { setInitial(null); return; }
        setInitial({
          id: q.id,
          number: q.number,
          accountId: q.account?.id ?? null,
          priceListId: q.priceList?.id ?? null,
          currency: q.currency,
          issueDate: q.issueDate ? String(q.issueDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
          validUntil: q.validUntil ? String(q.validUntil).slice(0, 10) : null,
          notes: q.notes,
          terms: q.terms,
          lines: q.lines.map((l: {
            productId: string | null;
            description: string;
            quantity: string | number;
            unitPrice: string | number;
            discountPct: string | number;
            taxRate: string | number;
          }) => ({
            productId: l.productId,
            description: l.description,
            quantity: Number(l.quantity),
            unitPrice: Number(l.unitPrice),
            discountPct: Number(l.discountPct),
            taxRate: Number(l.taxRate),
          })),
        });
      });
  }, [params.id]);

  if (!initial) return <div className="flex items-center justify-center py-32"><AdminSpinner /></div>;
  return <QuoteEditor initial={initial} />;
}
