"use client";

import { useEffect, useState } from "react";

import { Customer } from "@/types/customer";

import {
  addCustomer,
  deleteCustomer,
  getCustomers,
  updateCustomer,
} from "@/utils/customerStorage";

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(getCustomers());
  }, []);

  function create(customer: Customer) {
    addCustomer(customer);
    setCustomers(getCustomers());
  }

  function update(customer: Customer) {
    updateCustomer(customer);
    setCustomers(getCustomers());
  }

  function remove(id: string) {
    deleteCustomer(id);
    setCustomers(getCustomers());
  }

  return {
    customers,
    create,
    update,
    remove,
  };
}