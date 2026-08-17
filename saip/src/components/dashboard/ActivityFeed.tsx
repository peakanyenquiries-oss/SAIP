const activities = [
  {
    id: 1,
    title: "Customer Module Created",
    description: "Customer Management is now operational.",
    time: "2 minutes ago",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Dashboard Updated",
    description: "Enterprise Dashboard v0.3 installed.",
    time: "10 minutes ago",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Theme System Loaded",
    description: "Global design system initialized.",
    time: "30 minutes ago",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "System Ready",
    description: "Waiting for production database.",
    time: "Just now",
    color: "bg-orange-500",
  },
];

export default function ActivityFeed() {
  return (
    <div className="rounded-3xl bg-white p-8 shadow-sm border border-slate-200">

      <div className="mb-8 flex items-center justify-between">

        <h2 className="text-2xl font-bold text-slate-900">
          Recent Activity
        </h2>

        <button className="text-blue-700 font-semibold hover:underline">
          View All
        </button>

      </div>

      <div className="space-y-6">

        {activities.map((activity) => (

          <div
            key={activity.id}
            className="flex gap-4"
          >

            <div
              className={`mt-2 h-4 w-4 rounded-full ${activity.color}`}
            />

            <div className="flex-1">

              <h3 className="font-bold text-slate-900">
                {activity.title}
              </h3>

              <p className="mt-1 text-slate-500">
                {activity.description}
              </p>

              <p className="mt-2 text-sm text-slate-400">
                {activity.time}
              </p>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}