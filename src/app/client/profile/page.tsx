"use client";
import Link from 'next/link';
import { User, Package, Bell, Moon, HelpCircle, LogOut, ChevronRight, Phone, Star, Shield } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLogout } from '@/hooks/useLogout';

function SettingRow({ icon, label, sub, href, danger, onClick, right }: any) {
  const cls = `p-4 flex items-center gap-4 rounded-2xl cursor-pointer transition-all active:scale-[0.98] ${danger ? 'hover:bg-red-500/10 group' : 'hover:bg-background/60'}`;
  const content = (
    <>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${danger ? 'bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors' : 'bg-accent text-foreground'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className={`font-semibold text-sm ${danger ? 'text-red-500' : ''}`}>{label}</h3>
        {sub && <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>}
      </div>
      {right ?? <ChevronRight size={16} className="text-muted-foreground" />}
    </>
  );
  if (href) return <Link href={href} className={cls}>{content}</Link>;
  return <button className={`${cls} w-full text-left`} onClick={onClick}>{content}</button>;
}

export default function ClientProfile() {
  const { logout, isLoggingOut } = useLogout();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const phone = typeof document !== 'undefined'
    ? document.cookie.split('; ').find(r => r.startsWith('courssa_session='))?.split('=')[1]?.split(':')[1] || '—'
    : '—';

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent px-4 pt-12 pb-8 text-center">
        <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/30 flex items-center justify-center text-4xl font-black text-primary mx-auto mb-4">
          M
        </div>
        <h1 className="text-2xl font-black">Client</h1>
        <p className="text-muted-foreground text-sm mt-1 flex items-center justify-center gap-1.5">
          <Phone size={13} /> {phone}
        </p>
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="flex items-center gap-1 bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
            <Star size={12} fill="currentColor" /> 5.0
          </div>
          <span className="text-xs text-muted-foreground bg-accent px-3 py-1 rounded-full border border-border/50">
            Compte vérifié ✓
          </span>
        </div>
      </div>

      <div className="px-4 space-y-4">
        {/* Account */}
        <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">Mon compte</p>
          <SettingRow icon={<User size={18} />} label="Informations personnelles" sub="Nom, téléphone" href="/client/register" />
          <SettingRow icon={<Package size={18} />} label="Mes commandes" sub="Historique des livraisons" href="/client" />
          <SettingRow icon={<Shield size={18} />} label="Sécurité" sub="Confidentialité et données" />
        </div>

        {/* Preferences */}
        <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-4 pt-2 pb-1">Préférences</p>
          <SettingRow icon={<Bell size={18} />} label="Notifications" sub="Offres et mises à jour" />
          <SettingRow icon={<Moon size={18} />} label="Apparence" sub="Mode sombre / clair" />
          <SettingRow icon={<HelpCircle size={18} />} label="Aide & Support" sub="FAQ et contact" />
        </div>

        {/* App info */}
        <div className="bg-accent/30 border border-border/50 rounded-2xl p-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Version</span>
            <span className="font-bold">1.0.0</span>
          </div>
          <div className="flex justify-between text-sm mt-2">
            <span className="text-muted-foreground">Région</span>
            <span className="font-bold">🇩🇿 Algérie</span>
          </div>
        </div>

        {/* Logout */}
        <div className="bg-accent/30 border border-border/50 rounded-3xl p-2">
          <SettingRow icon={<LogOut size={18} />} label="Se déconnecter" danger onClick={() => setShowLogoutConfirm(true)} right={null} />
        </div>

        <p className="text-center text-xs text-muted-foreground pb-4">Courssa • Fait en Algérie 🇩🇿</p>
      </div>

      {/* Logout Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background border border-border/50 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <LogOut size={28} />
              </div>
              <h3 className="text-xl font-bold mb-2">Se déconnecter ?</h3>
              <p className="text-muted-foreground text-sm mb-6">Vous devrez vous reconnecter avec votre numéro de téléphone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowLogoutConfirm(false)} className="flex-1 bg-accent font-bold py-3.5 rounded-xl">
                  Annuler
                </button>
                <button onClick={logout} disabled={isLoggingOut}
                  className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 transition-colors flex items-center justify-center">
                  {isLoggingOut ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Déconnecter'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
