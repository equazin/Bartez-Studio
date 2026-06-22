import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Administración | Bartez", template: "%s | Administración Bartez" },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
