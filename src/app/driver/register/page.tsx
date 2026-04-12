"use client";
import { ArrowRight, ArrowLeft, User, Phone, Truck, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

const VEHICLE_TYPES = [
  "Moto / Scooter (Petits colis)",
  "Fourgonnette (ex: Kangoo, Berlingo)",
  "Fourgon (ex: Master, Transit)",
  "Camionnette / Pick-up",
  "Petit Camion (- de 2.5 Tonnes)",
  "Camion Moyen (2.5 à 5 Tonnes)",
  "Grand Camion (+ de 5 Tonnes)",
  "Camion Frigorifique",
  "Plateau",
  "Semi-remorque (Poids lourd)",
  "Porte-char (Engins lourds)",
  "Dépanneuse",
];

export default function DriverRegister() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState(() => {
    if (typeof document !== 'undefined') {
      const session = document.cookie.split('; ').find(r => r.startsWith('courssa_session='))?.split('=')[1];
      return session?.split(':')[1] || "";
    }
    return "";
  });
  const [vehicleType, setVehicleType] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!name || !vehicleType) return;
    setIsLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), phone, role: "DRIVER", vehicleType, vehiclePlate })
      });
      const data = await res.json();
      if (res.ok) {
        setIsDone(true);
        setStep(4);
      } else {
        setError(data.error || "Erreur");
      }
    } catch {
      setError("Erreur réseau.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-12">
      <div className="w-full max-w-lg bg-accent/30 border border-border/50 p-6 md:p-8 rounded-3xl shadow-xl">

        {/* Progress bar */}
        <div className="flex mb-8 gap-2">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className={`h-1.5 flex-grow rounded-full transition-all ${i <= step ? 'bg-primary' : 'bg-border/50'}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">

          {/* Step 1: Personal info */}
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-black text-primary mb-1">Informations Personnelles</h1>
              <p className="text-muted-foreground text-sm mb-6">Vos détails pour rejoindre le réseau Courssa.</p>
              <div className="space-y-4">
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                  <input type="text" value={name} onChange={e => setName(e.target.value)} required
                    className="w-full bg-background border border-border/50 rounded-xl py-3 pl-9 pr-4 text-sm outline-none focus:border-primary"
                    placeholder="Nom complet *" />
                </div>
                <div className="relative">
                  <Phone className="absolute left-3 top-3.5 text-muted-foreground" size={16} />
                  <input type="tel" value={phone} readOnly
                    className="w-full bg-accent/40 border border-border/30 rounded-xl py-3 pl-9 pr-4 text-sm text-muted-foreground cursor-not-allowed"
                    placeholder="Téléphone" />
                </div>
                <button onClick={() => name.trim() && setStep(2)} disabled={!name.trim()}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 active:scale-95 transition-all mt-2">
                  Suivant <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Vehicle */}
          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-black text-primary mb-1">Votre Véhicule</h1>
              <p className="text-muted-foreground text-sm mb-6">Type et immatriculation de votre camion.</p>
              <div className="space-y-4">
                <div className="relative">
                  <Truck className="absolute left-3 top-3.5 text-muted-foreground pointer-events-none z-10" size={16} />
                  <select value={vehicleType} onChange={e => setVehicleType(e.target.value)}
                    className="w-full bg-background border border-border/50 rounded-xl py-3 pl-9 pr-4 text-sm outline-none focus:border-primary appearance-none cursor-pointer">
                    <option value="" disabled>Sélectionner le type *</option>
                    {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>
                <input type="text" value={vehiclePlate} onChange={e => setVehiclePlate(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary"
                  placeholder="Plaque d'immatriculation (optionnel)" />
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep(1)} className="w-14 shrink-0 bg-background border border-border flex justify-center items-center rounded-xl hover:bg-accent">
                    <ArrowLeft size={18} />
                  </button>
                  <button onClick={() => vehicleType && setStep(3)} disabled={!vehicleType}
                    className="flex-grow bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 active:scale-95 transition-all">
                    Suivant <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirm & Submit */}
          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <h1 className="text-2xl font-black text-primary mb-1">Confirmation</h1>
              <p className="text-muted-foreground text-sm mb-6">Vérifiez vos informations avant de valider.</p>

              <div className="bg-background border border-border/50 rounded-2xl p-4 space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Nom</span>
                  <span className="font-bold">{name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Téléphone</span>
                  <span className="font-bold">{phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Véhicule</span>
                  <span className="font-bold text-right max-w-[55%]">{vehicleType}</span>
                </div>
                {vehiclePlate && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Plaque</span>
                    <span className="font-bold">{vehiclePlate}</span>
                  </div>
                )}
              </div>

              {error && <p className="text-red-500 text-sm font-medium mb-4">{error}</p>}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="w-14 shrink-0 bg-background border border-border flex justify-center items-center rounded-xl hover:bg-accent">
                  <ArrowLeft size={18} />
                </button>
                <button onClick={handleSubmit} disabled={isLoading}
                  className="flex-grow bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 active:scale-95 transition-all">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Valider l'inscription"}
                </button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Done */}
          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-6">
              <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex justify-center items-center mx-auto mb-6">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-2xl font-black mb-3">Bienvenue sur Courssa !</h1>
              <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                Votre compte chauffeur est prêt. Vous pouvez maintenant recevoir des missions et commencer à livrer.
              </p>
              <button onClick={() => router.push("/driver")}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg shadow-primary/20">
                Accéder au tableau de bord
              </button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
