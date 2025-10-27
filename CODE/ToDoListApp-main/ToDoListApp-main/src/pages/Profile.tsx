import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface Stats {
  total: number;
  completed: number;
  remaining: number;
}

const Profile = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [stats, setStats] = useState<Stats>({ total: 0, completed: 0, remaining: 0 });
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      // Fetch profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();

      if (profile) {
        setUserName(profile.name);
      }

      // Fetch tasks stats
      const { data: tasks } = await supabase
        .from("tasks")
        .select("completed, created_at")
        .eq("user_id", session.user.id);

      if (tasks) {
        const completed = tasks.filter((t) => t.completed).length;
        setStats({
          total: tasks.length,
          completed,
          remaining: tasks.length - completed,
        });

        // Calculate weekly data
        const today = new Date();
        const weekData = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const dateStr = date.toISOString().split("T")[0];
          
          const dayTasks = tasks.filter((t) => 
            t.created_at.startsWith(dateStr)
          );
          const dayCompleted = dayTasks.filter((t) => t.completed).length;
          
          weekData.push({
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
            completed: dayCompleted,
            pending: dayTasks.length - dayCompleted,
          });
        }
        
        setWeeklyData(weekData);
      }

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-2xl bg-primary/20 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <Button
          variant="ghost"
          onClick={() => navigate("/tasks")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tasks
        </Button>

        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="gradient-primary text-white">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                  <User className="w-8 h-8" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-white">{userName}</CardTitle>
                  <p className="text-white/80">Task Master</p>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Tasks
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total}</div>
              </CardContent>
            </Card>

            <Card className="border-success/50 bg-success/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed
                  </CardTitle>
                  <CheckCircle2 className="h-4 w-4 text-success" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success">{stats.completed}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {completionRate}% completion rate
                </p>
              </CardContent>
            </Card>

            <Card className="border-warning/50 bg-warning/5">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Remaining
                  </CardTitle>
                  <Clock className="h-4 w-4 text-warning" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-warning">{stats.remaining}</div>
              </CardContent>
            </Card>
          </div>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="day" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                  <Bar dataKey="pending" name="Pending" fill="hsl(var(--warning))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;
