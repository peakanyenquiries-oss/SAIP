"use client";

import { useCallback, useEffect, useState } from "react";
import {
  approveProcurementRequest,
  convertApprovedProcurementRequestToPo,
  createProcurementRequest,
  getProcurementRequests,
  getReplenishmentRecommendations,
  ProcurementRecommendation,
  ProcurementRequest,
} from "@/repositories/procurement-workflow.repository";

export default function useProcurementIntelligence() {
  const [recommendations, setRecommendations] = useState<ProcurementRecommendation[]>([]);
  const [requests, setRequests] = useState<ProcurementRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [nextRecommendations, nextRequests] = await Promise.all([
        getReplenishmentRecommendations(),
        getProcurementRequests(),
      ]);
      setRecommendations(nextRecommendations);
      setRequests(nextRequests);
    } catch (err) {
      console.error("Failed to load procurement intelligence:", err);
      setError(err instanceof Error ? err.message : "Failed to load procurement intelligence.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createRequest = useCallback(async (productId: string, quantity: number) => {
    const id = await createProcurementRequest(productId, quantity);
    await load();
    return id;
  }, [load]);

  const approveRequest = useCallback(async (requestId: string) => {
    await approveProcurementRequest(requestId);
    await load();
  }, [load]);

  const convertToPurchaseOrder = useCallback(async (requestId: string) => {
    const poId = await convertApprovedProcurementRequestToPo(requestId);
    await load();
    return poId;
  }, [load]);

  return {
    recommendations,
    requests,
    loading,
    error,
    createRequest,
    approveRequest,
    convertToPurchaseOrder,
    refresh: load,
  };
}
