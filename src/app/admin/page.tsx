"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Truck, Activity, BarChart3, Package,
  Search, RefreshCw, Trash2, Check, X,
  Filter, AlertTriangle, Navigation,
  Clock, ShieldCheck, History, LogOut,
  ChevronRight, Phone, Star, UserCog, Eye
} from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";

// ─── Types ──────────────────────────────────────────────────────────────
type TabId = "overview" | "orders" | "users";
type OrderStatus = "ALL" | "PENDING" | "NEGOTIATING" | "WAITING" | "LOADING" | "IN_TRANSIT" | "UNLOADING" | "COMPLETED" | "CANCELLED";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING:     { label: "En attente",   color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: "⏳" },
  NEGOTIATING: { label: "Négociation",  color: "bg-blue-500/10 text-blue-500 border-blue-500/20",      icon: "🤝" },
  WAITING:     { label: "Attente Chauf",color: "bg-purple-500/10 text-purple-500 border-purple-500/20",icon: "🚗" },
  LOADING:     { label: "Chargement",   color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",icon: "📦" },
  IN_TRANSIT:  { label: "En Transit",   color: "bg-primary/10 text-primary border-primary/20",          icon: "🚚" },
  UNLOADING:   { label: "Déchargem.",   color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",       icon: "🏁" },
  COMPLETED:   { label: "Terminé",      color: "bg-green-500/10 text-green-500 border-green-500/20",    icon: "✅" },
  CANCELLED:   { label: "Annulé",       color: "bg-red-500/10 text-red-500 border-red-500/20",          icon: "❌" },
};
const ALL_STATUSES = Object.keys(STATUS_CONFIG) as Exclude<OrderStatus, "ALL">[];

function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-accent/30 border border-border/50 p-5 rounded-2xl hover:border-primary/20 transition-all">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>{icon}</div>
      <div className="text-muted-foreground text-xs font-semibold mb-0.5">{label}</div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "bg-accent text-foreground border-border", icon: "?" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
}

const EMPTY_STATS = { orders: { total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 }, users: { total: 0, drivers: 0, clients: 0 }, offers: { total: 0 }, vehicles: { total: 0 } };

