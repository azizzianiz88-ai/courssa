"use client";

import { Truck, Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function TrucksPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Ma Flotte</h1>
        <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform">
          <Plus size={20} className="text-primary-foreground" />
        </button>
      </div>

      <div className="grid gap-4 mt-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-accent/30 border border-border/50 rounded-3xl p-5 flex items-center gap-4 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 bottom-0 w-1 bg-green-500 rounded-l-full" />
          <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center border border-border/50 shadow-sm shrink-0">
            <Truck size={28} className="text-foreground" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-foreground">Camionnette</h3>
              <span className="text-[10px] bg-green-500/10 text-green-500 font-bold px-2 py-0.5 rounded-full border border-green-500/20">
                Disponible
              </span>
            </div>
            <p className="text-xs text-muted-foreground">Fourgon • Capacité 1.5 t</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
