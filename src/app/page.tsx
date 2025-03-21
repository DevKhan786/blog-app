"use client";
import { motion } from "framer-motion";
import { Trophy, Users, Gamepad2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useAuth } from "../../lib/contexts/AuthContext";

const HomePage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 opacity-10 z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,gray_1px,transparent_1px),linear-gradient(to_bottom,gray_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-700 to-black py-20 px-4">
        <motion.div className="text-center relative z-50 max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 items-center justify-center">
            <motion.h1
              className="text-3xl xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-indigo-300 to-indigo-600 bg-clip-text text-transparent px-2"
              initial={{ opacity: 0, y: 40, letterSpacing: "0.3em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
              transition={{ duration: 2.5, ease: "easeOut" }}
            >
              CONNECT WITH GAMERS
            </motion.h1>

            <motion.p
              className="text-base sm:text-xl md:text-3xl font-semibold text-zinc-300 uppercase tracking-wider mt-4 sm:mt-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.5, ease: "easeOut" }}
            >
              The Ultimate Gaming Community
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2, ease: "easeOut" }}
              className="mt-6 sm:mt-10"
            >
              {!user ? (
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg md:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 group shadow-lg shadow-indigo-900/50 hover:shadow-indigo-800/50 hover:scale-105"
                >
                  <span className="tracking-wide">Start Your Journey</span>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-180 group-hover:scale-125" />
                </Link>
              ) : (
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg md:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 group shadow-lg shadow-indigo-900/50 hover:shadow-indigo-800/50 hover:scale-105"
                >
                  <span className="tracking-wide">Start posting</span>
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-180 group-hover:scale-125" />
                </Link>
              )}
            </motion.div>
          </div>
        </motion.div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-black via-indigo-700 to-black py-20 px-4">
        <div className="max-w-6xl mx-auto relative z-50">
          <div className="flex flex-col gap-8 md:gap-12">
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl font-bold text-center bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent px-2"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: true, margin: "100px" }}
            >
              WHY JOIN US?
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {[
                {
                  title: "Competitive Leaderboards",
                  desc: "Climb the ranks and showcase your skills",
                  icon: <Trophy className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-indigo-500 to-purple-600",
                },
                {
                  title: "Community Highlights",
                  desc: "Share and discover epic gaming moments",
                  icon: <Users className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-indigo-500 to-blue-600",
                },
                {
                  title: "Live Tournaments",
                  desc: "Compete in regular community events",
                  icon: <Gamepad2 className="h-8 w-8 sm:h-10 sm:w-10" />,
                  color: "from-indigo-500 to-cyan-600",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 sm:p-8 bg-zinc-800/30 rounded-xl sm:rounded-2xl border-2 border-zinc-700/50 backdrop-blur-lg hover:border-indigo-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-900/20 cursor-pointer group"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`mb-4 sm:mb-6 p-3 sm:p-4 w-fit rounded-lg sm:rounded-xl bg-gradient-to-br ${feature.color} transition-transform duration-300 group-hover:scale-110`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 text-base sm:text-lg">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-indigo-700 to-black py-20 px-4">
        <div className="max-w-4xl mx-auto text-center relative z-50">
          <motion.div
            className="flex flex-col items-center gap-6 sm:gap-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-3xl sm:text-4xl md:text-6xl font-bold bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              READY TO LEVEL UP?
            </motion.h2>

            <motion.p
              className="text-base sm:text-xl text-zinc-300 mb-6 sm:mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              Join thousands of gamers already creating their legacy
            </motion.p>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Link
                href={user ? "/blogs" : "/login"}
                className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-6 py-3 sm:py-4 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg md:rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 group shadow-lg shadow-indigo-900/50 hover:shadow-indigo-800/50 hover:scale-105"
              >
                <span className="tracking-wide transition-transform group-hover:translate-x-1">
                  {user ? "Explore Community" : "Begin Your Journey"}
                </span>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:rotate-180 group-hover:scale-125" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
