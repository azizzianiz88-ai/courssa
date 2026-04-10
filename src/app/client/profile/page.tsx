"use client";
import Link from 'next/link';
import { User, Settings, CreditCard, Bell, LogOut, ChevronLeft, Edit2 } from 'lucide-react';
import { useState } from 'react';

export default function ClientProfile() {
    const [user, setUser] = useState({ name: "Mohamed Ali", email: "mohamed@courssa.dz", phone: "+213 550 12 34 56" });

    return (
        <div className="min-h-screen bg-background flex flex-col pb-20 md:pb-0">
            <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
                <div className="max-w-3xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center gap-4">
                    <Link href="/client" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-accent transition-colors">
                        <ChevronLeft size={24} />
                    </Link>
                    <h1 className="text-xl font-bold">Mon Profil</h1>
                </div>
            </nav>

            <main className="max-w-3xl mx-auto w-full px-4 md:px-6 py-6 md:py-10 flex-grow">

                <div className="flex flex-col items-center text-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold mb-4 relative">
                        M
                        <button className="absolute bottom-0 right-0 w-8 h-8 bg-background border border-border shadow-sm rounded-full flex justify-center items-center text-foreground hover:bg-accent transition-colors">
                            <Edit2 size={14} />
                        </button>
                    </div>
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground mt-1">{user.phone}</p>
                </div>

                <div className="space-y-6">
                    <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><User size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Informations Personnelles</h3>
                                <p className="text-xs text-muted-foreground">Modifier vos détails de compte</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><CreditCard size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Moyens de paiement</h3>
                                <p className="text-xs text-muted-foreground">Gérer vos cartes et factures</p>
                            </div>
                        </div>

                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><Bell size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Notifications</h3>
                                <p className="text-xs text-muted-foreground">Alertes et mises à jour</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
                        <div className="p-4 flex items-center gap-4 hover:bg-background/50 rounded-2xl cursor-pointer transition-colors border-b border-transparent hover:border-border/50">
                            <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-foreground"><Settings size={20} /></div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-sm">Paramètres généraux</h3>
                                <p className="text-xs text-muted-foreground">Langue, apparence, affichage</p>
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
