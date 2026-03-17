"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Star, CheckCircle, PlayCircle, BookOpen, X } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CourseCardProps {
  course: any;
  userProgress?: any;
}

export default function CourseCard({ course, userProgress }: CourseCardProps) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [fetchingVideo, setFetchingVideo] = useState(false);

  const status = userProgress?.status || "not_started";

  const handlePreview = async () => {
    if (videoId) {
      setShowPreview(true);
      return;
    }

    setFetchingVideo(true);
    try {
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(course.title)}`);
      const data = await response.json();
      if (data.videoId) {
        setVideoId(data.videoId);
        setShowPreview(true);
      }
    } catch (error) {
      console.error("Failed to fetch preview:", error);
    } finally {
      setFetchingVideo(false);
    }
  };

  const handleEnrollOrUpdate = async (newStatus: "in_progress" | "completed") => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      router.push("/login");
      return;
    }

    const payload = {
      course_id: course.id,
      user_id: session.user.id,
      status: newStatus,
      enrolled_at: userProgress ? userProgress.enrolled_at : new Date().toISOString(),
      completed_at: newStatus === "completed" ? new Date().toISOString() : null,
      last_accessed_at: new Date().toISOString(),
    };

    if (userProgress) {
      await supabase.from("course_progress").update(payload).eq("id", userProgress.id);
    } else {
      await supabase.from("course_progress").insert([payload]);
    }

    setLoading(false);
    router.refresh();
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2 }}
        className="bg-card border border-border rounded-3xl overflow-hidden shadow-md hover:shadow-xl flex flex-col h-full"
      >
        <div className="relative h-48 w-full bg-muted group">
          {course.thumbnail_url ? (
            <img
              src={course.thumbnail_url}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500/10 text-blue-500">
              <BookOpen className="w-12 h-12 opacity-50" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              onClick={handlePreview}
              disabled={fetchingVideo}
              className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300"
            >
              {fetchingVideo ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <PlayCircle className="w-4 h-4" />
              )}
              {fetchingVideo ? "Searching..." : "Preview Video"}
            </button>
          </div>

          <div className="absolute top-4 left-4 bg-background/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-foreground border border-border/50">
            {course.category}
          </div>
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 leading-tight">{course.title}</h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4 flex-grow">{course.description}</p>
          
          <div className="flex items-center justify-between text-sm mb-6">
            <span className="font-medium text-teal-500">{course.institution}</span>
            <div className="flex items-center gap-1 text-yellow-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-medium text-foreground">{course.rating || "New"}</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-auto">
            {status === "completed" ? (
              <div className="flex items-center gap-2 text-green-500 font-medium text-sm">
                <CheckCircle className="w-5 h-5" /> Completed
              </div>
            ) : status === "in_progress" ? (
              <button
                disabled={loading}
                onClick={() => handleEnrollOrUpdate("completed")}
                className="px-4 py-2 bg-teal-500/10 text-teal-600 dark:text-teal-400 hover:bg-teal-500 hover:text-white transition-colors rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" /> Mark Complete
              </button>
            ) : (
              <button
                disabled={loading}
                onClick={() => handleEnrollOrUpdate("in_progress")}
                className="px-4 py-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500 hover:text-white transition-colors rounded-xl text-sm font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <PlayCircle className="w-4 h-4" /> Enroll
              </button>
            )}

            <a
              href={course.course_url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full transition-colors"
              title="Go to Course"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {showPreview && videoId && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPreview(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl"
            >
              <button
                onClick={() => setShowPreview(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
