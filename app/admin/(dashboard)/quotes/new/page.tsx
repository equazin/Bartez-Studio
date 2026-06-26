"use client";

import { QuoteEditor, newQuoteDefaults } from "../QuoteEditor";

export default function NewQuotePage() {
  return <QuoteEditor initial={newQuoteDefaults} />;
}
