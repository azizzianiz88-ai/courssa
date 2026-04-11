"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Navigation, Package, Clock, ShieldCheck, X } from "lucide-react";

export default function DriverOffersBoard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [biddingPrice, setBiddingPrice] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [biddedOrders, setBiddedOrders] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOrders();
    fetchVehicles();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/driver/orders");
      if (res.ok) setOrders(await res.json());
    } catch (e) {}
    setIsLoading(false);
  };

  const fetchVehicles = async () => {
    try {
      const res = await fetch("/api/driver/vehicles");
      if (res.ok) {
         const data = await res.json();
         setVehicles(data);
         if (data.length > 0) setSelectedVehicle(data[0].type); // Auto-select first vehicle
      }
    } catch (e) {}
  };

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || !biddingPrice || !selectedVehicle) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/driver/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          price: biddingPrice,
          vehicle: selectedVehicle,
          message: "Disponible immédiatement !"
        })
      });

      if (res.ok) {
        setBiddedOrders(prev => new Set(prev).add(selectedOrder.id));
        setSelectedOrder(null);
      }
    } catch (err) {}
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-32">
      <div className="mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Missions Disponibles</h1>
        <p className="text-sm text-muted-foreground font-medium mt-1">Trouvez des courses près de vous</p>
      </div>

      <div className="grid gap-5">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center p-8 text-muted-foreground">Aucune mission pour le moment.</div>
        ) : (
          orders.map((order, idx) => {
            const hasBidded = biddedOrders.has(order.id);
            
            return (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-accent/20 border border-border/50 rounded-[24px] p-5 relative overflow-hidden"
            >
              {/* Type Badge & Urgency */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 bg-background shadow-sm border border-border/50 px-3 py-1.5 rounded-full">
                  <Package size={14} className="text-primary" />
                  <span className="text-[11px] font-bold uppercase tracking-wider">{order.type}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                  <Clock size={12} />
                  {order.urgency}
                </div>
              </div>

              <h2 className="text-xl font-bold mb-5 leading-tight">{order.title}</h2>

              {/* Routing */}
              <div className="relative pl-6 mb-6">
                {/* Timeline line */}
                <div className="absolute top-2.5 bottom-2.5 left-2 w-0.5 bg-border/80"></div>
                
                <div className="relative mb-4">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-background border border-blue-600"></div>
                  <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">Lieu d'enlèvement</p>
                  <p className="font-semibold text-sm">{order.pickUp}</p>
                </div>

                <div className="relative">
                  <div className="absolute -left-[23px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-background border border-primary"></div>
                  <p className="text-[10px] text-primary font-bold uppercase tracking-wider mb-0.5">Lieu de livraison</p>
                  <p className="font-semibold text-sm">{order.dropOff}</p>
                </div>
              </div>

              {/* Actions */}
              {hasBidded ? (
                <div className="w-full bg-green-500/10 border border-green-500/20 text-green-500 font-bold py-3.5 rounded-2xl flex justify-center items-center gap-2">
                  <ShieldCheck size={18} /> Offre Envoyée !
                </div>
              ) : (
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-2xl flex justify-center items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  <Navigation size={18} /> Faire une Offre
                </button>
              )}
            </motion.div>
          )} // map function
          )
        )}
      </div>

      {/* Bidding Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative"
            >
              <div className="bg-accent/30 px-6 py-5 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Proposer un Tarif</h2>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-accent border border-border/50">
                  <X size={16} />
                </button>
              </div>
              
              <form onSubmit={submitOffer} className="p-6">
                <div className="space-y-5">
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
                    <p className="text-xs text-primary font-bold uppercase tracking-wider mb-1">Pour la mission :</p>
                    <p className="font-semibold text-sm">{selectedOrder.pickUp} ➔ {selectedOrder.dropOff}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Quel véhicule utiliserez-vous ?</label>
                    <select 
                      required
                      value={selectedVehicle}
                      onChange={e => setSelectedVehicle(e.target.value)}
                      className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-primary font-bold appearance-none"
                    >
                      {vehicles.length === 0 ? <option value="" disabled>Aucun véhicule (Ajoutez-en un dans Ma Flotte)</option> : null}
                      {vehicles.map((v, i) => (
                        <option key={i} value={v.type}>{v.type} ({v.capacity ? v.capacity+'t' : 'N/A'})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Votre Prix de Livraison (DZD)</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        required
                        placeholder="Ex: 2500"
                        value={biddingPrice}
                        onChange={e => setBiddingPrice(e.target.value)}
                        className="w-full bg-accent/20 border border-border/50 rounded-xl py-4 pl-4 pr-16 text-xl font-black outline-none focus:border-primary transition-all" 
                      />
                      <span className="absolute right-4 top-4 text-muted-foreground font-bold">DZD</span>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting || vehicles.length === 0}
                  className="w-full bg-foreground text-background font-black py-4 rounded-xl mt-8 active:scale-95 transition-transform flex justify-center items-center h-[60px] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-6 h-6 border-2 border-background/30 border-t-background rounded-full animate-spin"></span>
                  ) : "Envoyer l'Offre"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
