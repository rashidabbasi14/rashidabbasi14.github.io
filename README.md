
<p align="center">
  <img src="public/uploads/logo.png" alt="PortfolioBuilder Logo" width="80" height="80" />
</p>

<h1 align="center">PortfolioBuilder</h1>

<p align="center">
  <strong>Build a stunning, professional portfolio website in minutes — no coding required.</strong>
  <br />
  Showcase your skills, projects, and experience with a personalized portfolio that stands out.
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-environment-variables">Environment Variables</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-deployment">Deployment</a>
</p>

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎨 **Customizable Themes** | Choose from beautiful templates and customize colors, fonts, and layouts to match your personal brand. |
| 📱 **Responsive Design** | Your portfolio looks great on all devices — desktop, tablet, and mobile. Built with Tailwind CSS v4. |
| 🔗 **Personal Subdomain** | Get a personalized URL (`yourname.portfoliobuilder.com`) to share with employers and clients. |
| 💼 **Project Showcase** | Display your work with rich descriptions, images, GitHub links, and live demos. |
| 📊 **Skills & Experience** | Organize skills by category, highlight work experience, and list certifications — all in one place. |
| 📬 **Contact Form** | Let visitors reach out to you directly through an integrated contact form with email notifications. |
| 🔐 **Authentication** | Secure sign-in via Clerk (Google OAuth, email/password, and more). |
| 🛠️ **Admin Dashboard** | Full CRUD management for profile, projects, skills, education, employment, and certifications. |
| 🖼️ **Rich Text Editor** | Write compelling project descriptions with a built-in rich text editor (Markdown support). |
| 🌍 **Public Portfolio Pages** | Share your portfolio with the world — fully server-side rendered for SEO. |
| 🔒 **Private Mode** | Option to keep your portfolio private when needed. |
| ☁️ **Cloud Storage** | Images uploaded and served via Cloudflare R2 (S3-compatible). |
| ⚡ **Edge Caching** | Redis-powered caching via Upstash for blazing-fast page loads. |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, React 19) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) |
| **Authentication** | [Clerk](https://clerk.com/) |
| **File Storage** | [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) (S3-compatible) |
| **Caching** | [Upstash Redis](https://upstash.com/) |
| **Email** | Nodemailer (SMTP) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 20+ 
- [npm](https://www.npmjs.com/) (or yarn, pnpm, bun)
- A [Neon](https://neon.tech/) PostgreSQL database
- A [Clerk](https://clerk.com/) application
- A [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) bucket
- An [Upstash Redis](https://upstash.com/) instance
- SMTP credentials for email (e.g., Gmail, SendGrid, Mailgun)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/portfolio-builder.git
   cd portfolio-builder
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and fill in your credentials:

   ```bash
   cp .env.local.example .env.local
   ```

   See the [Environment Variables](#-environment-variables) section below for details.

4. **Run database migrations**

   ```bash
   npm run drizzle:generate
   npm run drizzle:migrate
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

Create a `.env.local` file in the project root with the following variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook signing secret |
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | Clerk sign-in URL (e.g., `/login`) |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | Clerk sign-up URL (e.g., `/login`) |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` | Post-login redirect URL |
| `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` | Post-registration redirect URL |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 access key |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 secret key |
| `R2_BUCKET_NAME` | Cloudflare R2 bucket name |
| `R2_ENDPOINT` | Cloudflare R2 endpoint URL |
| `R2_PUBLIC_URL` | Cloudflare R2 public URL base |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP server port |
| `SMTP_USER` | SMTP username |
| `SMTP_PASS` | SMTP password |
| `SMTP_FROM` | From email address for contact form |
| `NEXT_PUBLIC_SITE_NAME` | Site name (defaults to "PortfolioBuilder") |

---

## 📁 Project Structure

```
├── public/
│   ├── uploads/          # Static assets (logo, background)
│   └── favicon/          # Favicon assets
├── src/
│   ├── app/
│   │   ├── (public)/     # Public portfolio pages (subdomain routing)
│   │   │   └── [userId]/
│   │   │       ├── page.tsx
│   │   │       ├── project/[id]/page.tsx
│   │   │       └── projects/page.tsx
│   │   ├── admin/        # Admin dashboard (CRUD for all sections)
│   │   ├── api/          # API routes (REST endpoints)
│   │   ├── login/        # Authentication pages
│   │   ├── onboarding/   # Username selection after sign-up
│   │   ├── projects/     # Projects listing page
│   │   └── page.tsx      # Landing page
│   ├── components/       # Reusable React components
│   ├── db/
│   │   ├── schema.ts     # Drizzle ORM schema definitions
│   │   └── index.ts      # Database client
│   └── lib/
│       ├── data.ts       # Data access layer (queries)
│       ├── r2.ts         # Cloudflare R2 client
│       └── redis.ts      # Upstash Redis client
├── drizzle/              # Migration files
├── scripts/              # Utility scripts
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json
```

---

## 📦 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (Webpack) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run clean` | Clean `.next` build cache |
| `npm run drizzle:generate` | Generate Drizzle migrations |
| `npm run drizzle:migrate` | Run Drizzle migrations |
| `npm run drizzle:studio` | Open Drizzle Studio (GUI) |

---

## 🌐 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1. Push your repository to GitHub.
2. Import the project into Vercel.
3. Add all environment variables from `.env.local` to your Vercel project settings.
4. Deploy — Vercel will automatically detect Next.js and configure the build.

> **Note:** Ensure your Neon database, Cloudflare R2 bucket, Upstash Redis, and Clerk application are configured for production before deploying.

---

## 📄 License

This project is private and proprietary.

---

<p align="center">
  Built with ❤️ using <a href="https://nextjs.org/">Next.js</a>, <a href="https://tailwindcss.com/">Tailwind CSS</a>, and <a href="https://orm.drizzle.team/">Drizzle ORM</a>
</p>
