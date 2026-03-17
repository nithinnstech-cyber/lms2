"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { Award, Clock, BookOpen } from "lucide-react";

interface ProgressPageClientProps {
  progressList: any[];
}

export default function ProgressPageClient({ progressList }: ProgressPageClientProps) {
  const [activeTab, setActiveTab] = useState<"in_progress" | "completed" | "all">("in_progress");

  const inProgress = progressList.filter((p) => p.status === "in_progress");
  const completed = progressList.filter((p) => p.status === "completed");
  const completionRate = progressList.length > 0 
    ? Math.round((completed.length / progressList.length) * 100) 
    : 0;

  const displayList = activeTab === "all" 
    ? progressList 
    : activeTab === "in_progress" 
      ? inProgress 
      : completed;

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header & Stats summary */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">My Learning Path</h1>
          <p className="text-muted-foreground text-lg">Track your enrollments and celebrate your accomplishments.</p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center w-32">
              <span className="text-2xl font-bold text-blue-500">{progressList.length}</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Total</span>
            </div>
            <div className="bg-card border border-border p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center w-32">
              <span className="text-2xl font-bold text-teal-500">{completionRate}%</span>
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Completion</span>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-secondary rounded-2xl w-full md:w-max">
        <button
          onClick={() => setActiveTab("in_progress")}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "in_progress" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Clock className="w-4 h-4" /> In Progress ({inProgress.length})
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "completed" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Award className="w-4 h-4" /> Completed ({completed.length})
        </button>
        <button
          onClick={() => setActiveTab("all")}
          className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
            activeTab === "all" ? "bg-background text-foreground shadow" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <BookOpen className="w-4 h-4" /> All ({progressList.length})
        </button>
      </div>

      {/* Grid with animation */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {displayList.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
             {displayList.map((prog) => (
               <CourseCard key={`${prog.id}-${activeTab}`} course={prog.courses} userProgress={prog} />
             ))}
           </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center bg-card border border-border rounded-3xl shadow-sm">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-6">
                    {activeTab === "completed" 
                      ? <Award className="w-10 h-10 text-muted-foreground opacity-50" />
                      : <Clock className="w-10 h-10 text-muted-foreground opacity-50" />
                    }
                </div>
                <h3 className="text-xl font-bold mb-2">No courses found</h3>
                <p className="text-muted-foreground max-w-sm">
                  {activeTab === "completed" 
                    ? "You haven&apos;t completed any courses yet. Keep learning!"
                    : "You don&apos;t have any courses currently in progress."
                  }
                </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
