"use client";

import { Truck, Plus, CheckCircle2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

export default function TrucksPage() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    type: "",
    capacity: "",
    plateNumber: ""
  });

  useEffect(() => {
    fetchVehicles();
  }, []);

  const fetchVehicles = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/driver/vehicles');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setVehicles(data);
        }
      }
    } catch (err) {
      console.error("Fetch error", err);
    }
    setIsLoading(false);
  };

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.type) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/driver/vehicles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const newVehicle = await res.json();
        setVehicles([newVehicle, ...vehicles]);
        setShowModal(false);
        setFormData({ type: "", capacity: "", plateNumber: "" });
      }
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-6 pb-32">
      <div className="flex items-center justify-between mb-6 pt-2">
        <h1 className="text-2xl font-black text-foreground tracking-tight">Ma Flotte</h1>
        <button 
          onClick={() => setShowModal(true)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
        >
          <Plus size={20} className="text-primary-foreground" />
        </button>
      </div>

      <div className="grid gap-4 mt-6">
        {isLoading ? (
          <div className="flex justify-center p-10">
            <span className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></span>
          </div>
        ) : vehicles.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center text-center p-10 mt-10"
          >
            <div className="w-20 h-20 bg-accent/50 rounded-full flex items-center justify-center mb-4">
              <Truck size={40} className="text-muted-foreground/50" />
            </div>
            <h2 className="text-xl font-bold mb-2">Aucun Véhicule</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Ajoutez votre première camionnette ou camion pour commencer à recevoir des offres.
            </p>
            <button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground font-bold px-6 py-3 rounded-xl active:scale-95 transition-transform">
              Ajouter un véhicule
            </button>
          </motion.div>
        ) : (
          vehicles.map((v, idx) => (
            <motion.div 
              key={v.id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-accent/30 border border-border/50 rounded-[20px] p-5 flex items-center gap-4 relative overflow-hidden"
            >
              <div className={`absolute right-0 top-0 bottom-0 w-1.5 ${v.status === 'AVAILABLE' ? 'bg-green-500' : 'bg-orange-500'} rounded-l-full`} />
              <div className="w-14 h-14 bg-background rounded-2xl flex items-center justify-center border border-border/50 shadow-sm shrink-0">
                <Truck size={28} className="text-foreground" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-foreground truncate max-w-[150px]">{v.type}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${v.status === 'AVAILABLE' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-orange-500/10 text-orange-500 border-orange-500/20'}`}>
                    {v.status === 'AVAILABLE' ? 'Disponible' : 'Indisponible'}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {v.capacity ? `Capacité: ${v.capacity} t` : 'Capacité non spécifiée'} 
                  {v.plateNumber && ` • Mat: ${v.plateNumber}`}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Vehicle Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-background w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl relative"
            >
              {/* Header */}
              <div className="bg-accent/30 px-6 py-5 border-b border-border/50 flex justify-between items-center">
                <h2 className="text-xl font-bold">Ajouter un véhicule</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 bg-background rounded-full flex items-center justify-center hover:bg-accent border border-border/50">
                  <X size={16} />
                </button>
              </div>
              
              {/* Form Content */}
              <form onSubmit={handleAddVehicle} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Type de Camion *</label>
                    <select 
                      required
                      value={formData.type}
                      onChange={e => setFormData({...formData, type: e.target.value})}
                      className="w-full bg-accent/20 border border-border rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all cursor-pointer appearance-none font-bold"
                    >
                      <option value="" disabled>Sélectionner le type</option>
                      <option>Moto / Scooter</option>
                      <option>Camionnette</option>
                      <option>Fourgon</option>
                      <option>Petit Camion (- 2.5 t)</option>
                      <option>Grand Camion (+ 5 t)</option>
                      <option>Camion Frigorifique</option>
                      <option>Plateau</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Capacité (Tonnes)</label>
                      <input 
                        type="number" 
                        step="0.1"
                        placeholder="Ex: 1.5"
                        value={formData.capacity}
                        onChange={e => setFormData({...formData, capacity: e.target.value})}
                        className="w-full bg-accent/20 border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" 
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground mb-1 block">Immatriculation</label>
                      <input 
                        type="text" 
                        placeholder="01234 123 16"
                        value={formData.plateNumber}
                        onChange={e => setFormData({...formData, plateNumber: e.target.value})}
                        className="w-full bg-accent/20 border border-border/50 rounded-xl py-3 px-4 text-sm outline-none focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                  
                  {/* Fake Photo Picker for UI purposes */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground mb-1 block">Photos (Optionnel)</label>
                    <div className="border-2 border-dashed border-border/60 hover:bg-accent/40 hover:border-primary/50 transition-colors rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer">
                      <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center mb-2">
                        <span className="text-sm">📷</span>
                      </div>
                      <span className="text-xs font-semibold">Télécharger une photo</span>
                    </div>
                  </div>
                </div>

                <button 
                  disabled={isSubmitting}
                  className="w-full bg-primary text-primary-foreground font-bold py-3.5 rounded-xl mt-8 active:scale-95 transition-transform flex justify-center items-center h-14"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></span>
                  ) : "Enregistrer le véhicule"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
