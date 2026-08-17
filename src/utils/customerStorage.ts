import { Customer } from "@/types/customer";

const STORAGE_KEY = "saip-customers";

export function getCustomers(): Customer[] {
  if (typeof window === "undefined") {
    return [];
  }

  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) {
    return [];
  }

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveCustomers(customers: Customer[]) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(customers)
  );
}

export function addCustomer(customer: Customer) {
  const customers = getCustomers();

  customers.push(customer);

  saveCustomers(customers);
}

export function deleteCustomer(id: string) {
  const customers = getCustomers().filter(
    (customer) => customer.id !== id
  );

  saveCustomers(customers);
}

export function updateCustomer(updated: Customer) {
  const customers = getCustomers().map((customer) =>
    customer.id === updated.id
      ? updated
      : customer
  );

  saveCustomers(customers);
}