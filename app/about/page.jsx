"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  SiNextdotjs,
  SiTailwindcss,
  SiSupabase,
  SiFramer,
} from "react-icons/si";
import {
  FaBriefcase,
  FaUserAlt,
  FaLink,
  FaGithub,
  FaLinkedin,
  FaGlobe,
  FaEnvelope,
} from "react-icons/fa";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">
      {/* About the App Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-white via-gray-50 to-gray-200 shadow-lg rounded-2xl">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-700 via-indigo-500 to-indigo-400"
          >
            About Monexa
          </motion.h1>
          <p className="text-xl text-gray-800 max-w-3xl mx-auto mb-10 leading-relaxed">
            Monexa is crafted to simplify your financial management journey. Enjoy a sleek, intuitive platform to track income and expenses, powered by cutting-edge technologies for speed, scalability, and delightful user experience.
          </p>

          {/* Tech Stack Icons */}
          <div className="flex justify-center gap-12 flex-wrap mt-8">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition">
              <SiNextdotjs className="text-5xl text-black mb-2 drop-shadow" />
              <span className="text-sm font-medium text-gray-900">Next.js</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition">
              <SiTailwindcss className="text-5xl text-sky-400 mb-2 drop-shadow" />
              <span className="text-sm font-medium text-gray-900">Tailwind CSS</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition">
              <SiSupabase className="text-5xl text-green-600 mb-2 drop-shadow" />
              <span className="text-sm font-medium text-gray-900">Supabase</span>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-4 hover:scale-105 transition">
              <SiFramer className="text-5xl text-black mb-2 drop-shadow" />
              <span className="text-sm font-medium text-gray-900">Framer Motion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-800">Key Features</h2>
          <p className="text-gray-700">
            Explore the main highlights of this app — designed to be intuitive,
            powerful, and modern.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300"
          >
            <FaBriefcase className="w-12 h-12 text-yellow-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-indigo-800">Professional UI</h3>
            <p className="text-gray-700">
              Clean and modern design with a focus on usability and efficiency
              for financial tracking.
            </p>
          </motion.div>

          {/* Card 2 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300"
          >
            <FaUserAlt className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-indigo-800">Self Project</h3>
            <p className="text-gray-700">
              Built from scratch as a personal project to demonstrate technical
              skills and project ownership.
            </p>
          </motion.div>

          {/* Card 3 */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center transition-all duration-300"
          >
            <FaLink className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-indigo-800">Interactive & Modern</h3>
            <p className="text-gray-700">
              Features dynamic dashboards, expense tracking, and insightful
              analytics for financial decisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* About the Creator */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-center mb-12 text-indigo-800"
          >
            About the Creator
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-10 items-center">
            {/* Image side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex justify-center"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-lg border-4 border-indigo-300">
                <Image
                  src="/profile-bg.jpg"
                  alt="Creator"
                  width={300}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </motion.div>

            {/* Text side */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-white via-gray-100 to-gray-200 rounded-2xl shadow-xl p-8"
            >
              <h3 className="text-2xl font-semibold mb-4 text-indigo-700">Hi, I'm Biprajit Choudhury</h3>
              <p className="text-gray-800 leading-relaxed mb-6">
                “I’m the creator of this Expense Tracker app, built to simplify personal finance management using modern technologies like Next.js, Tailwind CSS, and Supabase. I’m passionate about designing clean UIs, delivering a smooth user experience, and solving real-world problems with code. This project also reflects my love for data analytics, enabling users to not just track expenses but also uncover insights from their financial habits.”
              </p>

              {/* Social icons */}
              <div className="flex space-x-6 text-2xl">
                <a
                  href="https://github.com/Biprajit09"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-black text-black transition"
                >
                  <FaGithub />
                </a>
                <a
                  href="https://www.linkedin.com/in/biprajitchoudhary09/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-700 text-blue-600 transition"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://biprajitportfolioweb.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-700 text-green-600 transition"
                >
                  <FaGlobe />
                </a>
                <a
                  href="mailto:choudharybiprajit@gmail.com"
                  className="hover:text-red-700 text-red-600 transition"
                >
                  <FaEnvelope />
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
}
