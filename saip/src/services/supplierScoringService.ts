export interface SupplierScoreInput {
  pricing: number;
  availability: number;
  delivery: number;
  paymentTerms: number;
  reliability: number;
  coverage: number;
}

export interface SupplierScoreResult {
  score: number;
  rating: "Excellent" | "Good" | "Watch" | "Poor";
}

export function calculateSupplierScore(
  input: SupplierScoreInput
): SupplierScoreResult {
  const score =
    input.pricing * 0.20 +
    input.availability * 0.20 +
    input.delivery * 0.20 +
    input.paymentTerms * 0.10 +
    input.reliability * 0.20 +
    input.coverage * 0.10;

  const roundedScore = Math.round(score);

  let rating: SupplierScoreResult["rating"];

  if (roundedScore >= 85) {
    rating = "Excellent";
  } else if (roundedScore >= 70) {
    rating = "Good";
  } else if (roundedScore >= 50) {
    rating = "Watch";
  } else {
    rating = "Poor";
  }

  return {
    score: roundedScore,
    rating,
  };
}