"use client";

import {
  MapPin,
  Navigation,
  PackageSearch,
  CheckCircle2,
  AlertCircle,
  Clock,
  Truck,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const WILAYAS = [
  "Adrar",
  "Chlef",
  "Laghouat",
  "Oum El Bouaghi",
  "Batna",
  "Béjaïa",
  "Biskra",
  "Béchar",
  "Blida",
  "Bouira",
  "Tamanrasset",
  "Tébessa",
  "Tlemcen",
  "Tiaret",
  "Tizi Ouzou",
  "Alger",
  "Djelfa",
  "Jijel",
  "Sétif",
  "Saïda",
  "Skikda",
  "Sidi Bel Abbès",
  "Annaba",
  "Guelma",
  "Constantine",
  "Médéa",
  "Mostaganem",
  "M'Sila",
  "Mascara",
  "Ouargla",
  "Oran",
  "El Bayadh",
  "Illizi",
  "Bordj Bou Arreridj",
  "Boumerdès",
  "El Tarf",
  "Tindouf",
  "Tissemsilt",
  "El Oued",
  "Khenchela",
  "Souk Ahras",
  "Tipaza",
  "Mila",
  "Aïn Defla",
  "Naâma",
  "Aïn Témouchent",
  "Ghardaïa",
  "Relizane",
  "Timimoun",
  "Bordj Badji Mokhtar",
  "Ouled Djellal",
  "Béni Abbès",
  "In Salah",
  "In Guezzam",
  "Touggourt",
  "Djanet",
  "El M'Ghair",
  "El Meniaa",
].sort();

export default function ClientDashboard() {
  const [orders, setOrders] = useState([
    {
      id: 1,
      title: "De Bab Ezzouar à Hydra",
      time: "Hier, 16:30",
      status: "En négociation",
      urgency: "Urgent (- de 48h)",
      offers: [
        { id: 101, vehicle: "Camionnette", rating: "4.9", price: "1500 DZD" },
        { id: 102, vehicle: "Petit Camion", rating: "4.5", price: "1800 DZD" },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    pickUp: "",
    dropOff: "",
    stop: "",
    type: "",
    description: "",
    urgency: "Normal (+ de 48h)",
    hasInvoice: false,
    needWorkers: false,
    workersPayer: "Client",
    photoAttached: false,
  });
  const [showStop, setShowStop] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAcceptSuccess, setShowAcceptSuccess] = useState(false);

  const handleAcceptOffer = (orderId: number, offerId: number) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: "Chauffeur assigné",
            offers: [], // Clear offers after accepting
          };
        }
        return o;
      })
    );
    setShowAcceptSuccess(true);
    setTimeout(() => setShowAcceptSuccess(false), 2500);
  };

  const handleOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pickUp || !formData.dropOff) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setOrders([
        {
          id: Date.now(),
          title: `De ${formData.pickUp}${formData.stop ? " via " + formData.stop : ""} à ${formData.dropOff}`,
          time: "À l'instant",
          status: "En attente",
          urgency: formData.urgency,
          offers: [],
        },
        ...orders,
      ]);
      setIsSubmitting(false);
      setSuccess(true);
      setFormData({
        pickUp: "",
        dropOff: "",
        stop: "",
        type: "",
        description: "",
        urgency: "Normal (+ de 48h)",
        hasInvoice: false,
        needWorkers: false,
        workersPayer: "Client",
        photoAttached: false,
      });
      setShowStop(false);

      setTimeout(() => setSuccess(false), 4000);
    }, 1500);
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-background">
      <nav className="border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-black text-primary">
            Courssa
          </Link>
          <Link
            href="/client/profile"
            className="flex items-center gap-3 text-xs md:text-sm font-semibold hover:opacity-80 transition-opacity cursor-pointer"
          >
            <span className="hidden md:inline">Bonjour, Mohamed</span>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40 text-primary font-bold">
              M
            </div>
          </Link>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1 space-y-6 order-2 lg:order-1">
          <h1 className="text-xl md:text-2xl font-bold">Nouvelle commande</h1>

          <AnimatePresence>
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-green-500/10 border border-green-500/30 text-green-600 p-4 rounded-xl flex items-center gap-3 text-sm font-semibold"
              >
                <CheckCircle2 size={24} className="shrink-0" />
                Votre commande a été envoyée avec succès aux chauffeurs !
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleOrder}
            className="bg-accent/40 rounded-2xl md:rounded-3xl p-5 md:p-6 border border-border/50"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1.5 block">
                  Lieu de ramassage (Wilaya)
                </label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-3.5 md:top-3 text-muted-foreground"
                    size={18}
                  />
                  <select
                    required
                    value={formData.pickUp}
                    onChange={(e) =>
                      setFormData({ ...formData, pickUp: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Sélectionner une Wilaya
                    </option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {!showStop ? (
                <button
                  type="button"
                  onClick={() => setShowStop(true)}
                  className="text-xs font-bold text-primary flex items-center gap-1 hover:underline -mt-1 mb-2"
                >
                  ➕ Ajouter un arrêt intermédiaire
                </button>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs md:text-sm font-medium text-muted-foreground block">
                      Arrêt intermédiaire (Optionnel)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setShowStop(false);
                        setFormData({ ...formData, stop: "" });
                      }}
                      className="text-[10px] text-red-500 hover:underline font-bold"
                    >
                      Retirer l'arrêt
                    </button>
                  </div>
                  <div className="relative mb-4">
                    <MapPin
                      className="absolute left-3 top-3.5 md:top-3 text-muted-foreground"
                      size={18}
                    />
                    <select
                      value={formData.stop}
                      onChange={(e) =>
                        setFormData({ ...formData, stop: e.target.value })
                      }
                      className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                    >
                      <option value="" disabled>
                        Sélectionner une Wilaya
                      </option>
                      {WILAYAS.map((w) => (
                        <option key={w} value={w}>
                          {w}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1.5 block">
                  Lieu de livraison (Wilaya)
                </label>
                <div className="relative">
                  <Navigation
                    className="absolute left-3 top-3.5 md:top-3 text-muted-foreground"
                    size={18}
                  />
                  <select
                    required
                    value={formData.dropOff}
                    onChange={(e) =>
                      setFormData({ ...formData, dropOff: e.target.value })
                    }
                    className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 pr-4 pl-10 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all appearance-none cursor-pointer"
                  >
                    <option value="" disabled>
                      Sélectionner une Wilaya
                    </option>
                    {WILAYAS.map((w) => (
                      <option key={w} value={w}>
                        {w}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1.5 block">
                  Type de camion
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none"
                >
                  <option value="" disabled>
                    Sélectionner le type de véhicule
                  </option>
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
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1.5 block">
                  Urgence de chargement
                </label>
                <select
                  value={formData.urgency}
                  onChange={(e) =>
                    setFormData({ ...formData, urgency: e.target.value })
                  }
                  className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 px-4 mb-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer appearance-none font-semibold text-foreground"
                >
                  <option value="Urgent (- de 48h)">
                    🔴 Urgent (Moins de 48h)
                  </option>
                  <option value="Normal (+ de 48h)">
                    🟢 Normal (Plus de 48h)
                  </option>
                </select>
              </div>
              <div>
                <label className="text-xs md:text-sm font-medium text-muted-foreground mb-1.5 block">
                  Description de la marchandise
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Ex: 3 canapés, 5 cartons, matériaux de construction..."
                  className="w-full bg-background border border-border rounded-xl md:rounded-2xl py-3 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none h-20 mb-3"
                />

                <div
                  className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors ${formData.photoAttached ? "border-primary/50 bg-primary/5" : "border-border/60 hover:bg-accent/40"}`}
                  onClick={() =>
                    setFormData({
                      ...formData,
                      photoAttached: !formData.photoAttached,
                    })
                  }
                >
                  {formData.photoAttached ? (
                    <>
                      <CheckCircle2 size={24} className="text-primary mb-1" />
                      <span className="text-xs font-semibold text-primary">
                        1 Photo jointe avec succès
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center mb-2">
                        <span className="text-sm">📷</span>
                      </div>
                      <span className="text-xs font-semibold">
                        Joindre une photo (Recommandé)
                      </span>
                    </>
                  )}
                </div>
              </div>

              <div className="flex bg-accent/20 p-3 rounded-xl border border-border/50 mb-4 items-center gap-3">
                <input
                  type="checkbox"
                  id="invoice"
                  checked={formData.hasInvoice}
                  onChange={(e) =>
                    setFormData({ ...formData, hasInvoice: e.target.checked })
                  }
                  className="w-4 h-4 accent-primary cursor-pointer rounded"
                />
                <label
                  htmlFor="invoice"
                  className="text-xs md:text-sm font-medium cursor-pointer"
                >
                  Facture de la marchandise disponible
                </label>
              </div>

              <div className="bg-accent/20 p-3 rounded-xl border border-border/50 mb-4">
                <div className="flex gap-3 items-center">
                  <input
                    type="checkbox"
                    id="workers"
                    checked={formData.needWorkers}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        needWorkers: e.target.checked,
                      })
                    }
                    className="w-4 h-4 accent-primary cursor-pointer rounded shrink-0"
                  />
                  <label
                    htmlFor="workers"
                    className="text-xs md:text-sm font-medium cursor-pointer"
                  >
                    Demander des manutentionnaires (Chargement/Déchargement)
                  </label>
                </div>

                <AnimatePresence>
                  {formData.needWorkers && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden mt-3 pl-7"
                    >
                      <label className="text-xs text-muted-foreground mb-1.5 block">
                        Qui paie les travailleurs ?
                      </label>
                      <select
                        value={formData.workersPayer}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            workersPayer: e.target.value,
                          })
                        }
                        className="w-full bg-background border border-border rounded-xl py-2 px-3 text-xs md:text-sm outline-none focus:border-primary cursor-pointer appearance-none font-semibold text-foreground"
                      >
                        <option value="Client">
                          Moi (Client) - je les paie sur place
                        </option>
                        <option value="Chauffeur">
                          Le Chauffeur (à inclure dans le tarif proposé)
                        </option>
                      </select>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl mt-4 active:scale-95 transition-transform shadow-lg shadow-primary/20 text-sm md:text-base disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {isSubmitting ? (
                  <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                ) : (
                  "Commander le transport"
                )}
              </button>
            </div>
          </form>

          <h2 className="text-[22px] font-bold mt-8 mb-4 tracking-tight px-1">
            Mes commandes
          </h2>
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order: any) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-[#1C1C1E] rounded-[24px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.06)] border border-gray-100 dark:border-[#2C2C2E]"
                >
                  <div className="p-4 md:p-5">
                    {/* iOS style Header */}
                    <div className="flex items-center gap-3.5 mb-4">
                      {/* iOS Squircle Icon */}
                      <div className={`w-12 h-12 shrink-0 rounded-[14px] flex items-center justify-center text-white shadow-sm ${order.status === "Terminé" ? "bg-[#34C759]" : order.status === "En attente" ? "bg-[#FF9500]" : "bg-[#007AFF]"}`}>
                        <PackageSearch size={22} strokeWidth={2.5} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[17px] text-gray-900 dark:text-white leading-tight truncate tracking-tight">
                          {order.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[13px] font-medium text-gray-500 dark:text-gray-400">
                            {order.time}
                          </span>
                          <div className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                          <span className={`text-[13px] font-semibold ${order.status === "Terminé" ? "text-[#34C759]" : "text-[#FF9500]"}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      
                      {/* Urgency Pill iOS specific */}
                      <div className="flex flex-col items-end shrink-0">
                          {order.urgency && order.urgency.includes("Urgent") && (
                            <span className="bg-[#FF3B30]/10 text-[#FF3B30] text-[12px] font-bold px-3 py-1.5 rounded-full shadow-sm">
                              Urgent
                            </span>
                          )}
                      </div>
                    </div>
                    
                    {/* iOS Divider */}
                    <div className="h-[1px] bg-gray-100 dark:bg-[#2C2C2E] rounded-full w-full mb-4"></div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      {order.status !== "Terminé" && (
                        <button
                          onClick={() => setShowCancelModal(true)}
                          className="text-[#FF3B30] text-[14px] font-semibold hover:bg-[#FF3B30]/10 px-4 py-2 rounded-xl transition-colors active:scale-95"
                        >
                          Annuler
                        </button>
                      )}
                      <button onClick={() => setSelectedOrder(order)} className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2C2C2E] dark:hover:bg-[#3C3C3E] text-gray-800 dark:text-gray-200 text-[14px] font-semibold px-4 py-2 rounded-xl ml-auto transition-colors active:scale-95">
                        Voir détails
                      </button>
                    </div>

                    {/* iOS Sub-card for offers */}
                    {order.offers && order.offers.length > 0 && (
                      <div className="mt-5 bg-gray-50 dark:bg-[#2C2C2E]/40 rounded-[20px] p-2 border border-gray-100 dark:border-[#2C2C2E]">
                        <div className="px-3 py-2 flex items-center justify-between">
                          <span className="text-[12px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                            Offres Reçues
                          </span>
                          <span className="text-[12px] font-bold text-[#007AFF] px-2.5 py-1 bg-[#007AFF]/10 rounded-full flex items-center gap-1.5">
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#007AFF] opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#007AFF]"></span>
                            </span>
                            Nouveau
                          </span>
                        </div>
                        
                        <div className="space-y-1.5">
                          {order.offers.map((offer: any) => (
                            <div
                              key={offer.id}
                              className="bg-white dark:bg-[#1C1C1E] p-3.5 rounded-[16px] flex items-center justify-between shadow-sm border border-gray-100 dark:border-[#3C3C3E]"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-full bg-gray-100 dark:bg-[#2C2C2E] flex items-center justify-center text-[20px]">
                                  👨‍✈️
                                </div>
                                <div>
                                  <div className="text-[16px] font-semibold text-gray-900 dark:text-white leading-tight tracking-tight">
                                    Chauffeur
                                  </div>
                                  <div className="text-[13px] text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1.5 font-medium">
                                    <Truck size={12} className="text-gray-400" /> {offer.vehicle} <span className="text-[#FF9500]">★ {offer.rating}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col items-end gap-1.5">
                                <span className="font-bold text-[16px] text-gray-900 dark:text-white tracking-tight">
                                  {offer.price}
                                </span>
                                <button onClick={() => handleAcceptOffer(order.id, offer.id)} className="bg-[#007AFF] hover:bg-[#0066CC] text-white text-[13px] font-bold px-4 py-1.5 rounded-full shadow-sm active:scale-95 transition-all">
                                  Accepter
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Map Interface Mock */}
        <div className="lg:col-span-2 relative h-[300px] md:h-auto md:min-h-[600px] bg-accent/20 rounded-2xl md:rounded-3xl border border-border/50 overflow-hidden flex items-center justify-center order-1 lg:order-2">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:40px_40px]" />
          <motion.div
            animate={{ y: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative z-10 flex flex-col items-center p-4 text-center"
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/20 rounded-full flex items-center justify-center mb-3 text-primary">
              <PackageSearch size={24} className="md:w-8 md:h-8" />
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-medium max-w-[250px] md:max-w-none">
              {formData.pickUp && formData.dropOff
                ? `Trajet: ${formData.pickUp} ➔ ${formData.dropOff}`
                : "Indiquez les lieux pour afficher l'itinéraire"}
            </p>
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background border border-border/50 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative"
            >
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-6 mx-auto">
                <AlertCircle size={32} />
              </div>
              <h2 className="text-2xl font-black text-center mb-2">
                Demande d'annulation
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Pour annuler cette course, veuillez contacter l'administration
                au <br />
                <b className="text-foreground">05XX XX XX XX</b> pour obtenir un
                code d'autorisation.
              </p>

              <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6">
                <div className="font-bold text-red-500 text-sm mb-1">
                  ⚠️ Politique d'annulation stricte
                </div>
                <div className="text-xs text-muted-foreground">
                  Vous avez actuellement{" "}
                  <b className="text-foreground">2 annulations</b> sur votre
                  compte. Au bout de 5 annulations, votre compte sera
                  automatiquement suspendu.
                </div>
                <div className="w-full h-1.5 bg-background rounded-full overflow-hidden mt-3">
                  <div className="h-full bg-red-500 w-[40%]" />
                </div>
                <div className="text-[10px] text-right font-bold mt-1">2/5</div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold mb-1 block">
                    Code d'annulation Administrateur
                  </label>
                  <input
                    type="text"
                    placeholder="Entrez le code à 6 chiffres"
                    className="w-full bg-background border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all font-mono tracking-widest text-center"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 bg-accent text-foreground font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors"
                  >
                    Retour
                  </button>
                  <button
                    className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20"
                    onClick={() => setShowCancelModal(false)}
                  >
                    Confirmer l'annulation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1C1C1E] w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] p-6 shadow-2xl pb-10 sm:pb-6"
            >
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-6 sm:hidden"></div>
              <h2 className="text-[22px] font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Détails de la course</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1">Itinéraire</label>
                  <p className="text-[17px] font-semibold text-gray-900 dark:text-white">{selectedOrder.title}</p>
                </div>
                <div>
                  <label className="text-[12px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest block mb-1">Date et Statut</label>
                  <p className="text-[16px] font-medium text-gray-900 dark:text-white">{selectedOrder.time} • <span className={`${selectedOrder.status === "Terminé" ? "text-[#34C759]" : selectedOrder.status === "Chauffeur assigné" ? "text-[#007AFF]" : "text-[#FF9500]"} font-bold`}>{selectedOrder.status}</span></p>
                </div>
                {selectedOrder.urgency && (
                  <div>
                    <label className="text-[12px] text-[#FF3B30]/70 font-bold uppercase tracking-widest block mb-1">Urgence</label>
                    <p className="text-[16px] font-bold text-[#FF3B30]">{selectedOrder.urgency}</p>
                  </div>
                )}
              </div>
              
              <button onClick={() => setSelectedOrder(null)} className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-[#2C2C2E] dark:hover:bg-[#3C3C3E] text-gray-900 dark:text-white font-bold py-3.5 rounded-xl mt-8 active:scale-95 transition-all text-[16px]">
                Fermer
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAcceptSuccess && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center bg-white/80 dark:bg-[#1C1C1E]/80 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-[#34C759] rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(52,199,89,0.4)] text-white mb-6">
                <CheckCircle2 size={48} strokeWidth={3} />
              </div>
              <h2 className="text-[26px] font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Offre Acceptée !</h2>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-[16px]">Le chauffeur a été assigné à votre course.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
