"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import CourseCard from "./CourseCard";
import { Search } from "lucide-react";

interface CourseGridProps {
  initialCourses: any[];
  userProgress: any[];
  initialCategory?: string;
  categories: string[];
}

export default function CourseGrid({ initialCourses, userProgress, initialCategory, categories }: CourseGridProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || "All");

  const filteredCourses = initialCourses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.institution?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || course.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Categories (only show if not pre-filtered via dynamic route) */}
        {!initialCategory ? (
          <div className="flex gap-2 p-1 bg-secondary rounded-2xl overflow-x-auto max-w-full pb-2 md:pb-1 scrollbar-hide">
             {["All", ...categories].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-500 text-white shadow"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        ) : (
          <h2 className="text-2xl font-bold">{initialCategory} Courses</h2>
        )}

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredCourses.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredCourses.map((course) => {
            const progress = userProgress.find(p => p.course_id === course.id);
            return <CourseCard key={course.id} course={course} userProgress={progress} />;
          })}
        </motion.div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 text-muted-foreground opacity-50" />
          </div>
          <h3 className="text-xl font-bold mb-2">No courses found</h3>
          <p className="text-muted-foreground max-w-md">
            We couldn't find any courses matching your current filters. Try adjusting your search query or category.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory(initialCategory || "All"); }}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
