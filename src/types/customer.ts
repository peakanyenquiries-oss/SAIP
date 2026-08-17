export interface Customer {
  id: string;

  firstName: string;

  lastName: string;

  company: string;

  email: string;

  phone: string;

  address: string;

  city: string;

  province: string;

  notes: string;

  status: "Active" | "Inactive";

  createdAt: string;

  updatedAt: string;
}

export const emptyCustomer: Customer = {
  id: "",

  firstName: "",

  lastName: "",

  company: "",

  email: "",

  phone: "",

  address: "",

  city: "",

  province: "",

  notes: "",

  status: "Active",

  createdAt: "",

  updatedAt: "",
};