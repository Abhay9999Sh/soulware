"use client";

import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      role="switch"
      aria-checked={isDark}
    >
      {/* Icon rotation */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: isDark ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        {isDark ? (
          <Moon className="w-6 h-6 text-yellow-400" />
        ) : (
          <Sun className="w-6 h-6 text-orange-500" />
        )}
      </motion.div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: isDark
            ? "radial-gradient(circle, rgba(251,191,36,0.3), transparent)"
            : "radial-gradient(circle, rgba(249,115,22,0.2), transparent)",
        }}
        animate={{
          opacity: isDark ? [0, 0.3, 0] : [0, 0.2, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.button>
  );
};

export default ThemeToggle;
