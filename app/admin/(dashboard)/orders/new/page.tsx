"use client";

import { OrderEditor, newOrderDefaults } from "../OrderEditor";

export default function NewOrderPage() {
  return <OrderEditor initial={newOrderDefaults} />;
}
