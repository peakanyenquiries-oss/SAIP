import { fetchVehicleServiceKitRules } from "@/repositories/vehicle-service-kit.repository";
import { getProcurementRecommendationForProduct } from "@/repositories/procurement-workflow.repository";

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
    procurement: {
      recommendation: "ORDER_NOW" | "EXPEDITE_REVIEW" | "MONITOR";
      supplierName: string | null;
      supplierScore: number;
      recommendedQuantity: number;
      orderValue: number;
      leadTimeDays: number;
      rationale: string | null;
    } | null;
  }>;
  totalCost: number;
  totalSellingPrice: number;
  grossProfit: number;
  grossMarginPercent: number;
  readyForService: boolean;
}

export async function getVehicleServiceKitRecommendations(vehicleVariantId: string): Promise<VehicleServiceKitRecommendation[]> {
  const rules = await fetchVehicleServiceKitRules(vehicleVariantId);

  return Promise.all(rules.map(async (rule) => {
    const items = await Promise.all(rule.serviceKit.items.map(async (item) => {
      const fitment = item.product.fitments
        .filter((candidate) => candidate.vehicleVariantId === vehicleVariantId)
        .sort((a, b) => String(b.verifiedAt ?? "").localeCompare(String(a.verifiedAt ?? "")))[0];

      const procurement = await getProcurementRecommendationForProduct(item.productId);

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
        procurement: procurement ? {
          recommendation: procurement.recommendation ?? "MONITOR",
          supplierName: procurement.supplier_name,
          supplierScore: procurement.supplier_score,
          recommendedQuantity: procurement.recommended_order_quantity,
          orderValue: procurement.recommended_order_value,
          leadTimeDays: procurement.lead_time_days,
          rationale: procurement.rationale || null,
        } : null,
      };
    }));

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
  }));
}

export async function getVehicleServiceKitRecommendation(vehicleVariantId: string, serviceKitId: string): Promise<VehicleServiceKitRecommendation | null> {
  const recommendations = await getVehicleServiceKitRecommendations(vehicleVariantId);
  return recommendations.find((recommendation) => recommendation.serviceKitId === serviceKitId) ?? null;
}
