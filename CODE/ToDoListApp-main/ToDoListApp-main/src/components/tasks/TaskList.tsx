import { Task, List } from "@/pages/Tasks";
import TaskCard from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  lists: List[];
  onToggleTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

const TaskList = ({ tasks, lists, onToggleTask, onDeleteTask }: TaskListProps) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
          <span className="text-3xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold mb-2">No tasks yet</h3>
        <p className="text-muted-foreground">Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const list = lists.find((l) => l.id === task.list_id);
        return (
          <TaskCard
            key={task.id}
            task={task}
            listColor={list?.color || "blue"}
            onToggle={() => onToggleTask(task.id)}
            onDelete={() => onDeleteTask(task.id)}
          />
        );
      })}
    </div>
  );
};

export default TaskList;
