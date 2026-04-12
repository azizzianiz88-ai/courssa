"use client";
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, ArrowLeft, Truck, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Auth() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [pendingPhone, setPendingPhone] = useState(""); // phone waiting for role selection
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === 2) setTimeout(() => inputRefs.current[0]?.focus(), 100);
  }, [step]);

  // ── Step 1: Phone submission ─────────────────────────────────────
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 8) return;
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone })
      });

      const data = await res.json();

      if (data.role === "ADMIN" || data.role === "CLIENT" || data.role === "DRIVER") {
        // Existing user or admin → redirect immediately after "OTP" step (simulated)
        setPendingPhone(phone);
        setStep(2); // show OTP screen
      } else if (data.role === "NEW") {
        // New user → OTP then role selection
        setPendingPhone(data.phone);
        setStep(2);
      } else {
        setError("Erreur de connexion. Réessayez.");
      }
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
    }

    setIsLoading(false);
  };

  // ── Step 2: OTP verified (simulated, accept any 4 digits) ─────────
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 4) return;

    setIsLoading(true);
    setError("");

    try {
      // Re-call login to get role after OTP "verification"
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: pendingPhone })
      });
      const data = await res.json();

      if (data.role === "ADMIN") {
        router.push("/admin");
      } else if (data.role === "CLIENT") {
        router.push("/client");
      } else if (data.role === "DRIVER") {
        router.push("/driver");
      } else {
        // NEW user → role selection
        setStep(3);
      }
    } catch {
      setError("Erreur. Réessayez.");
    }

    setIsLoading(false);
  };

  // ── Step 3: Role selection (new users only) ───────────────────────
  const selectRole = (role: 'CLIENT' | 'DRIVER') => {
    document.cookie = `courssa_session=new:${pendingPhone}; path=/; max-age=86400;`;
    document.cookie = `courssa_role=${role}; path=/; max-age=86400;`;
    if (role === 'CLIENT') router.push('/client/register');
    if (role === 'DRIVER') router.push('/driver/register');
  };

  // ── OTP helpers ──────────────────────────────────────────────────
  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d+$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value !== "" && index < 3) inputRefs.current[index + 1]?.focus();
    // Auto-submit when all 4 filled
    if (index === 3 && value !== "") {
      const full = [...newOtp.slice(0, 3), value].join("");
      if (full.length === 4) {
        setTimeout(() => {
          const form = document.getElementById("otp-form") as HTMLFormElement;
          form?.requestSubmit();
        }, 150);
      }
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-primary/25">
            <Truck strokeWidth={2.5} size={32} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-black tracking-tight">Courssa</h1>
          <p className="text-muted-foreground text-sm mt-1">La plateforme de Transport</p>
        </div>

        <div className="bg-accent/30 backdrop-blur border border-border/50 p-7 rounded-3xl shadow-2xl">
          <AnimatePresence mode="wait">

            {/* ─── STEP 1: Phone ─── */}
            {step === 1 && (
              <motion.form key="step1" id="phone-form" onSubmit={handlePhoneSubmit}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <h2 className="text-xl font-bold mb-1">Connexion</h2>
                <p className="text-sm text-muted-foreground mb-5">Entrez votre numéro de téléphone</p>

                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full bg-background border border-border/50 rounded-xl py-3.5 px-4 text-base font-bold outline-none focus:border-primary transition-colors mb-4"
                  placeholder="0XX XX XX XX" />

                {error && <p className="text-red-500 text-sm mb-3 font-medium">{error}</p>}

                <button disabled={isLoading || phone.length < 8}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 transition-all active:scale-95">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : <>Continuer <ArrowRight size={18} /></>}
                </button>

                <p className="text-xs text-center text-muted-foreground mt-5">
                  Premier accès ? Vous pourrez choisir votre rôle après vérification.
                </p>
              </motion.form>
            )}

            {/* ─── STEP 2: OTP ─── */}
            {step === 2 && (
              <motion.form key="step2" id="otp-form" onSubmit={handleOtpSubmit}
                initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex justify-center mb-5">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
                    <ShieldCheck size={28} className="text-primary" />
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-1 text-center">Vérification</h2>
                <p className="text-sm text-muted-foreground mb-6 text-center">
                  Code envoyé au <b>+213 {pendingPhone}</b>
                </p>

                <div className="flex justify-center gap-3 mb-7">
                  {[0, 1, 2, 3].map(i => (
                    <input key={i} ref={el => { inputRefs.current[i] = el; }}
                      type="text" inputMode="numeric" maxLength={1} value={otp[i]}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      className="w-14 h-14 text-center text-2xl font-black bg-background border-2 border-border/50 rounded-xl outline-none focus:border-primary focus:bg-primary/5 transition-all" />
                  ))}
                </div>

                {error && <p className="text-red-500 text-sm mb-3 text-center font-medium">{error}</p>}

                <button disabled={isLoading || otp.join("").length < 4}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-60 transition-all active:scale-95">
                  {isLoading ? <Loader2 size={20} className="animate-spin" /> : "Vérifier"}
                </button>
                <button type="button" onClick={() => { setStep(1); setOtp(["","","",""]); setError(""); }}
                  className="w-full mt-3 text-sm text-muted-foreground font-semibold py-2 hover:text-foreground transition-colors flex items-center justify-center gap-1">
                  <ArrowLeft size={14} /> Modifier le numéro
                </button>
              </motion.form>
            )}

            {/* ─── STEP 3: Role Selection (new users) ─── */}
            {step === 3 && (
              <motion.div key="step3"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <h2 className="text-2xl font-bold mb-1 text-center">Bienvenue !</h2>
                <p className="text-sm text-muted-foreground mb-7 text-center">Comment souhaitez-vous utiliser Courssa ?</p>

                <div className="grid grid-cols-2 gap-4">
                  <button onClick={() => selectRole('CLIENT')}
                    className="bg-background border-2 border-border/50 hover:border-primary rounded-2xl p-5 flex flex-col items-center gap-3 transition-all group active:scale-95">
                    <div className="w-14 h-14 bg-accent group-hover:bg-primary/20 rounded-full flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                      <User size={28} />
                    </div>
                    <div>
                      <div className="font-bold">Client</div>
                      <div className="text-xs text-muted-foreground">Envoyer des colis</div>
                    </div>
                  </button>

                  <button onClick={() => selectRole('DRIVER')}
                    className="bg-background border-2 border-border/50 hover:border-primary rounded-2xl p-5 flex flex-col items-center gap-3 transition-all group active:scale-95">
                    <div className="w-14 h-14 bg-accent group-hover:bg-primary/20 rounded-full flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                      <Truck size={28} />
                    </div>
                    <div>
                      <div className="font-bold">Chauffeur</div>
                      <div className="text-xs text-muted-foreground">Transporter des colis</div>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
