"use client";

import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    fetch("/api/activity")
      .then((res) => res.json())
      .then(setActivities);
  }, []);

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl font-bold mb-8 text-slate-900">
            Activity Feed
          </h1>

          <div className="space-y-4">
            {activities.map((item: any) => (
              <div
                key={item._id}
                className="bg-white border border-slate-200 rounded-xl shadow-sm p-4"
              >
                <p className="text-slate-900">{item.action}</p>

                <p className="text-sm text-slate-500">
                  {new Date(
                    item.timestamp
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
