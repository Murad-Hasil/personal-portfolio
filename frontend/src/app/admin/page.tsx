"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw, LogOut, Lock, BarChart2 } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface PageCount { page: string; count: number }
interface ReferrerCount { referrer: string; count: number }
interface DayCount { date: string; count: number }
interface Summary {
  total_views: number;
  views_today: number;
  views_7d: number;
  views_30d: number;
  top_pages: PageCount[];
  top_referrers: ReferrerCount[];
  views_by_day: DayCount[];
}

type View = "checking" | "login" | "dashboard";

const TOKEN_KEY = "admin_token";

// ── Helpers ────────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString();
}

function shortDate(iso: string) {
  const d = new Date(iso);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-1"
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-subtle)",
      }}
    >
      <p
        className="text-xs uppercase tracking-widest"
        style={{
          fontFamily: "var(--font-jetbrains-mono)",
          color: "var(--text-muted)",
        }}
      >
        {label}
      </p>
      <p
        className="text-3xl font-bold"
        style={{
          fontFamily: "var(--font-space-grotesk)",
          color: "var(--accent-cyan)",
        }}
      >
        {fmt(value)}
      </p>
    </div>
  );
}

function BarChart({ days }: { days: DayCount[] }) {
  if (!days.length) return (
    <p className="text-sm py-6 text-center" style={{ color: "var(--text-muted)" }}>
      No data yet.
    </p>
  );

  const max = Math.max(...days.map((d) => d.count), 1);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="overflow-x-auto">
      <div className="flex items-end gap-1 min-w-[600px] h-32 px-1">
        {days.map((d) => {
          const heightPct = (d.count / max) * 100;
          const isToday = d.date === today;
          return (
            <div
              key={d.date}
              className="flex flex-col items-center flex-1 gap-1"
              title={`${d.date}: ${d.count} views`}
            >
              <div
                className="w-full rounded-sm transition-all duration-200"
                style={{
                  height: `${Math.max(heightPct, 4)}%`,
                  background: isToday
                    ? "var(--accent-cyan)"
                    : "rgba(0,212,255,0.35)",
                  minHeight: 3,
                }}
              />
              {days.indexOf(d) % 7 === 0 && (
                <span
                  className="text-[10px] rotate-0"
                  style={{
                    color: "var(--text-muted)",
                    fontFamily: "var(--font-jetbrains-mono)",
                  }}
                >
                  {shortDate(d.date)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DataTable({
  rows,
  labelKey,
  countKey,
  labelHeader,
}: {
  rows: Record<string, string | number>[];
  labelKey: string;
  countKey: string;
  labelHeader: string;
}) {
  if (!rows.length) return (
    <p className="text-sm py-4" style={{ color: "var(--text-muted)" }}>No data yet.</p>
  );

  return (
    <table className="w-full text-sm">
      <thead>
        <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
          <th
            className="text-left py-2 font-medium"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            {labelHeader}
          </th>
          <th
            className="text-right py-2 font-medium"
            style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
          >
            Views
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr
            key={i}
            style={{ borderBottom: "1px solid var(--border-subtle)" }}
          >
            <td
              className="py-2 font-mono text-xs truncate max-w-[200px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {String(row[labelKey])}
            </td>
            <td
              className="py-2 text-right tabular-nums"
              style={{
                color: "var(--accent-cyan)",
                fontFamily: "var(--font-space-grotesk)",
              }}
            >
              {fmt(Number(row[countKey]))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── Login Form ─────────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: (token: string) => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.ok && data.token) {
        onSuccess(data.token);
      } else {
        setError("Incorrect password.");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--bg-primary)" }}>
      <div
        className="w-full max-w-sm rounded-lg p-8"
        style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Lock size={16} style={{ color: "var(--accent-cyan)" }} />
          <p
            className="text-sm"
            style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
          >
            // Admin Access
          </p>
        </div>

        <h1
          className="text-2xl font-bold mb-6"
          style={{ fontFamily: "var(--font-space-grotesk)", color: "var(--text-primary)" }}
        >
          Analytics Dashboard
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="block text-xs mb-1.5"
              style={{ color: "var(--text-muted)", fontFamily: "var(--font-jetbrains-mono)" }}
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded px-3 py-2.5 text-sm outline-none transition-all duration-200"
              style={{
                background: "var(--bg-primary)",
                border: "1px solid var(--border-subtle)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-space-grotesk)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent-cyan)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border-subtle)"; }}
              required
              autoFocus
            />
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#ef4444" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded text-sm font-semibold transition-opacity duration-200 disabled:opacity-50"
            style={{
              background: "var(--accent-cyan)",
              color: "#08080F",
              fontFamily: "var(--font-space-grotesk)",
            }}
          >
            {loading ? "Checking…" : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function Dashboard({ token, onLogout }: { token: string; onLogout: () => void }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/analytics", {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (res.status === 401) {
        onLogout();
        return;
      }
      if (!res.ok) throw new Error("Fetch failed");
      setSummary(await res.json());
    } catch {
      setError("Failed to load analytics. Retry?");
    } finally {
      setLoading(false);
    }
  }, [token, onLogout]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="min-h-screen px-4 py-10" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <BarChart2 size={16} style={{ color: "var(--accent-cyan)" }} />
            <p
              className="text-xs"
              style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--accent-cyan)" }}
            >
              // Analytics Dashboard
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all duration-200 disabled:opacity-40"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "var(--text-secondary)",
                border: "1px solid var(--border-subtle)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent-cyan)"; (e.currentTarget as HTMLElement).style.color = "var(--accent-cyan)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; (e.currentTarget as HTMLElement).style.color = "var(--text-secondary)"; }}
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded transition-all duration-200"
              style={{
                fontFamily: "var(--font-space-grotesk)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-subtle)",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.borderColor = "#ef4444"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--text-muted)"; (e.currentTarget as HTMLElement).style.borderColor = "var(--border-subtle)"; }}
            >
              <LogOut size={12} />
              Logout
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 px-4 py-3 rounded text-sm"
            style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#ef4444" }}
          >
            {error}
          </div>
        )}

        {/* Loading skeleton */}
        {loading && !summary && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg animate-pulse" style={{ background: "var(--bg-elevated)" }} />
            ))}
          </div>
        )}

        {summary && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard label="Total Views" value={summary.total_views} />
              <StatCard label="Today" value={summary.views_today} />
              <StatCard label="7 Days" value={summary.views_7d} />
              <StatCard label="30 Days" value={summary.views_30d} />
            </div>

            {/* Daily chart */}
            <div
              className="rounded-lg p-6 mb-6"
              style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
            >
              <p
                className="text-xs mb-4"
                style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
              >
                Daily Views — Last 30 Days
              </p>
              <BarChart days={summary.views_by_day} />
            </div>

            {/* Tables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="rounded-lg p-6"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                <p
                  className="text-xs mb-4"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
                >
                  Top Pages
                </p>
                <DataTable
                  rows={summary.top_pages as unknown as Record<string, string | number>[]}
                  labelKey="page"
                  countKey="count"
                  labelHeader="Page"
                />
              </div>

              <div
                className="rounded-lg p-6"
                style={{ background: "var(--bg-elevated)", border: "1px solid var(--border-subtle)" }}
              >
                <p
                  className="text-xs mb-4"
                  style={{ fontFamily: "var(--font-jetbrains-mono)", color: "var(--text-muted)" }}
                >
                  Top Referrers
                </p>
                <DataTable
                  rows={summary.top_referrers as unknown as Record<string, string | number>[]}
                  labelKey="referrer"
                  countKey="count"
                  labelHeader="Source"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const [view, setView] = useState<View>("checking");
  const [token, setToken] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem(TOKEN_KEY);
    if (!stored) { setView("login"); return; }
    // Verify stored token is still valid
    fetch("/api/admin/analytics", {
      headers: { Authorization: `Bearer ${stored}` },
      cache: "no-store",
    }).then((r) => {
      if (r.ok) { setToken(stored); setView("dashboard"); }
      else { sessionStorage.removeItem(TOKEN_KEY); setView("login"); }
    }).catch(() => { setView("login"); });
  }, []);

  function handleLogin(t: string) {
    sessionStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    setView("dashboard");
  }

  function handleLogout() {
    sessionStorage.removeItem(TOKEN_KEY);
    setToken("");
    setView("login");
  }

  if (view === "checking") {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: "var(--accent-cyan)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (view === "login") return <LoginForm onSuccess={handleLogin} />;
  return <Dashboard token={token} onLogout={handleLogout} />;
}
