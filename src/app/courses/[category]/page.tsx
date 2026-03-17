import { createClient } from "@/lib/supabase-server";
import CourseGrid from "@/components/CourseGrid";
import Link from "next/link";
import { ChevronRight, Home, Tags } from "lucide-react";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = createClient();
  const decodedCategory = decodeURIComponent(params.category);
  
  // Get currently authed user
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Fetch courses directly matching category
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .ilike("category", decodedCategory)
    .order("created_at", { ascending: false });

  // Fetch user progress
  let userProgress: any[] = [];
  if (userId && courses && courses.length > 0) {
    const courseIds = courses.map(c => c.id);
    const { data: progress } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId)
      .in("course_id", courseIds);
    userProgress = progress || [];
  }

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
        <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
          <Home className="w-4 h-4" /> Home
        </Link>
        <ChevronRight className="w-4 h-4" />
        <Link href="/courses" className="hover:text-foreground transition-colors">
          Courses
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">{decodedCategory}</span>
      </nav>

      {/* Hero Banner */}
      <div className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-sm flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-teal-500 mb-2">
            <Tags className="w-6 h-6" />
            <span className="font-semibold uppercase tracking-wider text-sm">Category</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight">{decodedCategory}</h1>
        </div>
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Course Grid pre-filtered */}
      <CourseGrid 
        initialCourses={courses || []} 
        userProgress={userProgress} 
        initialCategory={decodedCategory}
        categories={[]}
      />
    </div>
  );
}
