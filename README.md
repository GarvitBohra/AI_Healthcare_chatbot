# Healthcare AI Coordination System

A web-based healthcare coordination system designed to provide patients with access to their health metrics and an interactive health assistant. Built with HTML, Vanilla JavaScript, Supabase PostgreSQL, Google Gemini API, and Vercel Serverless Functions.

## Project Overview

The Healthcare AI Coordination System allows users to monitor vital health metrics (heart rate, blood pressure, clinical status) and interact with an informational health assistant powered by Google Gemini API. Patient data is securely retrieved from a Supabase PostgreSQL database while Gemini API requests are routed through a serverless backend.

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Frontend                     │
│                (HTML5 / CSS3 / Vanilla JS)              │
└──────────────┬───────────────────────────┬──────────────┘
               │                           │
               │ Fetch Vitals              │ Send Chat Request
               ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Supabase Database     │ │   Vercel Serverless API   │
│   (PostgreSQL + RLS)      │ │        (/api/chat)        │
└───────────────────────────┘ └────────────┬──────────────┘
                                           │
                                           │ Invoke Gemini API
                                           ▼
                              ┌───────────────────────────┐
                              │     Google Gemini API     │
                              └───────────────────────────┘
```

## Features

- **Patient Health Dashboard**: View real-time vitals including heart rate, blood pressure, and clinical status.
- **Synthetic Patient Records**: Patient cohort dataset stored in Supabase PostgreSQL with Row Level Security.
- **Gemini Health Assistant**: Informational assistant to explain health metrics and care recommendations.
- **Vercel Serverless Backend**: Keeps API keys protected by processing Gemini requests on the server side.
- **Responsive UI**: Modern glassmorphism layout optimized for desktop and mobile viewports.

## Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript
- **Database**: Supabase PostgreSQL
- **AI Integration**: Google Gemini API
- **Hosting & Serverless Functions**: Vercel

## System Requirements & Prerequisites

- Node.js (v18.0.0 or higher)
- npm
- Supabase Account & Project
- Google Gemini API Key

## Local Setup & Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/GarvitBohra/AI_Healthcare_chatbot.git
   cd AI_Healthcare_chatbot
   ```

2. **Set up Supabase Database**:
   - Create a new project in your [Supabase Dashboard](https://supabase.com/).
   - Open the **SQL Editor** in Supabase.
   - Copy the contents of `supabase/schema.sql` and run the script to create the `patients` table and insert synthetic patient records.
   - Retrieve your **Supabase URL** and **Supabase Anon Key** from Project Settings > API.

3. **Get Google Gemini API Key**:
   - Obtain an API key from Google AI Studio.

4. **Configure Environment Variables**:
   - Copy `.env.example` to create a `.env.local` file:
     ```bash
     cp .env.example .env.local
     ```
   - Populate `.env.local` with your credentials:
     ```env
     GEMINI_API_KEY=your_gemini_api_key_here
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

5. **Install Dependencies**:
   ```bash
   npm install
   ```

6. **Run Locally**:
   - Using Vercel CLI:
     ```bash
     npx vercel dev
     ```
   - Open `http://localhost:3000` in your browser.

## Deployment to Vercel

1. Push your code to your GitHub repository.
2. Import the project repository into your [Vercel Dashboard](https://vercel.com).
3. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
4. Click **Deploy**.

## Synthetic Data Disclaimer

> **Disclaimer**: This project uses synthetic/demo healthcare data and is not intended for real patient information or medical diagnosis.
