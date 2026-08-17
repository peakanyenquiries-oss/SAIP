"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
    LayoutDashboard,
    Users,
    Truck,
    Package,
    Car,
    Boxes,
    FileText,
    BarChart3,
    Bot,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
} from "lucide-react";

const menu = [

    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },

    {
        title: "Customers",
        href: "/customers",
        icon: Users,
    },

    {
        title: "Suppliers",
        href: "/suppliers",
        icon: Truck,
    },

    {
        title: "Products",
        href: "/products",
        icon: Package,
    },

    {
        title: "Vehicles",
        href: "/vehicles",
        icon: Car,
    },

    {
        title: "Inventory",
        href: "/inventory",
        icon: Boxes,
    },

    {
        title: "Quotations",
        href: "/quotations",
        icon: FileText,
    },

    {
        title: "Reports",
        href: "/reports",
        icon: BarChart3,
    },

    {
        title: "AI Assistant",
        href: "/ai",
        icon: Bot,
    },

    {
        title: "Settings",
        href: "/settings",
        icon: Settings,
    },

];

export default function Sidebar() {

    const pathname = usePathname();

    const [collapsed, setCollapsed] = useState(false);

    return (

        <aside
            className={`flex h-screen flex-col border-r border-slate-800 bg-slate-950 text-white transition-all duration-300 ${
                collapsed
                    ? "w-24"
                    : "w-72"
            }`}
        >

            {/* Header */}

            <div className="flex items-center justify-between border-b border-slate-800 p-6">

                {!collapsed && (

                    <div>

                        <h1 className="text-3xl font-bold tracking-tight">
                            SAIP
                        </h1>

                        <p className="mt-1 text-xs text-slate-400">
                            Enterprise Edition
                        </p>

                    </div>

                )}

                <button
                    onClick={() =>
                        setCollapsed(!collapsed)
                    }
                    className="rounded-lg p-2 hover:bg-slate-800"
                >

                    {collapsed ? (
                        <ChevronRight size={20} />
                    ) : (
                        <ChevronLeft size={20} />
                    )}

                </button>

            </div>

            {/* Navigation */}

            <nav className="flex-1 overflow-y-auto px-3 py-5">

                {menu.map((item) => {

                    const active =
                        pathname === item.href;

                    const Icon = item.icon;

                    return (

                        <Link
                            key={item.href}
                            href={item.href}
                            className={`mb-2 flex items-center rounded-xl px-4 py-3 transition-all duration-200

                            ${
                                active
                                    ? "bg-blue-700 text-white shadow-lg"
                                    : "text-slate-300 hover:bg-slate-900 hover:text-white"
                            }`}
                        >

                            <Icon
                                size={22}
                                className="shrink-0"
                            />

                            {!collapsed && (

                                <span className="ml-4 font-medium">

                                    {item.title}

                                </span>

                            )}

                        </Link>

                    );

                })}

            </nav>

            {/* Footer */}

            <div className="border-t border-slate-800 p-5">

                {!collapsed && (

                    <div className="mb-5 rounded-xl bg-slate-900 p-4">

                        <p className="text-xs uppercase tracking-widest text-slate-500">

                            Logged In

                        </p>

                        <h3 className="mt-2 font-semibold">

                            Administrator

                        </h3>

                        <p className="text-sm text-slate-400">

                            Enterprise Access

                        </p>

                    </div>

                )}

                <button
                    className="flex w-full items-center justify-center rounded-xl bg-red-600 py-3 transition hover:bg-red-700"
                >

                    <LogOut size={18} />

                    {!collapsed && (

                        <span className="ml-2">

                            Logout

                        </span>

                    )}

                </button>

            </div>

        </aside>

    );

}