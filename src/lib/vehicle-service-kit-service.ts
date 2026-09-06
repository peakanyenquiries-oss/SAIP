import { fetchVehicleServiceKitRules } from "@/repositories/vehicle-service-kit.repository";

export interface VehicleServiceKitRecommendation {
  vehicleVariantId: string;
  serviceKitId: string;
  serviceKitName: string;
  serviceType: string;
  intervalKm: number | null;
  intervalMonths: number | null;
  priority: number;
  notes: string | null;
  items: Array<{
    productId: string;
    sku: string | null;
    productName: string;
    quantity: number;
    required: boolean;
    compatible: boolean;
    fitmentType: string | null;
    verifiedAt: string | null;
    stock: number;
    minimumStock: number;
    supplierName: string | null;
    costPrice: number;
    sellingPrice: number;
  }>;
  totalCost: number;
  totalSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  readyForService: boolean;
}

export async function getVehicleServiceKitRecommendations(vehicleVariantId: string): Promise<VehicleServiceKitRecommendation[]> {
  const rules = await fetchVehicleServiceKitRules(vehicleVariantId);

  return rules.map((rule) => {
    const items = rule.serviceKit.items.map((item) => {
      const fitment = item.product.fitments
        .filter((candidate) => candidate.vehicleVariantId === vehicleVariantId)
        .sort((a, b) => String(b.verifiedAt ?? "").localeCompare(String(a.verifiedAt ?? "")))[0];

      return {
        productId: item.productId,
        sku: item.product.sku,
        productName: item.product.productName,
        quantity: item.quantity,
        required: item.required,
        compatible: Boolean(fitment),
        fitmentType: fitment?.fitmentType ?? null,
        verifiedAt: fitment?.verifiedAt ?? null,
        stock: Number(item.product.stock ?? 0),
        minimumStock: Number(item.product.minimumStock ?? 0),
        supplierName: item.product.supplierName,
        costPrice: Number(item.product.costPrice ?? 0),
        sellingPrice: Number(item.product.sellingPrice ?? 0),
      };
    });

    const totalCost = items.reduce((sum, item) => sum + item.costPrice * item.quantity, 0);
    const totalSellingPrice = items.reduce((sum, item) => sum + item.sellingPrice * item.quantity, 0);
    const grossProfit = totalSellingPrice - totalCost;
    const grossMarginPercent = totalSellingPrice > 0 ? (grossProfit / totalSellingPrice) * 100 : 0;
    const readyForService = items.filter((item) => item.required).every((item) => item.compatible && item.stock >= item.quantity);

    return {
      vehicleVariantId,
      serviceKitId: rule.serviceKit.id,
      serviceKitName: rule.serviceKit.name,
      serviceType: rule.serviceKit.serviceType,
      intervalKm: rule.intervalKm,
      intervalMonths: rule.intervalMonths,
      priority: rule.priority,
      notes: rule.notes,
      items,
      totalCost,
      totalSellingPrice,
      grossProfit,
      grossMarginPercent,
      readyForService,
    };
  });
}

export async function getVehicleServiceKitRecommendation(vehicleVariantId: string, serviceKitId: string): Promise<VehicleServiceKitRecommendation | null> {
  const recommendations = await getVehicleServiceKitRecommendations(vehicleVariantId);
  return recommendations.find((recommendation) => recommendation.serviceKitId === serviceKitId) ?? null;
}
