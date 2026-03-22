import { useEvents, useBuyers, useGuestlist, useAuth, login, logout, createEvent, updateEvent, addGuest, removeGuest, toggleGuestCheckin, checkinBuyer, scanQR } from "./fluxo-firebase.js";
import { useState, useEffect, useRef } from "react";

/* ═══════════════════════════════════════════════════════════
   FLUXO STAFF — App para organizadores
   Login · Dashboard · Eventos · Ventas · Invitados · Scanner QR
═══════════════════════════════════════════════════════════ */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:        #0e0e0e;
  --surface:   #161616;
  --surface2:  #1f1f1f;
  --surface3:  #272727;
  --border:    rgba(255,255,255,.08);
  --border2:   rgba(255,255,255,.13);
  --white:     #ffffff;
  --off:       rgba(255,255,255,.5);
  --dim:       rgba(255,255,255,.28);
  --accent:    #a78bfa;
  --accent-bg: rgba(167,139,250,.12);
  --accent-border: rgba(167,139,250,.3);
  --green:     #4ade80;
  --green-bg:  rgba(74,222,128,.1);
  --orange:    #fb923c;
  --orange-bg: rgba(251,146,60,.1);
  --red:       #f87171;
  --red-bg:    rgba(248,113,113,.1);
  --ff:        'Figtree', system-ui, sans-serif;
  --ease:      cubic-bezier(.16,1,.3,1);
  --r:         14px;
  --r-sm:      10px;
}

html, body { background: var(--bg); }
body {
  font-family: var(--ff);
  color: var(--white);
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  max-width: 430px;
  margin: 0 auto;
}
::-webkit-scrollbar { width: 0; }

/* ── UTILS ── */
.flex  { display: flex; }
.col   { flex-direction: column; }
.gap8  { gap: 8px; }
.gap12 { gap: 12px; }
.gap16 { gap: 16px; }
.ai-c  { align-items: center; }
.jc-sb { justify-content: space-between; }
.f1    { flex: 1; }
.mono  { font-variant-numeric: tabular-nums; }

/* ── LOGIN ── */
.login-wrap {
  min-height: 100dvh;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 40px 28px;
  background: radial-gradient(ellipse 70% 60% at 50% 0%, rgba(167,139,250,.14) 0%, transparent 70%);
}
.login-logo {
  font-size: 28px; font-weight: 900; letter-spacing: -.5px;
  margin-bottom: 4px;
}
.login-sub {
  font-size: 13px; color: var(--dim); margin-bottom: 48px;
  letter-spacing: .5px; text-transform: uppercase; font-weight: 600;
}
.login-card {
  width: 100%; background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px; padding: 28px 24px;
}
.login-title { font-size: 20px; font-weight: 800; margin-bottom: 6px; letter-spacing: -.3px; }
.login-hint  { font-size: 13px; color: var(--off); margin-bottom: 24px; }

.field { margin-bottom: 14px; }
.field label {
  display: block; font-size: 11px; font-weight: 700;
  letter-spacing: 1px; text-transform: uppercase;
  color: var(--dim); margin-bottom: 8px;
}
.field input {
  width: 100%; padding: 13px 16px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--r-sm); color: var(--white);
  font-family: var(--ff); font-size: 15px; font-weight: 500;
  outline: none; transition: border-color .15s;
}
.field input:focus { border-color: var(--accent); }
.field input::placeholder { color: rgba(255,255,255,.2); }

.btn-primary {
  width: 100%; padding: 15px; border-radius: var(--r);
  border: none; font-family: var(--ff);
  font-size: 15px; font-weight: 800; cursor: pointer;
  background: var(--accent); color: #0a0014;
  transition: opacity .15s, transform .15s;
  letter-spacing: -.1px;
}
.btn-primary:hover { opacity: .9; }
.btn-primary:active { transform: scale(.98); }
.btn-primary:disabled { opacity: .35; cursor: not-allowed; }

.login-error {
  background: var(--red-bg); border: 1px solid rgba(248,113,113,.3);
  border-radius: var(--r-sm); padding: 12px 14px;
  font-size: 13px; color: var(--red); margin-bottom: 14px;
}

/* ── BOTTOM NAV ── */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 100%; max-width: 430px;
  background: rgba(14,14,14,.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
  display: flex; z-index: 90;
  padding-bottom: env(safe-area-inset-bottom, 0);
}
.nav-tab {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 10px 0 12px; cursor: pointer;
  border: none; background: none; color: var(--dim);
  font-family: var(--ff); transition: color .15s;
  gap: 4px;
}
.nav-tab.active { color: var(--accent); }
.nav-tab svg { width: 22px; height: 22px; }
.nav-tab span { font-size: 10px; font-weight: 600; letter-spacing: .5px; text-transform: uppercase; }

/* ── TOPBAR ── */
.topbar {
  position: sticky; top: 0; z-index: 80;
  background: rgba(14,14,14,.92);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  padding: 0 18px; height: 58px;
  display: flex; align-items: center; justify-content: space-between;
}
.topbar-title { font-size: 18px; font-weight: 800; letter-spacing: -.3px; }
.topbar-action {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--surface2); border: 1px solid var(--border);
  cursor: pointer; color: var(--white);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px;
}

/* ── SCREEN WRAPPER ── */
.screen { padding-bottom: 80px; }

/* ── STAT CARDS ── */
.stat-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 10px; padding: 18px;
}
.stat-card {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 16px;
}
.stat-label { font-size: 11px; color: var(--dim); font-weight: 600; letter-spacing: .5px; margin-bottom: 8px; text-transform: uppercase; }
.stat-val   { font-size: 26px; font-weight: 900; letter-spacing: -.5px; line-height: 1; }
.stat-delta { font-size: 11px; color: var(--green); margin-top: 5px; font-weight: 600; }
.stat-delta.down { color: var(--orange); }

/* ── SECTION HEADER ── */
.sec-head {
  padding: 0 18px 12px;
  display: flex; align-items: center; justify-content: space-between;
}
.sec-head-title { font-size: 13px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 1.5px; }
.sec-head-link  { font-size: 13px; color: var(--accent); font-weight: 600; cursor: pointer; }

