"use client";
import Link from 'next/link';
import { ArrowRight, ArrowLeft, Truck, Image as ImageIcon, FileText, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DriverRegister() {
    const [step, setStep] = useState(1);

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 py-12">
            <div className="w-full max-w-lg bg-accent/30 p-6 md:p-8 rounded-3xl border border-border/50 relative overflow-hidden">

                <div className="flex mb-8 gap-2">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className={`h-2 flex-grow rounded-full transition-colors ${i <= step ? 'bg-primary' : 'bg-border/50'}`} />
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h1 className="text-2xl font-black text-primary mb-2">Informations Personnelles</h1>
                            <p className="text-muted-foreground text-sm mb-6">Commencez par vos détails de base pour rejoindre le réseau.</p>
                            <div className="space-y-4">
                                <input type="text" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary" placeholder="Nom complet" />
                                <input type="tel" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary" placeholder="Numéro de téléphone" />
                                <input type="email" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary" placeholder="Adresse Email" />
                                <button onClick={() => setStep(2)} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20 mt-6">
                                    Suivant <ArrowRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h1 className="text-2xl font-black text-primary mb-2">Le Véhicule</h1>
                            <p className="text-muted-foreground text-sm mb-6">Informations sur le camion que vous conduisez.</p>
                            <div className="space-y-4">
                                <select defaultValue="" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm appearance-none outline-none focus:border-primary cursor-pointer">
                                    <option value="" disabled>Sélectionner votre véhicule</option>
                                    <option>Moto / Scooter (Petits colis)</option>
                                    <option>Fourgonnette (ex: Kangoo, Berlingo)</option>
                                    <option>Fourgon (ex: Master, Transit)</option>
                                    <option>Camionnette / Pick-up</option>
                                    <option>Petit Camion (- de 2.5 Tonnes)</option>
                                    <option>Camion Moyen (2.5 à 5 Tonnes)</option>
                                    <option>Grand Camion (+ de 5 Tonnes)</option>
                                    <option>Camion Frigorifique</option>
                                    <option>Plateau</option>
                                    <option>Semi-remorque (Poids lourd)</option>
                                    <option>Porte-char (Engins lourds, Pelleteuses)</option>
                                    <option>Dépanneuse</option>
                                </select>
                                <input type="text" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary" placeholder="Plaque d'immatriculation" />

                                <div className="border-2 border-dashed border-border/60 rounded-xl p-8 flex flex-col justify-center items-center text-muted-foreground hover:bg-accent/40 cursor-pointer transition-colors">
                                    <ImageIcon size={32} className="mb-2 opacity-50" />
                                    <span className="text-sm">Prendre en photo le véhicule (Extérieur)</span>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setStep(1)} className="w-14 shrink-0 bg-background border border-border flex justify-center items-center rounded-xl hover:bg-accent transition-colors">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <button onClick={() => setStep(3)} className="flex-grow bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform">
                                        Suivant <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                            <h1 className="text-2xl font-black text-primary mb-2">Documents légaux</h1>
                            <p className="text-muted-foreground text-sm mb-6">Preuve d'identité et papiers du véhicule.</p>
                            <div className="space-y-4">

                                <div className="border-2 border-dashed border-border/60 rounded-xl p-6 flex flex-col justify-center text-center items-center text-muted-foreground hover:bg-accent/40 cursor-pointer transition-colors bg-blue-500/5">
                                    <FileText size={24} className="mb-2 opacity-80 text-blue-500" />
                                    <span className="text-sm font-semibold text-foreground">Permis de Conduire</span>
                                    <span className="text-xs">Uploader Recto/Verso</span>
                                </div>

                                <div className="border-2 border-dashed border-border/60 rounded-xl p-6 flex flex-col justify-center text-center items-center text-muted-foreground hover:bg-accent/40 cursor-pointer transition-colors bg-purple-500/5">
                                    <FileText size={24} className="mb-2 opacity-80 text-purple-500" />
                                    <span className="text-sm font-semibold text-foreground">Carte Grise</span>
                                    <span className="text-xs">Document officiel</span>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button onClick={() => setStep(2)} className="w-14 shrink-0 bg-background border border-border flex justify-center items-center rounded-xl hover:bg-accent transition-colors">
                                        <ArrowLeft size={18} />
                                    </button>
                                    <button onClick={() => setStep(4)} className="flex-grow bg-primary text-primary-foreground font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] transition-transform">
                                        Soumettre & Finir
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 4 && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                            <div className="w-20 h-20 bg-green-500/10 text-green-500 rounded-full flex justify-center items-center mx-auto mb-6">
                                <CheckCircle2 size={40} />
                            </div>
                            <h1 className="text-2xl font-black text-foreground mb-4">Profil en cours de vérification</h1>
                            <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
                                Merci pour votre inscription ! Notre équipe examine vos documents. Vous recevrez une notification d'ici 24h une fois votre compte approuvé.
                            </p>
                            <Link href="/driver" className="w-full bg-accent text-foreground font-bold py-3.5 rounded-xl block border border-border hover:bg-accent/80 transition-colors">
                                Aller au tableau de bord
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
