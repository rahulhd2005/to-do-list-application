import { Task } from "@/pages/Tasks";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Clock } from "lucide-react";
import { format } from "date-fns";

interface TaskCardProps {
  task: Task;
  listColor: string;
  onToggle: () => void;
  onDelete: () => void;
}

const getColorClass = (color: string) => {
  const colorMap: Record<string, string> = {
    blue: "border-l-secondary",
    purple: "border-l-primary",
    green: "border-l-accent",
  };
  return colorMap[color] || "border-l-primary";
};

const TaskCard = ({ task, listColor, onToggle, onDelete }: TaskCardProps) => {
  return (
    <Card className={`p-4 border-l-4 ${getColorClass(listColor)} hover:shadow-md transition-all animate-slide-up`}>
      <div className="flex items-start gap-3">
        <Checkbox
          checked={task.completed}
          onCheckedChange={onToggle}
          className="mt-1"
        />
        
        <div className="flex-1 min-w-0">
          <h3 className={`font-medium mb-1 ${task.completed ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </h3>
          
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {format(new Date(task.created_at), "MMM d, yyyy")}
            </span>
            
            {task.due_date && (
              <span className="inline-flex items-center gap-1 text-warning">
                Due: {format(new Date(task.due_date), "MMM d")}
              </span>
            )}
            
            <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
              {task.category}
            </span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onDelete}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default TaskCard;
