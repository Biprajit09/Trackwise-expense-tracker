# Monexa – Expense Tracker 💰

[![Next.js](https://img.shields.io/badge/Next.js-13+-black?logo=next.js)](https://nextjs.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://monexa.vercel.app)

A modern **expense tracker app** built with Next.js, Supabase, TailwindCSS, and Vercel.  
It helps you manage your **income, expenses, and savings** in a clean and responsive UI.  

👉 **Live Demo:** [https://monexa.vercel.app](https://vercel-xi-weld.vercel.app/)

---

## ✨ Features

- 🔐 **Authentication** – Secure login/logout with Supabase  
- 💸 **Expense Management** – Add and categorize expenses  
- 📊 **Income Tracking** – Track your monthly earnings  
- 📈 **Dashboard Analytics** – Visualize spending trends  
- 👤 **User Profile** – Manage your personal account  
- ⚡ **Fast & Responsive** – Built with Next.js App Router + TailwindCSS  
- 🌩️ **Deployed on Vercel** – Easy one-click deployment  

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 13+ (App Router)](https://nextjs.org/)  
- **Database & Auth:** [Supabase](https://supabase.com/)  
- **Styling:** [TailwindCSS](https://tailwindcss.com/)  
- **Icons & Animations:** [Lucide React](https://lucide.dev/), [Framer Motion](https://www.framer.com/motion/)  
- **Deployment:** [Vercel](https://vercel.com/)  

---

## 🚀 Getting Started (Local Development)

Follow these steps to set up Monexa locally:

### 1. Clone the repository
```bash
git clone https://github.com/Biprajit09/monexa-expense-tracker.git
cd monexa-expense-tracker
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root and add your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```


### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📂 Project Structure

```
monexa-expense-tracker/
├── .next
├── .vercel
├── app/                # Next.js App Router
│   ├── about
│   ├── categories
│   ├── components
│   ├── dashboard
│   ├── expenses
│   ├── income
│   ├── login
│   ├── logout
│   ├── profile
│   ├── signup
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js
│   ├── page.js
│   └── page.metadata.js
├── components/         # Reusable UI components
├── lib/                # Supabase client & helpers (supabaseClient.js)
├── node_modules
├── public/             # Static assets
├── .env                # (ignored) local env file
├── .gitignore
├── env.example
├── jsconfig.json
├── next-env.d.ts
├── next.config.mjs
└── package.json
```

---

## 🌍 Deployment

This project is deployed on **Vercel**. To deploy your own copy:

1. Push your repo to GitHub.
2. Connect the repository in Vercel dashboard.
3. Add these Environment Variables in Vercel (Project → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Trigger a deploy (push to `main` or deploy from Vercel UI).

Your site will be available at `https://<your-project-name>.vercel.app`.

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repo  
2. Create a branch (`feature/your-feature`)  
3. Commit your changes  
4. Open a Pull Request

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👤 Author

Built with ❤️ by **Biprajit**  
GitHub: [Biprajit09](https://github.com/Biprajit09) • Live: [https://monexa.vercel.app](https://monexa.vercel.app)

