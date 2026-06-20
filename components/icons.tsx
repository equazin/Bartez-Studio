import {
  Truck,
  Cpu,
  BadgeDollarSign,
  Server,
  Laptop,
  Network,
  MonitorSmartphone,
  Keyboard,
  Cctv,
  Banknote,
  FileCheck,
  Landmark,
  ReceiptText,
  MapPin,
  Headset,
  DraftingCompass,
  Wrench,
  ShieldCheck,
  Cloud,
  Boxes,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  Truck,
  Cpu,
  BadgeDollarSign,
  Server,
  Laptop,
  Network,
  MonitorSmartphone,
  Keyboard,
  Cctv,
  Banknote,
  FileCheck,
  Landmark,
  ReceiptText,
  MapPin,
  Headset,
  DraftingCompass,
  Wrench,
  ShieldCheck,
  Cloud,
  Boxes,
};

export function Icon({
  name,
  className,
  strokeWidth = 1.7,
}: {
  name: string;
  className?: string;
  strokeWidth?: number;
}) {
  const Cmp = map[name] ?? Server;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden />;
}
