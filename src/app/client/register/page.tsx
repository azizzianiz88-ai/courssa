"use client";
import { ArrowRight, User, Phone, MapPin, Loader2, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const WILAYAS = ["Alger","Annaba","Batna","Béjaïa","Biskra","Blida","Bouira","Constantine","Djelfa","El Oued","Ghardaïa","Jijel","Médéa","Mila","M'Sila","Oran","Ouargla","Oum El Bouaghi","Relizane","Sétif","Sidi Bel Abbès","Skikda","Souk Ahras","Tamanrasset","Tébessa","Tiaret","Tindouf","Tipaza","Tissemsilt","Tizi Ouzou","Tlemcen"];

export default function ClientRegister() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("Alger");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill phone from the session cookie set during /auth
  if (typeof document !== 'undefined' && !phone) {
    const session = document.cookie.split('; ').find(r => r.startsWith('courssa_session='))?.split('=')[1];
    const cookiePhone = session?.split(':')[1];
    if (cookiePhone && cookiePhone !== 'undefined') setPhone(cookiePhone);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, role: "CLIENT" })
      });
      const data = await res.json();

      if (res.ok) {
        setIsDone(true);
        setTimeout(() => router.push("/client"), 1500);
      } else {
        setError(data.error || "Une erreur est survenue");
      }
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.12),transparent)]" />
      <div className="w-full max-w-sm relative z-10">
        <div className="text-center mb-7">
          <div className="text-3xl mb-2">🛒</div>
          <h1 className="text-2xl font-black">Finalisez votre profil</h1>
          <p className="text-muted-foreground text-sm mt-1">Quelques informations pour commencer</p>
        </div>

        <div className="bg-accent/30 border border-border/50 p-7 rounded-3xl shadow-xl">
          <AnimatePresence mode="wait">
            {isDone ? (
              <motion.div key="done" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center gap-4 text-center">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={36} />
                </div>
                <h2 className="text-xl font-bold">Compte créé !</h2>
                <p className="text-muted-foreground text-sm">Redirection vers votre tableau de bord…</p>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Nom complet *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                    <input required type="text" value={name} onChange={e => setName(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl py-3 pl-9 pr-4 text-sm font-medium outline-none focus:border-primary transition-colors"
                      placeholder="Ex: Mohamed Ben Ahmed" />
                  </div>
                </div>

                {/* Phone (pre-filled & readonly) */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Téléphone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                    <input type="tel" value={phone} readOnly
                      className="w-full bg-accent/40 border border-border/30 rounded-xl py-3 pl-9 pr-4 text-sm font-medium outline-none text-muted-foreground cursor-not-allowed"
                      placeholder="0XX XX XX XX" />
                  </div>
                </div>

                {/* Wilaya */}
                <div>
                  <label className="text-xs font-bold mb-1.5 block">Wilaya</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none z-10" size={16} />
                    <select value={wilaya} onChange={e => setWilaya(e.target.value)}
                      className="w-full bg-background border border-border/50 rounded-xl py-3 pl-9 pr-4 text-sm font-medium outline-none focus:border-primary appearance-none cursor-pointer">
                      {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

                <button type="submit" disabled={isLoading || !name.trim()}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 transition-all active:scale-95 mt-2">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Créer mon compte <ArrowRight size={18} /></>}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
