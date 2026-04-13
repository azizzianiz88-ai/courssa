"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Package, ShieldCheck, Clock, Star, ChevronRight, Users, Zap, MapPin, Phone } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const role = document.cookie.split('; ').find(r => r.startsWith('courssa_role='))?.split('=')[1];
    const session = document.cookie.split('; ').find(r => r.startsWith('courssa_session='))?.split('=')[1];
    if (session && role) {
      const map: Record<string, string> = { ADMIN: '/admin', CLIENT: '/client', DRIVER: '/driver' };
      router.replace(map[role] || '/auth');
    } else {
      setChecking(false);
    }
  }, [router]);

  if (checking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const features = [
    { icon: <Zap size={24} />, color: "text-yellow-500 bg-yellow-500/10", title: "Rapide", desc: "Trouvez un chauffeur en quelques minutes grâce à notre système de mise en relation instantanée." },
    { icon: <ShieldCheck size={24} />, color: "text-green-500 bg-green-500/10", title: "Sécurisé", desc: "Tous nos chauffeurs sont vérifiés. Vos marchandises sont entre de bonnes mains." },
    { icon: <Clock size={24} />, color: "text-blue-500 bg-blue-500/10", title: "Temps réel", desc: "Suivez votre livraison étape par étape depuis le chargement jusqu'à la destination." },
    { icon: <Star size={24} />, color: "text-primary bg-primary/10", title: "Meilleurs prix", desc: "Négociez directement avec les chauffeurs et obtenez le meilleur tarif pour votre transport." },
  ];

  const stats = [
    { val: "500+", label: "Chauffeurs actifs" },
    { val: "48", label: "Wilayas couvertes" },
    { val: "4.9★", label: "Note moyenne" },
    { val: "24/7", label: "Disponibilité" },
  ];

  const vehicleTypes = ["Fourgonnette", "Petit Camion", "Grand Camion", "Plateau", "Frigorifique", "Semi-remorque"];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/90 backdrop-blur border-b border-border/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center">
              <Truck size={16} strokeWidth={2.5} className="text-primary-foreground" />
            </div>
            <span className="text-xl font-black">Courssa</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/auth" className="text-sm font-bold text-muted-foreground hover:text-foreground transition-colors px-3 py-2">
              Se connecter
            </Link>
            <Link href="/auth" className="bg-primary text-primary-foreground font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity flex items-center gap-2">
              S'inscrire <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(234,179,8,0.12),transparent)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 text-primary text-xs font-bold px-4 py-2 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Plateforme logistique 🇩🇿 Algérie
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black leading-tight mb-6">
            Le Transport
            <span className="text-primary block">simplifié.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            Connectez-vous avec des chauffeurs vérifiés à travers toute l'Algérie.
            Négociez le prix, suivez votre livraison en temps réel.
          </motion.p>

          {/* ── Prominent Login Box ── */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="bg-accent/40 backdrop-blur border border-border/60 rounded-3xl p-6 max-w-sm mx-auto mb-10 shadow-xl">
            <p className="text-sm font-bold text-muted-foreground mb-4">Accédez à votre compte</p>
            <Link href="/auth"
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl flex items-center justify-center gap-2 text-base shadow-lg shadow-primary/25 hover:scale-[1.02] active:scale-95 transition-all">
              <Phone size={20} /> Connexion par téléphone
            </Link>
            <p className="text-xs text-muted-foreground mt-3">
              Nouveau ? Inscrivez-vous en 30 secondes après connexion.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth" className="bg-accent border border-border/50 font-bold px-6 py-3 rounded-xl text-sm hover:bg-accent/80 transition-colors flex items-center justify-center gap-2">
              <Package size={18} /> Envoyer un colis
            </Link>
            <Link href="/auth" className="bg-accent border border-border/50 font-bold px-6 py-3 rounded-xl text-sm hover:bg-accent/80 transition-colors flex items-center justify-center gap-2">
              <Truck size={18} /> Je suis chauffeur
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="px-4 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="bg-accent/30 border border-border/50 rounded-2xl p-5 text-center">
              <div className="text-2xl md:text-3xl font-black text-primary">{s.val}</div>
              <div className="text-xs text-muted-foreground font-semibold mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 py-16 border-t border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Comment ça marche ?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "1", icon: <Package size={28} />, title: "Décrivez votre colis", desc: "Indiquez le départ, la destination, le type de marchandise et les spécificités." },
              { n: "2", icon: <Users size={28} />, title: "Recevez des offres", desc: "Les chauffeurs disponibles vous contactent avec leurs tarifs. Négociez librement." },
              { n: "3", icon: <MapPin size={28} />, title: "Suivez en direct", desc: "Acceptez la meilleure offre et suivez votre colis de bout en bout." },
            ].map((step, i) => (
              <div key={step.n} className="relative">
                <div className="bg-accent/30 border border-border/50 rounded-3xl p-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4">
                    {step.icon}
                  </div>
                  <div className="text-4xl font-black text-primary/20 mb-2">{step.n}.</div>
                  <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                </div>
                {i < 2 && <ChevronRight className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 text-border z-10" size={24} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 py-16 bg-accent/20 border-y border-border/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-12">Pourquoi Courssa ?</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {features.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                className="bg-background border border-border/50 rounded-3xl p-6 flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${f.color}`}>{f.icon}</div>
                <div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle types */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-center mb-4">Tous types de véhicules</h2>
          <p className="text-center text-muted-foreground mb-10">Des petits colis aux chargements industriels</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {vehicleTypes.map(v => (
              <span key={v} className="bg-accent/40 border border-border/50 text-sm font-semibold px-4 py-2 rounded-full hover:border-primary/30 hover:bg-primary/5 transition-colors cursor-default">
                🚛 {v}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 rounded-3xl p-10">
            <h2 className="text-3xl font-black mb-4">Prêt à commencer ?</h2>
            <p className="text-muted-foreground mb-8">Rejoignez des milliers d'utilisateurs qui font confiance à Courssa pour leurs transports en Algérie.</p>
            <Link href="/auth" className="bg-primary text-primary-foreground font-black px-10 py-4 rounded-2xl text-lg shadow-2xl shadow-primary/25 hover:scale-105 transition-transform inline-flex items-center gap-2">
              Démarrer gratuitement <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 px-4 py-8 text-center text-sm text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
            <Truck size={12} strokeWidth={2.5} className="text-primary-foreground" />
          </div>
          <span className="font-bold text-foreground">Courssa</span>
        </div>
        <p>© 2025 Courssa — Fait avec ❤️ en Algérie 🇩🇿</p>
      </footer>
    </div>
  );
}
