import { getDisplayName } from '@/lib/formatters';

type PopulatedRef = {
  _id: string;
  name?: string;
  title?: string;
};

type TaskCardProps = {
  id: string;
  title: string;
  description: string;
  priority: string;
  project?: string | PopulatedRef | null;
  assignedTo?: string | PopulatedRef | null;
  dueDate?: string;
  commentCount?: number;
  onMove: (id: string, status: string) => void;
  onViewDetails?: (id: string) => void;
};

const TaskCard = ({
  id,
  title,
  description,
  priority,
  project,
  assignedTo,
  dueDate,
  commentCount,
  onMove,
  onViewDetails,
}: TaskCardProps) => {
  const priorityStyles: Record<string, { border: string; badge: string }> = {
    high: {
      border: 'border-l-red-500',
      badge: 'bg-red-50 text-red-700 border border-red-200',
    },
    medium: {
      border: 'border-l-yellow-500',
      badge: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    },
    low: {
      border: 'border-l-green-500',
      badge: 'bg-green-50 text-green-700 border border-green-200',
    },
  };

  const styles = priorityStyles[priority] || priorityStyles.low;
  const isOverdue = dueDate && new Date(dueDate) < new Date();
  const projectName = getDisplayName(project);
  const assigneeName = getDisplayName(assignedTo);

  return (
    <div className={`${styles.border} border-l-4 rounded-lg shadow-sm hover:shadow-md transition-all p-4 bg-white border border-slate-200 hover:border-slate-300`}>
      <div className="flex items-start justify-between mb-3 gap-2">
        <h3 className="font-semibold text-slate-900 text-sm line-clamp-2 flex-1">{title}</h3>
        <span className={`${styles.badge} text-xs font-medium px-2 py-1 rounded whitespace-nowrap flex-shrink-0`}>
          {priority.charAt(0).toUpperCase() + priority.slice(1)}
        </span>
      </div>

      <p className="text-xs text-slate-500 mb-3 line-clamp-2">{description}</p>

      <div className="space-y-1.5 mb-4 text-xs text-slate-500 pb-4 border-b border-slate-200">
        {projectName && (
          <div className="flex items-center gap-2">
            <span>📁</span>
            <span className="text-slate-700">{projectName}</span>
          </div>
        )}
        {assigneeName && (
          <div className="flex items-center gap-2">
            <span>👤</span>
            <span className="text-slate-700">{assigneeName}</span>
          </div>
        )}
        {dueDate && (
          <div className={`flex items-center gap-2 ${isOverdue ? 'text-red-600' : 'text-slate-500'}`}>
            <span>📅</span>
            <span className={isOverdue ? 'font-semibold' : ''}>{new Date(dueDate).toLocaleDateString()}</span>
          </div>
        )}
        {!!commentCount && (
          <div className="flex items-center gap-2">
            <span>💬</span>
            <span className="text-slate-700">{commentCount} comment{commentCount === 1 ? '' : 's'}</span>
          </div>
        )}
      </div>

      <div className="flex gap-1.5 flex-wrap">
        <button
          onClick={() => onViewDetails?.(id)}
          className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-2.5 py-1.5 rounded transition font-medium"
        >
          View Details
        </button>
        <button
          onClick={() => onMove(id, 'todo')}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-2.5 py-1.5 rounded transition font-medium"
          title="Move to To Do"
        >
          To Do
        </button>
        <button
          onClick={() => onMove(id, 'inprogress')}
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs px-2.5 py-1.5 rounded transition font-medium"
          title="Move to In Progress"
        >
          In Progress
        </button>
        <button
          onClick={() => onMove(id, 'done')}
          className="bg-green-50 hover:bg-green-100 text-green-700 text-xs px-2.5 py-1.5 rounded transition font-medium"
          title="Mark as Done"
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default TaskCard;