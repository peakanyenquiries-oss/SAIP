"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    customerSchema,
    CustomerFormData,
} from "@/schemas/customerSchema";

import { createCustomer } from "@/services/customerService";

interface CustomerFormProps {
    onSuccess?: () => void;
}

export default function CustomerForm({
    onSuccess,
}: CustomerFormProps) {

    const {

        register,

        handleSubmit,

        reset,

        formState: {

            errors,

            isSubmitting,

        },

    } = useForm<CustomerFormData>({

        resolver: zodResolver(customerSchema),

        defaultValues: {

            first_name: "",

            last_name: "",

            company: "",

            email: "",

            phone: "",

            address: "",

            city: "",

            province: "",

            notes: "",

            status: "Active",

        },

    });

    async function onSubmit(data: CustomerFormData) {

        try {

            await createCustomer(data);

            reset();

            if (onSuccess) {

                onSuccess();

            }

        }

        catch (error) {

            console.error(error);

            alert("Unable to save customer.");

        }

    }

    return (

        <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl bg-white border border-slate-200 shadow-sm"
        >

            <div className="border-b border-slate-200 px-8 py-6">

                <h2 className="text-2xl font-semibold text-slate-900">

                    New Customer

                </h2>

                <p className="mt-2 text-slate-500">

                    Capture customer information.

                </p>

            </div>

            <div className="grid gap-6 p-8 md:grid-cols-2">

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        First Name

                    </label>

                    <input

                        {...register("first_name")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"

                    />

                    <p className="mt-1 text-sm text-red-600">

                        {errors.first_name?.message}

                    </p>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Last Name

                    </label>

                    <input

                        {...register("last_name")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-600"

                    />

                    <p className="mt-1 text-sm text-red-600">

                        {errors.last_name?.message}

                    </p>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Company

                    </label>

                    <input

                        {...register("company")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Email

                    </label>

                    <input

                        {...register("email")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                    <p className="mt-1 text-sm text-red-600">

                        {errors.email?.message}

                    </p>

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Phone

                    </label>

                    <input

                        {...register("phone")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

                <div>

                    <label className="mb-2 block text-sm font-medium">

                        Province

                    </label>

                    <input

                        {...register("province")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">

                        Address

                    </label>

                    <textarea

                        rows={3}

                        {...register("address")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

                <div className="md:col-span-2">

                    <label className="mb-2 block text-sm font-medium">

                        Notes

                    </label>

                    <textarea

                        rows={5}

                        {...register("notes")}

                        className="w-full rounded-xl border border-slate-300 px-4 py-3"

                    />

                </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 px-8 py-6">

                <button

                    disabled={isSubmitting}

                    className="rounded-xl bg-blue-700 px-8 py-3 font-medium text-white transition hover:bg-blue-800 disabled:opacity-50"

                >

                    {isSubmitting
                        ? "Saving..."
                        : "Save Customer"}

                </button>

            </div>

        </form>

    );

}