import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext";
import { http, formatApiError } from "../lib/api";
import { LOGO_URL } from "../data/mockData";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "users", label: "Users" },
  { key: "activity", label: "Activity" },
  { key: "content", label: "Content" },
  { key: "prompts", label: "Prompts" },
  { key: "subscriptions", label: "Subscriptions" },
  { key: "quests", label: "Quest Log" },
];

const GOLD = "#d4a853";
const GOLD_LIGHT = "#f4d68c";
const PLUM = "#7c3aed";
const PIE_COLORS = [GOLD, GOLD_LIGHT, PLUM, "#22d3ee", "#f472b6", "#4ade80"];

export default function AdminPanel() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [tab, setTab] = useState("dashboard");

  return (
    <div className="min-h-screen cosmic-bg text-white flex">
      <aside className="w-64 border-r border-white/5 p-6 sticky top-0 h-screen hidden md:block">
        <Link to="/" className="flex items-center gap-3" data-testid="admin-home-link">
          <img src={LOGO_URL} alt="" className="w-9 h-9" />
          <div>
            <div className="font-serif-lux text-xl text-gold">FATELYN</div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-[#a0a0a0]">Admin</div>
          </div>
        </Link>
        <nav className="mt-10 space-y-1">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              data-testid={`admin-tab-${t.key}`}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                tab === t.key ? "bg-[#d4a853]/20 text-[#f4d68c] border border-[#d4a853]/40" : "text-[#e0e0e0] hover:bg-white/5"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>
        <div className="mt-10 text-xs text-[#a0a0a0]">
          <div>Signed in as</div>
          <div className="text-[#f4d68c]">{user?.email}</div>
        </div>
        <button onClick={async () => { await logout(); nav("/"); }} className="btn-outline-gold text-xs mt-6" data-testid="admin-logout-btn">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-x-hidden">
        <div className="md:hidden mb-6 flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`tab-pill ${tab === t.key ? "active" : ""}`}>{t.label}</button>
          ))}
        </div>
        {tab === "dashboard" && <Dashboard />}
        {tab === "users" && <Users />}
        {tab === "activity" && <Activity />}
        {tab === "content" && <Content />}
        {tab === "prompts" && <Prompts />}
        {tab === "subscriptions" && <Subscriptions />}
        {tab === "quests" && <QuestLog />}
      </main>
    </div>
  );
}

