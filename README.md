# Gopal Maddheshiya — Developer Portfolio

A personal portfolio website showcasing full-stack web development projects, Data Structures & Algorithms problem-solving stats, academic background, and technical credentials.

Live Demo: [https://gopal-maddheshiya.vercel.app](https://gopal-maddheshiya.vercel.app)

---

## Overview

This repository contains the source code for my personal portfolio. The application is built using React 19, TypeScript, TanStack Start, and Tailwind CSS v4, focusing on performance, clean component architecture, and responsive design.

---

## Features

- **Hero & Profile**: Interactive typing role animation and developer status indicator.
- **Highlights Ticker**: Smooth scroll-direction-aware continuous marquee for quick credentials and section shortcuts.
- **About & Education**: Background narrative, core engineering principles, and B.Tech CSE coursework details.
- **Skills Matrix**: Categorized technical skills across Languages, Frontend, Backend, Databases, and Developer Tools.
- **Featured Projects**: Full-stack web applications with direct live demo links and GitHub repository references.
- **DSA & Problem Solving**: LeetCode stats tracker (50+ problems solved) and Java solutions repository links.
- **Roadmap & Journey**: Timeline tracking learning milestones and technical growth.
- **Coding Profiles**: Quick links to LeetCode, GitHub, GeeksforGeeks, CodeChef, and HackerRank.
- **Verified Certifications**: Credential cards with direct PDF preview and download capabilities.
- **Theme Support**: Dark and light mode switching with persistent user preference.
- **Contact Form**: Client-side validated contact form powered by EmailJS.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, TanStack Router, TanStack Start
- **Styling**: Tailwind CSS v4, Lucide Icons
- **Server / SSR Engine**: Nitro
- **Email Service**: EmailJS
- **Deployment**: Vercel

---

## Project Structure

```text
├── public/
│   ├── certificates/        # Verified PDF credentials
│   └── favicon.svg          # Site icon
├── src/
│   ├── assets/              # Static profile images
│   ├── components/
│   │   ├── portfolio/       # Modular portfolio components
│   │   └── ui/              # Base UI primitives
│   ├── data/
│   │   └── profile.ts       # Central data configuration
│   ├── hooks/               # Custom React hooks
│   ├── routes/              # TanStack Router page routes
│   └── styles.css           # Design tokens and global CSS
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/gopal-maddheshiya/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Set up environment variables for EmailJS in a `.env` file:
   ```env
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```

---

## Deployment

The project is configured for one-click deployment on **Vercel**:

1. Push your repository to GitHub.
2. Import the repository in your Vercel dashboard.
3. Vercel automatically detects the build command (`npm run build`) and output directory.
4. Click **Deploy**.

---

## Contact

- **Name**: Gopal Maddheshiya
- **Education**: B.Tech CSE (2024–2028), Shri Ramswaroop Memorial University
- **LinkedIn**: [linkedin.com/in/gopal-maddheshiya-05049a2a7](https://linkedin.com/in/gopal-maddheshiya-05049a2a7)
- **GitHub**: [github.com/gopal-maddheshiya](https://github.com/gopal-maddheshiya)
- **LeetCode**: [leetcode.com/u/gopalmaddheshiya80/](https://leetcode.com/u/gopalmaddheshiya80/)
- **Email**: [gopalmaddheshiya80@gmail.com](mailto:gopalmaddheshiya80@gmail.com)

---

## License

This project is licensed under the MIT License.
