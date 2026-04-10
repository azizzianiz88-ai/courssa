"use client";
import Link from 'next/link';
import { MapPin, Navigation, Phone, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function DriverTrip() {
    const [tripStatus, setTripStatus] = useState("En route vers le client"); // En route vers le client -> Marchandise chargée -> Voyage terminé

    return (
        <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
            {/* Fake map background */}
            <div className="absolute inset-0 bg-[#09090b]">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:40px_40px]" />
            </div>

            <div className="relative z-20 p-4 md:p-6 pt-10 md:pt-16 flex-grow flex flex-col max-w-2xl mx-auto w-full">
                <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-2xl p-4 flex items-center justify-between mb-auto">
                    <Link href="/driver" className="text-xl md:text-2xl font-black text-primary">Courssa <span className="text-[10px] md:text-xs text-muted-foreground font-normal">| Chauffeur</span></Link>
                    <div className="text-[10px] md:text-xs font-semibold bg-accent px-3 py-1.5 rounded-full border border-border/50">
                        Course Active
                    </div>
                </div>

                <div className="bg-background/90 backdrop-blur-lg border border-border/50 rounded-[2rem] p-6 md:p-10 mt-auto">

                    <div className="flex justify-between items-center mb-6 md:mb-8">
                        <div className="text-xl md:text-3xl font-bold text-primary">{tripStatus}</div>
                        {tripStatus === "Voyage terminé" ? (
                            <CheckCircle2 size={32} className="text-green-500" />
                        ) : (
                            <div className="w-8 h-8 md:w-10 md:h-10 border-4 border-primary border-t-transparent rounded-full animate-spin shrink-0 ml-4" />
                        )}
                    </div>

                    <div className="space-y-4 mb-6 md:mb-8">
                        <div className="flex items-start gap-4 p-4 md:p-5 bg-accent/30 rounded-2xl border border-border/50">
                            <MapPin className="text-primary mt-1 shrink-0" size={24} />
                            <div>
                                <div className="text-xs md:text-sm text-muted-foreground mb-1">Point de ramassage</div>
                                <div className="font-semibold text-base md:text-lg">Bab Ezzouar, Alger</div>
                                <div className="text-xs md:text-sm mt-1 text-muted-foreground">Client: Mohamed Ali</div>
                            </div>
                            <button className="ml-auto w-10 h-10 md:w-12 md:h-12 rounded-full bg-green-500/10 text-green-500 flex justify-center items-center shrink-0 active:scale-95 transition-transform hover:bg-green-500/20">
                                <Phone size={18} />
                            </button>
                        </div>

                        <div className="flex items-start gap-4 p-4 md:p-5 bg-accent/30 rounded-2xl border border-border/50">
                            <Navigation className="text-muted-foreground mt-1 shrink-0" size={24} />
                            <div>
                                <div className="text-xs md:text-sm text-muted-foreground mb-1">Point de livraison</div>
                                <div className="font-semibold text-base md:text-lg">Hydra, Alger</div>
                            </div>
                        </div>
                    </div>

                    {tripStatus === "En route vers le client" && (
                        <button onClick={() => setTripStatus("Marchandise chargée")} className="w-full bg-primary text-primary-foreground font-bold py-4 md:py-5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform shadow-[0_0_20px_rgba(250,204,21,0.3)] text-base md:text-lg">
                            Je suis arrivé au ramassage
                        </button>
                    )}

                    {tripStatus === "Marchandise chargée" && (
                        <div className="space-y-3">
                            <div className="p-4 bg-accent/40 rounded-xl border border-border/50 text-center">
                                <label className="text-xs md:text-sm font-semibold mb-2 block">Code PIN de livraison (Demandez au client)</label>
                                <input type="number" placeholder="• • • •" className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-center text-2xl tracking-[1em] font-mono outline-none focus:border-primary" />
                            </div>
                            <button onClick={() => setTripStatus("Voyage terminé")} className="w-full bg-blue-600 text-white font-bold py-4 md:py-5 rounded-xl flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition-transform text-base md:text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)]">
                                Confirmer & Terminer
                            </button>
                        </div>
                    )}

                    {tripStatus === "Voyage terminé" && (
                        <Link href="/driver" className="w-full bg-accent text-foreground font-bold py-4 md:py-5 rounded-xl flex justify-center items-center gap-2 active:scale-95 transition-transform border border-border block text-center text-base md:text-lg hover:bg-accent/80">
                            Retour au tableau de bord
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
