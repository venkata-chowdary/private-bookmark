# Smart Bookmark App

A modern, minimalist bookmark manager built with **Next.js 15 (App Router)** and **Supabase**. This application allows users to save, manage, and delete private bookmarks with real-time synchronization across devices and tabs.

## Features

- **Google Authentication**: Secure sign-in using Supabase Auth.
- **Private Bookmarks**: Row Level Security (RLS) ensures users can only see their own data.
- **Realtime Updates**: Bookmarks appear instantly in other tabs without refreshing.
- **Minimalist UI**: Clean, distraction-free interface inspired by Linear and Vercel.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Database & Auth**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript

## Challenges & Solutions

During the development of this project, I encountered and resolved a few key challenges:

### 1. Locating Supabase Project Configuration

**The Problem:**
Although I was familiar with Supabase from previous projects, the dashboard interface had recently changed. I initially struggled to find the Project URL and API Keys because their location had moved.

**The Solution:**
I patiently navigated through the new Project Settings layout until I located the API section. Once found, I verified the `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to ensure the client could successfully connect to the database instance.

### 2. Implementing Realtime Updates

**The Problem:**
I needed the bookmark list to update automatically when a new link was added or deleted.
_Initial thought:_ I considered implementing a custom WebSocket server to handle event broadcasting.
_Constraint:_ Since the app doesn't have an external custom backend (it relies on Supabase & Next.js), adding a separate WebSocket server would have added unnecessary complexity.

**The Solution:**
I realized Supabase has a built-in **Realtime** engine. It listens to PostgreSQL database changes (`INSERT`, `UPDATE`, `DELETE`) and broadcasts them via websockets automatically.
_Implementation:_ I utilized the `supabase.channel().on('postgres_changes', ...)` API to listen for `INSERT` and `DELETE` events on the `bookmarks` table. This allowed me to achieve seamless realtime sync with just a few lines of client-side code, keeping the architecture simple and serverless.
