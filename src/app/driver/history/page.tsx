"use client";

import { Clock, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function HistoryPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Historique & Revenus</h1>
        <button className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center active:bg-accent transition-colors">
          <Download size={18} className="text-muted-foreground" />
        </button>
      </div>

      <div className="flex justify-center items-center h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center text-center p-6"
        >
          <div className="w-16 h-16 bg-accent/50 rounded-full flex items-center justify-center mb-4">
            <Clock size={32} className="text-muted-foreground/50" />
          </div>
          <h2 className="text-lg font-bold mb-2">Historique vide</h2>
          <p className="text-sm text-muted-foreground">
            Vous n'avez pas encore terminé de course. Vos courses précédentes apparaîtront ici à l'avenir!
          </p>
        </motion.div>
      </div>
    </div>
  );
}
