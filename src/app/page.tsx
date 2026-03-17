import Link from "next/link";
import { ArrowRight, BookOpen, BrainCircuit, ShieldCheck } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-500/10 via-background to-teal-500/10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/20 blur-[100px] rounded-full z-0 pointer-events-none"></div>

        <div className="z-10 max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 dark:text-teal-400 font-medium text-sm mb-4 border border-teal-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
            </span>
            LearnHub Next-Gen is Live
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight">
            Master Technical Skills <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-500">
              Smarter & Faster
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Elevate your career with industry-leading courses synced directly from Coursera. Featuring an AI assistant to guide your learning journey.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/courses" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-500 text-white rounded-2xl font-bold hover:bg-blue-600 hover:-translate-y-1 transition-all duration-200 shadow-xl shadow-blue-500/20 flex items-center justify-center gap-2 text-lg"
            >
              Explore Courses <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              href="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-card text-foreground border border-border rounded-2xl font-bold hover:bg-secondary hover:-translate-y-1 transition-all duration-200 shadow-sm flex items-center justify-center text-lg"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-secondary/50 py-24 px-4 z-10 border-t border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vast Library</h3>
            <p className="text-muted-foreground leading-relaxed">
              Access thousands of premium tech courses from top institutions natively synced to our portal.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-teal-500/10 text-teal-500 rounded-2xl flex items-center justify-center mb-6">
              <BrainCircuit className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">AI Powered</h3>
            <p className="text-muted-foreground leading-relaxed">
              Stuck? Our integrated HuggingFace powered chatbot assistant is always ready to help explain complex topics.
            </p>
          </div>

          <div className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold mb-3">Secure Progress</h3>
            <p className="text-muted-foreground leading-relaxed">
              Never lose track of your work with robust session management backed by Supabase Auth and isolated pipelines.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
