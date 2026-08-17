import { GoodsReceivedNote } from "../types/goods-received";

const STORAGE_KEY =
  "saip-grn";

export function getGRNs() {

  if (typeof window === "undefined")
    return [];

  const data =
    localStorage.getItem(
      STORAGE_KEY
    );

  return data
    ? JSON.parse(data)
    : [];

}

export function saveGRNs(
  grns: GoodsReceivedNote[]
) {

  localStorage.setItem(

    STORAGE_KEY,

    JSON.stringify(grns)

  );

}

export function addGRN(

  grn: GoodsReceivedNote

) {

  const grns =
    getGRNs();

  grns.unshift(grn);

  saveGRNs(grns);

}

export function generateGRNNumber() {

  const grns =
    getGRNs();

  return `GRN-${String(

    grns.length + 1

  ).padStart(6, "0")}`;

}