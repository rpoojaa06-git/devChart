interface AnnouncementCardProps {
  title: string;
  message: string;
  createdAt?: string;
}

export default function AnnouncementCard({
  title,
  message,
  createdAt,
}: AnnouncementCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      <h2 className="text-xl font-bold text-slate-900 mb-2">
        {title}
      </h2>

      <p className="text-slate-600 mb-3 leading-relaxed">
        {message}
      </p>

      {createdAt && (
        <p className="text-sm text-slate-500">
          {new Date(createdAt).toLocaleString()}
        </p>
      )}
    </div>
  );
}
