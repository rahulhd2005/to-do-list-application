import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const motivationalMessages = [
  "Great things never come from comfort zones!",
  "Today is the perfect day to be productive!",
  "Small progress is still progress!",
  "You've got this! Let's make today count!",
  "Success is the sum of small efforts repeated daily!",
];

const Welcome = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [message] = useState(
    motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
  );

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/auth");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("name")
        .eq("id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } else if (profile) {
        setUserName(profile.name);
      }

      setLoading(false);
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/20" />
          <div className="h-8 w-48 bg-muted rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="text-center max-w-2xl animate-fade-in">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl gradient-primary shadow-glow mb-8 animate-pulse">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome back, {userName}!
        </h1>
        
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 animate-slide-up">
          {message}
        </p>
        
        <Button
          size="lg"
          onClick={() => navigate("/tasks")}
          className="gradient-primary text-lg px-8 py-6 shadow-glow hover:shadow-lg transition-all"
        >
          View Your Tasks
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        
        <div className="mt-12 grid grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-2xl font-bold text-primary mb-1">📝</div>
            <div className="text-sm text-muted-foreground">Stay Organized</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-2xl font-bold text-secondary mb-1">⚡</div>
            <div className="text-sm text-muted-foreground">Be Productive</div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border">
            <div className="text-2xl font-bold text-accent mb-1">🎯</div>
            <div className="text-sm text-muted-foreground">Achieve Goals</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
