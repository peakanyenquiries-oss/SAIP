"use client";

interface Props {
  currentStatus: string;
}

const workflow = [
  "Draft",
  "Pending Approval",
  "Approved",
  "Ordered",
  "Partially Received",
  "Completed",
];

export default function PurchaseOrderTimeline({
  currentStatus,
}: Props) {

  const currentIndex =
    workflow.indexOf(currentStatus);

  return (

    <div className="space-y-4">

      {workflow.map((step, index) => (

        <div
          key={step}
          className="flex items-center gap-4"
        >

          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-white

            ${
              index <= currentIndex

                ? "bg-green-600"

                : "bg-slate-300"

            }`}
          >

            {index + 1}

          </div>

          <span className="font-medium">

            {step}

          </span>

        </div>

      ))}

    </div>

  );

}