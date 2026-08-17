import { InventoryItem } from "@/types/inventory";
import { Product } from "@/types/product";
import { StockMovement } from "@/types/stock-movement";

import {
  getInventory,
  saveInventory,
} from "@/lib/inventory-service";

import {
  getProducts,
  saveProducts,
} from "@/lib/product-service";

import {
  addStockMovement,
} from "@/lib/stock-movement-service";

export interface StockTransaction {
  productId: string;

  inventoryId: string;

  quantity: number;

  movementType:
    StockMovement["movementType"];

  referenceNumber: string;

  referenceType: string;

  notes: string;

  performedBy: string;
}

/* =========================================================
   PROCESS STOCK TRANSACTION
========================================================= */

export async function processStockTransaction(
  transaction: StockTransaction
): Promise<boolean> {
  try {
    const inventory =
      await getInventory();

    const products =
      await getProducts();

    const inventoryItem =
      inventory.find(
        (item) =>
          item.id ===
          transaction.inventoryId
      );

    if (!inventoryItem) {
      return false;
    }

    const product =
      products.find(
        (item) =>
          item.id ===
          transaction.productId
      );

    if (!product) {
      return false;
    }

    const quantityBefore =
      inventoryItem.quantityOnHand;

    let quantityAfter =
      quantityBefore;

    /* =====================================================
       CALCULATE NEW QUANTITY
    ===================================================== */

    switch (
      transaction.movementType
    ) {
      case "Purchase":

      case "Goods Received":

      case "Opening Balance":

      case "Transfer In":

      case "Return":
        quantityAfter +=
          transaction.quantity;
        break;

      case "Sale":

      case "Transfer Out":

      case "Damaged":

      case "Expired":
        quantityAfter -=
          transaction.quantity;
        break;

      case "Adjustment":
        quantityAfter +=
          transaction.quantity;
        break;

      default:
        return false;
    }

    /*
      Inventory must never become negative.
    */

    if (quantityAfter < 0) {
      quantityAfter = 0;
    }

    /* =====================================================
       CALCULATE AVAILABLE STOCK
    ===================================================== */

    const availableQuantity =
      Math.max(
        quantityAfter -
          inventoryItem.reservedQuantity,
        0
      );

    /* =====================================================
       CALCULATE INVENTORY VALUE
    ===================================================== */

    const inventoryValue =
      quantityAfter *
      inventoryItem.unitCost;

    /* =====================================================
       DETERMINE INVENTORY STATUS
    ===================================================== */

    let status:
      InventoryItem["status"];

    if (quantityAfter <= 0) {
      status = "Out of Stock";
    } else if (
      quantityAfter <=
      inventoryItem.reorderLevel
    ) {
      status = "Low Stock";
    } else if (
      inventoryItem.reorderQuantity > 0 &&
      quantityAfter >=
        inventoryItem.reorderQuantity *
          5
    ) {
      status = "Overstock";
    } else {
      status = "In Stock";
    }

    /* =====================================================
       UPDATE INVENTORY OBJECT
    ===================================================== */

    const now =
      new Date().toISOString();

    inventoryItem.quantityOnHand =
      quantityAfter;

    inventoryItem.availableQuantity =
      availableQuantity;

    inventoryItem.inventoryValue =
      inventoryValue;

    inventoryItem.status =
      status;

    inventoryItem.lastStockMovement =
      now;

    inventoryItem.updatedAt =
      now;

    /* =====================================================
       UPDATE PRODUCT TIMESTAMP
    ===================================================== */

    product.updatedAt =
      now;

    /* =====================================================
       SAVE INVENTORY
    ===================================================== */

    await saveInventory(
      inventory
    );

    /* =====================================================
       SAVE PRODUCTS
    ===================================================== */

    await saveProducts(
      products
    );

    /* =====================================================
       CREATE STOCK MOVEMENT
    ===================================================== */

    const movement:
      StockMovement = {
      id:
        crypto.randomUUID(),

      inventoryId:
        inventoryItem.id,

      productId:
        product.id,

      sku:
        inventoryItem.sku,

      productName:
        inventoryItem.productName,

      warehouse:
        inventoryItem.warehouse,

      location:
        inventoryItem.location,

      movementType:
        transaction.movementType,

      quantity:
        transaction.quantity,

      quantityBefore,

      quantityAfter,

      unitCost:
        inventoryItem.unitCost,

      totalValue:
        transaction.quantity *
        inventoryItem.unitCost,

      referenceNumber:
        transaction.referenceNumber,

      referenceType:
        transaction.referenceType,

      notes:
        transaction.notes,

      performedBy:
        transaction.performedBy,

      movementDate:
        now,

      createdAt:
        now,
    };

    await addStockMovement(
      movement
    );

    return true;
  } catch (error) {
    console.error(
      "Failed to process stock transaction:",
      error
    );

    return false;
  }
}