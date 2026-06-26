"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AdminSpinner } from "../../../../../../components/admin/AdminUI";
import { OrderEditor, type OrderEditorValue } from "../../OrderEditor";

export default function EditOrderPage() {
  const params = useParams<{ id: string }>();
  const [initial, setInitial] = useState<OrderEditorValue | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then((r) => r.json())
      .then((j) => {
        const o = j.data;
        if (!o) { setInitial(null); return; }
        setInitial({
          id: o.id,
          number: o.number,
          accountId: o.account?.id ?? null,
          warehouseId: o.warehouseId ?? null,
          currency: o.currency,
          orderDate: o.orderDate ? String(o.orderDate).slice(0, 10) : new Date().toISOString().slice(0, 10),
          expectedDate: o.expectedDate ? String(o.expectedDate).slice(0, 10) : null,
          notes: o.notes,
          lines: o.lines.map((l: {
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
  return <OrderEditor initial={initial} />;
}
