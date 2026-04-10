"use client";
import Link from 'next/link';
import { User, Truck, Shield, Wallet, LogOut, ChevronLeft, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function DriverProfile() {
    const [user, setUser] = useState({ name: "Karim B.", email: "karim@courssa.dz", phone: "+213 660 98 76 54" });
    const [isOnline, setIsOnline] = useState(true);

    return (
        <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
            <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-4">
                    <Link href="/driver" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">Mon Profil <span className="text-muted-foreground text-sm font-normal">| Chauffeur</span></h1>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto w-full px-4 md:px-6 py-6 md:py-10 flex-grow">

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-border flex items-center justify-center text-3xl font-bold mb-4 relative overflow-hidden">
                        <span className="text-4xl text-muted-foreground">👤</span>
                        <button className="absolute bottom-0 inset-x-0 h-8 bg-black/50 text-white flex justify-center items-center text-[10px] hover:bg-black/70 transition-colors">
                            Modifier
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground mt-1">{user.phone}</p>
                </div>

                {/* Online Toggle Status */}
                <div className="bg-accent/40 border border-border/50 rounded-3xl p-5 mb-8 flex items-center justify-between shadow-sm">
                    <div>
                        <h3 className="font-bold flex items-center gap-2">
                            Statut de disponibilité
                            {isOnline ? (
                                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.6)]" />
                            ) : (
                                <span className="w-2.5 h-2.5 bg-muted-foreground rounded-full" />
                            )}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                            {isOnline ? "Vous êtes visible pour les clients" : "Vous ne recevrez plus de demandes"}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsOnline(!isOnline)}
                        className={`w-14 h-8 rounded-full p-1 transition-colors flex ${isOnline ? 'bg-green-500 justify-end' : 'bg-muted justify-start'}`}
                    >
                        <div className="w-6 h-6 bg-white rounded-full shadow-md" />
                    </button>
                </div>

                <div className="space-y-6">
                    <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><User size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Informations Personnelles</h3>
                                <p className="text-xs text-muted-foreground">Gérer vos détails</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><Truck size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Mon Véhicule</h3>
                                <p className="text-xs text-muted-foreground">Plaque, type et assurance</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><Shield size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Documents Légaux</h3>
                                <p className="text-xs text-green-500 font-semibold">Tous vérifiés ✅</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><Wallet size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Mes Gains & Retraits</h3>
                                <p className="text-xs text-muted-foreground">Historique des virements</p>
                            </div>
                        </div>

                        <Link href="/" className="p-4 flex items-center gap-4 hover:bg-red-500/10 rounded-2xl cursor-pointer transition-colors group">
                            <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors"><LogOut size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm text-red-500">Se déconnecter</h3>
                            </div>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
