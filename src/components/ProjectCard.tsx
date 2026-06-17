type ProjectCardProps = {
    name: string;
    description: string;
};

export default function ProjectCard({
    name,
    description,
}: ProjectCardProps) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
            <h2 className="text-lg font-bold text-slate-900">
                {name}
            </h2>

            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {description}
            </p>
        </div>
    );
}
