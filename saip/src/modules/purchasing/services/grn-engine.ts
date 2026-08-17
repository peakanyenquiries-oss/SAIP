import { GoodsReceivedNote } from "../types/goods-received";

import {

  processStockTransaction,

} from "@/lib/erp-engine";

export function receiveGoods(

  grn: GoodsReceivedNote

) {

  grn.items.forEach(item => {

    processStockTransaction({

      productId:

        item.productId,

      inventoryId:

        item.inventoryId,

      quantity:

        item.receivedQuantity,

      movementType:

        "Goods Received",

      referenceNumber:

        grn.grnNumber,

      referenceType:

        "GRN",

      notes:

        grn.notes,

      performedBy:

        grn.receivedBy,

    });

  });

}