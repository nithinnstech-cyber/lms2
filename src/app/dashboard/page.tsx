import { createClient } from "@/lib/supabase-server";
import { BookOpen, CheckCircle, Flame, Clock, Navigation } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  // Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", userId)
    .single();

  const name = profile?.full_name || session.user.email?.split("@")[0] || "Student";

  // Fetch Progress
  const { data: progressList } = await supabase
    .from("course_progress")
    .select("*, courses(*)")
    .eq("user_id", userId)
    .order("last_accessed_at", { ascending: false });

  const enrolled = progressList || [];
  const inProgress = enrolled.filter(p => p.status === "in_progress");
  const completed = enrolled.filter(p => p.status === "completed");
  const recentlyAccessed = enrolled.slice(0, 4);

  const categories = [
    { name: "Docker", icon: "🐳", href: "/courses/Docker" },
    { name: "Networking", icon: "📡", href: "/courses/Networking" },
    { name: "Python", icon: "🐍", href: "/courses/Python" },
    { name: "Cloud", icon: "☁️", href: "/courses/Cloud" },
    { name: "Linux", icon: "🐧", href: "/courses/Linux" },
    { name: "DevOps", icon: "⚙️", href: "/courses/DevOps" },
    { name: "Git", icon: "📁", href: "/courses/Git" },
    { name: "Security", icon: "🔒", href: "/courses/Security" },
    { name: "Kubernetes", icon: "☸️", href: "/courses/Kubernetes" },
  ];

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-12">
      {/* Header & Greeting */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Welcome back, <span className="text-blue-500">{name}</span> 👋
          </h1>
          <p className="text-muted-foreground">Here is what&apos;s happening with your learning today.</p>
        </div>
        
        {/* Streak Indicator */}
        <div className="flex items-center gap-3 bg-card border border-border p-4 rounded-2xl shadow-sm self-start">
          <div className="w-12 h-12 bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xl font-bold">12 Days</div>
            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Learning Streak</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">In Progress</h3>
            <div className="p-2 bg-blue-500/10 text-blue-500 rounded-xl"><Clock className="w-5 h-5" /></div>
          </div>
          <p className="text-4xl font-bold">{inProgress.length}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Completed</h3>
            <div className="p-2 bg-teal-500/10 text-teal-500 rounded-xl"><CheckCircle className="w-5 h-5" /></div>
          </div>
          <p className="text-4xl font-bold">{completed.length}</p>
        </div>
        <div className="bg-card border border-border p-6 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-muted-foreground">Total Enrolled</h3>
            <div className="p-2 bg-purple-500/10 text-purple-500 rounded-xl"><BookOpen className="w-5 h-5" /></div>
          </div>
          <p className="text-4xl font-bold">{enrolled.length}</p>
        </div>
      </div>

      {/* Recently Accessed */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="text-teal-500 w-6 h-6" /> Recently Accessed
          </h2>
          <Link href="/progress" className="text-sm font-medium text-blue-500 hover:underline">
            View all progress
          </Link>
        </div>
        
        {recentlyAccessed.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentlyAccessed.map((prog) => (
              <CourseCard key={prog.id} course={prog.courses} userProgress={prog} />
            ))}
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-muted-foreground opacity-50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No active courses</h3>
            <p className="text-muted-foreground mb-6">You haven&apos;t enrolled in any courses yet.</p>
            <Link href="/courses" className="px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-medium">
              Explore Catalog
            </Link>
          </div>
        )}
      </div>

      {/* Category Quick Access */}
      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Navigation className="text-blue-500 w-6 h-6" /> Explore Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              href={cat.href}
              className="bg-card border border-border p-4 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-blue-500/30 transition-all duration-200 flex flex-col items-center justify-center text-center gap-2 group"
            >
              <div className="text-3xl group-hover:scale-110 transition-transform">{cat.icon}</div>
              <span className="font-semibold">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
