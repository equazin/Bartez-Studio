export const CONSENT_KEY = "bartez-cookie-consent-v1";
export const CONSENT_EVENT = "bartez:consent";
export type ConsentChoice = "accept" | "reject";

export function getConsentSnapshot(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(CONSENT_KEY);
  return value === "accept" || value === "reject" ? value : null;
}

export function subscribeConsent(onStoreChange: () => void): () => void {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  window.addEventListener("storage", onStoreChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onStoreChange);
    window.removeEventListener("storage", onStoreChange);
  };
}

export function saveConsent(value: ConsentChoice): void {
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent<ConsentChoice>(CONSENT_EVENT, { detail: value }));
}