/* ── EVENT ROW ── */
.event-row {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  cursor: pointer; transition: background .15s;
}
.event-row:hover { background: rgba(255,255,255,.03); }
.event-thumb {
  width: 52px; height: 52px; border-radius: 12px;
  overflow: hidden; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  font-size: 24px;
}
.event-info { flex: 1; min-width: 0; }
.event-name {
  font-size: 15px; font-weight: 700; margin-bottom: 3px;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.event-meta { font-size: 12px; color: var(--off); }
.event-right { text-align: right; flex-shrink: 0; }
.event-pct   { font-size: 18px; font-weight: 800; }
.event-pct-label { font-size: 10px; color: var(--dim); font-weight: 500; margin-top: 2px; }

/* ── BADGE ── */
.badge {
  display: inline-flex; align-items: center;
  padding: 3px 9px; border-radius: 100px;
  font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase;
}
.badge-green  { background: var(--green-bg); color: var(--green); }
.badge-orange { background: var(--orange-bg); color: var(--orange); }
.badge-red    { background: var(--red-bg); color: var(--red); }
.badge-accent { background: var(--accent-bg); color: var(--accent); }

/* ── PROGRESS BAR ── */
.prog-wrap { margin-top: 6px; }
.prog-track {
  height: 4px; background: var(--surface3);
  border-radius: 2px; overflow: hidden;
}
.prog-fill  { height: 100%; border-radius: 2px; background: var(--accent); transition: width .4s var(--ease); }
.prog-fill.green  { background: var(--green); }
.prog-fill.orange { background: var(--orange); }

/* ── LIST CARD ── */
.list-card {
  margin: 0 18px 10px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); overflow: hidden;
}
.list-item {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 16px;
  border-bottom: 1px solid var(--border);
}
.list-item:last-child { border-bottom: none; }
.list-icon {
  width: 38px; height: 38px; border-radius: 10px;
  background: var(--surface3);
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.list-body { flex: 1; min-width: 0; }
.list-name { font-size: 14px; font-weight: 700; }
.list-sub  { font-size: 12px; color: var(--off); margin-top: 2px; }
.list-right { text-align: right; font-size: 14px; font-weight: 700; }
.list-right-sub { font-size: 11px; color: var(--dim); margin-top: 2px; }

/* ── CHART AREA ── */
.chart-wrap {
  margin: 0 18px 18px;
  background: var(--surface); border: 1px solid var(--border);
  border-radius: var(--r); padding: 18px;
}
.chart-head { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.chart-title { font-size: 14px; font-weight: 700; }
.chart-total { font-size: 22px; font-weight: 900; letter-spacing: -.4px; }
.chart-sub   { font-size: 11px; color: var(--dim); margin-top: 2px; }

.bar-chart { display: flex; align-items: flex-end; gap: 6px; height: 100px; }
.bar-col { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 5px; }
.bar-fill {
  width: 100%; border-radius: 4px 4px 0 0;
  background: var(--accent); opacity: .7;
  transition: opacity .15s; cursor: pointer;
}
.bar-fill:hover { opacity: 1; }
.bar-fill.today { opacity: 1; }
.bar-label { font-size: 9px; color: var(--dim); font-weight: 600; letter-spacing: .3px; }

/* ── INVITADOS ── */
.search-wrap {
  padding: 14px 18px;
  position: sticky; top: 58px; z-index: 70;
  background: rgba(14,14,14,.96);
  backdrop-filter: blur(20px);
}
.search-inp {
  width: 100%; padding: 12px 16px 12px 42px;
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: 12px; color: var(--white);
  font-family: var(--ff); font-size: 14px; outline: none;
  transition: border-color .15s;
}
.search-inp:focus { border-color: var(--accent); }
.search-inp::placeholder { color: rgba(255,255,255,.25); }
.search-ico {
  position: absolute; left: 30px; top: 50%; transform: translateY(-50%);
  font-size: 16px; pointer-events: none;
}

.guest-item {
  display: flex; align-items: center; gap: 14px;
  padding: 13px 18px;
  border-bottom: 1px solid var(--border);
  transition: background .15s;
}
.guest-item:hover { background: rgba(255,255,255,.02); }
.guest-avatar {
  width: 42px; height: 42px; border-radius: 50%;
  background: var(--surface3);
  display: flex; align-items: center; justify-content: center;
  font-size: 15px; font-weight: 800; flex-shrink: 0; color: var(--dim);
}
.guest-info { flex: 1; }
.guest-name { font-size: 14px; font-weight: 700; margin-bottom: 2px; }
.guest-email { font-size: 11px; color: var(--dim); }
.guest-right { display: flex; flex-direction: column; align-items: flex-end; gap: 5px; }
.check-btn {
  width: 32px; height: 32px; border-radius: 50%;
  border: 2px solid var(--border2);
  background: transparent; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; transition: all .2s;
}
.check-btn.in  { background: var(--green); border-color: var(--green); }
.check-btn.out { border-color: var(--border2); }

/* ── INNER TABS ── */
.inner-tabs {
  display: flex; border-bottom: 1px solid var(--border);
  padding: 0 18px; gap: 0;
  position: sticky; top: 58px; z-index: 69;
  background: rgba(14,14,14,.96);
  backdrop-filter: blur(20px);
}
.inner-tab {
  flex: 1; padding: 14px 0; text-align: center;
  font-size: 13px; font-weight: 700; cursor: pointer;
  border: none; background: none; font-family: var(--ff);
  color: var(--dim); border-bottom: 2px solid transparent;
  transition: all .15s; margin-bottom: -1px;
}
.inner-tab.active { color: var(--accent); border-bottom-color: var(--accent); }

/* ── GUESTLIST ITEM ── */
.gl-item {
  display: flex; align-items: flex-start; gap: 14px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  transition: background .15s;
}
.gl-item:hover { background: rgba(255,255,255,.02); }
.gl-body { flex: 1; min-width: 0; }
.gl-name { font-size: 14px; font-weight: 700; margin-bottom: 3px; }
.gl-meta { font-size: 11px; color: var(--dim); display: flex; gap: 8px; flex-wrap: wrap; }
.gl-note {
  font-size: 11px; color: var(--off); margin-top: 4px;
  font-style: italic;
}
.gl-plus {
  display: inline-flex; align-items: center; gap: 4px;
  background: var(--accent-bg); color: var(--accent);
  border-radius: 100px; padding: 2px 8px;
  font-size: 10px; font-weight: 700;
}

/* ── QR SCANNER ── */
.scanner-wrap {
  display: flex; flex-direction: column;
  align-items: center; padding: 28px 24px;
}
.scanner-box {
  width: 100%; max-width: 320px;
  aspect-ratio: 1; border-radius: 20px;
  background: var(--surface); border: 1px solid var(--border);
  position: relative; overflow: hidden;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 28px;
}
.scanner-corner {
  position: absolute; width: 40px; height: 40px;
  border-color: var(--accent); border-style: solid;
}
.sc-tl { top: 16px; left: 16px; border-width: 3px 0 0 3px; border-radius: 4px 0 0 0; }
.sc-tr { top: 16px; right: 16px; border-width: 3px 3px 0 0; border-radius: 0 4px 0 0; }
.sc-bl { bottom: 16px; left: 16px; border-width: 0 0 3px 3px; border-radius: 0 0 0 4px; }
.sc-br { bottom: 16px; right: 16px; border-width: 0 3px 3px 0; border-radius: 0 0 4px 0; }
.scan-line {
  position: absolute; left: 16px; right: 16px; height: 2px;
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  animation: scanMove 2s ease-in-out infinite;
}
@keyframes scanMove {
  0%   { top: 16px; opacity: 1; }
  90%  { top: calc(100% - 18px); opacity: 1; }
  100% { top: calc(100% - 18px); opacity: 0; }
}
.scanner-icon { font-size: 56px; opacity: .15; }
.scanner-status {
  font-size: 14px; color: var(--off); text-align: center;
  line-height: 1.6; max-width: 260px;
}

.scan-result {
  width: 100%; border-radius: var(--r);
  padding: 20px; margin-bottom: 16px;
  border: 1px solid;
}
.scan-result.ok    { background: var(--green-bg); border-color: rgba(74,222,128,.3); }
.scan-result.error { background: var(--red-bg);   border-color: rgba(248,113,113,.3); }
.scan-result-title { font-size: 18px; font-weight: 900; margin-bottom: 4px; }
.scan-result.ok    .scan-result-title { color: var(--green); }
.scan-result.error .scan-result-title { color: var(--red); }
.scan-result-name  { font-size: 14px; font-weight: 600; margin-bottom: 2px; }
.scan-result-sub   { font-size: 12px; color: var(--off); }

.manual-btn {
  padding: 14px 28px; border-radius: var(--r);
  border: 1px solid var(--border2); background: transparent;
  color: var(--white); font-family: var(--ff); font-size: 14px;
  font-weight: 600; cursor: pointer; transition: background .15s;
  margin-top: 8px;
}
.manual-btn:hover { background: rgba(255,255,255,.06); }

/* ── MODAL / SHEET ── */
.overlay {
  position: fixed; inset: 0; z-index: 200;
  background: rgba(0,0,0,.75);
  backdrop-filter: blur(8px);
  display: flex; align-items: flex-end;
}
.sheet {
  background: #141414; width: 100%; max-width: 430px;
  margin: 0 auto; border-radius: 24px 24px 0 0;
  max-height: 92dvh; overflow-y: auto;
  animation: sheetUp .34s var(--ease);
  border-top: 1px solid var(--border);
}
@keyframes sheetUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
.sheet-handle {
  width: 36px; height: 4px; border-radius: 2px;
  background: var(--border2); margin: 14px auto 0;
}
.sheet-inner { padding: 20px 20px 40px; }
.sheet-title { font-size: 22px; font-weight: 900; letter-spacing: -.4px; margin-bottom: 20px; }

/* ── EVENT DETAIL IN SHEET ── */
.detail-stat {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--border);
}
.detail-stat:last-child { border-bottom: none; }
.detail-ico {
  width: 40px; height: 40px; border-radius: 12px;
  background: var(--surface2);
  display: flex; align-items: center; justify-content: center; font-size: 18px;
  flex-shrink: 0;
}
.detail-body { flex: 1; }
.detail-lbl  { font-size: 11px; color: var(--dim); margin-bottom: 3px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; }
.detail-val  { font-size: 16px; font-weight: 800; }
.detail-sub  { font-size: 12px; color: var(--off); margin-top: 2px; }

/* ── CREATE EVENT FORM ── */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.sheet-btn {
  width: 100%; padding: 15px; border-radius: var(--r); border: none;
  font-family: var(--ff); font-size: 15px; font-weight: 800;
  background: var(--accent); color: #0a0014;
  cursor: pointer; transition: all .15s;
  margin-top: 12px; letter-spacing: -.1px;
}
.sheet-btn:hover { opacity: .9; }
.sheet-btn.ghost {
  background: transparent; color: var(--off);
  border: 1px solid var(--border2); font-size: 14px; font-weight: 600;
  color: var(--white);
}
.sheet-btn.ghost:hover { background: rgba(255,255,255,.06); }

/* ── TICKET TYPE EDITOR ── */
.tt-editor {
  background: var(--surface2); border: 1px solid var(--border);
  border-radius: var(--r-sm); padding: 14px; margin-bottom: 10px;
}
.tt-editor-head {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;
}
.tt-editor-name { font-size: 14px; font-weight: 700; }
.tt-del-btn {
  width: 28px; height: 28px; border-radius: 50%;
  border: 1px solid rgba(248,113,113,.3); background: var(--red-bg);
  color: var(--red); cursor: pointer; font-size: 14px;
  display: flex; align-items: center; justify-content: center;
}

/* ── AVATAR ── */
.avatar {
  width: 38px; height: 38px; border-radius: 50%;
  background: var(--accent-bg); border: 1px solid var(--accent-border);
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; font-weight: 800; color: var(--accent); flex-shrink: 0;
}

/* ── EMPTY STATE ── */
.empty {
  text-align: center; padding: 60px 30px;
  color: var(--dim); font-size: 14px; line-height: 1.8;
}
.empty-ico { font-size: 42px; margin-bottom: 14px; }
`;

/* ════════════════ MOCK DATA ════════════════ */
const MOCK_USER = { name: "Carlos Vega", email: "carlos@fluxo.ar", role: "Organizador" };

const MOCK_EVENTS = [
  {
    id: "e1", artist: "Marilina Bertoldi & Alok", tag: "Electrónica · Rock",
    venue: "Club Niceto", city: "Palermo, CABA",
    day: "28", month: "MAR", year: "2025", time: "23:00", doors: "22:00",
    emoji: "🎧", color1: "#1a0533", color2: "#6b21a8", color3: "#c084fc",
    types: [
      { id: "t1", name: "General", price: 9500,  sold: 187, total: 250 },
      { id: "t2", name: "VIP",     price: 24000, sold: 42,  total: 50  },
    ],
  },
  {
    id: "e2", artist: "Cuarteto del Norte", tag: "Folklore · Cuarteto",
    venue: "Ópera Córdoba", city: "Nueva Córdoba, CBA",
    day: "04", month: "ABR", year: "2025", time: "21:00", doors: "20:00",
    emoji: "🎶", color1: "#1c0a00", color2: "#9a3412", color3: "#fb923c",
    types: [
      { id: "t3", name: "Campo",    price: 8000,  sold: 200, total: 400 },
      { id: "t4", name: "Platea A", price: 18000, sold: 28,  total: 50  },
    ],
  },
  {
    id: "e3", artist: "La Gaviota", tag: "Teatro · Drama",
    venue: "Teatro Picadero", city: "Palermo, CABA",
    day: "29", month: "MAR", year: "2025", time: "20:30", doors: "20:00",
    emoji: "🎭", color1: "#0a0f1a", color2: "#1e3a5f", color3: "#60a5fa",
    types: [
      { id: "t5", name: "Platea",  price: 14000, sold: 40, total: 80 },
      { id: "t6", name: "Paraíso", price: 7500,  sold: 20, total: 80 },
    ],
  },
];

const MOCK_GUESTS = [
  { id: "g1", name: "Valentina Rossi",   email: "valen@mail.com",    dni: "32.456.789", ticket: "VIP",     hash: "hmac_ab3f9c",  checkedIn: false },
  { id: "g2", name: "Martín Aguirre",    email: "martin@mail.com",   dni: "28.901.234", ticket: "General", hash: "hmac_cd7e2a",  checkedIn: true  },
  { id: "g3", name: "Sofía Méndez",      email: "sofi@mail.com",     dni: "40.123.456", ticket: "General", hash: "hmac_ef1b5d",  checkedIn: false },
  { id: "g4", name: "Lucas Fernández",   email: "lucas@mail.com",    dni: "35.678.901", ticket: "VIP",     hash: "hmac_gh4c8f",  checkedIn: true  },
  { id: "g5", name: "Camila Torres",     email: "cami@mail.com",     dni: "38.234.567", ticket: "General", hash: "hmac_ij2d7e",  checkedIn: false },
  { id: "g6", name: "Diego Rodríguez",   email: "diego@mail.com",    dni: "29.876.543", ticket: "General", hash: "hmac_kl5a9b",  checkedIn: false },
  { id: "g7", name: "Natalia Gómez",     email: "nat@mail.com",      dni: "33.456.789", ticket: "VIP",     hash: "hmac_mn8c3f",  checkedIn: true  },
  { id: "g8", name: "Andrés Castillo",   email: "andres@mail.com",   dni: "31.234.567", ticket: "General", hash: "hmac_op6d1a",  checkedIn: false },
];

const MOCK_GUESTLIST = [
  { id: "l1", name: "Rodrigo Sánchez", dni: "27.345.678", plus: 1, motivo: "Prensa",      eventId: "e1", checkedIn: false },
  { id: "l2", name: "Jimena Alvarez",  dni: "34.567.890", plus: 0, motivo: "Staff",       eventId: "e1", checkedIn: true  },
  { id: "l3", name: "Pablo Herrera",   dni: "30.123.456", plus: 2, motivo: "Artista",     eventId: "e2", checkedIn: false },
  { id: "l4", name: "Florencia Ruiz",  dni: "38.901.234", plus: 0, motivo: "Prensa",      eventId: "e2", checkedIn: false },
  { id: "l5", name: "Tomás Acosta",    dni: "25.678.901", plus: 1, motivo: "Sponsor",     eventId: "e3", checkedIn: true  },
];

const DAYS_DATA = [
  { day: "L", val: 42 }, { day: "M", val: 58 }, { day: "X", val: 35 },
  { day: "J", val: 91 }, { day: "V", val: 124 }, { day: "S", val: 187 }, { day: "D", val: 0, today: true },
];

const fmt = n => new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 }).format(n);
const initials = name => name.split(" ").slice(0, 2).map(w => w[0]).join("").toUpperCase();

/* ════════════════ COMPONENTS ════════════════ */

function EventThumb({ ev }) {
  if (ev.photo) {
    return (
      <div className="event-thumb" style={{ background: "var(--surface2)" }}>
        <img src={ev.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
      </div>
    );
  }
  return (
    <div className="event-thumb" style={{
      background: `radial-gradient(circle at 60% 40%, ${ev.color3}55, ${ev.color2} 60%, ${ev.color1})`,
    }}>{ev.emoji}</div>
  );
}

/* ── DASHBOARD ── */
function Dashboard({ events, onEventClick, onCreateEvent }) {
  const totalRevenue = events.reduce((s, ev) =>
    s + ev.types.reduce((ts, t) => ts + t.sold * t.price, 0), 0);
  const totalSold = events.reduce((s, ev) =>
    s + ev.types.reduce((ts, t) => ts + t.sold, 0), 0);
  const totalCapacity = events.reduce((s, ev) =>
    s + ev.types.reduce((ts, t) => ts + t.total, 0), 0);
  const maxBar = Math.max(...DAYS_DATA.map(d => d.val));

  return (
    <div className="screen">
      <div className="topbar">
        <div>
          <div className="topbar-title">Hola, Carlos 👋</div>
        </div>
        <button className="topbar-action" onClick={onCreateEvent} title="Crear evento">＋</button>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Ingresos</div>
          <div className="stat-val mono">{fmt(totalRevenue)}</div>
          <div className="stat-delta">↑ +12% esta semana</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Entradas</div>
          <div className="stat-val mono">{totalSold}</div>
          <div className="stat-delta">de {totalCapacity} cap.</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Eventos</div>
          <div className="stat-val mono">{events.length}</div>
          <div className="stat-delta">activos</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Check-in hoy</div>
          <div className="stat-val mono">{MOCK_GUESTS.filter(g => g.checkedIn).length}</div>
          <div className="stat-delta down">de {MOCK_GUESTS.length} total</div>
        </div>
      </div>

      {/* BAR CHART */}
      <div className="chart-wrap">
        <div className="chart-head">
          <div>
            <div className="chart-title">Ventas últimos 7 días</div>
            <div className="chart-sub">Entradas vendidas por día</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="chart-total">537</div>
            <div className="chart-sub">esta semana</div>
          </div>
        </div>
        <div className="bar-chart">
          {DAYS_DATA.map((d, i) => (
            <div key={i} className="bar-col">
              <div
                className={`bar-fill${d.today ? " today" : ""}`}
                style={{ height: `${Math.max(4, (d.val / maxBar) * 80)}px` }}
              />
              <div className="bar-label">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* EVENTS */}
      <div className="sec-head">
        <div className="sec-head-title">Mis eventos</div>
      </div>

      {events.map(ev => {
        const sold = ev.types.reduce((s, t) => s + t.sold, 0);
        const cap  = ev.types.reduce((s, t) => s + t.total, 0);
        const pct  = Math.round((sold / cap) * 100);
        return (
          <div key={ev.id} className="event-row" onClick={() => onEventClick(ev)}>
            <EventThumb ev={ev} />
            <div className="event-info">
              <div className="event-name">{ev.artist}</div>
              <div className="event-meta">{ev.venue} · {ev.day} {ev.month}</div>
              <div className="prog-wrap">
                <div className="prog-track" style={{ marginTop: 6 }}>
                  <div className="prog-fill green" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
            <div className="event-right">
              <div className="event-pct">{pct}%</div>
              <div className="event-pct-label">vendido</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── VENTAS ── */
function Sales({ events }) {
  const [activeEvent, setActiveEvent] = useState(events[0]);
  const ev = activeEvent;
  const revenue  = ev.types.reduce((s, t) => s + t.sold * t.price, 0);
  const sold     = ev.types.reduce((s, t) => s + t.sold, 0);
  const capacity = ev.types.reduce((s, t) => s + t.total, 0);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title">Ventas</div>
      </div>

      {/* Event switcher */}
      <div style={{ padding: "14px 18px 4px", display: "flex", gap: 8, overflowX: "auto" }}>
        {events.map(ev2 => (
          <button
            key={ev2.id}
            onClick={() => setActiveEvent(ev2)}
            style={{
              padding: "8px 16px", borderRadius: 100, border: "1px solid",
              borderColor: activeEvent.id === ev2.id ? "var(--accent)" : "var(--border)",
              background: activeEvent.id === ev2.id ? "var(--accent-bg)" : "transparent",
              color: activeEvent.id === ev2.id ? "var(--accent)" : "var(--off)",
              whiteSpace: "nowrap", cursor: "pointer",
              fontSize: 13, fontWeight: 700, fontFamily: "var(--ff)",
              transition: "all .15s",
            }}
          >
            {ev2.emoji} {ev2.artist.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="stat-grid">
        <div className="stat-card" style={{ gridColumn: "1/-1" }}>
          <div className="stat-label">Ingresos totales</div>
          <div className="stat-val mono">{fmt(revenue)}</div>
          <div className="stat-delta">↑ {sold} entradas · {Math.round((sold/capacity)*100)}% de capacidad</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Vendidas</div>
          <div className="stat-val mono">{sold}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Disponibles</div>
          <div className="stat-val mono">{capacity - sold}</div>
        </div>
      </div>

      {/* Por tipo */}
      <div className="sec-head">
        <div className="sec-head-title">Por tipo de entrada</div>
      </div>

      <div className="list-card">
        {ev.types.map((t, i) => {
          const pct = Math.round((t.sold / t.total) * 100);
          return (
            <div key={t.id} className="list-item" style={{ flexDirection: "column", alignItems: "stretch" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                <div>
                  <div className="list-name">{t.name}</div>
                  <div className="list-sub">{fmt(t.price)} c/u</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="list-right">{fmt(t.sold * t.price)}</div>
                  <div className="list-right-sub">{t.sold} / {t.total}</div>
                </div>
              </div>
              <div className="prog-track">
                <div
                  className={`prog-fill ${pct > 80 ? "orange" : "green"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <div style={{ fontSize: 11, color: "var(--dim)", marginTop: 5 }}>{pct}% vendido</div>
            </div>
          );
        })}
      </div>

      {/* Últimas ventas mock */}
      <div className="sec-head">
        <div className="sec-head-title">Últimas ventas</div>
      </div>

      <div className="list-card">
        {MOCK_GUESTS.slice(0, 5).map(g => (
          <div key={g.id} className="list-item">
            <div className="avatar">{initials(g.name)}</div>
            <div className="list-body">
              <div className="list-name">{g.name}</div>
              <div className="list-sub">{g.ticket} · {g.hash}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="list-right">
                {fmt(ev.types.find(t => t.name === g.ticket)?.price || 0)}
              </div>
              <div className="list-right-sub">hace 2h</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── ADD TO GUESTLIST SHEET ── */
function AddToListSheet({ onClose, onSave, events }) {
  const [form, setForm] = useState({ name: "", dni: "", plus: "0", motivo: "", eventId: "" });
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const valid = form.name.trim() && form.dni.trim() && form.eventId;
  const motivos = ["Prensa", "Staff", "Artista", "Sponsor", "Invitado VIP", "Otro"];

  const inputStyle = {
    width: "100%", padding: "13px 16px",
    background: "var(--surface2)", border: "1px solid var(--border)",
    borderRadius: "var(--r-sm)", color: "var(--white)",
    fontFamily: "var(--ff)", fontSize: 15, outline: "none",
  };

  async function save() {
    await addGuest({
      name: form.name.trim(),
      dni: form.dni.trim(),
      plus: Number(form.plus),
      motivo: form.motivo || "Invitado",
      eventId: form.eventId,
      checkedIn: false,
    });
    onClose();
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-inner">
          <div className="sheet-title">Agregar a la lista</div>

          {/* EVENTO — primero y destacado */}
          <div className="field">
            <label>Evento</label>
            <select style={inputStyle} value={form.eventId} onChange={e => setF("eventId", e.target.value)}>
              <option value="">Seleccioná un evento…</option>
              {events.map(ev => (
                <option key={ev.id} value={ev.id}>
                  {ev.emoji} {ev.artist} · {ev.day} {ev.month}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Nombre completo</label>
            <input style={inputStyle} placeholder="Nombre Apellido"
              value={form.name} onChange={e => setF("name", e.target.value)} />
          </div>

          <div className="field">
            <label>DNI</label>
            <input style={inputStyle} placeholder="32.456.789"
              value={form.dni} onChange={e => setF("dni", e.target.value)} />
          </div>

          <div className="form-row">
            <div className="field">
              <label>Acompañantes</label>
              <select style={{ ...inputStyle }}
                value={form.plus} onChange={e => setF("plus", e.target.value)}>
                {[0,1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n === 0 ? "Sin acomp." : `+${n}`}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Motivo</label>
              <select style={{ ...inputStyle }}
                value={form.motivo} onChange={e => setF("motivo", e.target.value)}>
                <option value="">Sin motivo</option>
                {motivos.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <button className="sheet-btn" disabled={!valid} onClick={save}>
            Agregar a la lista
          </button>
          <button className="sheet-btn ghost" onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

/* ── COMPRADORES TAB ── */
function BuyersTab({ guests, setGuests }) {
  const [query, setQuery]   = useState("");
  const [filter, setFilter] = useState("todos");

  const filtered = guests.filter(g => {
    const q = query.toLowerCase();
    const match = !q || g.name.toLowerCase().includes(q) || g.email.includes(q) || g.dni.includes(q);
    if (filter === "ingresaron") return match && g.checkedIn;
    if (filter === "pendientes") return match && !g.checkedIn;
    return match;
  });

  const inCount = guests.filter(g => g.checkedIn).length;

  function toggle(g) {
    checkinBuyer(g.id, !g.checkedIn);
  }

  return (
    <>
      <div className="search-wrap" style={{ top: 106 }}>
        <div style={{ position: "relative" }}>
          <span className="search-ico">🔍</span>
          <input className="search-inp" placeholder="Buscar por nombre, email, DNI…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          {[["todos", "Todos"], ["ingresaron", "Ingresaron"], ["pendientes", "Pendientes"]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: "6px 14px", borderRadius: 100, border: "1px solid",
              borderColor: filter === key ? "var(--accent)" : "var(--border)",
              background: filter === key ? "var(--accent-bg)" : "transparent",
              color: filter === key ? "var(--accent)" : "var(--dim)",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--ff)", transition: "all .15s",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Counter strip */}
      <div style={{ padding: "10px 18px 2px", fontSize: 12, color: "var(--dim)", fontWeight: 600 }}>
        {inCount} ingresaron · {guests.length - inCount} pendientes
      </div>

      {filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">🔍</div>
          Sin resultados para &ldquo;{query}&rdquo;
        </div>
      ) : (
        filtered.map(g => (
          <div key={g.id} className="guest-item">
            <div className="avatar">{initials(g.name)}</div>
            <div className="guest-info">
              <div className="guest-name">{g.name}</div>
              <div className="guest-email">{g.ticket} · DNI {g.dni}</div>
            </div>
            <div className="guest-right">
              <button
                className={`check-btn ${g.checkedIn ? "in" : "out"}`}
                onClick={() => toggle(g.id)}
              >{g.checkedIn ? "✓" : ""}</button>
              <div style={{ fontSize: 10, color: g.checkedIn ? "var(--green)" : "var(--dim)", fontWeight: 600 }}>
                {g.checkedIn ? "Ingresó" : "Pendiente"}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
}

/* ── LISTA TAB ── */
function GuestListTab({ guestlist, setGuestlist, events }) {
  const [query, setQuery]             = useState("");
  const [filter, setFilter]           = useState("todos");
  const [eventFilter, setEventFilter] = useState("todos");
  const [showAdd, setShowAdd]         = useState(false);
  const [toDelete, setToDelete]       = useState(null);

  const filtered = guestlist.filter(g => {
    const q = query.toLowerCase();
    const matchQ      = !q || g.name.toLowerCase().includes(q) || g.dni.includes(q) || g.motivo.toLowerCase().includes(q);
    const matchStatus = filter === "todos" || (filter === "ingresaron" ? g.checkedIn : !g.checkedIn);
    const matchEvent  = eventFilter === "todos" || g.eventId === eventFilter;
    return matchQ && matchStatus && matchEvent;
  });

  const inCount = guestlist.filter(g => g.checkedIn).length;
  const totalPersonas = guestlist.reduce((s, g) => s + 1 + g.plus, 0);

  function toggle(g) {
    toggleGuestCheckin(g.id, g.checkedIn);
  }

  async function remove(id) {
    await removeGuest(id);
    setToDelete(null);
  }

  const motivoColors = {
    Prensa: { bg: "rgba(96,165,250,.12)", color: "#60a5fa" },
    Staff:  { bg: "rgba(167,139,250,.12)", color: "#a78bfa" },
    Artista:{ bg: "rgba(74,222,128,.12)",  color: "#4ade80" },
    Sponsor:{ bg: "rgba(251,191,36,.12)",  color: "#fbbf24" },
    "Invitado VIP": { bg: "rgba(251,146,60,.12)", color: "#fb923c" },
  };

  return (
    <>
      <div className="search-wrap" style={{ top: 106 }}>
        <div style={{ position: "relative" }}>
          <span className="search-ico">🔍</span>
          <input className="search-inp" placeholder="Buscar por nombre, DNI, motivo…"
            value={query} onChange={e => setQuery(e.target.value)} />
        </div>
        {/* Filtro estado */}
        <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
          {[["todos","Todos"],["ingresaron","Ingresaron"],["pendientes","Pendientes"]].map(([key, label]) => (
            <button key={key} onClick={() => setFilter(key)} style={{
              padding: "6px 14px", borderRadius: 100, border: "1px solid",
              borderColor: filter === key ? "var(--accent)" : "var(--border)",
              background:  filter === key ? "var(--accent-bg)" : "transparent",
              color:       filter === key ? "var(--accent)" : "var(--dim)",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
              fontFamily: "var(--ff)", transition: "all .15s",
            }}>{label}</button>
          ))}
        </div>
        {/* Filtro por evento */}
        <div style={{ display: "flex", gap: 8, marginTop: 8, overflowX: "auto", paddingBottom: 2 }}>
          <button onClick={() => setEventFilter("todos")} style={{
            padding: "5px 12px", borderRadius: 100, border: "1px solid", whiteSpace: "nowrap",
            borderColor: eventFilter === "todos" ? "var(--white)" : "var(--border)",
            background:  eventFilter === "todos" ? "rgba(255,255,255,.1)" : "transparent",
            color:       eventFilter === "todos" ? "var(--white)" : "var(--dim)",
            fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--ff)",
          }}>Todos los eventos</button>
          {events.map(ev => (
            <button key={ev.id} onClick={() => setEventFilter(ev.id)} style={{
              padding: "5px 12px", borderRadius: 100, border: "1px solid", whiteSpace: "nowrap",
              borderColor: eventFilter === ev.id ? "var(--white)" : "var(--border)",
              background:  eventFilter === ev.id ? "rgba(255,255,255,.1)" : "transparent",
              color:       eventFilter === ev.id ? "var(--white)" : "var(--dim)",
              fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--ff)",
            }}>{ev.emoji} {ev.artist.split(" ")[0]} · {ev.day}/{ev.month}</button>
          ))}
        </div>
      </div>

      {/* Counter strip + add button */}
      <div style={{ padding: "10px 18px 2px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 12, color: "var(--dim)", fontWeight: 600 }}>
          {guestlist.length} personas · {totalPersonas} total con acomp.
        </div>
        <button onClick={() => setShowAdd(true)} style={{
          padding: "6px 14px", borderRadius: 100,
          border: "1px solid var(--accent-border)",
          background: "var(--accent-bg)", color: "var(--accent)",
          fontSize: 12, fontWeight: 700, cursor: "pointer",
          fontFamily: "var(--ff)",
        }}>＋ Agregar</button>
      </div>

      {filtered.length === 0 && guestlist.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">📋</div>
          La lista está vacía.<br />
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }}
            onClick={() => setShowAdd(true)}>Agregá el primero →</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty">
          <div className="empty-ico">🔍</div>
          Sin resultados para los filtros seleccionados.
        </div>
      ) : (
        filtered.map(g => {
          const mc = motivoColors[g.motivo] || { bg: "var(--surface3)", color: "var(--dim)" };
          const ev = events.find(e => e.id === g.eventId);
          return (
            <div key={g.id} className="gl-item">
              <div className="avatar">{initials(g.name)}</div>
              <div className="gl-body">
                <div className="gl-name">{g.name}</div>
                <div className="gl-meta">
                  <span>DNI {g.dni}</span>
                  {g.plus > 0 && (
                    <span className="gl-plus">+{g.plus} acomp.</span>
                  )}
                  {g.motivo && (
                    <span style={{
                      background: mc.bg, color: mc.color,
                      borderRadius: 100, padding: "2px 8px",
                      fontSize: 10, fontWeight: 700,
                    }}>{g.motivo}</span>
                  )}
                </div>
                {ev && (
                  <div style={{
                    marginTop: 5, display: "inline-flex", alignItems: "center", gap: 5,
                    background: "var(--surface3)", borderRadius: 100,
                    padding: "3px 10px", fontSize: 10, fontWeight: 700, color: "var(--dim)",
                  }}>
                    <span>{ev.emoji}</span><span>{ev.artist} · {ev.day} {ev.month}</span>
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
                <button
                  className={`check-btn ${g.checkedIn ? "in" : "out"}`}
                  onClick={() => toggle(g.id)}
                >{g.checkedIn ? "✓" : ""}</button>
                <div style={{ fontSize: 10, color: g.checkedIn ? "var(--green)" : "var(--dim)", fontWeight: 600 }}>
                  {g.checkedIn ? "Ingresó" : "Pendiente"}
                </div>
                <button onClick={() => setToDelete(g)} style={{
                  background: "none", border: "none", cursor: "pointer",
                  color: "var(--red)", fontSize: 14, padding: 0, lineHeight: 1,
                }}>✕</button>
              </div>
            </div>
          );
        })
      )}

      {showAdd && (
        <AddToListSheet
          onClose={() => setShowAdd(false)}
          onSave={entry => setGuestlist(prev => [entry, ...prev])}
          events={events}
        />
      )}

      {toDelete && (
        <div className="overlay" onClick={() => setToDelete(null)}>
          <div className="sheet" onClick={e => e.stopPropagation()}>
            <div className="sheet-handle" />
            <div className="sheet-inner" style={{ textAlign: "center" }}>
              <div style={{
                width: 56, height: 56, borderRadius: "50%",
                background: "var(--red-bg)", border: "1px solid rgba(248,113,113,.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 24, margin: "0 auto 18px",
              }}>🗑</div>
              <div style={{ fontSize: 20, fontWeight: 900, marginBottom: 8, letterSpacing: "-.3px" }}>
                ¿Eliminar invitado?
              </div>
              <div style={{ fontSize: 14, color: "var(--off)", marginBottom: 6, lineHeight: 1.5 }}>
                Vas a eliminar a <strong style={{ color: "var(--white)" }}>{toDelete.name}</strong>
                {" "}de la lista.
              </div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginBottom: 28 }}>
                Esta acción no se puede deshacer.
              </div>
              <button
                onClick={() => remove(toDelete.id)}
                style={{
                  width: "100%", padding: "15px", borderRadius: "var(--r)",
                  border: "none", fontFamily: "var(--ff)", fontSize: 15, fontWeight: 800,
                  background: "var(--red)", color: "#fff",
                  cursor: "pointer", marginBottom: 10,
                }}
              >
                Sí, eliminar
              </button>
              <button className="sheet-btn ghost" onClick={() => setToDelete(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── INVITADOS (shell con tabs) ── */
function Guests({ guests, setGuests, guestlist, setGuestlist, events }) {
  const [activeTab, setActiveTab] = useState("compradores");
  const buyerIn = guests.filter(g => g.checkedIn).length;
  const listIn  = guestlist.filter(g => g.checkedIn).length;

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title">Invitados</div>
        <div style={{ fontSize: 12, color: "var(--off)", fontWeight: 600 }}>
          {buyerIn + listIn} ingresaron
        </div>
      </div>
      <div className="inner-tabs">
        <button className={`inner-tab ${activeTab === "compradores" ? "active" : ""}`} onClick={() => setActiveTab("compradores")}>
          Compradores ({guests.length})
        </button>
        <button className={`inner-tab ${activeTab === "lista" ? "active" : ""}`} onClick={() => setActiveTab("lista")}>
          Lista ({guestlist.length})
        </button>
      </div>
      {activeTab === "compradores"
        ? <BuyersTab guests={guests} setGuests={setGuests} />
        : <GuestListTab guestlist={guestlist} setGuestlist={setGuestlist} events={events} />
      }
    </div>
  );
}

/* ── SCANNER ── */
function Scanner({ guests, setGuests }) {
  const [result, setResult] = useState(null);
  const [manualCode, setManualCode] = useState("");
  const [showManual, setShowManual] = useState(false);

  async function scanCode(code) {
    const result = await scanQR(code.trim(), buyers);
    if (!result.ok) {
      if (result.reason === "already_in") {
        setResult({ ok: false, title: "Ya ingresó", name: result.buyer.name, sub: `${result.buyer.ticket} · ${result.buyer.hash}` });
      } else {
        setResult({ ok: false, title: "QR inválido", name: "Código no encontrado", sub: code });
      }
      return;
    }
    setResult({ ok: true, title: "✓ Acceso válido", name: result.buyer.name, sub: `${result.buyer.ticket} · ${result.buyer.hash}` });
  }

  function tryManual() {
    if (manualCode.trim()) {
      scanCode(manualCode);
      setManualCode("");
      setShowManual(false);
    }
  }

  const mockCodes = guests.filter(g => !g.checkedIn).slice(0, 3).map(g => g.hash);

  return (
    <div className="screen">
      <div className="topbar">
        <div className="topbar-title">Scanner QR</div>
        <div style={{ fontSize: 12, color: "var(--green)", fontWeight: 700 }}>
          ● EN VIVO
        </div>
      </div>

      <div className="scanner-wrap">
        {result ? (
          <>
            <div className={`scan-result ${result.ok ? "ok" : "error"}`} style={{ width: "100%" }}>
              <div className="scan-result-title">{result.title}</div>
              <div className="scan-result-name">{result.name}</div>
              <div className="scan-result-sub">{result.sub}</div>
            </div>
            <button
              className="btn-primary"
              style={{ marginBottom: 12 }}
              onClick={() => setResult(null)}
            >
              Escanear siguiente
            </button>
          </>
        ) : (
          <>
            <div className="scanner-box">
              <div className="scanner-corner sc-tl" />
              <div className="scanner-corner sc-tr" />
              <div className="scanner-corner sc-bl" />
              <div className="scanner-corner sc-br" />
              <div className="scan-line" />
              <div className="scanner-icon">⬛</div>
            </div>
            <div className="scanner-status">
              Apuntá la cámara al código QR de la entrada.<br />El código se valida automáticamente.
            </div>
          </>
        )}

        {/* Simulated scan buttons (demo) */}
        {!result && (
          <div style={{ width: "100%", marginTop: 28 }}>
            <div style={{ fontSize: 11, color: "var(--dim)", textAlign: "center", marginBottom: 14, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
              Demo — simular scan
            </div>
            {mockCodes.map(code => (
              <button
                key={code}
                className="manual-btn"
                style={{ width: "100%", marginBottom: 8, textAlign: "left" }}
                onClick={() => scanCode(code)}
              >
                Escanear {code}
              </button>
            ))}
            <button
              className="manual-btn"
              style={{ width: "100%", marginBottom: 8 }}
              onClick={() => scanCode("hmac_invalido")}
            >
              Simular QR inválido
            </button>
            <button
              className="manual-btn"
              style={{ width: "100%", marginTop: 8 }}
              onClick={() => setShowManual(true)}
            >
              Ingresar código manual
            </button>
          </div>
        )}
      </div>

      {/* Manual input overlay */}
      {showManual && (
        <div className="overlay" onClick={e => e.target === e.currentTarget && setShowManual(false)}>
          <div className="sheet">
            <div className="sheet-handle" />
            <div className="sheet-inner">
              <div className="sheet-title">Código manual</div>
              <div className="field">
                <label>Hash del ticket</label>
                <input
                  className="field input"
                  placeholder="hmac_..."
                  value={manualCode}
                  onChange={e => setManualCode(e.target.value)}
                  style={{
                    width: "100%", padding: "13px 16px",
                    background: "var(--surface2)", border: "1px solid var(--border)",
                    borderRadius: "var(--r-sm)", color: "var(--white)",
                    fontFamily: "var(--ff)", fontSize: 15, outline: "none",
                  }}
                  onKeyDown={e => e.key === "Enter" && tryManual()}
                  autoFocus
                />
              </div>
              <button className="sheet-btn" onClick={tryManual} disabled={!manualCode.trim()}>
                Validar
              </button>
              <button className="sheet-btn ghost" onClick={() => setShowManual(false)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ── SHARED FORM FIELDS (used by Create & Edit) ── */
const INP = { width:"100%", padding:"13px 16px", background:"var(--surface2)", border:"1px solid var(--border)", borderRadius:"var(--r-sm)", color:"var(--white)", fontFamily:"var(--ff)", fontSize:15, outline:"none" };
const INP_SM = { ...INP, padding:"11px 14px", background:"var(--surface3)", fontSize:14 };
const MONTHS = ["ENE","FEB","MAR","ABR","MAY","JUN","JUL","AGO","SEP","OCT","NOV","DIC"];
const PRESET_TYPES = ["Anticipada","General","VIP"];
const PALETTE = [
  { color1: "#1a0533", color2: "#6b21a8", color3: "#c084fc" },
  { color1: "#1c0a00", color2: "#9a3412", color3: "#fb923c" },
  { color1: "#0a0f1a", color2: "#1e3a5f", color3: "#60a5fa" },
  { color1: "#0d1f0d", color2: "#15532e", color3: "#4ade80" },
];
const DEFAULT_EMOJIS = ["🎵","🎧","🎶","🎭","🎸","🎤","🎛️","🥁"];

function EventForm({ form, setForm, onSubmit, onCancel, submitLabel }) {
  const fileRef = useRef(null);

  function setF(k, v) { setForm(p => ({ ...p, [k]: v })); }
  function setTT(i, k, v) {
    setForm(p => {
      const types = [...p.types];
      types[i] = { ...types[i], [k]: v };
      return { ...p, types };
    });
  }
  function addTT(name = "") {
    setForm(p => ({ ...p, types: [...p.types, { name, price: "", total: "" }] }));
  }
  function delTT(i) {
    setForm(p => ({ ...p, types: p.types.filter((_, idx) => idx !== i) }));
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setF("photo", ev.target.result);
    reader.readAsDataURL(file);
  }

  const valid = form.artist && form.venue && form.day && form.month && form.time &&
    form.types.every(t => t.name && t.price && t.total);

  // Which preset names are already used
  const usedNames = form.types.map(t => t.name);

  return (
    <>
      {/* FOTO / FLYER */}
      <div className="field">
        <label>Imagen del evento (flyer / banner)</label>
        <div
          onClick={() => fileRef.current.click()}
          style={{
            width: "100%", height: 120, borderRadius: "var(--r-sm)",
            border: "1px dashed var(--border2)", background: "var(--surface2)",
            display: "flex", flexDirection: "column", alignItems: "center",
            justifyContent: "center", cursor: "pointer", overflow: "hidden",
            position: "relative", transition: "border-color .15s",
          }}
        >
          {form.photo ? (
            <>
              <img src={form.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover" }} />
              <div style={{
                position:"absolute", inset:0, background:"rgba(0,0,0,.45)",
                display:"flex", alignItems:"center", justifyContent:"center",
                opacity:0, transition:"opacity .15s",
              }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0}
              >
                <span style={{ fontSize:13, fontWeight:700, color:"#fff" }}>Cambiar imagen</span>
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize:28, marginBottom:8 }}>🖼</div>
              <div style={{ fontSize:13, color:"var(--dim)", fontWeight:600 }}>Tocá para subir imagen</div>
              <div style={{ fontSize:11, color:"var(--dim)", marginTop:3 }}>JPG, PNG o WEBP</div>
            </>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handlePhoto} />
        {form.photo && (
          <button onClick={() => setF("photo", null)} style={{
            marginTop:8, background:"none", border:"none", cursor:"pointer",
            color:"var(--red)", fontSize:12, fontWeight:700, padding:0,
          }}>✕ Quitar imagen</button>
        )}
      </div>

      <div className="field">
        <label>Artista / nombre</label>
        <input style={INP} placeholder="Nombre del evento" value={form.artist} onChange={e => setF("artist", e.target.value)} />
      </div>

      <div className="field">
        <label>Género / tag</label>
        <input style={INP} placeholder="ej. Electrónica · Rock" value={form.tag} onChange={e => setF("tag", e.target.value)} />
      </div>

      <div className="form-row">
        <div className="field">
          <label>Lugar</label>
          <input style={INP} placeholder="Club Niceto" value={form.venue} onChange={e => setF("venue", e.target.value)} />
        </div>
        <div className="field">
          <label>Ciudad</label>
          <input style={INP} placeholder="CABA" value={form.city} onChange={e => setF("city", e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label>Día</label>
          <input style={INP} placeholder="28" type="number" min="1" max="31"
            value={form.day} onChange={e => setF("day", e.target.value)} />
        </div>
        <div className="field">
          <label>Mes</label>
          <select style={INP} value={form.month} onChange={e => setF("month", e.target.value)}>
            <option value="">Mes</option>
            {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="field">
          <label>Apertura</label>
          <input style={INP} placeholder="20:00" value={form.doors} onChange={e => setF("doors", e.target.value)} />
        </div>
        <div className="field">
          <label>Show</label>
          <input style={INP} placeholder="21:00" value={form.time} onChange={e => setF("time", e.target.value)} />
        </div>
      </div>

      {/* TIPOS DE ENTRADA */}
      <div style={{ marginTop: 8, marginBottom: 8 }}>
        <div style={{ fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", color:"var(--dim)", marginBottom:10 }}>
          Tipos de entrada
        </div>

        {/* Preset quick-add pills */}
        <div style={{ display:"flex", gap:8, marginBottom:14, flexWrap:"wrap" }}>
          {PRESET_TYPES.map(name => {
            const already = usedNames.includes(name);
            return (
              <button
                key={name}
                disabled={already}
                onClick={() => addTT(name)}
                style={{
                  padding:"7px 16px", borderRadius:100,
                  border:"1px solid",
                  borderColor: already ? "var(--border)" : "var(--accent-border)",
                  background: already ? "transparent" : "var(--accent-bg)",
                  color: already ? "var(--dim)" : "var(--accent)",
                  fontSize:12, fontWeight:700, cursor: already ? "not-allowed" : "pointer",
                  fontFamily:"var(--ff)", opacity: already ? .45 : 1,
                  transition:"all .15s",
                }}
              >
                {already ? "✓ " : "＋ "}{name}
              </button>
            );
          })}
        </div>

        {form.types.map((t, i) => (
          <div key={i} className="tt-editor">
            <div className="tt-editor-head">
              <div className="tt-editor-name">{t.name || `Tipo ${i + 1}`}</div>
              {form.types.length > 1 && (
                <button className="tt-del-btn" onClick={() => delTT(i)}>✕</button>
              )}
            </div>
            <div className="field">
              <label>Nombre</label>
              <input style={INP_SM} placeholder="Anticipada / General / VIP / Platea…"
                value={t.name} onChange={e => setTT(i, "name", e.target.value)} />
            </div>
            <div className="form-row">
              <div className="field">
                <label>Precio (ARS)</label>
                <input style={INP_SM} placeholder="9500" type="number"
                  value={t.price} onChange={e => setTT(i, "price", e.target.value)} />
              </div>
              <div className="field">
                <label>Capacidad</label>
                <input style={INP_SM} placeholder="250" type="number"
                  value={t.total} onChange={e => setTT(i, "total", e.target.value)} />
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => addTT()} style={{
          width:"100%", padding:"12px", borderRadius:"var(--r-sm)",
          border:"1px dashed var(--border2)", background:"transparent",
          color:"var(--accent)", fontFamily:"var(--ff)", fontSize:13,
          fontWeight:700, cursor:"pointer",
        }}>
          ＋ Otro tipo personalizado
        </button>
      </div>

      <button className="sheet-btn" disabled={!valid} onClick={onSubmit}>
        {submitLabel}
      </button>
      <button className="sheet-btn ghost" onClick={onCancel}>Cancelar</button>
    </>
  );
}

/* ── CREATE EVENT SHEET ── */
function CreateEventSheet({ onClose, onSave }) {
  const [form, setForm] = useState({
    artist: "", venue: "", city: "", day: "", month: "", year: "2025",
    time: "", doors: "", tag: "", photo: null,
    types: [],
  });

  async function save() {
    const c = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const emoji = DEFAULT_EMOJIS[Math.floor(Math.random() * DEFAULT_EMOJIS.length)];
    const newEvent = {
      ...form, ...c, emoji,
      types: form.types.map((t, i) => ({
        id: `t${Date.now()}${i}`, name: t.name,
        price: Number(t.price), sold: 0, total: Number(t.total),
      })),
    };
    await createEvent(newEvent);
    onClose();
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-inner">
          <div className="sheet-title">Nuevo evento</div>
          <EventForm
            form={form} setForm={setForm}
            onSubmit={save} onCancel={onClose}
            submitLabel="Crear evento"
          />
        </div>
      </div>
    </div>
  );
}

/* ── EDIT EVENT SHEET ── */
function EditEventSheet({ ev, onClose, onSave }) {
  const [form, setForm] = useState({
    artist: ev.artist, venue: ev.venue, city: ev.city,
    day: ev.day, month: ev.month, year: ev.year,
    time: ev.time, doors: ev.doors, tag: ev.tag,
    photo: ev.photo || null,
    types: ev.types.map(t => ({ name: t.name, price: String(t.price), total: String(t.total), id: t.id, sold: t.sold })),
  });

  async function save() {
    const updated = {
      ...ev, ...form,
      types: form.types.map((t, i) => ({
        id: t.id || `t${Date.now()}${i}`,
        name: t.name,
        price: Number(t.price),
        sold: t.sold ?? 0,
        total: Number(t.total),
      })),
    };
    await updateEvent(ev.id, updated);
    onClose();
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-inner">
          <div className="sheet-title">Editar evento</div>
          <EventForm
            form={form} setForm={setForm}
            onSubmit={save} onCancel={onClose}
            submitLabel="Guardar cambios"
          />
        </div>
      </div>
    </div>
  );
}

/* ── EVENT DETAIL SHEET ── */
function EventDetailSheet({ ev, onClose, onEdit }) {
  const sold     = ev.types.reduce((s, t) => s + t.sold, 0);
  const capacity = ev.types.reduce((s, t) => s + t.total, 0);
  const revenue  = ev.types.reduce((s, t) => s + t.sold * t.price, 0);

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-inner">
          {/* Header image or gradient fallback */}
          <div style={{
            height: 140, borderRadius: 14, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 60, marginBottom: 20, position: "relative",
            background: `radial-gradient(ellipse at 60% 40%, ${ev.color3}55, ${ev.color2} 55%, ${ev.color1})`,
          }}>
            {ev.photo
              ? <img src={ev.photo} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", position:"absolute", inset:0 }} />
              : ev.emoji
            }
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ fontSize:10, color:"var(--dim)", fontWeight:600, textTransform:"uppercase", letterSpacing:1 }}>{ev.tag}</div>
          </div>
          <div className="sheet-title" style={{ marginBottom: 4 }}>{ev.artist}</div>
          <div style={{ fontSize:13, color:"var(--off)", marginBottom: 20 }}>{ev.venue} · {ev.city}</div>

          {[
            { ico:"📅", lbl:"Fecha", val:`${ev.day} de ${ev.month} de ${ev.year}`, sub:`Puertas: ${ev.doors} hs` },
            { ico:"⏰", lbl:"Horario", val:`${ev.time} hs`, sub:"Duración estimada: 2:30 hs" },
            { ico:"🎟", lbl:"Vendidas / Capacidad", val:`${sold} / ${capacity}`, sub:`${Math.round((sold/capacity)*100)}% ocupado` },
            { ico:"💰", lbl:"Ingresos", val:fmt(revenue), sub:"Neto antes de comisión" },
          ].map((d, i) => (
            <div key={i} className="detail-stat">
              <div className="detail-ico">{d.ico}</div>
              <div className="detail-body">
                <div className="detail-lbl">{d.lbl}</div>
                <div className="detail-val">{d.val}</div>
                {d.sub && <div className="detail-sub">{d.sub}</div>}
              </div>
            </div>
          ))}

          <div style={{ marginTop: 16 }}>
            {ev.types.map(t => {
              const pct = Math.round((t.sold / t.total) * 100);
              return (
                <div key={t.id} style={{ marginBottom: 14 }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:13, fontWeight:700 }}>{t.name}</span>
                    <span style={{ fontSize:13, color:"var(--off)" }}>{t.sold}/{t.total} · {fmt(t.price)}</span>
                  </div>
                  <div className="prog-track">
                    <div className={`prog-fill ${pct > 80 ? "orange" : "green"}`} style={{ width:`${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Edit + Close buttons */}
          <button className="sheet-btn ghost" style={{ marginTop: 20 }} onClick={onEdit}>
            ✏️ Editar evento
          </button>
          <button className="sheet-btn" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

/* ════════════════ LOGIN ════════════════ */
function Login({ onLogin }) {
  const [email, setEmail]     = useState("");
  const [pass, setPass]       = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function submit() {
    if (!email || !pass) return;
    setLoading(true); setError("");
    try {
      await login(email, pass);
      onLogin();
    } catch (err) {
      setError("Email o contraseña incorrectos.");
      setLoading(false);
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-logo">Fluxo</div>
      <div className="login-sub">Staff & Organizadores</div>

      <div className="login-card">
        <div className="login-title">Iniciá sesión</div>
        <div className="login-hint">Accedé con tu cuenta de organizador</div>

        {error && <div className="login-error">{error}</div>}

        <div className="field">
          <label>Email</label>
          <input
            type="email" placeholder="tu@email.com"
            value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>
        <div className="field" style={{ marginBottom: 22 }}>
          <label>Contraseña</label>
          <input
            type="password" placeholder="••••••••"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && submit()}
          />
        </div>

        <button className="btn-primary" onClick={submit} disabled={loading || !email || !pass}>
          {loading ? "Ingresando…" : "Ingresar"}
        </button>
      </div>

      <div style={{ marginTop: 20, fontSize: 12, color: "var(--dim)", textAlign: "center" }}>
        Demo: carlos@fluxo.ar / fluxo123
      </div>
    </div>
  );
}

/* ════════════════ APP SHELL ════════════════ */
const NAV_ITEMS = [
  {
    key: "dashboard", label: "Inicio",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>,
  },
  {
    key: "sales", label: "Ventas",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  },
  {
    key: "guests", label: "Invitados",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  },
  {
    key: "scanner", label: "Scanner",
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 9V5a2 2 0 0 1 2-2h4"/><path d="M21 9V5a2 2 0 0 0-2-2h-4"/><path d="M3 15v4a2 2 0 0 0 2 2h4"/><path d="M21 15v4a2 2 0 0 1-2 2h-4"/><line x1="7" y1="12" x2="7" y2="12.01"/><line x1="12" y1="12" x2="17" y2="12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>,
  },
];

export default function App() {
  const [loggedIn, setLoggedIn]           = useState(false);
  const [tab, setTab]                     = useState("dashboard");
  const { events } = useEvents();
  const buyers = useBuyers();
  const guestlist = useGuestlist();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editingEvent, setEditingEvent]   = useState(null);
  const [showCreate, setShowCreate]       = useState(false);

  if (!loggedIn) return (
    <>
      <style>{CSS}</style>
      <Login onLogin={() => setLoggedIn(true)} />
    </>
  );

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background: "var(--bg)", minHeight: "100vh", maxWidth: 430, margin: "0 auto", position: "relative" }}>

        {tab === "dashboard" && (
          <Dashboard
            events={events}
            onEventClick={ev => setSelectedEvent(ev)}
            onCreateEvent={() => setShowCreate(true)}
          />
        )}
        {tab === "sales"   && <Sales events={events} />}
        {tab === "guests"  && <Guests guests={guests} setGuests={setGuests} guestlist={guestlist} setGuestlist={setGuestlist} events={events} />}
        {tab === "scanner" && <Scanner guests={guests} setGuests={setGuests} />}

        {/* Modals */}
        {selectedEvent && (
          <EventDetailSheet
            ev={selectedEvent}
            onClose={() => setSelectedEvent(null)}
            onEdit={() => { setEditingEvent(selectedEvent); setSelectedEvent(null); }}
          />
        )}
        {editingEvent && (
          <EditEventSheet
            ev={editingEvent}
            onClose={() => setEditingEvent(null)}
            onSave={updated => {
              setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
              setEditingEvent(null);
            }}
          />
        )}
        {showCreate && (
          <CreateEventSheet
            onClose={() => setShowCreate(false)}
            onSave={ev => setEvents(prev => [ev, ...prev])}
          />
        )}

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`nav-tab ${tab === item.key ? "active" : ""}`}
              onClick={() => setTab(item.key)}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
