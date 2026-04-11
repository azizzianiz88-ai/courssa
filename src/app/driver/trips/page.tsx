"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Truck, Navigation, CheckCircle2, Package, Clock,
  MapPin, User, ChevronRight, History
} from "lucide-react";

const TRIP_STAGES = [
  { status: "WAITING",    label: "En attente",        icon: "⏳", next: "Chauffeur arrivé",   desc: "Vous êtes en route vers le client." },
  { status: "LOADING",    label: "Chargement",         icon: "📦", next: "Chargement terminé", desc: "Chargement de la marchandise en cours." },
  { status: "IN_TRANSIT", label: "En Livraison",       icon: "🚚", next: "Arrivé à destination",desc: "Vous êtes en route vers la destination." },
  { status: "UNLOADING",  label: "Déchargement",       icon: "🏁", next: "Mission Terminée",   desc: "Déchargement et remise au destinataire." },
  { status: "COMPLETED",  label: "Terminé",            icon: "✅", next: null,                 desc: "Mission accomplie avec succès !" },
];

function getStageInfo(status: string) {
  return TRIP_STAGES.find(s => s.status === status) ?? TRIP_STAGES[0];
}

function StageIndicator({ currentStatus }: { currentStatus: string }) {
  const activeIdx = TRIP_STAGES.findIndex(s => s.status === currentStatus);
  return (
    <div className="flex items-center justify-between mt-5 mb-6 px-2">
      {TRIP_STAGES.filter(s => s.status !== "COMPLETED").map((stage, idx) => (
        <div key={stage.status} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${idx <= activeIdx ? 'bg-primary/20 border-2 border-primary scale-110' : 'bg-accent/50 border-2 border-border/50 opacity-50'}`}>
            {stage.icon}
          </div>
          {idx < 3 && <div className={`h-0.5 w-6 md:w-10 mx-1 ${idx < activeIdx ? 'bg-primary' : 'bg-border/50'}`} />}
        </div>
      ))}
    </div>
  );
}

export default function DriverTripsPage() {
  const [activeTrip, setActiveTrip] = useState<any | null>(null);
  const [pastTrips, setPastTrips] = useState<any[]>([]);
  const [myOffers, setMyOffers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancing, setIsAdvancing] = useState(false);
  
  const [finalPrice, setFinalPrice] = useState("");
  const [negotiatingOffer, setNegotiatingOffer] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [tripsRes, offersRes] = await Promise.all([
        fetch("/api/driver/trips"),
        fetch("/api/driver/my-offers")
      ]);
      if (tripsRes.ok) {
        const data = await tripsRes.json();
        setActiveTrip(data.active);
        setPastTrips(data.past);
      }
      if (offersRes.ok) setMyOffers(await offersRes.json());
    } catch(e) {}
    setIsLoading(false);
  };

  const advanceTrip = async () => {
    if (!activeTrip) return;
    setIsAdvancing(true);
    try {
      const res = await fetch("/api/driver/trips", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: activeTrip.id })
      });
      if (res.ok) await fetchAll();
    } catch(e) {}
    setIsAdvancing(false);
  };

  const respondToNegotiation = async (offerId: string, action: "COUNTER_BY_DRIVER" | "ACCEPT", price?: number) => {
    setActionLoading(offerId);
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, price })
      });
      if (res.ok) {
        await fetchAll();
        setNegotiatingOffer(null);
        setFinalPrice("");
      }
    } catch(e) {}
    setActionLoading(null);
  };

  if (isLoading) return (
    <div className="flex justify-center p-20">
      <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-36">
      <h1 className="text-2xl font-black text-foreground tracking-tight mb-1 pt-2">Mes Rحلات</h1>
      <p className="text-sm text-muted-foreground font-medium mb-6">Gérez votre mission en cours</p>

      {/* === ACTIVE TRIP === */}
      {activeTrip ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-[28px] p-5 mb-6">

          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-primary font-bold text-sm">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              MISSION EN COURS
            </div>
            <div className="text-2xl font-black">{getStageInfo(activeTrip.status).icon}</div>
          </div>
          
          <h2 className="text-xl font-black mb-1">
            {activeTrip.pickUp} → {activeTrip.dropOff}
          </h2>
          <p className="text-sm text-muted-foreground font-medium mb-3">
            {getStageInfo(activeTrip.status).desc}
          </p>

          {/* Stage Progress Bar */}
          <StageIndicator currentStatus={activeTrip.status} />

          {/* Client Info */}
          {activeTrip.client && (
            <div className="bg-background/60 rounded-2xl p-3 flex items-center gap-3 mb-5 border border-border/50">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                {activeTrip.client.name?.[0] || "C"}
              </div>
              <div>
                <div className="font-bold text-sm">{activeTrip.client.name}</div>
                <div className="text-xs text-muted-foreground">{activeTrip.client.phone}</div>
              </div>
              <a href={`tel:${activeTrip.client.phone}`} className="ml-auto text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-full">
                Appeler
              </a>
            </div>
          )}

          {/* Action Button */}
          {activeTrip.status !== "COMPLETED" && (
            <button
              onClick={advanceTrip}
              disabled={isAdvancing}
              className="w-full bg-primary text-primary-foreground font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2.5 shadow-lg shadow-primary/25 active:scale-95 transition-transform disabled:opacity-60"
            >
              {isAdvancing ? (
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {getStageInfo(activeTrip.status).next}
                  <ChevronRight size={20} />
                </>
              )}
            </button>
          )}
          {activeTrip.status === "COMPLETED" && (
            <div className="w-full bg-green-500/20 text-green-500 font-black py-4 rounded-2xl text-base flex items-center justify-center gap-2.5">
              <CheckCircle2 size={20} /> Mission Terminée !
            </div>
          )}
        </motion.div>
      ) : (
        <div className="bg-accent/20 border border-border/50 rounded-[24px] p-8 text-center mb-6">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-3">
            <Truck size={32} className="text-muted-foreground/50" />
          </div>
          <h3 className="font-bold mb-1">Aucune mission active</h3>
          <p className="text-sm text-muted-foreground">Vos prochaines missions assignées apparaîtront ici.</p>
        </div>
      )}

      {/* === ACTIVE NEGOTIATIONS === */}
      {myOffers.filter((o: any) => o.status === "NEGOTIATING" && o.lastActionBy === "CLIENT").length > 0 && (
        <div className="mb-6">
          <h2 className="font-black text-lg mb-3">Négociations en cours 🤝</h2>
          <div className="space-y-3">
            {myOffers.filter((o: any) => o.lastActionBy === "CLIENT").map((offer: any) => (
              <motion.div key={offer.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="bg-orange-500/5 border border-orange-500/20 rounded-[20px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-bold text-orange-500 uppercase tracking-wider">Contre-offre du client</div>
                  <div className="text-lg font-black text-orange-500">{offer.clientCounterPrice} DZD</div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {offer.order.pickUp} → {offer.order.dropOff}
                </p>
                <p className="text-xs text-muted-foreground mb-4">
                  Offre initiale : <b>{offer.price} DZD</b> • Prix client : <b>{offer.clientCounterPrice} DZD</b>
                </p>
                <div className="flex gap-2">
                  <button onClick={() => respondToNegotiation(offer.id, "ACCEPT")} disabled={actionLoading === offer.id}
                    className="flex-1 bg-green-500 text-white font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-all">
                    Accepter {offer.clientCounterPrice} DZD
                  </button>
                  <button onClick={() => setNegotiatingOffer(offer)}
                    className="flex-1 bg-accent font-bold py-2.5 rounded-xl text-sm active:scale-95 transition-all">
                    Contre-offre finale
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* === PAST TRIPS === */}
      {pastTrips.length > 0 && (
        <div>
          <h2 className="font-black text-lg mb-3 flex items-center gap-2">
            <History size={18} /> Courses terminées
          </h2>
          <div className="space-y-3">
            {pastTrips.map((trip: any, i: number) => (
              <motion.div key={trip.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-accent/20 border border-border/50 rounded-[20px] p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center shrink-0">
                  <CheckCircle2 size={22} className="text-green-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm truncate">{trip.pickUp} → {trip.dropOff}</div>
                  <div className="text-xs text-muted-foreground">{trip.type} • {trip.urgency}</div>
                </div>
                <div className="text-xs font-bold text-green-500 bg-green-500/10 px-2 py-1 rounded-full shrink-0">Terminé</div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* === COUNTER-OFFER MODAL (Driver's Final Price) === */}
      <AnimatePresence>
        {negotiatingOffer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-3xl p-6 w-full max-w-md shadow-2xl">
              <h2 className="text-xl font-bold text-center mb-1">Votre Prix Final</h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                C'est votre <b>dernière proposition</b>. Le client devra accepter ou refuser.
              </p>
              <div className="relative mb-6">
                <input type="number" placeholder="Prix final" value={finalPrice} onChange={e => setFinalPrice(e.target.value)}
                  className="w-full bg-accent/30 border border-border/50 rounded-xl py-4 px-4 text-center text-2xl font-black outline-none focus:border-primary" />
                <span className="absolute right-4 top-5 text-muted-foreground font-bold text-sm">DZD</span>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setNegotiatingOffer(null)} className="flex-1 bg-accent font-bold py-3.5 rounded-xl">Annuler</button>
                <button onClick={() => respondToNegotiation(negotiatingOffer.id, "COUNTER_BY_DRIVER", parseFloat(finalPrice))}
                  disabled={!finalPrice || actionLoading === negotiatingOffer.id}
                  className="flex-1 bg-primary text-primary-foreground font-bold py-3.5 rounded-xl disabled:opacity-50">
                  Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
