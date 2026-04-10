"use client";

import { motion } from "framer-motion";
import { Truck, Package, MapPin, Clock, ShieldCheck, ChevronRight, Star } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col pt-16 md:pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 border-b border-border/40 bg-background/80 backdrop-blur-md z-50 flex items-center px-4 md:px-12">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Truck strokeWidth={2.5} size={20} className="md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tight">Courssa</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">Comment ça marche ?</Link>
            <Link href="#features" className="hover:text-foreground transition-colors">Avantages</Link>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <Link href="/auth" className="text-xs md:text-sm font-semibold hidden md:block hover:text-primary transition-colors">
              Devenir Chauffeur
            </Link>
            <Link
              href="/auth"
              className={cn(
                "bg-primary text-primary-foreground px-4 md:px-5 py-2 md:py-2.5 rounded-full font-bold text-xs md:text-sm",
                "active:scale-95 transition-transform"
              )}
            >
              Commander
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative px-4 md:px-6 py-16 md:py-32 max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Background Glares */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-primary/10 blur-[80px] md:blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-center md:text-left z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-full bg-accent text-[10px] md:text-xs font-semibold mb-6 border border-border/50">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Disponible partout en Algérie
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-4 md:mb-6 leading-tight">
              Le transport de meubles <br className="hidden md:block" />
              <span className="text-primary">simplifié !</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto md:mx-0">
              Plus rapide, sécurisé, et moins cher. Nous vous connectons aux meilleurs chauffeurs fiables pour transporter tout ce dont vous avez besoin, en un clic.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center md:justify-start">
              <Link
                href="/client"
                className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-full font-bold text-base md:text-lg active:scale-95 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.3)]"
              >
                Commander un camion
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/driver"
                className="flex items-center justify-center gap-2 bg-accent text-accent-foreground px-6 md:px-8 py-3.5 md:py-4 rounded-xl md:rounded-full font-bold text-base md:text-lg active:bg-accent/80 transition-colors border border-border/50"
              >
                Gagnez avec Courssa
              </Link>
            </div>

            <div className="mt-8 md:mt-12 flex items-center justify-center md:justify-start gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border-2 border-background flex items-center justify-center overflow-hidden">
                    <span className="text-xs text-zinc-400">👤</span>
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex text-primary gap-1 mb-0.5">
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                  <Star size={12} fill="currentColor" />
                </div>
                <span className="font-semibold">+10,000</span> courses réussies
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-lg z-10 relative mt-8 md:mt-0"
          >
            <div className="relative aspect-square w-full rounded-[1.5rem] md:rounded-[2rem] bg-accent border border-border/50 overflow-hidden flex flex-col">
              <div className="h-14 md:h-16 border-b border-border/50 p-3 md:p-4 flex items-center gap-3 bg-background/50 backdrop-blur">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="text-xs md:text-sm font-bold">Suivi de livraison en direct</div>
                  <div className="text-[10px] md:text-xs text-muted-foreground">À 3 km de distance</div>
                </div>
              </div>
              <div className="flex-1 w-full flex items-center justify-center bg-[#09090b] relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]" />
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="w-24 h-24 md:w-32 md:h-32 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-[0_0_30px_rgba(250,204,21,0.5)] z-10"
                >
                  <Truck size={48} strokeWidth={1.5} className="md:w-16 md:h-16" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Features / How it works */}
        <section id="how-it-works" className="py-16 md:py-24 bg-accent/30 border-y border-border/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-2xl md:text-5xl font-black mb-3">Comment ça marche ?</h2>
              <p className="text-muted-foreground text-base md:text-lg">Votre cargaison en route en seulement 3 étapes</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
              {[
                { icon: Package, title: "1. Décrivez la charge", desc: "Choisissez le type de marchandise à transporter, puis indiquez les lieux." },
                { icon: ShieldCheck, title: "2. Choisissez l'offre", desc: "Recevez les offres des chauffeurs qualifiés et choisissez celle qui vous convient." },
                { icon: Clock, title: "3. Suivez la livraison", desc: "Suivez votre camion en direct sur la carte jusqu'à l'arrivée sécurisée." }
              ].map((feature, idx) => (
                <div key={idx} className="bg-background rounded-2xl md:rounded-3xl p-6 md:p-8 border border-border/50 hover:border-primary/50 transition-colors group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent rounded-xl md:rounded-2xl flex items-center justify-center text-foreground mb-4 md:mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <feature.icon size={24} className="md:w-7 md:h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-2 md:mb-3">{feature.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 md:py-8 text-center text-xs md:text-sm text-muted-foreground border-t border-border/30">
        <p>© 2026 Courssa. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
