"use client";
import Link from 'next/link';
import { Users, Truck, DollarSign, Activity, FileText, Check, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function AdminDashboard() {
    const [pendingDrivers, setPendingDrivers] = useState([
        { id: 1, name: "Samir K.", phone: "0555 12 34 56", truck: "Poids Lourd", wilaya: "Alger" },
        { id: 2, name: "Riyad M.", phone: "0770 98 76 54", truck: "Camionnette", wilaya: "Oran" },
        { id: 3, name: "Hichem H.", phone: "0660 11 22 33", truck: "Petit Camion", wilaya: "Sétif" }
    ]);

    return (
        <div className="min-h-screen bg-background flex flex-col md:flex-row">
            <aside className="w-full md:w-64 bg-accent/40 border-r border-border/50 p-6 flex flex-col h-auto md:h-screen md:sticky top-0 z-50">
                <Link href="/" className="text-2xl font-black text-primary mb-8 block text-center md:text-left">Courssa <span className="text-sm font-normal text-muted-foreground p-1 border border-border rounded-md bg-background ml-1">Admin</span></Link>

                <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible flex-grow pb-4 md:pb-0">
                    <Link href="#dashboard" className="flex items-center gap-3 text-foreground bg-primary/10 text-primary font-bold px-4 py-3 rounded-xl transition-colors shrink-0">
                        <Activity size={20} /> <span className="hidden md:inline">Vue d'ensemble</span>
                    </Link>
                    <Link href="#drivers" className="flex items-center gap-3 text-muted-foreground hover:text-foreground font-semibold px-4 py-3 rounded-xl transition-colors shrink-0">
                        <Truck size={20} /> <span className="hidden md:inline">Chauffeurs</span>
                        <span className="ml-auto bg-primary text-primary-foreground text-xs py-0.5 px-2 rounded-full hidden md:inline">{pendingDrivers.length}</span>
                    </Link>
                    <Link href="#users" className="flex items-center gap-3 text-muted-foreground hover:text-foreground font-semibold px-4 py-3 rounded-xl transition-colors shrink-0">
                        <Users size={20} /> <span className="hidden md:inline">Clients</span>
                    </Link>
                </nav>

                <div className="mt-4 md:mt-8 pt-4 md:pt-8 border-t border-border/50 hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center font-bold">A</div>
                        <div>
                            <div className="font-bold text-sm">Super Admin</div>
                            <div className="text-xs text-muted-foreground">admin@courssa.dz</div>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="flex-1 p-4 md:p-8 lg:p-10">
                <h1 className="text-2xl md:text-3xl font-bold mb-6 md:mb-8">Tableau de bord</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8 md:mb-10">
                    <div className="bg-accent/30 border border-border/50 p-5 md:p-6 rounded-2xl md:rounded-3xl hover:border-primary/30 transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-primary/20 text-primary rounded-xl flex items-center justify-center mb-3 md:mb-4"><DollarSign size={20} className="md:w-6 md:h-6" /></div>
                        <div className="text-muted-foreground text-xs md:text-sm font-semibold mb-1">Revenus (Mensuel)</div>
                        <div className="text-2xl md:text-3xl font-black">450,000 <span className="text-sm md:text-base font-bold text-muted-foreground">DZD</span></div>
                    </div>

                    <div className="bg-accent/30 border border-border/50 p-5 md:p-6 rounded-2xl md:rounded-3xl hover:border-blue-500/30 transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-3 md:mb-4"><Truck size={20} className="md:w-6 md:h-6" /></div>
                        <div className="text-muted-foreground text-xs md:text-sm font-semibold mb-1">Chauffeurs Actifs</div>
                        <div className="text-2xl md:text-3xl font-black">248</div>
                    </div>

                    <div className="bg-accent/30 border border-border/50 p-5 md:p-6 rounded-2xl md:rounded-3xl hover:border-green-500/30 transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center mb-3 md:mb-4"><Activity size={20} className="md:w-6 md:h-6" /></div>
                        <div className="text-muted-foreground text-xs md:text-sm font-semibold mb-1">Courses en cours</div>
                        <div className="text-2xl md:text-3xl font-black">42</div>
                    </div>

                    <div className="bg-accent/30 border border-border/50 p-5 md:p-6 rounded-2xl md:rounded-3xl hover:border-purple-500/30 transition-colors">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center mb-3 md:mb-4"><Users size={20} className="md:w-6 md:h-6" /></div>
                        <div className="text-muted-foreground text-xs md:text-sm font-semibold mb-1">Total Clients</div>
                        <div className="text-2xl md:text-3xl font-black">12,450</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-2 space-y-6">
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                            <FileText className="text-primary" /> Chauffeurs en attente d'approbation
                        </h2>

                        <div className="bg-accent/20 border border-border/50 rounded-2xl md:rounded-3xl overflow-x-auto">
                            <div className="min-w-[600px]">
                                <div className="grid grid-cols-5 gap-4 p-4 border-b border-border/50 font-semibold text-sm text-muted-foreground">
                                    <div className="col-span-1">Chauffeur</div>
                                    <div className="col-span-1">Téléphone</div>
                                    <div className="col-span-1">Véhicule</div>
                                    <div className="col-span-1">Wilaya</div>
                                    <div className="col-span-1 text-right pr-4">Action</div>
                                </div>

                                <AnimatePresence>
                                    {pendingDrivers.map(driver => (
                                        <motion.div key={driver.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-5 gap-4 px-4 py-3 border-b border-border/20 items-center text-sm last:border-0 hover:bg-background/40 transition-colors">
                                            <div className="col-span-1 font-bold truncate">{driver.name}</div>
                                            <div className="col-span-1 text-muted-foreground truncate">{driver.phone}</div>
                                            <div className="col-span-1 truncate">{driver.truck}</div>
                                            <div className="col-span-1"><span className="bg-accent px-2 py-1 rounded-md text-xs font-semibold">{driver.wilaya}</span></div>
                                            <div className="col-span-1 flex justify-end gap-2 pr-2">
                                                <button onClick={() => setPendingDrivers(pd => pd.filter(d => d.id !== driver.id))} className="w-8 h-8 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-all active:scale-95" title="Approuver">
                                                    <Check size={16} strokeWidth={3} />
                                                </button>
                                                <button onClick={() => setPendingDrivers(pd => pd.filter(d => d.id !== driver.id))} className="w-8 h-8 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all active:scale-95" title="Rejeter">
                                                    <X size={16} strokeWidth={3} />
                                                </button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {pendingDrivers.length === 0 && (
                                    <div className="p-8 text-center text-muted-foreground font-semibold">Toutes les demandes ont été traitées ! 🎉</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                            <MapPin className="text-primary" /> Activité en direct
                        </h2>
                        <div className="bg-accent/20 border border-border/50 rounded-2xl md:rounded-3xl p-6 min-h-[350px] flex flex-col items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:30px_30px]" />
                            <div className="relative z-10 flex flex-col items-center gap-4 w-full">
                                <div className="bg-background border border-border/50 p-4 rounded-xl flex items-center gap-4 w-full shadow-lg hover:border-primary/30 transition-colors cursor-pointer">
                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Transport en cours</div>
                                        <div className="font-bold text-sm">Alger ➔ Blida</div>
                                    </div>
                                </div>
                                <div className="bg-background border border-border/50 p-4 rounded-xl flex items-center gap-4 w-full shadow-lg hover:border-primary/30 transition-colors cursor-pointer">
                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" style={{ animationDelay: '0.4s' }} />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Transport en cours</div>
                                        <div className="font-bold text-sm">Oran ➔ Tlemcen</div>
                                    </div>
                                </div>
                                <div className="bg-background border border-border/50 p-4 rounded-xl flex items-center gap-4 w-full shadow-lg hover:border-primary/30 transition-colors cursor-pointer">
                                    <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" style={{ animationDelay: '0.8s' }} />
                                    <div>
                                        <div className="text-xs text-muted-foreground">Transport en cours</div>
                                        <div className="font-bold text-sm">Sétif ➔ Constantine</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