// ------------- Dashboard ------------- //
function Dashboard() {
  const [d, setD] = useState(null);
  useEffect(() => { http.get("/admin/dashboard").then((r) => setD(r.data)).catch(() => setD({})); }, []);
  if (!d) return <div className="text-[#f4d68c]">Loading dashboard…</div>;
  const stats = [
    { label: "Total users", value: d.users?.total ?? 0 },
    { label: "New (24h)", value: d.users?.new_24h ?? 0 },
    { label: "Active (7d)", value: d.users?.active_7d ?? 0 },
    { label: "Active (30d)", value: d.users?.active_30d ?? 0 },
    { label: "Quest total", value: d.quest?.total ?? 0 },
    { label: "Quest 24h", value: d.quest?.last_24h ?? 0 },
    { label: "Paid subs", value: d.subscriptions?.succeeded ?? 0 },
    { label: "Revenue (₹)", value: `₹${(d.subscriptions?.revenue_inr ?? 0).toLocaleString("en-IN")}` },
  ];
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Dashboard</h1>
      <p className="text-xs text-[#a0a0a0] mt-1">Realtime activity across your Fatelyn app.</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {stats.map((s) => (
          <div key={s.label} className="glass p-4" data-testid={`stat-${s.label.replace(/\W/g, '-').toLowerCase()}`}>
            <div className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">{s.label}</div>
            <div className="font-serif-lux text-3xl text-gold mt-1">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-6">
        <div className="glass p-5 lg:col-span-2 h-72">
          <div className="text-[10px] uppercase tracking-widest text-[#f4d68c]">Activity · last 7 days</div>
          <ResponsiveContainer width="100%" height="88%">
            <AreaChart data={d.activity_series || []} margin={{ left: -20, right: 8, top: 12 }}>
              <defs>
                <linearGradient id="gold" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={GOLD} stopOpacity={0.7} />
                  <stop offset="100%" stopColor={GOLD} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" stroke="#a0a0a0" fontSize={11} />
              <YAxis stroke="#a0a0a0" fontSize={11} />
              <Tooltip contentStyle={{ background: "#1a1420", border: "1px solid rgba(212,168,83,0.4)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="events" stroke={GOLD_LIGHT} strokeWidth={2} fill="url(#gold)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass p-5 h-72">
          <div className="text-[10px] uppercase tracking-widest text-[#f4d68c]">Top clicks</div>
          {(!d.top_clicks || d.top_clicks.length === 0) ? (
            <div className="text-xs text-[#a0a0a0] mt-4">No clicks yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height="88%">
              <BarChart data={d.top_clicks} margin={{ left: 0, right: 8, top: 10 }}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="target" stroke="#a0a0a0" fontSize={10} />
                <YAxis stroke="#a0a0a0" fontSize={10} />
                <Tooltip contentStyle={{ background: "#1a1420", border: "1px solid rgba(212,168,83,0.4)", borderRadius: 8 }} />
                <Bar dataKey="count" fill={GOLD} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}

// ------------- Users ------------- //
function Users() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const load = () => http.get("/admin/users", { params: { search: q } }).then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, []);

  const changeRole = async (uid, role) => {
    await http.patch(`/admin/users/${uid}/role`, { role });
    load();
  };
  const del = async (uid) => {
    if (!window.confirm("Delete this user?")) return;
    await http.delete(`/admin/users/${uid}`);
    load();
  };

  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Users</h1>
      <div className="flex gap-2 mt-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by email or name" className="glass px-3 py-2 text-sm outline-none" data-testid="users-search-input" />
        <button onClick={load} className="btn-gold text-xs" data-testid="users-search-btn">Search</button>
      </div>
      <div className="glass mt-4 overflow-hidden">
        <div className="grid grid-cols-6 gap-2 text-[10px] uppercase tracking-widest text-[#a0a0a0] px-4 py-3 border-b border-white/5">
          <div>Name</div><div>Email</div><div>Role</div><div>Provider</div><div>Created</div><div>Actions</div>
        </div>
        {items.map((u) => (
          <div key={u.user_id} className="grid grid-cols-6 gap-2 text-xs px-4 py-3 border-b border-white/5" data-testid={`user-row-${u.user_id}`}>
            <div>{u.name}</div>
            <div className="truncate">{u.email}</div>
            <div><span className={`px-2 py-0.5 rounded-full text-[10px] ${u.role === "admin" ? "bg-[#d4a853]/20 text-[#f4d68c]" : "bg-white/10"}`}>{u.role}</span></div>
            <div className="text-[#a0a0a0]">{u.provider || "email"}</div>
            <div className="text-[#a0a0a0]">{(u.created_at || "").slice(0, 10)}</div>
            <div className="flex gap-2">
              <button onClick={() => changeRole(u.user_id, u.role === "admin" ? "user" : "admin")} className="text-[#f4d68c] text-[11px]" data-testid={`role-toggle-${u.user_id}`}>
                {u.role === "admin" ? "Demote" : "Promote"}
              </button>
              <button onClick={() => del(u.user_id)} className="text-red-300 text-[11px]" data-testid={`user-delete-${u.user_id}`}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------- Activity ------------- //
function Activity() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const load = () => http.get("/admin/activity", { params: type ? { type } : {} }).then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, [type]);
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Activity log</h1>
      <div className="flex gap-2 mt-4">
        {["", "login", "logout", "quest_ask", "click"].map((t) => (
          <button key={t || "all"} onClick={() => setType(t)} className={`tab-pill ${type === t ? "active" : ""}`} data-testid={`activity-filter-${t || "all"}`}>
            {t || "All"}
          </button>
        ))}
      </div>
      <div className="glass mt-4 overflow-hidden">
        <div className="grid grid-cols-5 text-[10px] uppercase tracking-widest text-[#a0a0a0] px-4 py-3 border-b border-white/5">
          <div>When</div><div>Type</div><div>User</div><div>Target</div><div>IP</div>
        </div>
        {items.slice(0, 200).map((a, i) => (
          <div key={i} className="grid grid-cols-5 gap-2 text-xs px-4 py-2 border-b border-white/5" data-testid={`activity-row-${i}`}>
            <div className="text-[#a0a0a0]">{(a.at || "").slice(0, 19).replace("T", " ")}</div>
            <div className="text-[#f4d68c]">{a.type}</div>
            <div className="truncate">{a.user_id || "—"}</div>
            <div>{a.target || "—"}</div>
            <div className="text-[#a0a0a0]">{a.ip || "—"}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------- Content ------------- //
function Content() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState({});
  const load = () => http.get("/admin/content").then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, []);

  const save = async (key) => {
    await http.put(`/admin/content/${key}`, { key, value: editing[key] });
    load();
    setEditing((s) => ({ ...s, [key]: undefined }));
  };
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Content</h1>
      <p className="text-xs text-[#a0a0a0] mt-1">Edit copy shown across landing, dashboard and app.</p>
      <div className="mt-6 space-y-3">
        {items.map((c) => (
          <div key={c.key} className="glass p-4" data-testid={`content-${c.key}`}>
            <div className="flex justify-between items-baseline">
              <div className="text-[10px] uppercase tracking-widest text-[#f4d68c]">{c.key}</div>
              <div className="text-[9px] text-[#a0a0a0]">Updated {(c.updated_at || "").slice(0, 10)}</div>
            </div>
            <textarea
              defaultValue={c.value}
              onChange={(e) => setEditing((s) => ({ ...s, [c.key]: e.target.value }))}
              rows={2}
              className="w-full bg-transparent border-b border-white/10 focus:border-[#d4a853] py-2 outline-none text-white text-sm mt-2"
              data-testid={`content-input-${c.key}`}
            />
            <button onClick={() => save(c.key)} className="btn-gold text-xs mt-2" data-testid={`content-save-${c.key}`}>Save</button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------- Prompts ------------- //
function Prompts() {
  const [items, setItems] = useState([]);
  const [editing, setEditing] = useState({});
  const load = () => http.get("/admin/prompts").then((r) => setItems(r.data.items));
  useEffect(() => { load(); }, []);

  const save = async (p) => {
    const body = editing[p.key] || {};
    await http.put(`/admin/prompts/${p.key}`, { key: p.key, body: body.body ?? p.body, model: body.model ?? p.model });
    load();
  };
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">AI Prompts</h1>
      <p className="text-xs text-[#a0a0a0] mt-1">Live-tune the system prompt used by Quest AI. Saved instantly — no redeploy.</p>
      <div className="mt-6 space-y-4">
        {items.map((p) => (
          <div key={p.key} className="glass p-5" data-testid={`prompt-${p.key}`}>
            <div className="flex justify-between items-baseline">
              <div className="text-[10px] uppercase tracking-widest text-[#f4d68c]">{p.key}</div>
              <input
                defaultValue={p.model}
                onChange={(e) => setEditing((s) => ({ ...s, [p.key]: { ...s[p.key], model: e.target.value } }))}
                className="text-xs bg-transparent border-b border-white/10 text-[#f4d68c] outline-none text-right"
                placeholder="provider/model"
                data-testid={`prompt-model-${p.key}`}
              />
            </div>
            <textarea
              defaultValue={p.body}
              onChange={(e) => setEditing((s) => ({ ...s, [p.key]: { ...s[p.key], body: e.target.value } }))}
              rows={6}
              className="w-full bg-transparent border border-white/10 rounded-lg p-3 focus:border-[#d4a853] outline-none text-white text-sm mt-3 font-mono"
              data-testid={`prompt-body-${p.key}`}
            />
            <div className="flex justify-between items-center mt-3">
              <div className="text-[10px] text-[#a0a0a0]">Updated {(p.updated_at || "").slice(0, 10)}</div>
              <button onClick={() => save(p)} className="btn-gold text-xs" data-testid={`prompt-save-${p.key}`}>Save prompt</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------- Subscriptions ------------- //
function Subscriptions() {
  const [items, setItems] = useState([]);
  useEffect(() => { http.get("/admin/subscriptions").then((r) => setItems(r.data.items)); }, []);
  const succeeded = items.filter((s) => s.status === "succeeded");
  const revenue = succeeded.reduce((a, s) => a + (s.amount || 0), 0) / 100;
  const byPlan = ["monthly", "yearly"].map((p) => ({ name: p, value: succeeded.filter((s) => s.plan === p).length }));
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Subscriptions</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="glass p-4"><div className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">Total sessions</div><div className="font-serif-lux text-3xl text-gold">{items.length}</div></div>
        <div className="glass p-4"><div className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">Succeeded</div><div className="font-serif-lux text-3xl text-gold">{succeeded.length}</div></div>
        <div className="glass p-4"><div className="text-[10px] uppercase tracking-widest text-[#a0a0a0]">Revenue</div><div className="font-serif-lux text-3xl text-gold">₹{revenue.toLocaleString("en-IN")}</div></div>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="glass p-5 h-64 md:col-span-1">
          <div className="text-[10px] uppercase tracking-widest text-[#f4d68c]">By plan</div>
          <ResponsiveContainer width="100%" height="88%">
            <PieChart>
              <Pie data={byPlan} dataKey="value" nameKey="name" innerRadius={40} outerRadius={70}>
                {byPlan.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Legend wrapperStyle={{ fontSize: 11, color: "#a0a0a0" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="glass overflow-hidden md:col-span-2">
          <div className="grid grid-cols-5 text-[10px] uppercase tracking-widest text-[#a0a0a0] px-4 py-3 border-b border-white/5">
            <div>Session</div><div>Plan</div><div>Amount</div><div>Status</div><div>Date</div>
          </div>
          {items.slice(0, 100).map((s) => (
            <div key={s.session_id} className="grid grid-cols-5 gap-2 text-xs px-4 py-2 border-b border-white/5" data-testid={`sub-row-${s.session_id}`}>
              <div className="truncate">{s.session_id?.slice(-10)}</div>
              <div className="capitalize">{s.plan}</div>
              <div className="text-[#f4d68c]">₹{((s.amount || 0) / 100).toLocaleString("en-IN")}</div>
              <div><span className={`px-2 py-0.5 rounded-full text-[10px] ${s.status === "succeeded" ? "bg-green-500/20 text-green-300" : "bg-white/10 text-[#a0a0a0]"}`}>{s.status}</span></div>
              <div className="text-[#a0a0a0]">{(s.created_at || "").slice(0, 10)}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------- Quest Log ------------- //
function QuestLog() {
  const [items, setItems] = useState([]);
  useEffect(() => { http.get("/admin/quests").then((r) => setItems(r.data.items)); }, []);
  return (
    <div>
      <h1 className="font-serif-lux text-4xl text-gold">Quest history</h1>
      <div className="mt-6 space-y-3">
        {items.slice(0, 50).map((q) => (
          <div key={q.id} className="glass p-4" data-testid={`quest-log-${q.id}`}>
            <div className="flex justify-between text-[10px] uppercase tracking-widest text-[#a0a0a0]">
              <span>{q.category || "personal"} · {(q.created_at || "").slice(0, 19).replace("T", " ")}</span>
              <span>{q.user_id || "anonymous"}</span>
            </div>
            <div className="font-serif-lux text-lg text-gold mt-1">{q.question}</div>
            <p className="text-xs text-[#e0e0e0] mt-2 whitespace-pre-wrap leading-relaxed">{q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
