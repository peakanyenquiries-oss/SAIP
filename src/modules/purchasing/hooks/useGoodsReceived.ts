"use client";

import { useEffect, useState } from "react";

import {

  addGRN,

  getGRNs,

} from "../services/grn.service";

import {

  GoodsReceivedNote,

} from "../types/goods-received";

export default function useGoodsReceived() {

  const [

    grns,

    setGRNs,

  ] = useState<GoodsReceivedNote[]>([]);

  function refresh() {

    setGRNs(

      getGRNs()

    );

  }

  useEffect(() => {

    refresh();

  }, []);

  function create(

    grn: GoodsReceivedNote

  ) {

    addGRN(grn);

    refresh();

  }

  return {

    grns,

    create,

    refresh,

  };

}