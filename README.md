<div align="center">
  <img src="https://raw.githubusercontent.com/lucide-icons/lucide/main/icons/infinity.svg" alt="LearnHub Logo" width="100" />
  
  # LearnHub LMS
  
  **A Next-Generation, Open-Source Learning Management System**
  
  [Deployment](https://vercel.com) • [Tech Stack](#-tech-stack) • [Features](#-key-features) • [Getting Started](#-getting-started)
</div>

<br/>

## ✨ Overview

LearnHub is a full-stack, production-ready Learning Management System designed with a focus on modern aesthetics, dynamic user experiences, and robust serverless architecture. Built on **Next.js 14 (App Router)** and **Supabase**, it seamlessly integrates external course catalogs and provides an immersive environment for students to track their progress.

<br/>

## 🚀 Key Features

*   🔐 **Secure Authentication:** End-to-end user registration and session management powered by Supabase Auth (JWT).
*   📚 **Dynamic Course Catalog:** Live synchronization with Coursera via the RapidAPI network.
*   🎥 **YouTube Video Previews:** Smart video discovery for every course, allowing users to watch introductory content directly on the platform.
*   🤖 **AI Learning Assistant:** An integrated, floating AI Chatbot powered by **NVIDIA NIM (Llama 3.1 8B)** to help students navigate topics and courses.
*   📊 **Progress Tracking:** Beautiful dashboard visualizing user learning streaks, enrolled courses, and completion metrics.
*   🌗 **Theming:** Seamless Light/Dark mode transitions powered by `next-themes`.
*   💫 **Fluid Animations:** Spring-physics based micro-interactions and route transitions via `Framer Motion`.

<br/>

## 🛠 Tech Stack

*   **Framework:** Next.js 14+ (React, App Router)
*   **Language:** TypeScript
*   **Database & Auth:** Supabase (PostgreSQL)
*   **Styling:** Tailwind CSS + clsx + tailwind-merge
*   **Animations:** Framer Motion
*   **AI Integration:** OpenAI SDK targeting NVIDIA API (Llama 3.1)
*   **Icons:** Lucide React

<br/>

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/learnhub-lms.git
cd learnhub-lms
npm install
```

### 2. Environment Variables
Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# For Course Catalog Sync
RAPIDAPI_KEY=your_rapidapi_key

# For AI Learning Assistant
NEXT_PUBLIC_NVIDIA_API_KEY=your_nvidia_api_key

# For YouTube Video Previews
YOUTUBE_API_KEY=your_youtube_api_key
```

### 3. Database Setup (Supabase)
Execute the SQL provided in `/supabase/schema.sql` in your Supabase SQL Editor. This will generate the `profiles`, `courses`, and `course_progress` tables alongside necessary Trigger functions and Row Level Security (RLS) policies.

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

<br/>

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.
