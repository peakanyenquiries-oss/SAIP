import { fetchActiveServiceKitIds, fetchServiceKitSummary } from "@/repositories/service-kit.repository";

export interface ServiceKitItem {
  id: string;
  productId: string;
  sku: string | null;
  productName: string;
  quantity: number;
  required: boolean;
  costPrice: number;
  sellingPrice: number;
  stock: number;
  minimumStock: number;
}

export interface ServiceKitSummary {
  id: string;
  name: string;
  description: string | null;
  serviceType: string;
  active: boolean;
  items: ServiceKitItem[];
  totalCost: number;
  totalSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  stockReady: boolean;
}

export async function getServiceKitSummary(serviceKitId: string): Promise<ServiceKitSummary | null> {
  const row = await fetchServiceKitSummary(serviceKitId);
  if (!row) return null;

  const items: ServiceKitItem[] = row.items.map((item) => ({
    ...item,
    costPrice: Number(item.costPrice ?? 0),
    sellingPrice: Number(item.sellingPrice ?? 0),
    stock: Number(item.stock ?? 0),
    minimumStock: Number(item.minimumStock ?? 0),
  }));

  const totalCost = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
  const totalSellingPrice = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
  const grossProfit = totalSellingPrice - totalCost;
  const grossMarginPercent = totalSellingPrice > 0 ? (grossProfit / totalSellingPrice) * 100 : 0;
  const stockReady = items.filter((item) => item.required).every((item) => item.stock >= item.quantity);

  return { ...row, items, totalCost, totalSellingPrice, grossProfit, grossMarginPercent, stockReady };
}

export async function getServiceKits(): Promise<ServiceKitSummary[]> {
  const ids = await fetchActiveServiceKitIds();
  const summaries = await Promise.all(ids.map(getServiceKitSummary));
  return summaries.filter((summary): summary is ServiceKitSummary => summary !== null);
}
