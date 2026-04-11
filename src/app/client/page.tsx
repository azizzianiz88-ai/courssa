"use client";

import {
  MapPin, Navigation, PackageSearch, CheckCircle2,
  AlertCircle, Truck, Info, Handshake
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const WILAYAS = ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Djelfa", "Sétif"];

export default function ClientDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Realtime refetch interval
  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 5000); // Polling every 5s for negotiations
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/client/orders");
      if (res.ok) setOrders(await res.json());
    } catch(e) {}
    setIsLoading(false);
  };

  const [formData, setFormData] = useState({ pickUp: "", dropOff: "", type: "", description: "", urgency: "Normal (+ de 48h)"});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [negotiatingOffer, setNegotiatingOffer] = useState<any | null>(null);
  const [counterPrice, setCounterPrice] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickUp || !formData.dropOff) return;
    setIsSubmitting(true);
    
    // Fallback Mock create since POST /api/client/orders isn't built yet
    setTimeout(() => {
      setOrders([{
        id: "mock-new", title: `De ${formData.pickUp} à ${formData.dropOff}`,
        status: "PENDING", urgency: formData.urgency, offers: [], time: "À l'instant"
      }, ...orders]);
      setIsSubmitting(false); setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }, 1000);
  };

  const handleAction = async (offerId: string, action: string, price?: number) => {
    setActionLoading(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, price })
      });
      if (res.ok) {
        await fetchOrders(); // refresh UI
        if(action === 'COUNTER_BY_CLIENT') setNegotiatingOffer(null);
      }
    } catch(err) {}
    setActionLoading(null);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-sm">
              <Truck strokeWidth={2.5} size={18} className="w-5 h-5" />
            </div>
            <span className="text-xl font-black tracking-tight leading-none">Courssa</span>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <h1 className="text-xl md:text-2xl font-bold">Nouvelle commande</h1>

          <AnimatePresence>
            {success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold">
                <CheckCircle2 size={24} className="shrink-0" /> Commande envoyée avec succès !
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleOrder} className="bg-accent/40 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-border/50 space-y-4">
             <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Lieu de ramassage</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <select required value={formData.pickUp} onChange={e => setFormData({...formData, pickUp: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pr-4 pl-10 text-sm outline-none focus:border-primary">
                    <option value="" disabled>Sélectionner</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">Lieu de livraison</label>
                <div className="relative">
                  <Navigation className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
                  <select required value={formData.dropOff} onChange={e => setFormData({...formData, dropOff: e.target.value})} className="w-full bg-background border border-border rounded-xl py-3 pr-4 pl-10 text-sm outline-none focus:border-primary">
                    <option value="" disabled>Sélectionner</option>
                    {WILAYAS.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
              <button disabled={isSubmitting} className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl active:scale-95 transition-transform flex justify-center">
                {isSubmitting ? "Envoi..." : "Commander le transport"}
              </button>
          </form>
        </div>

        {/* Orders Feed */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <h2 className="text-[22px] font-bold mb-4 tracking-tight px-1">Mes commandes et Offres</h2>
          
          <div className="space-y-5">
            {isLoading ? <div className="text-center p-10">Chargement...</div> : orders.map((order) => (
              <motion.div key={order.id} className="bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden shadow-lg border border-gray-100 dark:border-[#2C2C2E]">
                <div className="p-5">
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center text-white ${order.status === 'WAITING' ? 'bg-green-500' : 'bg-primary'}`}>
                      <PackageSearch size={22} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[17px] text-gray-900 dark:text-white">{order.title}</h3>
                      <div className="text-[13px] font-medium text-gray-500 mt-1">
                        Status: <span className="text-primary font-bold">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-[1px] bg-gray-100 dark:bg-[#2C2C2E] w-full mb-4"></div>

                  {/* Offers Section */}
                  {order.offers && order.offers.length > 0 ? (
                    <div className="space-y-3">
                      {order.offers.filter((o:any) => o.status !== 'REJECTED').map((offer: any) => {
                        
                        // Negotitation State Logic
                        const isAccepted = offer.status === 'ACCEPTED';
                        const currentPrice = offer.driverFinalPrice || offer.clientCounterPrice || offer.price;
                        const isClientTurn = !offer.lastActionBy || (offer.lastActionBy === 'DRIVER' && offer.status === 'NEGOTIATING');
                        const isDriverTurn = offer.lastActionBy === 'CLIENT' && offer.status === 'NEGOTIATING';
                        const canNegotiate = !offer.driverFinalPrice && offer.status !== 'ACCEPTED'; // Cannot negotiate driver's final price

                        return (
                          <div key={offer.id} className={`p-4 rounded-[16px] border ${isAccepted ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-50 dark:bg-[#2C2C2E]/40 border-gray-200 dark:border-[#3C3C3E]'}`}>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2 text-sm font-semibold">
                                <span className="text-[20px]">👨‍✈️</span> Chauffeur • {offer.vehicle}
                              </div>
                              <div className="text-lg font-black">{currentPrice} DZD</div>
                            </div>
                            
                            {/* Status tags */}
                            {offer.driverFinalPrice && !isAccepted && (
                              <div className="text-xs font-bold text-orange-500 bg-orange-500/10 px-2 py-1 rounded inline-block mb-3">
                                🚨 Offre finale du chauffeur
                              </div>
                            )}
                            {isDriverTurn && (
                              <div className="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded inline-block mb-3">
                                ⏳ En attente de la réponse du chauffeur...
                              </div>
                            )}
                            {isAccepted && (
                              <div className="text-xs font-bold text-green-500 flex items-center gap-1 mb-1">
                                <CheckCircle2 size={16}/> Chauffeur assigné !
                              </div>
                            )}

                            {/* Actions */}
                            {isClientTurn && !isAccepted && (
                              <div className="flex gap-2 mt-2">
                                <button 
                                  onClick={() => handleAction(offer.id, 'ACCEPT')} 
                                  disabled={actionLoading === offer.id}
                                  className="flex-1 bg-green-500 text-white font-bold py-2 rounded-xl text-sm transition-transform active:scale-95"
                                >
                                  Accepter
                                </button>
                                {canNegotiate && (
                                  <button 
                                    onClick={() => setNegotiatingOffer(offer)}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 text-foreground font-bold py-2 rounded-xl text-sm transition-transform active:scale-95"
                                  >
                                    Négocier
                                  </button>
                                )}
                                {offer.driverFinalPrice && (
                                  <button 
                                    onClick={() => handleAction(offer.id, 'REJECT')}
                                    className="flex-1 bg-red-500/10 text-red-500 font-bold py-2 rounded-xl text-sm transition-transform active:scale-95"
                                  >
                                    Refuser
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                      )})}
                    </div>
                  ) : (
                    <div className="text-center p-6 text-sm text-gray-500">Pas encore d'offres pour cette commande.</div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Negotiation Modal */}
      <AnimatePresence>
        {negotiatingOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl p-6 w-full max-w-md shadow-2xl relative">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake size={32} />
              </div>
              <h2 className="text-xl font-bold text-center mb-1">Faire une contre-proposition</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Le chauffeur demande {negotiatingOffer.price} DZD. Quel est votre prix ?
              </p>
              <div className="relative mb-6">
                <input type="number" required placeholder="Votre prix en DZD" value={counterPrice} onChange={e => setCounterPrice(e.target.value)} 
                  className="w-full bg-accent/30 border border-border/50 rounded-xl py-4 px-4 text-center text-2xl font-black outline-none focus:border-primary" />
                <span className="absolute right-4 top-5 text-muted-foreground font-bold text-sm">DZD</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setNegotiatingOffer(null)} className="flex-1 bg-accent font-bold py-3.5 rounded-xl">Annuler</button>
                <button onClick={() => handleAction(negotiatingOffer.id, 'COUNTER_BY_CLIENT', parseFloat(counterPrice))} disabled={!counterPrice}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl shadow-lg disabled:opacity-50">
                  Envoyer l'offre
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
