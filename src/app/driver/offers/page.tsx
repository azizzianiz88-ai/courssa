"use client";

import { Receipt, Search } from "lucide-react";
import { motion } from "framer-motion";

export default function OffersPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">العروض</h1>
        <div className="w-10 h-10 rounded-full bg-accent/50 flex items-center justify-center">
          <Search size={20} className="text-muted-foreground" />
        </div>
      </div>

      <div className="flex justify-center items-center h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center p-6 bg-accent/20 rounded-3xl border border-border/50 max-w-sm"
        >
          <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mb-4">
            <Receipt size={32} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">لا توجد عروض نشطة</h2>
          <p className="text-sm text-muted-foreground">
            قم بالعودة للرئيسية وتقديم عروض أسعار على الطلبات القريبة لتظهر هنا.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
