"use client";

import { useMemo, useState } from "react";

import {
  Plus,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

import Button from "@/components/ui/Button";
import DataTable, {
  Column,
} from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import PageHeader from "@/components/ui/PageHeader";
import SearchBar from "@/components/ui/SearchBar";
import SectionCard from "@/components/ui/SectionCard";

import ProductForm from "@/components/forms/ProductForm";
import ProductStats from "@/components/products/ProductStats";
import ProductProfile from "@/components/products/ProductProfile";
import ProductHistory, {
  ProductHistoryItem,
} from "@/components/products/ProductHistory";

import useProducts from "@/hooks/useProducts";

import { Product } from "@/types/product";

export default function ProductsPage() {

  const {

    products,

    statistics,

    create,

    update,

    remove,

    refresh,

  } = useProducts();

  const [search, setSearch] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [deleteOpen, setDeleteOpen] =
    useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<Product>();

  const history: ProductHistoryItem[] =
    useMemo(() => {

      if (!selectedProduct)
        return [];

      return [

        {

          id: "1",

          title: "Product Created",

          description:
            "Product added to catalogue.",

          date: new Date(
            selectedProduct.createdAt
          ).toLocaleString(),

          type: "created",

        },

        {

          id: "2",

          title: "Last Updated",

          description:
            "Product information updated.",

          date: new Date(
            selectedProduct.updatedAt
          ).toLocaleString(),

          type: "updated",

        },

        {

          id: "3",

          title: "Stock Level",

          description:
            `${selectedProduct.quantity} units currently in stock.`,

          date: new Date().toLocaleString(),

          type: "stock",

        },

      ];

    }, [selectedProduct]);

  const filteredProducts =
    useMemo(() => {

      const keyword =
        search.toLowerCase();

      return products.filter(product =>

        product.name
          .toLowerCase()
          .includes(keyword)

        ||

        product.brand
          .toLowerCase()
          .includes(keyword)

        ||

        product.category
          .toLowerCase()
          .includes(keyword)

        ||

        product.sku
          .toLowerCase()
          .includes(keyword)

        ||

        product.barcode
          .toLowerCase()
          .includes(keyword)

      );

    }, [

      products,

      search,

    ]);

  function saveProduct(
    product: Product
  ) {

    const exists =
      products.some(
        item =>
          item.id === product.id
      );

    if (exists) {

      update(product);

    } else {

      create(product);

    }

    setFormOpen(false);

    setSelectedProduct(undefined);

  }

  function viewProduct(
    product: Product
  ) {

    setSelectedProduct(product);

    setProfileOpen(true);

  }

  function editProduct(
    product: Product
  ) {

    setSelectedProduct(product);

    setFormOpen(true);

  }

  function askDelete(
    product: Product
  ) {

    setSelectedProduct(product);

    setDeleteOpen(true);

  }

  function deleteCurrentProduct() {

    if (!selectedProduct)
      return;

    remove(selectedProduct.id);

    setDeleteOpen(false);

    setSelectedProduct(undefined);

  }

  const columns: Column<Product>[] = [

    {

      title: "SKU",

      render: p => p.sku,

    },

    {

      title: "Product",

      render: p => p.name,

    },

    {

      title: "Brand",

      render: p => p.brand,

    },

    {

      title: "Stock",

      render: p => p.quantity,

    },

    {

      title: "Price",

      render: p =>
        `R ${p.sellingPrice.toLocaleString()}`,

    },

    {

      title: "Status",

      render: p =>
        p.status,

    },

    {

      title: "Actions",

      render: p => (

        <div className="flex gap-2">

          <button
            onClick={() =>
              viewProduct(p)
            }
            className="rounded-lg p-2 hover:bg-slate-100"
          >

            <Eye size={18} />

          </button>

          <button
            onClick={() =>
              editProduct(p)
            }
            className="rounded-lg p-2 hover:bg-slate-100"
          >

            <Pencil size={18} />

          </button>

          <button
            onClick={() =>
              askDelete(p)
            }
            className="rounded-lg p-2 text-red-600 hover:bg-red-50"
          >

            <Trash2 size={18} />

          </button>

        </div>

      ),

    },

  ];
    return (

    <div className="space-y-8">

      <PageHeader
        title="Products"
        subtitle="Manage Product Catalogue"
        actions={

          <Button
            onClick={() => {

              setSelectedProduct(
                undefined
              );

              setFormOpen(true);

            }}
          >

            <Plus size={18} />

            Add Product

          </Button>

        }
      />

      <ProductStats
        statistics={statistics}
      />

      <SectionCard
        title="Product Catalogue"
        subtitle="Manage all products."
      >

        <div className="mb-6">

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />

        </div>

        <DataTable
          columns={columns}
          data={filteredProducts}
          emptyMessage="No products found."
        />

      </SectionCard>

      <Modal
        open={formOpen}
        title={
          selectedProduct
            ? "Edit Product"
            : "New Product"
        }
        onClose={() => {

          setFormOpen(false);

          setSelectedProduct(
            undefined
          );

        }}
      >

        <ProductForm
          product={selectedProduct}
          onSave={saveProduct}
          onCancel={() => {

            setFormOpen(false);

            setSelectedProduct(
              undefined
            );

          }}
        />

      </Modal>

      <Modal
        open={profileOpen}
        title="Product Profile"
        onClose={() => {

          setProfileOpen(false);

          setSelectedProduct(
            undefined
          );

        }}
      >

        {selectedProduct && (

          <div className="space-y-6">

            <ProductProfile
              product={selectedProduct}
            />

            <ProductHistory
              history={history}
            />

          </div>

        )}

      </Modal>

      <Modal
        open={deleteOpen}
        title="Delete Product"
        onClose={() => {

          setDeleteOpen(false);

          setSelectedProduct(
            undefined
          );

        }}
      >

        <div className="space-y-6">

          <p className="text-slate-600">

            Are you sure you want to permanently delete

            <span className="font-semibold">

              {" "}
              {selectedProduct?.name}

            </span>

            ?

          </p>

          <div className="flex justify-end gap-3">

            <Button
              variant="ghost"
              onClick={() => {

                setDeleteOpen(false);

                setSelectedProduct(
                  undefined
                );

              }}
            >

              Cancel

            </Button>

            <Button
              onClick={
                deleteCurrentProduct
              }
            >

              Delete Product

            </Button>

          </div>

        </div>

      </Modal>

    </div>

  );

}