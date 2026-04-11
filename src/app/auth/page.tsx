"use client";
import { useState, useRef, useEffect } from 'react';
import { ArrowRight, ShieldCheck, ArrowLeft, Truck, User } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Auth() {
    const router = useRouter();
    const [step, setStep] = useState(1); // 1: Phone, 2: OTP, 3: Role Selection
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (step === 2) {
            setTimeout(() => {
                inputRefs.current[0]?.focus();
            }, 100);
        }
    }, [step]);

    const handlePhoneSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length >= 8) setStep(2);
    }

    const handleOtpChange = (index: number, value: string) => {
        if (value && !/^\d+$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        if (value !== "" && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const fullOtp = otp.join("");
        if (fullOtp.length === 4) {
            setStep(3);
        }
    }

    const selectRole = (role: 'client' | 'driver') => {
        // Set a local session cookie to bypass the middleware guard
        document.cookie = "courssa_session=true; path=/; max-age=86400;";
        if (role === 'client') router.push('/client/register');
        if (role === 'driver') router.push('/driver/register');
    }

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md bg-accent/30 p-8 rounded-3xl border border-border/50 overflow-hidden relative min-h-[450px] flex flex-col justify-center">
                <Link href="/" className="absolute top-6 left-6 text-muted-foreground hover:text-foreground">
                    <ArrowLeft size={24} />
                </Link>
                <div className="text-center mb-8 mt-4">
                    <h1 className="text-3xl font-black text-primary mb-2">Courssa</h1>
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.form key="step1" onSubmit={handlePhoneSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h2 className="text-xl font-bold mb-2">Entrez votre numéro</h2>
                            <p className="text-sm text-muted-foreground mb-6">Un code de vérification vous sera envoyé par SMS.</p>

                            <div className="flex mb-6">
                                <div className="bg-background border border-r-0 border-border/50 rounded-l-xl py-3 px-4 text-sm font-bold flex items-center border-r-transparent">
                                    +213
                                </div>
                                <input required type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-background border border-border/50 rounded-r-xl py-3 px-4 text-sm outline-none focus:border-primary" placeholder="5xx xx xx xx" />
                            </div>

                            <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                                Continuer <ArrowRight size={18} />
                            </button>

                            <div className="relative flex items-center py-6">
                                <div className="flex-grow border-t border-border/50"></div>
                                <span className="shrink-0 px-4 text-xs text-muted-foreground">Ou avec</span>
                                <div className="flex-grow border-t border-border/50"></div>
                            </div>

                            <button type="button" className="w-full bg-white text-black font-semibold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-zinc-200 transition-colors border border-border/20">
                                <svg viewBox="0 0 24 24" className="w-5 h-5">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                </svg>
                                Continuer avec Google
                            </button>
                        </motion.form>
                    )}

                    {step === 2 && (
                        <motion.form key="step2" onSubmit={handleOtpSubmit} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <div className="flex justify-center mb-6">
                                <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                                    <ShieldCheck size={32} className="text-primary" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold mb-2 text-center">Vérification SMS</h2>
                            <p className="text-sm text-muted-foreground mb-6 text-center">Entrez le code à 4 chiffres envoyé au +213 {phone}</p>

                            <div className="flex justify-between gap-3 mb-8">
                                {[0, 1, 2, 3].map(i => (
                                    <input 
                                        key={i} 
                                        ref={(el) => {
                                            inputRefs.current[i] = el;
                                        }}
                                        required 
                                        type="text" 
                                        inputMode="numeric"
                                        maxLength={1} 
                                        value={otp[i]}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-14 h-14 text-center text-2xl font-black bg-background border border-border/50 rounded-xl outline-none focus:border-primary focus:bg-primary/5 transition-colors" 
                                    />
                                ))}
                            </div>

                            <button className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20">
                                Vérifier
                            </button>
                            <button type="button" onClick={() => setStep(1)} className="w-full mt-4 text-sm text-muted-foreground font-semibold py-2 hover:text-foreground transition-colors">
                                Modifier le numéro
                            </button>
                        </motion.form>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                            <h2 className="text-2xl font-bold mb-2 text-center">Bienvenue !</h2>
                            <p className="text-sm text-muted-foreground mb-8 text-center">Choisissez votre profil pour continuer</p>

                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => selectRole('client')} className="bg-background border-2 border-border/50 hover:border-primary rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors group">
                                    <div className="w-16 h-16 bg-accent group-hover:bg-primary/20 rounded-full flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                                        <User size={32} />
                                    </div>
                                    <span className="font-bold text-lg">Je suis un<br />Client</span>
                                </button>

                                <button onClick={() => selectRole('driver')} className="bg-background border-2 border-border/50 hover:border-primary rounded-2xl p-6 flex flex-col items-center gap-4 transition-colors group">
                                    <div className="w-16 h-16 bg-accent group-hover:bg-primary/20 rounded-full flex items-center justify-center text-foreground group-hover:text-primary transition-colors">
                                        <Truck size={32} />
                                    </div>
                                    <span className="font-bold text-lg">Je suis un<br />Chauffeur</span>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
