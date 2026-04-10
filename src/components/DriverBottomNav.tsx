"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Receipt, Truck, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

export function DriverBottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Accueil", href: "/driver", icon: Home },
    { name: "Offres", href: "/driver/offers", icon: Receipt },
    { name: "Courses", href: "/driver/trips", icon: MapPin },
    { name: "Véhicules", href: "/driver/trucks", icon: Truck },
    { name: "Historique", href: "/driver/history", icon: Clock },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-2 pb-5 pt-2 bg-white/70 dark:bg-[#1C1C1E]/70 backdrop-blur-xl border-t border-gray-200 dark:border-gray-800 safe-area-pb">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative flex flex-col items-center justify-center p-2 w-[20%] tap-highlight-transparent"
            >
              {isActive && (
                <motion.div
                  layoutId="bubble"
                  className="absolute inset-0 bg-[#007AFF]/10 dark:bg-[#007AFF]/20 rounded-2xl -z-10"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              
              <Icon 
                size={22} 
                className={`mb-1 transition-colors duration-200 ${isActive ? "text-[#007AFF] stroke-[2.5]" : "text-gray-500 dark:text-gray-400 stroke-2"}`} 
              />
              
              <span 
                className={`text-[10px] font-semibold transition-colors duration-200 ${isActive ? "text-[#007AFF]" : "text-gray-500 dark:text-gray-400"}`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
