import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface QuickAddBarProps {
  onQuickAdd: (title: string) => void;
  onOpenModal: () => void;
}

const QuickAddBar = ({ onQuickAdd, onOpenModal }: QuickAddBarProps) => {
  const [quickTaskTitle, setQuickTaskTitle] = useState("");

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickTaskTitle.trim()) {
      onQuickAdd(quickTaskTitle.trim());
      setQuickTaskTitle("");
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <form onSubmit={handleQuickAdd} className="flex gap-2">
          <Input
            placeholder="Quick add task..."
            value={quickTaskTitle}
            onChange={(e) => setQuickTaskTitle(e.target.value)}
            className="flex-1"
          />
          <Button
            type="button"
            size="icon"
            onClick={onOpenModal}
            className="gradient-primary shadow-glow"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default QuickAddBar;
