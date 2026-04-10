"use client";
import Link from 'next/link';
import { Phone, MessageCircle, Truck, Star, ShieldCheck, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function ClientTracking() {
    const [showReceipt, setShowReceipt] = useState(false);
    const [rating, setRating] = useState(0);
    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Fake map background */}
            <div className="absolute inset-0 bg-[#09090b]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]" />
                {/* Fake route line */}
                <svg className="absolute w-full h-full" style={{ pointerEvents: 'none' }}>
                    <motion.path
                        d="M 100 200 C 200 400 300 100 500 300 C 700 500 800 200 1000 400"
                        stroke="var(--color-primary)"
                        strokeWidth="6"
                        fill="none"
                        strokeDasharray="15 15"
                        animate={{ strokeDashoffset: [0, -100] }}
                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    />
                </svg>
                {/* Truck Marker moving */}
                <motion.div
                    animate={{ x: [100, 300, 500, 800], y: [200, 250, 300, 250] }}
                    transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
                    className="absolute w-12 h-12 md:w-16 md:h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)] z-10"
                >
                    <Truck size={24} className="md:w-8 md:h-8" />
                </motion.div>
            </div>

            {/* Top Banner */}
            <div className="relative z-20 p-4 md:p-6 pt-10 md:pt-16 max-w-2xl mx-auto w-full">
                <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 flex items-center justify-between">
                    <Link href="/client" className="text-xl font-black text-primary">Courssa</Link>
                    <div className="text-xs md:text-sm font-semibold text-muted-foreground flex items-center gap-2">
                        Trajet en cours <span className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Info Bottom Sheet */}
            <div className="relative z-20 mt-auto bg-background/90 backdrop-blur-lg border-t border-border/50 rounded-t-[2rem] p-6 md:p-10 max-w-2xl mx-auto w-full">
                <div className="w-16 h-1.5 bg-accent rounded-full mx-auto mb-6 md:mb-8" />

                <div className="flex justify-between items-center mb-6 md:mb-8">
                    <div>
                        <h2 className="text-xl md:text-3xl font-bold">Arrivée dans 15 min</h2>
                        <p className="text-sm md:text-base text-muted-foreground">Le chauffeur est en route</p>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-3 text-center min-w-[100px]">
                        <div className="text-[10px] md:text-xs font-bold text-primary mb-1 uppercase tracking-wider"><ShieldCheck size={12} className="inline mr-1" />Code PIN</div>
                        <div className="text-xl md:text-2xl font-black tracking-widest text-foreground font-mono">1492</div>
                    </div>
                </div>

                {/* Driver Card */}
                <div className="bg-accent/40 rounded-2xl p-4 md:p-5 border border-border/50 mb-6 md:mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-zinc-800 rounded-full border-2 border-border overflow-hidden flex items-center justify-center">
                            <span className="text-xl md:text-3xl">👤</span>
                        </div>
                        <div>
                            <div className="font-bold text-lg md:text-xl">Karim B.</div>
                            <div className="text-xs md:text-sm text-muted-foreground flex items-center gap-1">
                                <Star size={14} className="text-primary fill-primary" /> 4.9 (120 courses)
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="font-bold text-sm md:text-base">Camionnette</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground bg-background px-2 py-1 rounded border border-border/50 mt-1">12345 119 16</div>
                    </div>
                </div>

                <div className="flex gap-3 md:gap-4">
                    <button className="flex-grow bg-accent text-foreground hover:bg-accent/80 font-bold py-4 md:py-5 rounded-2xl border border-border flex justify-center items-center gap-2 transition-colors md:text-lg active:scale-95">
                        <MessageCircle size={20} /> <span className="hidden md:inline">Envoyer un </span>message
                    </button>
                    <button onClick={() => setShowReceipt(true)} className="flex-grow bg-primary text-primary-foreground font-bold py-4 md:py-5 rounded-2xl flex justify-center items-center hover:bg-primary/90 transition-colors active:scale-95">
                        Fin de course
                    </button>
                    <button className="w-16 md:w-20 shrink-0 bg-green-500/10 text-green-500 font-bold py-4 md:py-5 rounded-2xl border border-green-500/20 flex justify-center items-center hover:bg-green-500/20 transition-colors active:scale-95">
                        <Phone size={24} />
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {showReceipt && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="bg-background border border-border/50 rounded-[2rem] p-6 md:p-8 max-w-sm w-full shadow-2xl relative flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck size={32} />
                            </div>
                            <h2 className="text-2xl font-black mb-1">Course terminée !</h2>
                            <p className="text-sm text-muted-foreground mb-6">La marchandise a été livrée avec succès.</p>

                            <div className="w-full bg-accent/30 rounded-2xl p-4 border border-border/50 mb-6">
                                <div className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Montant Payé</div>
                                <div className="text-3xl font-black text-primary mb-4">1200 DZD</div>
                                <div className="flex justify-between items-center text-sm py-2 border-t border-border/50">
                                    <span className="text-muted-foreground">Frais de livraison</span>
                                    <span className="font-bold">1200 DZD</span>
                                </div>
                                <div className="flex justify-between items-center text-sm py-2 border-t border-border/50">
                                    <span className="text-muted-foreground">Manutention</span>
                                    <span className="font-bold">0 DZD</span>
                                </div>
                                <button className="w-full mt-4 bg-background border border-border py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-accent"><Mail size={14} /> Envoyer le reçu par email</button>
                            </div>

                            <div className="w-full mb-6">
                                <div className="text-sm font-semibold mb-3">Évaluez votre chauffeur Karim B.</div>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <button key={star} onClick={() => setRating(star)} className="p-1 transition-transform hover:scale-110">
                                            <Star size={32} className={`${rating >= star ? 'text-primary fill-primary' : 'text-border'} transition-colors`} />
                                        </button>
                                    ))}
                                </div>
                                <textarea placeholder="Laissez un commentaire..." className="w-full mt-4 bg-background border border-border/50 rounded-xl p-3 text-sm resize-none outline-none focus:border-primary" rows={2}></textarea>
                            </div>

                            <Link href="/client" className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl text-center active:scale-95 transition-transform">
                                Retour à l'accueil
                            </Link>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
