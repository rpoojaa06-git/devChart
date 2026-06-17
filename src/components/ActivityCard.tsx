interface ActivityCardProps {
  action: string;
  timestamp?: string;
}

export default function ActivityCard({
  action,
  timestamp,
}: ActivityCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm border-l-4 border-l-teal-500">
      <p className="font-medium text-slate-900">
        {action}
      </p>

      {timestamp && (
        <p className="text-sm text-slate-500 mt-2">
          {new Date(timestamp).toLocaleString()}
        </p>
      )}
    </div>
  );
}