// ─── Main ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [userSearch, setUserSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Modals
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ type: "order" | "user"; id: string } | null>(null);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const { logout, isLoggingOut } = useLogout();

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      setStats(res.ok ? await res.json() : EMPTY_STATS);
    } catch { setStats(EMPTY_STATS); }
  }, []);

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = new URLSearchParams();
      if (statusFilter !== "ALL") p.set("status", statusFilter);
      if (searchQuery) p.set("search", searchQuery);
      const res = await fetch(`/api/admin/orders?${p}`);
      if (res.ok) setOrders(await res.json());
      else setOrders([]);
    } catch { setOrders([]); }
    setIsLoading(false);
  }, [statusFilter, searchQuery]);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const p = new URLSearchParams();
      if (roleFilter !== "ALL") p.set("role", roleFilter);
      if (userSearch) p.set("search", userSearch);
      const res = await fetch(`/api/admin/users?${p}`);
      if (res.ok) setUsers(await res.json());
      else setUsers([]);
    } catch { setUsers([]); }
    setIsLoading(false);
  }, [roleFilter, userSearch]);

  useEffect(() => { fetchStats(); }, [fetchStats]);
  useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab, fetchOrders]);
  useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab, fetchUsers]);

  // ── Order Actions ──────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId + status);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchOrders(); await fetchStats();
        setSelectedOrder((prev: any) => prev ? { ...prev, status } : null);
        showToast("Statut mis à jour ✓");
      } else showToast("Erreur lors de la mise à jour", false);
    } catch { showToast("Erreur réseau", false); }
    setActionLoading(null);
  };

  const deleteOrder = async (id: string) => {
    setActionLoading("del_" + id);
    try {
      const res = await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchOrders(); await fetchStats();
        setSelectedOrder(null); setConfirmDelete(null);
        showToast("Commande supprimée");
      } else showToast("Échec de la suppression", false);
    } catch { showToast("Erreur réseau", false); }
    setActionLoading(null);
  };

  // ── User Actions ──────────────────────────────────────────────────────
  const changeUserRole = async (userId: string, role: string) => {
    setActionLoading("role_" + userId);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        await fetchUsers(); await fetchStats();
        setSelectedUser((prev: any) => prev ? { ...prev, role } : null);
        showToast("Rôle modifié ✓");
      } else showToast("Erreur lors du changement de rôle", false);
    } catch { showToast("Erreur réseau", false); }
    setActionLoading(null);
  };

  const deleteUser = async (id: string) => {
    setActionLoading("del_user_" + id);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      if (res.ok) {
        await fetchUsers(); await fetchStats();
        setSelectedUser(null); setConfirmDelete(null);
        showToast("Utilisateur supprimé");
      } else showToast("Échec de la suppression", false);
    } catch { showToast("Erreur réseau", false); }
    setActionLoading(null);
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: <BarChart3 size={18} /> },
    { id: "orders",   label: "Commandes",       icon: <Package size={18} /> },
    { id: "users",    label: "Utilisateurs",    icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">

      {/* ── Sidebar ── */}
      <aside className="w-full md:w-64 bg-accent/30 border-b md:border-b-0 md:border-r border-border/50 p-4 md:p-5 flex flex-col md:h-screen md:sticky top-0 z-50">
        <div className="flex items-center justify-between md:justify-start md:flex-col md:items-start mb-4 md:mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-primary-foreground">
              <Truck strokeWidth={2.5} size={16} />
            </div>
            <div>
              <span className="text-lg font-black leading-none">Courssa</span>
              <span className="text-[10px] font-bold text-muted-foreground block">ADMIN PANEL</span>
            </div>
          </Link>
          <button onClick={logout} disabled={isLoggingOut}
            className="md:hidden flex items-center gap-1.5 text-red-500 font-bold text-xs px-3 py-2 rounded-xl bg-red-500/10">
            <LogOut size={14} />
            {isLoggingOut ? "..." : "Quitter"}
          </button>
        </div>

        <nav className="flex md:flex-col gap-1.5 overflow-x-auto md:overflow-visible flex-1 pb-1 md:pb-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 font-semibold px-3 md:px-4 py-2.5 rounded-xl transition-all text-sm shrink-0 md:w-full text-left ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 bg-accent/30 md:bg-transparent"
              }`}>
              {tab.icon}
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-5 border-t border-border/50 hidden md:flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">A</div>
            <div>
              <div className="font-bold text-sm">Super Admin</div>
              <div className="text-xs text-muted-foreground">0771005952</div>
            </div>
          </div>
          <button onClick={logout} disabled={isLoggingOut}
            className="w-full flex items-center gap-2 text-red-500 font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            {isLoggingOut ? "Déconnexion..." : "Se déconnecter"}
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">

        {/* ═══════ OVERVIEW ═══════ */}
        {activeTab === "overview" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl md:text-3xl font-black">Vue d'ensemble</h1>
              <button onClick={() => { fetchStats(); showToast("Actualisé ✓"); }}
                className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70 transition-opacity">
                <RefreshCw size={16} /> Actualiser
              </button>
            </div>

            {stats ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={<Package size={20} />}    label="Total Commandes"  value={stats.orders.total}     sub={`${stats.orders.active} en cours`}      color="bg-primary/20 text-primary" />
                  <StatCard icon={<Activity size={20} />}   label="Commandes Actives" value={stats.orders.active}   sub={`${stats.orders.pending} en attente`}   color="bg-blue-500/20 text-blue-500" />
                  <StatCard icon={<Users size={20} />}      label="Chauffeurs"        value={stats.users.drivers}   sub={`${stats.users.clients} clients`}        color="bg-orange-500/20 text-orange-500" />
                  <StatCard icon={<ShieldCheck size={20} />} label="Terminées"        value={stats.orders.completed} sub={`${stats.orders.cancelled} annulées`}  color="bg-green-500/20 text-green-500" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Orders chart */}
                  <div className="bg-accent/20 border border-border/50 rounded-2xl p-5">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-primary" /> Répartition commandes</h2>
                    <div className="space-y-3">
                      {[
                        { key: "pending",   label: "En attente", val: stats.orders.pending,   color: "bg-orange-500" },
                        { key: "active",    label: "En cours",   val: stats.orders.active,    color: "bg-blue-500" },
                        { key: "completed", label: "Terminées",  val: stats.orders.completed, color: "bg-green-500" },
                        { key: "cancelled", label: "Annulées",   val: stats.orders.cancelled, color: "bg-red-500" },
                      ].map(item => (
                        <div key={item.key}>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className="font-medium">{item.label}</span>
                            <span className="font-black">{item.val}</span>
                          </div>
                          <div className="h-2 bg-accent rounded-full overflow-hidden">
                            <motion.div className={`h-full ${item.color} rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: stats.orders.total ? `${(item.val / stats.orders.total) * 100}%` : "0%" }}
                              transition={{ duration: 0.8, delay: 0.1 }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Platform stats */}
                  <div className="bg-accent/20 border border-border/50 rounded-2xl p-5">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Users size={18} className="text-primary" /> Statistiques plateforme</h2>
                    <div className="space-y-3">
                      {[
                        { label: "Total utilisateurs",   val: stats.users.total,    icon: "👥", color: "bg-accent" },
                        { label: "Chauffeurs inscrits",  val: stats.users.drivers,  icon: "🚚", color: "bg-blue-500/10" },
                        { label: "Clients inscrits",     val: stats.users.clients,  icon: "🛒", color: "bg-purple-500/10" },
                        { label: "Offres soumises",      val: stats.offers.total,   icon: "💬", color: "bg-orange-500/10" },
                        { label: "Véhicules enregistrés",val: stats.vehicles.total, icon: "🚛", color: "bg-green-500/10" },
                      ].map(item => (
                        <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl ${item.color}`}>
                          <div className="flex items-center gap-2.5">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          <span className="font-black text-xl">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <button onClick={() => setActiveTab("orders")}
                    className="bg-accent/30 border border-border/50 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group">
                    <Package size={20} className="text-primary" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Commandes</div>
                      <div className="text-xs text-muted-foreground">Gérer & filtrer</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary" />
                  </button>
                  <button onClick={() => setActiveTab("users")}
                    className="bg-accent/30 border border-border/50 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group">
                    <Users size={20} className="text-primary" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Utilisateurs</div>
                      <div className="text-xs text-muted-foreground">Gérer les rôles</div>
                    </div>
                    <ChevronRight size={16} className="ml-auto text-muted-foreground group-hover:text-primary" />
                  </button>
                  <button onClick={fetchStats}
                    className="bg-accent/30 border border-border/50 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/30 transition-all group">
                    <RefreshCw size={20} className="text-primary" />
                    <div className="text-left">
                      <div className="font-bold text-sm">Actualiser</div>
                      <div className="text-xs text-muted-foreground">Stats en direct</div>
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement...</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════ ORDERS ═══════ */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Commandes <span className="text-muted-foreground font-normal text-lg">({orders.length})</span></h1>
              <button onClick={fetchOrders} className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70">
                <RefreshCw size={16} /> Rafraîchir
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[160px]">
                <Search size={15} className="absolute left-3 top-3 text-muted-foreground" />
                <input type="text" placeholder="Départ, arrivée..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-accent/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as OrderStatus)}
                  className="bg-accent/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-primary appearance-none cursor-pointer">
                  <option value="ALL">Tous les statuts</option>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}</option>)}
                </select>
                <Filter size={14} className="absolute left-3 top-3 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Package size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Aucune commande trouvée.</p>
              </div>
            ) : (
              <div className="bg-accent/20 border border-border/50 rounded-2xl overflow-hidden">
                <div className="divide-y divide-border/30">
                  {orders.map((order, i) => (
                    <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }}
                      className="px-4 py-4 hover:bg-background/40 transition-colors">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-sm truncate">{order.pickUp} → {order.dropOff}</div>
                          <div className="text-xs text-muted-foreground mt-0.5 flex flex-wrap items-center gap-2">
                            <span className="flex items-center gap-1"><Clock size={10} /> {new Date(order.createdAt).toLocaleDateString("fr-DZ")}</span>
                            {order.client?.name && <span>👤 {order.client.name}</span>}
                            {order.driver?.name && <span className="text-primary">🚚 {order.driver.name}</span>}
                            {order.offers?.length > 0 && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{order.offers.length} offres</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <StatusBadge status={order.status} />
                          <button onClick={() => setSelectedOrder(order)}
                            className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                            Gérer
                          </button>
                          <button onClick={() => setConfirmDelete({ type: "order", id: order.id })}
                            className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════ USERS ═══════ */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Utilisateurs <span className="text-muted-foreground font-normal text-lg">({users.length})</span></h1>
              <button onClick={fetchUsers} className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70">
                <RefreshCw size={16} /> Rafraîchir
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div className="relative flex-1 min-w-[160px]">
                <Search size={15} className="absolute left-3 top-3 text-muted-foreground" />
                <input type="text" placeholder="Nom ou téléphone..." value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full bg-accent/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["ALL", "CLIENT", "DRIVER"].map(r => (
                  <button key={r} onClick={() => setRoleFilter(r)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${roleFilter === r ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"}`}>
                    {r === "ALL" ? "Tous" : r}
                  </button>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : users.length === 0 ? (
              <div className="text-center py-20 text-muted-foreground">
                <Users size={48} className="mx-auto mb-4 opacity-20" />
                <p className="font-medium">Aucun utilisateur trouvé.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                {users.map((user, i) => (
                  <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className="bg-accent/20 border border-border/50 rounded-2xl p-4 flex items-center gap-3 hover:border-primary/20 transition-all">
                    <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-xl text-primary shrink-0">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{user.name || "Sans nom"}</div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone size={10} /> {user.phone}
                      </div>
                      {user.vehicles?.length > 0 && (
                        <div className="text-xs mt-0.5 text-primary font-semibold">
                          🚛 {user.vehicles.map((v: any) => v.type).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${
                        user.role === "DRIVER" ? "bg-blue-500/10 text-blue-500" :
                        user.role === "ADMIN"  ? "bg-red-500/10 text-red-500" :
                        "bg-accent text-muted-foreground"}`}>
                        {user.role}
                      </span>
                      <div className="flex gap-1.5">
                        <button onClick={() => setSelectedUser(user)}
                          className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-1">
                          <Eye size={12} /> Voir
                        </button>
                        <button onClick={() => setConfirmDelete({ type: "user", id: user.id })}
                          className="w-6 h-6 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <Trash2 size={11} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── ORDER DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-background border border-border/50 rounded-t-3xl md:rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Gestion de commande</h2>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"><X size={16} /></button>
              </div>

              {/* Info */}
              <div className="bg-accent/30 rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Navigation size={16} className="text-primary" />
                  {selectedOrder.pickUp} → {selectedOrder.dropOff}
                </div>
                <div className="text-sm text-muted-foreground">{selectedOrder.type} • {selectedOrder.urgency}</div>
                <div className="text-sm text-muted-foreground">{selectedOrder.description}</div>
                <div className="flex flex-wrap gap-2 pt-1">
                  <StatusBadge status={selectedOrder.status} />
                  {selectedOrder.client && <span className="text-xs bg-accent px-2 py-0.5 rounded-full">👤 {selectedOrder.client.name} • {selectedOrder.client.phone}</span>}
                  {selectedOrder.driver && <span className="text-xs bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full">🚚 {selectedOrder.driver.name}</span>}
                </div>
                {selectedOrder.offers?.length > 0 && (
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs font-bold text-muted-foreground mb-2">Offres reçues :</p>
                    {selectedOrder.offers.map((o: any) => (
                      <div key={o.id} className="flex justify-between text-xs py-1">
                        <span className="text-muted-foreground">Offre</span>
                        <span className="font-bold">{o.price?.toLocaleString()} DA</span>
                        <StatusBadge status={o.status} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Change status */}
              <p className="text-sm font-bold text-muted-foreground mb-3">Changer le statut :</p>
              <div className="grid grid-cols-2 gap-2 mb-5">
                {ALL_STATUSES.map(status => {
                  const cfg = STATUS_CONFIG[status];
                  const isActive = selectedOrder.status === status;
                  const loading = actionLoading === selectedOrder.id + status;
                  return (
                    <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={isActive || !!actionLoading}
                      className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border transition-all ${
                        isActive ? "opacity-30 cursor-not-allowed bg-accent border-border" : "hover:border-primary/30 hover:bg-accent/50 border-border/50 bg-accent/20 active:scale-95"
                      }`}>
                      <span>{cfg.icon}</span> {cfg.label}
                      {isActive && <Check size={14} className="ml-auto text-green-500" />}
                      {loading && <span className="ml-auto w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                    </button>
                  );
                })}
              </div>

              <button onClick={() => setConfirmDelete({ type: "order", id: selectedOrder.id })}
                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
                <Trash2 size={16} /> Supprimer cette commande
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── USER DETAIL MODAL ─── */}
      <AnimatePresence>
        {selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedUser(null)}>
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              onClick={e => e.stopPropagation()}
              className="bg-background border border-border/50 rounded-t-3xl md:rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Profil utilisateur</h2>
                <button onClick={() => setSelectedUser(null)} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center"><X size={16} /></button>
              </div>

              {/* User info */}
              <div className="flex items-center gap-4 mb-5 p-4 bg-accent/30 rounded-2xl">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl font-black text-primary">
                  {selectedUser.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="flex-1">
                  <div className="font-black text-lg">{selectedUser.name || "Sans nom"}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                    <Phone size={12} /> {selectedUser.phone}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <Star size={12} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-xs font-bold">{selectedUser.rating ?? 5.0}/5</span>
                    <span className="text-xs text-muted-foreground ml-2">Inscrit le {new Date(selectedUser.createdAt).toLocaleDateString("fr-DZ")}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-accent/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black">{selectedUser._count?.ordersAsClient || 0}</div>
                  <div className="text-xs text-muted-foreground">Commandes passées</div>
                </div>
                <div className="bg-accent/20 rounded-xl p-3 text-center">
                  <div className="text-2xl font-black">{selectedUser._count?.ordersAsDriver || 0}</div>
                  <div className="text-xs text-muted-foreground">Livraisons effectuées</div>
                </div>
              </div>

              {/* Vehicles */}
              {selectedUser.vehicles?.length > 0 && (
                <div className="mb-5">
                  <p className="text-xs font-bold text-muted-foreground mb-2">Véhicules</p>
                  {selectedUser.vehicles.map((v: any) => (
                    <div key={v.id} className="flex justify-between text-sm p-2 bg-accent/20 rounded-xl mb-1.5">
                      <span>🚛 {v.type}</span>
                      {v.plateNumber && <span className="text-muted-foreground font-mono text-xs">{v.plateNumber}</span>}
                    </div>
                  ))}
                </div>
              )}

              {/* Change role */}
              <p className="text-sm font-bold text-muted-foreground mb-3"><UserCog size={14} className="inline mr-1" /> Changer le rôle :</p>
              <div className="flex gap-2 mb-5">
                {["CLIENT", "DRIVER"].map(role => (
                  <button key={role} onClick={() => changeUserRole(selectedUser.id, role)}
                    disabled={selectedUser.role === role || actionLoading === "role_" + selectedUser.id}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${selectedUser.role === role ? "bg-primary text-primary-foreground" : "bg-accent/40 hover:bg-accent"}`}>
                    {actionLoading === "role_" + selectedUser.id ? (
                      <span className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin inline-block" />
                    ) : (role === "CLIENT" ? "🛒 Client" : "🚚 Chauffeur")}
                  </button>
                ))}
              </div>

              <button onClick={() => setConfirmDelete({ type: "user", id: selectedUser.id })}
                className="w-full bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
                <Trash2 size={16} /> Supprimer cet utilisateur
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── CONFIRM DELETE MODAL ─── */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background border border-red-500/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirmer la suppression</h3>
              <p className="text-muted-foreground text-sm mb-6">
                {confirmDelete.type === "order"
                  ? "Cette commande et toutes ses offres seront supprimées définitivement."
                  : "Cet utilisateur, ses commandes et ses véhicules seront supprimés définitivement."}
              </p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)}
                  className="flex-1 bg-accent font-bold py-3.5 rounded-xl hover:bg-accent/80">
                  Annuler
                </button>
                <button
                  onClick={() => confirmDelete.type === "order" ? deleteOrder(confirmDelete.id) : deleteUser(confirmDelete.id)}
                  disabled={!!actionLoading}
                  className="flex-1 bg-red-500 text-white font-bold py-3.5 rounded-xl hover:bg-red-600 flex items-center justify-center">
                  {actionLoading ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── TOAST ─── */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] px-5 py-3 rounded-2xl font-bold text-sm shadow-xl ${toast.ok ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
