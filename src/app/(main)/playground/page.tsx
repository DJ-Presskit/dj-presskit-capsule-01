"use client";

import { useEffect, useState } from "react";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";

export default function PlaygroundPage() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <LayoutGroup>
      {/* HEADER (posición final) */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        {ready && (
          <div className="flex items-center">
            <motion.div
              layoutId="brand-logo"
              className="h-10 w-10 rounded-xl bg-red-500 backdrop-blur"
            />
            <div className="ml-3 text-sm opacity-80">DJ Presskit</div>
          </div>
        )}
      </header>

      {/* SPLASH (posición inicial) */}
      <AnimatePresence>
        {!ready && (
          <motion.div
            className="fixed inset-0 z-[60] grid place-items-center bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            <motion.div
              layoutId="brand-logo"
              className="h-20 w-20 rounded-2xl bg-red-500 backdrop-blur"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTENIDO */}
      <main className="min-h-screen pt-20 p-6">
        <h1 className="text-3xl">Contenido</h1>
        <p className="mt-4 opacity-80">El logo “viaja” al header porque comparte layoutId.</p>
      </main>
    </LayoutGroup>
  );
}
