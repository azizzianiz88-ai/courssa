"use client";

import { MapPin, Navigation } from "lucide-react";
import { motion } from "framer-motion";

export default function TripsPage() {
  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">الرحلات الحالية</h1>
      </div>

      <div className="flex justify-center items-center h-[50vh]">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center p-6 bg-accent/20 rounded-3xl border border-border/50 max-w-sm"
        >
          <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
            <MapPin size={32} className="text-green-500" />
          </div>
          <h2 className="text-lg font-bold mb-2">ليس لديك أي رحلة نشطة</h2>
          <p className="text-sm text-muted-foreground mb-6">
            ستظهر هنا الرحلة فور قيام العميل بقبول عرضك وموافقتك النهائية.
          </p>
          <button className="bg-foreground text-background px-6 py-3 rounded-xl font-bold flex items-center gap-2 active:scale-95 transition-transform">
            <Navigation size={18} />
            البحث عن طلبات
          </button>
        </motion.div>
      </div>
    </div>
  );
}
