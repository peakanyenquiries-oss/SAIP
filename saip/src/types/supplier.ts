export interface Supplier {
  id: string;

  company: string;
  contactPerson: string;
  phone: string;
  email: string;
  province: string;
  paymentTerms: string;

  supplierScore: number;

  status: "Active" | "Inactive" | "Pending";

  createdAt: string;
  updatedAt: string;
}