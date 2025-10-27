import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import TasksNavbar from "@/components/tasks/TasksNavbar";
import TaskList from "@/components/tasks/TaskList";
import QuickAddBar from "@/components/tasks/QuickAddBar";
import AddTaskModal from "@/components/tasks/AddTaskModal";

export interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  due_date: string | null;
  created_at: string;
  list_id: string;
}

export interface List {
  id: string;
  name: string;
  color: string;
  icon: string | null;
}

const Tasks = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      setUser(session.user);
      await Promise.all([fetchLists(session.user.id), fetchTasks(session.user.id)]);
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const fetchLists = async (userId: string) => {
    const { data, error } = await supabase
      .from("lists")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error fetching lists:", error);
      toast.error("Failed to load lists");
    } else {
      setLists(data || []);
    }
  };

  const fetchTasks = async (userId: string) => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
    } else {
      setTasks(data || []);
    }
  };

  const addTask = async (taskData: {
    title: string;
    category: string;
    list_id: string;
    due_date?: string;
  }) => {
    if (!user) return;

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        user_id: user.id,
        ...taskData,
      })
      .select()
      .single();

    if (error) {
      console.error("Error adding task:", error);
      toast.error("Failed to add task");
    } else {
      setTasks([data, ...tasks]);
      toast.success("Task added successfully!");
    }
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const { error } = await supabase
      .from("tasks")
      .update({
        completed: !task.completed,
        completed_at: !task.completed ? new Date().toISOString() : null,
      })
      .eq("id", taskId);

    if (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task");
    } else {
      setTasks(
        tasks.map((t) =>
          t.id === taskId
            ? { ...t, completed: !t.completed }
            : t
        )
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    const { error } = await supabase
      .from("tasks")
      .delete()
      .eq("id", taskId);

    if (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task");
    } else {
      setTasks(tasks.filter((t) => t.id !== taskId));
      toast.success("Task deleted");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesList = !selectedList || task.list_id === selectedList;
    const matchesCompleted = showCompleted ? task.completed : !task.completed;
    
    return matchesSearch && matchesList && matchesCompleted;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TasksNavbar
        lists={lists}
        selectedList={selectedList}
        showCompleted={showCompleted}
        searchQuery={searchQuery}
        onListSelect={setSelectedList}
        onShowCompletedToggle={() => setShowCompleted(!showCompleted)}
        onSearchChange={setSearchQuery}
        onProfileClick={() => navigate("/profile")}
        onLogout={async () => {
          await supabase.auth.signOut();
          navigate("/auth");
        }}
      />

      <main className="flex-1 container mx-auto px-4 py-6 pb-32">
        <TaskList
          tasks={filteredTasks}
          lists={lists}
          onToggleTask={toggleTask}
          onDeleteTask={deleteTask}
        />
      </main>

      <QuickAddBar
        onOpenModal={() => setIsModalOpen(true)}
        onQuickAdd={(title) => {
          const defaultList = lists[0];
          if (defaultList) {
            addTask({
              title,
              category: defaultList.name,
              list_id: defaultList.id,
            });
          }
        }}
      />

      <AddTaskModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        lists={lists}
        onAddTask={addTask}
      />
    </div>
  );
};

export default Tasks;
