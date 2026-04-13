"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Truck, Activity, BarChart3, Package,
  Search, RefreshCw, Trash2, Check, X,
  ChevronDown, Filter, AlertTriangle, Navigation,
  Clock, ShieldCheck, History, LogOut
} from "lucide-react";
import Link from "next/link";
import { useLogout } from "@/hooks/useLogout";

// ─── Types ──────────────────────────────────────────────────────────────
type TabId = "overview" | "orders" | "users";
type OrderStatus = "ALL" | "PENDING" | "NEGOTIATING" | "WAITING" | "LOADING" | "IN_TRANSIT" | "UNLOADING" | "COMPLETED" | "CANCELLED";

// ─── Status Config ───────────────────────────────────────────────────────
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING:     { label: "En attente",   color: "bg-orange-500/10 text-orange-500 border-orange-500/20", icon: "⏳" },
  NEGOTIATING: { label: "Négociation",  color: "bg-blue-500/10 text-blue-500 border-blue-500/20",      icon: "🤝" },
  WAITING:     { label: "Attente Chauf", color: "bg-purple-500/10 text-purple-500 border-purple-500/20", icon: "🚗" },
  LOADING:     { label: "Chargement",   color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20", icon: "📦" },
  IN_TRANSIT:  { label: "En Transit",   color: "bg-primary/10 text-primary border-primary/20",          icon: "🚚" },
  UNLOADING:   { label: "Décharg.",     color: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",       icon: "🏁" },
  COMPLETED:   { label: "Terminé",      color: "bg-green-500/10 text-green-500 border-green-500/20",    icon: "✅" },
  CANCELLED:   { label: "Annulé",       color: "bg-red-500/10 text-red-500 border-red-500/20",          icon: "❌" },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG) as OrderStatus[];

// ─── Sub-components ──────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, color }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="bg-accent/30 border border-border/50 p-5 rounded-2xl hover:border-primary/20 transition-all">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-3 ${color}`}>
        {icon}
      </div>
      <div className="text-muted-foreground text-xs font-semibold mb-0.5">{label}</div>
      <div className="text-3xl font-black">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </motion.div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: "bg-accent text-foreground border-border", icon: "?" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border ${config.color}`}>
      {config.icon} {config.label}
    </span>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────
export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<OrderStatus>("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const { logout, isLoggingOut } = useLogout();

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        setStats(await res.json());
      } else {
        // Show empty stats instead of loading forever
        setStats({ orders: { total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 }, users: { total: 0, drivers: 0, clients: 0 }, offers: { total: 0 }, vehicles: { total: 0 } });
      }
    } catch(e) {
      // DB not ready yet — show zeros so UI doesn't hang
      setStats({ orders: { total: 0, pending: 0, active: 0, completed: 0, cancelled: 0 }, users: { total: 0, drivers: 0, clients: 0 }, offers: { total: 0 }, vehicles: { total: 0 } });
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== "ALL") params.set("status", statusFilter);
      if (searchQuery) params.set("search", searchQuery);
      const res = await fetch(`/api/admin/orders?${params}`);
      if (res.ok) setOrders(await res.json());
    } catch(e) {}
    setIsLoading(false);
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter !== "ALL") params.set("role", roleFilter);
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) setUsers(await res.json());
    } catch(e) {}
    setIsLoading(false);
  };

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => { if (activeTab === "orders") fetchOrders(); }, [activeTab, statusFilter, searchQuery]);
  useEffect(() => { if (activeTab === "users") fetchUsers(); }, [activeTab, roleFilter]);

  const updateOrderStatus = async (orderId: string, status: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      }
    } catch(e) {}
    setActionLoading(null);
  };

  const deleteOrder = async (orderId: string) => {
    setActionLoading(orderId);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) { await fetchOrders(); setConfirmDelete(null); setSelectedOrder(null); }
    } catch(e) {}
    setActionLoading(null);
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "overview", label: "Vue d'ensemble", icon: <BarChart3 size={18} /> },
    { id: "orders",   label: "Commandes",       icon: <Package size={18} /> },
    { id: "users",    label: "Utilisateurs",    icon: <Users size={18} /> },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* ── Sidebar / Mobile Top Bar ── */}
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
          {/* Mobile logout button */}
          <button onClick={logout} disabled={isLoggingOut}
            className="md:hidden flex items-center gap-1.5 text-red-500 font-bold text-xs px-3 py-2 rounded-xl bg-red-500/10">
            <LogOut size={14} />
            {isLoggingOut ? '...' : 'Quitter'}
          </button>
        </div>

        <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible flex-1 pb-1 md:pb-0">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 font-semibold px-3 md:px-4 py-2.5 md:py-3 rounded-xl transition-all text-sm shrink-0 md:w-full text-left ${
                activeTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50 bg-accent/30 md:bg-transparent"
              }`}>
              {tab.icon}
              <span className="text-xs md:text-sm">{tab.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-8 pt-6 border-t border-border/50 hidden md:block">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">A</div>
            <div>
              <div className="font-bold text-sm">Super Admin</div>
              <div className="text-xs text-muted-foreground">0771005952</div>
            </div>
          </div>
          <button onClick={logout} disabled={isLoggingOut}
            className="w-full flex items-center gap-2 text-red-500 font-bold text-sm px-3 py-2.5 rounded-xl hover:bg-red-500/10 transition-colors">
            <LogOut size={16} />
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="flex-1 p-4 md:p-8 overflow-auto">

        {/* ═══════════ TAB 1: OVERVIEW ═══════════ */}
        {activeTab === "overview" && (
          <div>
            <h1 className="text-2xl md:text-3xl font-black mb-6">Vue d'ensemble</h1>

            {stats ? (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <StatCard icon={<Package size={20} />}  label="Total Commandes" value={stats.orders.total}    sub={`${stats.orders.active} en cours`}     color="bg-primary/20 text-primary" />
                  <StatCard icon={<Activity size={20} />} label="Commandes Actives" value={stats.orders.active} sub={`${stats.orders.pending} en attente`}  color="bg-blue-500/20 text-blue-500" />
                  <StatCard icon={<Users size={20} />}    label="Chauffeurs"       value={stats.users.drivers}  sub={`${stats.users.clients} clients`}       color="bg-orange-500/20 text-orange-500" />
                  <StatCard icon={<ShieldCheck size={20} />} label="Terminées"    value={stats.orders.completed} sub={`${stats.orders.cancelled} annulées`} color="bg-green-500/20 text-green-500" />
                </div>

                {/* Activity Feed */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Orders by status */}
                  <div className="bg-accent/20 border border-border/50 rounded-2xl p-5">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Activity size={18} className="text-primary" /> Répartition des commandes</h2>
                    <div className="space-y-2.5">
                      {[
                        { key: "pending",   label: "En attente",  val: stats.orders.pending,   color: "bg-orange-500" },
                        { key: "active",    label: "En cours",    val: stats.orders.active,     color: "bg-blue-500" },
                        { key: "completed", label: "Terminées",   val: stats.orders.completed,  color: "bg-green-500" },
                        { key: "cancelled", label: "Annulées",    val: stats.orders.cancelled,  color: "bg-red-500" },
                      ].map(item => (
                        <div key={item.key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium">{item.label}</span>
                            <span className="font-bold">{item.val}</span>
                          </div>
                          <div className="h-2 bg-accent rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full transition-all duration-700`}
                              style={{ width: stats.orders.total ? `${(item.val / stats.orders.total) * 100}%` : "0%" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Users stats */}
                  <div className="bg-accent/20 border border-border/50 rounded-2xl p-5">
                    <h2 className="font-bold text-lg mb-4 flex items-center gap-2"><Users size={18} className="text-primary" /> Statistiques utilisateurs</h2>
                    <div className="space-y-4">
                      {[
                        { label: "Total utilisateurs",   val: stats.users.total,    icon: "👥", color: "bg-accent" },
                        { label: "Chauffeurs inscrits",  val: stats.users.drivers,  icon: "🚚", color: "bg-blue-500/10" },
                        { label: "Clients inscrits",     val: stats.users.clients,  icon: "🛒", color: "bg-purple-500/10" },
                        { label: "Offres soumises",      val: stats.offers.total,   icon: "💬", color: "bg-orange-500/10" },
                        { label: "Véhicules enregistrés",val: stats.vehicles.total, icon: "🚛", color: "bg-green-500/10" },
                      ].map(item => (
                        <div key={item.label} className={`flex items-center justify-between p-3 rounded-xl ${item.color}`}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{item.icon}</span>
                            <span className="font-semibold text-sm">{item.label}</span>
                          </div>
                          <span className="font-black text-lg">{item.val}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center py-20 gap-4">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-muted-foreground font-medium">Chargement des statistiques...</p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TAB 2: ORDERS ═══════════ */}
        {activeTab === "orders" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Commandes</h1>
              <button onClick={fetchOrders} className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70 transition-opacity">
                <RefreshCw size={16} /> Rafraîchir
              </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <input type="text" placeholder="Rechercher une commande..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-accent/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-primary" />
              </div>
              {/* Status filter */}
              <div className="relative">
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as OrderStatus)}
                  className="bg-accent/30 border border-border/50 rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold outline-none focus:border-primary appearance-none cursor-pointer">
                  <option value="ALL">Tous les statuts</option>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{STATUS_CONFIG[s].icon} {STATUS_CONFIG[s].label}</option>)}
                </select>
                <Filter size={14} className="absolute left-3 top-3 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Orders Table */}
            {isLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">Aucune commande trouvée.</div>
            ) : (
              <div className="bg-accent/20 border border-border/50 rounded-2xl overflow-hidden">
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 border-b border-border/50 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <div className="col-span-4">Itinéraire</div>
                  <div className="col-span-2">Client</div>
                  <div className="col-span-2">Chauffeur</div>
                  <div className="col-span-2">Statut</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y divide-border/30">
                  {orders.map((order, i) => (
                    <motion.div key={order.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                      className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-4 px-5 py-4 hover:bg-background/40 transition-colors items-center">
                      <div className="col-span-2 md:col-span-4">
                        <div className="font-bold text-sm truncate">{order.pickUp} → {order.dropOff}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1.5">
                          <Clock size={10} /> {new Date(order.createdAt).toLocaleDateString("fr-DZ")}
                          {order.offers?.length > 0 && <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">{order.offers.length} offres</span>}
                        </div>
                      </div>
                      <div className="hidden md:block md:col-span-2 text-sm">
                        <div className="font-medium truncate">{order.client?.name || "—"}</div>
                        <div className="text-xs text-muted-foreground">{order.client?.phone}</div>
                      </div>
                      <div className="hidden md:block md:col-span-2 text-sm">
                        {order.driver ? (
                          <>
                            <div className="font-medium truncate text-primary">{order.driver.name}</div>
                            <div className="text-xs text-muted-foreground">{order.driver.phone}</div>
                          </>
                        ) : <span className="text-muted-foreground text-xs">Non assigné</span>}
                      </div>
                      <div className="col-span-1 md:col-span-2">
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="col-span-1 md:col-span-2 flex justify-end gap-2">
                        <button onClick={() => setSelectedOrder(order)}
                          className="text-xs font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-colors">
                          Gérer
                        </button>
                        <button onClick={() => setConfirmDelete(order.id)}
                          className="w-7 h-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ TAB 3: USERS ═══════════ */}
        {activeTab === "users" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-black">Utilisateurs</h1>
              <button onClick={fetchUsers} className="flex items-center gap-2 text-sm font-bold text-primary hover:opacity-70">
                <RefreshCw size={16} /> Rafraîchir
              </button>
            </div>

            {/* Role filter */}
            <div className="flex gap-2 mb-6">
              {["ALL", "CLIENT", "DRIVER", "ADMIN"].map(r => (
                <button key={r} onClick={() => setRoleFilter(r)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${roleFilter === r ? "bg-primary text-primary-foreground" : "bg-accent/40 text-muted-foreground hover:text-foreground"}`}>
                  {r === "ALL" ? "Tous" : r}
                </button>
              ))}
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" /></div>
            ) : users.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">Aucun utilisateur trouvé.</div>
            ) : (
              <div className="grid gap-3">
                {users.map((user, i) => (
                  <motion.div key={user.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                    className="bg-accent/20 border border-border/50 rounded-2xl p-4 flex items-center gap-4 hover:border-primary/20 transition-all">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center font-black text-xl text-primary shrink-0">
                      {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold truncate">{user.name || "Sans nom"}</div>
                      <div className="text-xs text-muted-foreground">{user.phone}</div>
                      {user.vehicles?.length > 0 && (
                        <div className="text-xs mt-1 text-primary font-semibold">
                          {user.vehicles.map((v: any) => v.type).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className={`text-[11px] font-black px-2.5 py-1 rounded-full ${user.role === "DRIVER" ? "bg-blue-500/10 text-blue-500" : user.role === "ADMIN" ? "bg-red-500/10 text-red-500" : "bg-accent text-muted-foreground"}`}>
                        {user.role}
                      </span>
                      <div className="text-[10px] text-muted-foreground">
                        {user._count?.ordersAsClient + user._count?.ordersAsDriver || 0} commandes
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ─── Order Management Modal ─── */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-background border border-border/50 rounded-3xl p-6 w-full max-w-lg shadow-2xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold">Gérer la commande</h2>
                <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 bg-accent rounded-full flex items-center justify-center hover:bg-accent/80">
                  <X size={16} />
                </button>
              </div>

              {/* Order Details */}
              <div className="bg-accent/30 rounded-2xl p-4 mb-5 space-y-2">
                <div className="flex items-center gap-2 font-bold">
                  <Navigation size={16} className="text-primary" />
                  {selectedOrder.pickUp} → {selectedOrder.dropOff}
                </div>
                <div className="text-sm text-muted-foreground">{selectedOrder.type} • {selectedOrder.urgency}</div>
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-xs text-muted-foreground">Statut actuel:</span>
                  <StatusBadge status={selectedOrder.status} />
                </div>
              </div>

              {/* Change Status */}
              <div>
                <p className="text-sm font-bold text-muted-foreground mb-3">Changer le statut :</p>
                <div className="grid grid-cols-2 gap-2">
                  {ALL_STATUSES.map(status => {
                    const cfg = STATUS_CONFIG[status];
                    const isActive = selectedOrder.status === status;
                    return (
                      <button key={status} onClick={() => updateOrderStatus(selectedOrder.id, status)}
                        disabled={isActive || actionLoading === selectedOrder.id}
                        className={`flex items-center gap-2 p-3 rounded-xl text-sm font-semibold border transition-all ${isActive ? "opacity-30 cursor-not-allowed bg-accent border-border" : "hover:border-primary/30 hover:bg-accent/50 border-border/50 bg-accent/20 active:scale-95"}`}>
                        <span>{cfg.icon}</span> {cfg.label}
                        {isActive && <Check size={14} className="ml-auto text-green-500" />}
                        {actionLoading === selectedOrder.id && !isActive && <span className="ml-auto w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Delete */}
              <button onClick={() => setConfirmDelete(selectedOrder.id)}
                className="w-full mt-5 bg-red-500/10 text-red-500 border border-red-500/20 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors">
                <Trash2 size={16} /> Supprimer cette commande
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── Delete Confirm Modal ─── */}
      <AnimatePresence>
        {confirmDelete && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-background border border-red-500/20 rounded-3xl p-6 w-full max-w-sm shadow-2xl text-center">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Confirmer la suppression</h3>
              <p className="text-muted-foreground text-sm mb-6">Cette action est irréversible. Toutes les offres associées seront supprimées.</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmDelete(null)} className="flex-1 bg-accent font-bold py-3 rounded-xl hover:bg-accent/80 transition-colors">
                  Annuler
                </button>
                <button onClick={() => deleteOrder(confirmDelete)} disabled={actionLoading === confirmDelete}
                  className="flex-1 bg-red-500 text-white font-bold py-3 rounded-xl hover:bg-red-600 transition-colors shadow-lg flex items-center justify-center">
                  {actionLoading === confirmDelete ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Supprimer"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
