"use client";

import { Check, X, Map, Clock, Truck } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function DriverDashboard() {
    const [requests, setRequests] = useState([
        { id: 1, from: "Bab Ezzouar", to: "Hydra", price: "1200", dist: "8 km", time: "15 min", urgency: "Urgent", desc: "3 Cartons, 2 chaises", hasInvoice: false, needWorkers: true, workersPayer: "Client" },
        { id: 2, from: "Zone Industrielle", to: "Rouiba", price: "2500", dist: "25 km", time: "40 min", urgency: "Normal", desc: "Briques de construction", hasInvoice: true, needWorkers: true, workersPayer: "Chauffeur" },
        { id: 3, from: "Casbah", to: "El Biar", price: "900", dist: "12 km", time: "20 min", urgency: "Normal", desc: "Meubles de salon", hasInvoice: false, needWorkers: false, workersPayer: "" }
    ]);
    const [offerAmounts, setOfferAmounts] = useState<{ [key: number]: string }>({});

    return (
        <div className="min-h-screen pb-20 md:pb-0 bg-background">
            <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
                            <Truck strokeWidth={2.5} size={18} className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg md:text-xl font-black tracking-tight leading-none text-foreground">Courssa</span>
                            <span className="text-muted-foreground text-[10px] md:text-xs font-semibold">Chauffeur</span>
                        </div>
                    </Link>

                    <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1.5 md:gap-2 text-green-500 bg-green-500/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-[10px] md:text-xs border border-green-500/20 font-semibold">
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500 animate-pulse" />
                            En ligne
                        </span>
                        <Link href="/driver/profile" className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-zinc-800 border-[1.5px] border-border flex items-center justify-center overflow-hidden hover:opacity-80 transition-opacity">
                            <span className="text-sm md:text-base">👤</span>
                        </Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
                    <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
                        <div className="bg-accent/40 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-border/50 text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
                            <div className="text-xs md:text-sm text-muted-foreground mb-1 relative z-10">Gains d'aujourd'hui</div>
                            <div className="text-4xl md:text-5xl font-black text-primary mb-4 flex justify-center items-end gap-1 relative z-10 leading-none">
                                3700 <span className="text-base md:text-xl mb-1">DZD</span>
                            </div>
                            <div className="w-full h-1.5 md:h-2 bg-background/50 rounded-full overflow-hidden relative z-10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "66%" }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-primary"
                                />
                            </div>
                        </div>

                        <h2 className="text-lg md:text-xl font-bold flex items-center justify-between">
                            Demandes à proximité
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">{requests.length}</span>
                        </h2>

                        <div className="space-y-3 md:space-y-4">
                            <AnimatePresence>
                                {requests.map(req => (
                                    <motion.div
                                        key={req.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="bg-accent/20 border border-border/50 rounded-2xl p-4 md:p-5 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex justify-between items-start mb-3 md:mb-4">
                                            <div className="w-full">
                                                <div className="flex items-center gap-2 mb-2">
                                                    {req.urgency === "Urgent" ? (
                                                        <span className="text-[10px] bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full font-bold border border-red-500/20">🔴 Urgent</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold border border-green-500/20">🟢 Normal</span>
                                                    )}
                                                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">Prix suggéré: {req.price} DZD</span>
                                                </div>
                                                <div className="text-[10px] md:text-xs text-muted-foreground flex gap-3 md:gap-4 w-full">
                                                    <span className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full"><Clock size={12} className="text-primary" /> {req.time}</span>
                                                    <span className="flex items-center gap-1 bg-background/50 px-2 py-0.5 rounded-full"><Map size={12} className="text-primary" /> {req.dist}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 mb-3 text-xs md:text-sm font-medium bg-background/40 p-3 rounded-xl border border-border/50">
                                            <div className="flex flex-col items-center gap-1">
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-primary" />
                                                <div className="w-0.5 h-6 bg-border/80 relative overflow-hidden" />
                                                <div className="w-2.5 h-2.5 rounded-full border-2 border-foreground bg-foreground" />
                                            </div>
                                            <div className="flex flex-col gap-3 w-full">
                                                <div className="text-muted-foreground">{req.from}</div>
                                                <div className="text-foreground">{req.to}</div>
                                            </div>
                                        </div>

                                        <div className="text-xs text-muted-foreground mb-4 p-2.5 bg-accent/30 rounded-lg border border-border/50">
                                            <div className="font-semibold text-foreground mb-1 flex items-center gap-2">📦 {req.desc} {req.hasInvoice && <span className="text-[9px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded border border-blue-500/20">Avec Facture</span>}</div>
                                            {req.needWorkers && (
                                                <div className="mt-2 text-[10px] bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 p-1.5 rounded flex flex-col">
                                                    <span className="font-bold">⚠️ Manutentionnaires requis</span>
                                                    <span>Payé par: {req.workersPayer === 'Chauffeur' ? "Vous (inclure dans l'offre)" : "Le client sur place"}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 items-center">
                                            <div className="flex-1 relative flex items-center">
                                                <input
                                                    type="number"
                                                    placeholder="Votre tarif"
                                                    value={offerAmounts[req.id] || ""}
                                                    onChange={(e) => setOfferAmounts({ ...offerAmounts, [req.id]: e.target.value })}
                                                    className="w-full bg-background border border-border/50 rounded-xl py-2.5 px-3 pl-3 pr-12 text-sm focus:border-primary outline-none font-bold"
                                                />
                                                <span className="absolute right-3 text-[10px] font-bold text-muted-foreground pointer-events-none">DZD</span>
                                            </div>
                                            <button
                                                disabled={!offerAmounts[req.id]}
                                                onClick={() => setRequests(r => r.filter(x => x.id !== req.id))}
                                                className="bg-primary text-primary-foreground py-2.5 px-4 rounded-xl text-sm font-bold flex justify-center items-center gap-2 active:scale-95 transition-transform disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-primary/20"
                                            >
                                                Proposer
                                            </button>
                                            <button onClick={() => setRequests(r => r.filter(x => x.id !== req.id))} className="w-10 h-10 shrink-0 bg-background border border-border/50 flex justify-center items-center rounded-xl active:bg-accent text-muted-foreground transition-colors">
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {requests.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 md:py-16 text-muted-foreground bg-accent/10 rounded-2xl border border-border/10"
                                >
                                    <Truck size={40} className="mx-auto mb-3 opacity-20" />
                                    Aucune demande pour le moment
                                </motion.div>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2 h-[200px] md:h-auto md:min-h-[600px] bg-accent/20 rounded-2xl md:rounded-3xl border border-border/50 relative overflow-hidden flex justify-center items-center order-1 lg:order-2 mb-6 lg:mb-0">
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:30px_30px] md:bg-[size:40px_40px]" />
                        <div className="relative text-center">
                            <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_20px_rgba(250,204,21,1)] z-10" />
                            <span className="absolute top-1/2 left-1/2 w-16 h-16 md:w-24 md:h-24 border border-primary/50 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-inner animate-ping" />
                            <span className="absolute top-1/2 left-1/2 w-32 h-32 md:w-48 md:h-48 border border-primary/20 rounded-full -translate-x-1/2 -translate-y-1/2 animate-ping" style={{ animationDelay: '500ms' }} />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
