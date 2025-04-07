
import { FC, ReactNode } from "react";
import { Package2 } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

const EmptyState: FC<EmptyStateProps> = ({ 
  title, 
  description, 
  icon, 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-4">
        {icon || <Package2 className="h-10 w-10 text-slate-400" />}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
