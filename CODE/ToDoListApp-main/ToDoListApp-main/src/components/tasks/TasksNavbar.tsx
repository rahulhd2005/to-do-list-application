import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle, User, LogOut } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { List } from "@/pages/Tasks";

interface TasksNavbarProps {
  lists: List[];
  selectedList: string | null;
  showCompleted: boolean;
  searchQuery: string;
  onListSelect: (listId: string | null) => void;
  onShowCompletedToggle: () => void;
  onSearchChange: (query: string) => void;
  onProfileClick: () => void;
  onLogout: () => void;
}

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: "bg-secondary",
    purple: "bg-primary",
    green: "bg-accent",
  };
  return colorMap[color] || "bg-primary";
};

const TasksNavbar = ({
  lists,
  selectedList,
  showCompleted,
  searchQuery,
  onListSelect,
  onShowCompletedToggle,
  onSearchChange,
  onProfileClick,
  onLogout,
}: TasksNavbarProps) => {
  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col gap-4">
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shadow-glow">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold">ProToDo</h1>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onProfileClick}
                className="hover:bg-muted"
              >
                <User className="h-5 w-5" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-muted">
                    <LogOut className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Lists and Completed Toggle */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <Button
              variant={selectedList === null && !showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onListSelect(null);
                if (showCompleted) onShowCompletedToggle();
              }}
              className="whitespace-nowrap"
            >
              All Tasks
            </Button>
            
            {lists.map((list) => (
              <Button
                key={list.id}
                variant={selectedList === list.id ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onListSelect(list.id);
                  if (showCompleted) onShowCompletedToggle();
                }}
                className="whitespace-nowrap gap-2"
              >
                <div className={`w-2 h-2 rounded-full ${getColorClass(list.color)}`} />
                {list.name}
              </Button>
            ))}

            <Button
              variant={showCompleted ? "default" : "outline"}
              size="sm"
              onClick={() => {
                onShowCompletedToggle();
                onListSelect(null);
              }}
              className="whitespace-nowrap gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Completed
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TasksNavbar;
