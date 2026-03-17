import { createClient } from "@/lib/supabase-server";
import CourseGrid from "@/components/CourseGrid";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CoursesPage() {
  const supabase = createClient();
  
  // Get currently authed user
  const { data: { session } } = await supabase.auth.getSession();
  const userId = session?.user?.id;

  // Fetch all courses
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .order("created_at", { ascending: false });

  // Fetch user progress for these courses if logged in
  let userProgress: any[] = [];
  if (userId) {
    const { data: progress } = await supabase
      .from("course_progress")
      .select("*")
      .eq("user_id", userId);
    userProgress = progress || [];
  }

  // Get unique categories sorted alphabetically
  const uniqueCategories = Array.from(
    new Set((courses || []).map((c) => c.category))
  )
    .filter(Boolean)
    .sort();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-500 rounded-3xl p-8 md:p-12 text-white shadow-lg overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Course Catalog</h1>
          <p className="text-blue-50 text-lg opacity-90">
            Browse our extensive collection of courses synced directly from Coursera. Filter by category, institution, or search for exactly what you need to level up your career.
          </p>
        </div>
        <BookOpen className="absolute -bottom-10 -right-10 w-64 h-64 text-white opacity-10 rotate-12" />
      </div>

      {/* Main Grid */}
      <CourseGrid 
        initialCourses={courses || []} 
        userProgress={userProgress} 
        categories={uniqueCategories as string[]}
      />
    </div>
  );
}
