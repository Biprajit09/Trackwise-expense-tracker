"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } },
  };

  const letterVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 150, damping: 12 },
    },
  };

  // Professional SVG icons
  const ExpenseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

  const BudgetIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  const ReportIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );

  // Animated title letters
  const titleText = "exa";
  const titleLetters = titleText.split("");

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-white to-purple-50">
      {/* Hero Section */}
      <div className="w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-6xl mx-auto w-full gap-8 px-6 py-12 md:py-24">
          
          {/* Left: Text + Buttons */}
          <motion.div
            className="flex-1 flex flex-col items-center md:items-start text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Animated Title */}
            <motion.h1 className="text-5xl md:text-6xl font-bold mb-4 flex flex-wrap justify-center md:justify-start">
              {/* "mon" letters */}
              {"mon".split("").map((letter, i) => (
                <motion.span
                  key={`mon-${i}`}
                  variants={letterVariants}
                  className="inline-block text-[#5A31F4] font-poppins"
                  transition={{ delay: i * 0.1 }}
                  animate={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
                >
                  {letter}
                </motion.span>
              ))}

              {/* "exa" letters */}
              {titleLetters.map((letter, i) => (
                <motion.span
                  key={`exa-${i}`}
                  variants={letterVariants}
                  className="inline-block text-gray-900 font-roboto"
                  transition={{ delay: i * 0.1 + 0.3 }}
                  animate={{ y: [0, -5, 0], transition: { repeat: Infinity, duration: 1.5, ease: "easeInOut" } }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p className="mt-4 text-base md:text-lg lg:text-xl text-gray-600 max-w-md" variants={itemVariants}>
              Track your expenses, manage budgets, and gain financial clarity with ease.
            </motion.p>

            <motion.div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-6" variants={itemVariants}>
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -10px rgba(90, 49, 244, 0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-[#5A31F4] text-white rounded-xl font-medium text-lg transition-all duration-300"
                >
                  Get Started
                </motion.button>
              </Link>

              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -10px rgba(0,0,0,0.2)" }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-gray-900 border border-gray-200 rounded-xl font-medium text-lg transition-all duration-300"
                >
                  Login
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Hero Image */}
          <motion.div
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <motion.div animate={{ y: [0, -15, 0] }} transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}>
              <Image
                src="/finance-app-1-98.svg"
                alt="Finance illustration"
                width={500}
                height={350}
                className="rounded-xl drop-shadow-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 bg-gradient-to-t from-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            Why Choose Us?
          </motion.h2>

          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 w-full" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {[
              { title: "Track Expenses", desc: "Easily log your daily spending and categorize expenses.", icon: <ExpenseIcon />, gradient: "from-purple-500 to-indigo-600", color: "text-purple-600" },
              { title: "Manage Budgets", desc: "Set monthly budgets and stay on top of your finances.", icon: <BudgetIcon />, gradient: "from-blue-500 to-cyan-600", color: "text-blue-600" },
              { title: "Visualize Reports", desc: "Get clear insights with charts and analytics.", icon: <ReportIcon />, gradient: "from-green-500 to-emerald-600", color: "text-green-600" },
            ].map((feature, i) => (
              <motion.div key={i} className="p-6 rounded-2xl shadow-lg text-center w-full bg-white border border-gray-100 overflow-hidden relative group" variants={itemVariants} whileHover={{ y: -10, transition: { duration: 0.3 } }}>
                <motion.div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} initial={false} />
                <motion.div className={`mb-4 mx-auto ${feature.color}`} initial={{ scale: 0.8 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, delay: i * 0.1 }} viewport={{ once: true }}>
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
                <motion.div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-purple-400 to-blue-400 mt-4 mx-auto rounded-full transition-all duration-500" initial={false} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div className="w-full py-16 bg-gradient-to-r from-[#5A31F4] to-[#7C3AED] text-white" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
        <div className="max-w-4xl mx-auto text-center px-6">
          <motion.h2 className="text-3xl md:text-4xl font-bold mb-6" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} viewport={{ once: true }}>
            Ready to Take Control of Your Finances?
          </motion.h2>
          <motion.p className="text-xl mb-8 text-purple-100" initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
            Join thousands of users who are already managing their money smarter.
          </motion.p>
          <motion.div initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }}>
            <Link href="/signup">
              <motion.button whileHover={{ scale: 1.05, boxShadow: "0 15px 30px -10px rgba(255,255,255,0.3)" }} whileTap={{ scale: 0.95 }} className="px-8 py-4 bg-white text-[#5A31F4] rounded-xl font-bold text-lg transition-all duration-300">
                Start Your Financial Journey
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
