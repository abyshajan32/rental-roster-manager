
import { FC, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface ContentHeaderProps {
  title: string;
  actionButton?: {
    label: string;
    icon: ReactNode;
    onClick: () => void;
  };
  searchPlaceholder?: string;
  onSearchChange?: (value: string) => void;
  filterButton?: boolean;
  onFilterClick?: () => void;
  children?: ReactNode;
}

const ContentHeader: FC<ContentHeaderProps> = ({
  title,
  actionButton,
  searchPlaceholder,
  onSearchChange,
  filterButton = false,
  onFilterClick,
  children,
}) => {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        {actionButton && (
          <Button 
            onClick={actionButton.onClick}
            className="bg-blue-500 hover:bg-blue-600"
          >
            {actionButton.icon}
            <span className="ml-2">{actionButton.label}</span>
          </Button>
        )}
      </div>
      
      {(searchPlaceholder || filterButton) && (
        <div className="flex gap-4">
          {searchPlaceholder && onSearchChange && (
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-9 bg-white"
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          )}
          
          {filterButton && onFilterClick && (
            <Button 
              variant="outline" 
              className="bg-white"
              onClick={onFilterClick}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          )}
        </div>
      )}
      
      {children}
    </div>
  );
};

export default ContentHeader;
