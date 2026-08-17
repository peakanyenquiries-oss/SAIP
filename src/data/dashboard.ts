export interface DashboardStat {
  id: number;
  title: string;
  value: number;
  change: string;
  changeType: "increase" | "decrease";
  color: string;
  icon: string;
}

export const dashboardStats: DashboardStat[] = [
  {
    id: 1,
    title: "Customers",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "blue",
    icon: "👥",
  },
  {
    id: 2,
    title: "Suppliers",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "green",
    icon: "🏭",
  },
  {
    id: 3,
    title: "Products",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "orange",
    icon: "📦",
  },
  {
    id: 4,
    title: "Vehicles",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "purple",
    icon: "🚗",
  },
  {
    id: 5,
    title: "Inventory",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "cyan",
    icon: "📋",
  },
  {
    id: 6,
    title: "Revenue",
    value: 0,
    change: "+0%",
    changeType: "increase",
    color: "emerald",
    icon: "💰",
  },
];