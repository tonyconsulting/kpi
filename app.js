/* Kairós KPI — front v2 (shell Kairós complet). Lien secret ?c=CODE. */
"use strict";
const API = "https://gwococcxzrrtadtricnd.supabase.co/functions/v1/kpi";
const CLE_LS = "kpi_code";
const VAPID_PUB = "BBefpGJrlJu2jhuahy0XnidzpnE5nfZ84kRh3YueXISXD036WLlbQu50vebuJcKKiF05xz5Cj_C__Qa8wc_YWNQ";
const FIN_MOIS = "2026-09-30";
const PTS = { vmens: 300, v12: 660, passage: 150 };
const HYP = { fille: { lead: 0.5, chaud: 0.5, close: 1 / 3 }, gars: { rep: 0.34, redi: 0.42, set: 0.5, close: 1 / 3 } };
const COULEURS_AVI = ["#a78bfa", "#34d399", "#f472b6", "#60a5fa", "#fbbf24", "#f87171", "#2dd4bf", "#c084fc", "#fb923c"];

const CHAMPS_UI = {
  fille: [
    ["conversations", "Conversations ouvertes", "DMs, réponses stories, commentaires"],
    ["leads", "Leads", "des gens qui te répondent"],
    ["chauds", "Leads chauds", "de vraies questions d'intérêt"],
    ["vmens", "Ventes mensuelles", "packs 1 mois — 300 pts"],
    ["v12", "Ventes 12 mois", "compte double — 660 pts"],
    ["autres_pts", "Autres packs (en points)", "Pro 150 · Premium 230 · Pro an 530 · Prem. an 600"],
    ["passages", "Passages de position", "150 pts chacun"],
    ["renouv_pts", "Renouvellements (en points)", "mois 2 : 95 · m3 : 85 · m4 : 75 · m5 : 65 · m6+ : 50"],
    ["contenus", "Contenus postés", "stories + posts + vidéos"],
  ],
  gars: [
    ["dms", "DMs envoyés", "plancher : 200 par jour"],
    ["fu", "Follow-ups", "plancher : 25 par jour"],
    ["reponses", "Réponses reçues", ""],
    ["redis", "Redirigés", "amenés sur le compte / l'offre"],
    ["settes", "Settés", "rendez-vous posés"],
    ["vmens", "Ventes mensuelles", "packs 1 mois — 300 pts"],
    ["v12", "Ventes 12 mois", "compte double — 660 pts"],
    ["autres_pts", "Autres packs (en points)", "Pro 150 · Premium 230 · Pro an 530 · Prem. an 600"],
    ["passages", "Passages de position", "150 pts chacun"],
    ["renouv_pts", "Renouvellements (en points)", "mois 2 : 95 · m3 : 85 · m4 : 75 · m5 : 65 · m6+ : 50"],
  ],
  leader: [
    ["vmens", "Ventes perso mensuelles", "300 pts"],
    ["v12", "Ventes perso 12 mois", "compte double — 660 pts"],
    ["autres_pts", "Autres packs (en points)", ""],
    ["passages", "Passages de position", "150 pts chacun"],
    ["renouv_pts", "Renouvellements (en points)", "mois 2 : 95 · m3 : 85 · m4 : 75 · m5 : 65 · m6+ : 50"],
    ["pts_b1", "Points branche 1 (relevé du jour)", "le total affiché dans ton back-office"],
    ["pts_b2", "Points branche 2 (relevé du jour)", ""],
  ],
};
const COLS_HIST = {
  fille: [["conversations", "Conv."], ["leads", "Leads"], ["chauds", "Chauds"], ["vmens", "V. mens"], ["v12", "V. 12m"], ["passages", "Pass."], ["renouv_pts", "Renouv."], ["contenus", "Contenus"]],
  gars: [["dms", "DMs"], ["fu", "FU"], ["reponses", "Rép."], ["redis", "Redi"], ["settes", "Settés"], ["vmens", "V. mens"], ["v12", "V. 12m"], ["passages", "Pass."], ["renouv_pts", "Renouv."]],
  leader: [["vmens", "V. mens"], ["v12", "V. 12m"], ["passages", "Pass."], ["renouv_pts", "Renouv."], ["pts_b1", "Branche 1"], ["pts_b2", "Branche 2"]],
};

const SVG = {
  jour: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  saisie: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  histo: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M7 21V10M12 21V4M17 21v-7"/></svg>',
  equipe: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.5 3-5.5 6.5-5.5s6.5 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7"/><path d="M18 14.7c2.1.7 3.5 2.3 3.5 5.3"/></svg>',
  reglages: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.7 1.7 0 0 0 1.87.34h.09a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>',
  lien: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
  flamme: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3 1.1-2.2 2.8-3.5 5-4 0 2.5 1.5 3.5 2.5 5a7 7 0 1 1-11.4 3.2"/></svg>',
};

let CODE = null, MOI = null, PARAMS = {}, MEMBRES = null, SAISIES = [], PAGE = null, JOUR_RENDU = null, PARTIE = "mlm", SOUS_KPI = "prod";

/* ================== utilitaires ================== */
const $ = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function toast(msg, err) {
  let t = $("#toastg");
  if (!t) { t = document.createElement("div"); t.id = "toastg"; t.className = "toast-g"; document.body.appendChild(t); }
  t.textContent = msg; t.classList.toggle("err", !!err);
  requestAnimationFrame(() => t.classList.add("on"));
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("on"), 2800);
}
function busy(btn, on) { if (btn) { btn.classList.toggle("busy", !!on); btn.disabled = !!on; } }
function initiale(p) { return (p || "?").trim().charAt(0).toUpperCase(); }
function couleurAvi(id) { let h = 0; for (const c of String(id)) h = (h * 31 + c.charCodeAt(0)) >>> 0; return COULEURS_AVI[h % COULEURS_AVI.length]; }
function aviHTML(id, prenom, taille) {
  const t = taille || 20;
  return `<span class="avi" style="width:${t}px;height:${t}px;font-size:${Math.round(t * 0.48)}px;background:${couleurAvi(id)}22;color:${couleurAvi(id)}">${esc(initiale(prenom))}</span>`;
}
function parisMaintenant() {
  const f = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  const p = {}; for (const x of f.formatToParts(new Date())) p[x.type] = x.value;
  return { jour: `${p.year}-${p.month}-${p.day}`, heure: `${p.hour}:${p.minute}` };
}
function joursRestants(depuis) {
  const a = new Date(depuis + "T12:00:00Z"), b = new Date(FIN_MOIS + "T12:00:00Z");
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
function joliJour(iso) {
  const d = new Date(iso + "T12:00:00Z");
  const s = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function joliHeure(ts) {
  try { return new Date(ts).toLocaleTimeString("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }); } catch { return ""; }
}
function ptsJour(d) { return (+d.vmens || 0) * PTS.vmens + (+d.v12 || 0) * PTS.v12 + (+d.passages || 0) * PTS.passage + (+d.renouv_pts || 0) + (+d.autres_pts || 0); }
function ventesJour(d) { return (+d.vmens || 0) + (+d.v12 || 0); }
async function api(corps) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: CODE, ...corps }) });
  const j = await r.json().catch(() => ({ erreur: "réseau" }));
  if (!r.ok) throw new Error(j.erreur || "erreur");
  return j;
}

/* ================== calculs ================== */
function totaux(saisies) {
  const t = {};
  for (const s of saisies) for (const [k, v] of Object.entries(s.d || {})) if (k !== "pts_b1" && k !== "pts_b2") t[k] = (t[k] || 0) + (+v || 0);
  t._pts = saisies.reduce((a, s) => a + ptsJour(s.d || {}), 0);
  t._ventes = saisies.reduce((a, s) => a + ventesJour(s.d || {}), 0);
  return t;
}
function ratios(type, t) {
  if (type === "gars") return {
    rep: t.dms > 0 && (t.reponses || 0) > 0 ? t.reponses / t.dms : HYP.gars.rep,
    redi: (t.reponses || 0) > 0 && (t.redis || 0) > 0 ? t.redis / t.reponses : HYP.gars.redi,
    set: (t.redis || 0) > 0 && (t.settes || 0) > 0 ? t.settes / t.redis : HYP.gars.set,
    close: (t.settes || 0) > 0 && t._ventes > 0 ? t._ventes / t.settes : HYP.gars.close,
    mesure: t.dms > 0,
  };
  return {
    lead: (t.conversations || 0) > 0 && (t.leads || 0) > 0 ? t.leads / t.conversations : HYP.fille.lead,
    chaud: (t.leads || 0) > 0 && (t.chauds || 0) > 0 ? t.chauds / t.leads : HYP.fille.chaud,
    close: (t.chauds || 0) > 0 && t._ventes > 0 ? t._ventes / t.chauds : HYP.fille.close,
    mesure: (t.conversations || 0) > 0,
  };
}
function dose(cfg, saisies, jour) {
  const t = totaux(saisies);
  const restant = Math.max(0, (cfg.cible_pts || 0) - t._pts);
  const jr = joursRestants(jour);
  const ppv = t._ventes > 0 ? ((+t.vmens || 0) * PTS.vmens + (+t.v12 || 0) * PTS.v12 + (+t.autres_pts || 0)) / t._ventes : PTS.vmens;
  const vj = restant / ppv / jr;
  const type = cfg.type || "fille";
  const r = ratios(type, t);
  const garde = (x) => Math.max(0.05, x);
  if (type === "leader") {
    const der = saisies.find((s) => s.d && (s.d.pts_b1 != null || s.d.pts_b2 != null));
    const b1 = der ? +der.d.pts_b1 || 0 : 0, b2 = der ? +der.d.pts_b2 || 0 : 0;
    return { type, restant, jr, t, r,
      principal: { n: `${Math.max(0, 16000 - b1).toLocaleString("fr-FR")} · ${Math.max(0, 16000 - b2).toLocaleString("fr-FR")}`, l: "points restants — branche 1 · branche 2" },
      petits: [[b1.toLocaleString("fr-FR"), "relevé branche 1"], [b2.toLocaleString("fr-FR"), "relevé branche 2"], [t._pts.toLocaleString("fr-FR"), "points perso"]] };
  }
  if (type === "gars") {
    const settes = vj / garde(r.close);
    const redis = settes / garde(r.set);
    const reps = redis / garde(r.redi);
    const dms = Math.max(cfg.plancher_dms || 200, Math.ceil(reps / garde(r.rep)));
    return { type, restant, jr, t, r,
      principal: { n: dms, l: `DMs aujourd'hui + ${cfg.plancher_fu || 25} follow-ups (ton plancher)` },
      petits: [[arr1(reps), "réponses visées"], [arr1(redis), "redirigés visés"], [arr1(settes), "settés visés"], [arr1(vj), "ventes visées"]] };
  }
  const chauds = vj / garde(r.close);
  const leads = chauds / garde(r.chaud);
  const conv = Math.ceil(leads / garde(r.lead));
  return { type, restant, jr, t, r,
    principal: { n: conv, l: "conversations à ouvrir aujourd'hui" },
    petits: [[arr1(leads), "leads visés"], [arr1(chauds), "leads chauds visés"], [arr1(vj), "ventes visées"]] };
}
function arr1(x) { return Math.round(x * 10) / 10; }
function heureLimite(id) {
  const h = PARAMS.heure_limite || { defaut: "21:00", par_membre: {} };
  return (h.par_membre || {})[id] || h.defaut || "21:00";
}
function heureRappel(id) {
  const h = PARAMS.rappel_heure || { defaut: "20:30", par_membre: {} };
  return (h.par_membre || {})[id] || h.defaut || "20:30";
}
function saisieDuJour(saisies, jour) { return saisies.find((s) => s.jour === jour); }
function ventesSemaine(saisies, jourISO) {
  const d = new Date(jourISO + "T12:00:00Z");
  const lundi = new Date(d); lundi.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  const debut = lundi.toISOString().slice(0, 10);
  return saisies.filter((s) => s.jour >= debut && s.jour <= jourISO).reduce((a, s) => a + ventesJour(s.d || {}), 0);
}
function saisiesDe(id) { return SAISIES.filter((s) => s.membre_id === id); }

/* ================== notifications ================== */
function b64ToU8(b64) {
  const pad = "=".repeat((4 - (b64.length % 4)) % 4);
  const raw = atob((b64 + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(raw, (c) => c.charCodeAt(0));
}
async function etatNotifs() {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) return "indispo";
  if (Notification.permission === "denied") return "refuse";
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    const sub = reg && (await reg.pushManager.getSubscription());
    return sub ? "actif" : "inactif";
  } catch { return "indispo"; }
}
async function activeNotifs(btn) {
  busy(btn, true);
  try {
    const perm = await Notification.requestPermission();
    if (perm !== "granted") { toast("Notifications refusées par le téléphone", true); busy(btn, false); return; }
    const reg = await navigator.serviceWorker.register("sw.js");
    await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64ToU8(VAPID_PUB) });
    await api({ action: "push_subscribe", sub: sub.toJSON() });
    await api({ action: "push_test" });
    toast("Rappels activés sur cet appareil ✔");
  } catch (e) { toast("Activation impossible : " + e.message, true); }
  busy(btn, false);
  rendsPage(PAGE);
}
function notifsCarteHTML(etat) {
  const ios = /iPhone|iPad/.test(navigator.userAgent);
  if (etat === "actif") return `<div class="card" style="margin-top:14px"><div class="chart-title">🔔 Rappels activés sur cet appareil — tu recevras une notification le soir si ta journée n'est pas remplie.</div></div>`;
  if (etat === "indispo") return ios ? `<div class="card" style="margin-top:14px"><div class="chart-title">🔔 Pour recevoir les rappels sur iPhone : ajoute d'abord l'app à ton écran d'accueil (Partager → « Sur l'écran d'accueil »), puis reviens activer ici.</div></div>` : "";
  if (etat === "refuse") return `<div class="card" style="margin-top:14px"><div class="chart-title">🔔 Les notifications sont bloquées dans les réglages du téléphone pour cette app.</div></div>`;
  return `<div class="card" style="margin-top:14px">
    <div class="chart-title">Reçois un rappel automatique le soir si ta journée n'est pas remplie.</div>
    <button class="abtn oui" id="btnNotifs">Activer les rappels sur cet appareil</button>
    ${ios ? `<div class="foot" style="margin-top:10px">iPhone : ajoute d'abord l'app sur ton écran d'accueil.</div>` : ""}
  </div>`;
}
async function brancheNotifs(sec) {
  const b = $("#btnNotifs", sec);
  if (b) b.onclick = () => activeNotifs(b);
}

/* ================== shell ================== */
function pagesPour(role) {
  if (PARTIE === "ib") return [["ib", "Tableau IB", SVG.jour]];
  if (role === "admin") return [
    ["equipe", "Équipe", SVG.equipe], ["reglages", "Réglages", SVG.reglages], ["liens", "Liens", SVG.lien],
  ];
  return [["jour", "Ma journée", SVG.jour], ["saisie", "Ma saisie", SVG.saisie], ["kpi", "Mes KPI", SVG.histo]];
}
const TITRES = {
  jour: ["Ma journée", "Ta to-do du jour, elle se sauvegarde toute seule"],
  saisie: ["Ma saisie du soir", "30 secondes chaque soir, c'est le moteur du mois"],
  historique: ["Historique", "Toutes tes journées de septembre"],
  kpi: ["Mes KPI", "Ta prod perso et tes taux de closing"],
  ib: ["Partie IB", "La nouvelle structure arrive"],
  equipe: ["L'équipe", ""],
  reglages: ["Réglages", "Rappel automatique + heure limite, par défaut et par personne"],
  liens: ["Liens personnels", "À distribuer en privé, chacun ne voit que son KPI"],
};
function montreNav() {
  const nav = $("#nav");
  nav.innerHTML = pagesPour(MOI.role).map(([p, label, svg]) =>
    `<button data-page="${p}"><span class="nlab">${svg}${esc(label)}</span> <span class="badge red" id="badge-${p}" style="display:none"></span></button>`).join("");
  for (const b of $$("#nav button")) b.onclick = () => { montre(b.dataset.page); fermeTiroir(); };
}
function montre(page) {
  if (page !== "ib" && PARTIE === "ib") choisitPartie("mlm", true);
  PAGE = page;
  for (const s of $$(".page")) s.classList.remove("on");
  const sec = $("#page-" + page);
  if (sec) sec.classList.add("on");
  for (const b of $$("#nav button")) b.classList.toggle("active", b.dataset.page === page);
  const [t, sub] = TITRES[page] || [page, ""];
  $("#pageTitle").textContent = t;
  $("#pageSub").textContent = page === "equipe" ? sousTitreEquipe() : sub;
  $("#topTitre").textContent = t;
  rendsPage(page);
  majBadges();
}
function sousTitreEquipe() {
  const n = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin").length;
  return "Septembre · " + n + " membres · limite " + (PARAMS.heure_limite ? PARAMS.heure_limite.defaut : "21:00");
}
function ouvreTiroir() { $("#sideNav").classList.add("open"); $("#navOverlay").classList.add("on"); }
function fermeTiroir() { $("#sideNav").classList.remove("open"); $("#navOverlay").classList.remove("on"); }
function majStatut(ok) {
  $("#dot").classList.toggle("err", !ok);
  $("#updated").textContent = ok ? "À jour · " + new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "Hors ligne — réessaie";
}
function majBadges() {
  const { jour, heure } = parisMaintenant();
  if (MOI.role === "admin") {
    const retard = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin" && !saisieDuJour(saisiesDe(m.id), jour) && heure >= heureLimite(m.id));
    const b = $("#badge-equipe");
    if (b) { b.style.display = retard.length ? "" : "none"; b.textContent = retard.length; }
  } else {
    const pas = !saisieDuJour(SAISIES, jour) && heure >= heureLimite(MOI.id);
    const b = $("#badge-saisie");
    if (b) { b.style.display = pas ? "" : "none"; b.textContent = "!"; }
    const dot = $("#bellDot");
    if (dot) { dot.style.display = pas ? "flex" : "none"; dot.textContent = "!"; }
  }
}

/* ================== composants ================== */
function kpiCarteHTML(tile, label, valeur, hint, warn) {
  return `<div class="card kpi${warn ? " warn" : ""}">
    <div class="itile${warn ? " warn" : ""}">${tile}</div>
    <div class="label">${esc(label)}</div>
    <div class="value">${valeur}</div>
    ${hint ? `<div class="hint">${hint}</div>` : ""}
  </div>`;
}
function bandeauHTML(id, saisies) {
  const { jour, heure } = parisMaintenant();
  const s = saisieDuJour(saisies, jour);
  const lim = heureLimite(id);
  if (s) return `<div class="toast" style="display:block;background:#0e2117;border-color:#1d4230;color:#86efac">Journée du ${esc(joliJour(jour))} remplie à ${esc(joliHeure(s.maj))} ✔</div>`;
  if (heure >= lim) return `<div class="toast" data-va="1" style="display:block;cursor:pointer;background:#2a0f12;border-color:#7f1d1d;color:#fca5a5">⚠️ Il est plus de ${esc(lim)} et ta journée n'est pas remplie. Vas-y maintenant, 30 secondes.</div>`;
  return `<div class="toast" data-va="1" style="display:block;cursor:pointer;background:var(--raise);border-color:var(--line);color:var(--muted);font-weight:500">Journée du ${esc(joliJour(jour))} à remplir avant ${esc(lim)}.</div>`;
}
function progressionHTML(cfg, t, jr) {
  const pct = Math.min(100, Math.round((t._pts / (cfg.cible_pts || 1)) * 100));
  return `<div class="card" style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:8px">
      <div><span style="font-size:26px;font-weight:750">${t._pts.toLocaleString("fr-FR")}</span>
        <span style="color:var(--muted)"> / ${(cfg.cible_pts || 0).toLocaleString("fr-FR")} points</span></div>
      <div class="eur" style="font-weight:750;font-size:18px">${(cfg.objectif_eur || 0).toLocaleString("fr-FR")} €</div>
    </div>
    <div class="gbar"><i class="${pct >= 100 ? "ok" : ""}" style="width:${pct}%"></i></div>
    <div style="display:flex;justify-content:space-between;color:var(--muted);font-size:12.5px">
      <span>${pct} % de ta cible</span><span>${jr} jours restants</span>
    </div>
  </div>`;
}
function ratiosHTML(dz) {
  const r = dz.r;
  const pc = (x) => Math.round(x * 100) + " %";
  let lignes = "";
  if (dz.type === "gars") lignes = ligneRatio("Taux de réponse", r.rep) + ligneRatio("Taux de redirection", r.redi) + ligneRatio("Redirigé → setté", r.set) + ligneRatio("Setté → vente", r.close);
  else if (dz.type === "fille") lignes = ligneRatio("Conversation → lead", r.lead) + ligneRatio("Lead → chaud", r.chaud) + ligneRatio("Chaud → vente", r.close);
  else return "";
  function ligneRatio(nom, v) {
    const pct = Math.min(100, Math.round(v * 100));
    return `<div class="pipe .row" style="display:grid;grid-template-columns:150px 1fr 52px;align-items:center;gap:12px;margin:9px 0">
      <span style="color:var(--muted);font-size:13px">${esc(nom)}</span>
      <div class="gbar" style="margin:0"><i style="width:${pct}%"></i></div>
      <b style="text-align:right;font-size:13.5px">${pc(v)}</b></div>`;
  }
  return `<div class="card" style="margin-top:14px"><div class="chart-title">Tes ratios — ${r.mesure ? "TES vrais chiffres" : "hypothèses de départ, remplacées dès tes premières saisies"}</div>${lignes}</div>`;
}
function histTableHTML(cfg, saisies) {
  const type = cfg.type || "fille";
  const cols = COLS_HIST[type] || COLS_HIST.fille;
  if (!saisies.length) return `<div class="empty"><b>Rien pour l'instant</b>Ta première saisie du soir apparaîtra ici.</div>`;
  const lignes = saisies.slice(0, 40).map((x) => `
    <tr><td><b>${esc(joliJour(x.jour))}</b></td>
    ${cols.map(([k]) => `<td class="num">${x.d && x.d[k] != null ? esc(x.d[k]) : "·"}</td>`).join("")}
    <td class="num"><b>${ptsJour(x.d || {})}</b></td>
    <td style="white-space:normal;min-width:150px;color:var(--warn);font-size:12.5px">${esc(x.blocage || "")}</td></tr>`).join("");
  return `<div class="tscroll"><table>
    <thead><tr><th>Jour</th>${cols.map(([, l]) => `<th class="num">${esc(l)}</th>`).join("")}<th class="num">Pts</th><th>Blocage</th></tr></thead>
    <tbody>${lignes}</tbody></table></div>`;
}

/* ================== pages membre ================== */
function statHTML(label, valeur, extra) {
  return `<div class="stat"><span class="sl">${esc(label)}</span><span class="sv">${valeur}</span>${extra ? `<span class="sh">${esc(extra)}</span>` : ""}</div>`;
}
function bandeauZenHTML(id, saisies) {
  const { jour, heure } = parisMaintenant();
  const sx = saisieDuJour(saisies, jour);
  const lim = heureLimite(id);
  if (sx) return `<div class="jligne ok">✓ Journée du ${esc(joliJour(jour))} remplie${sx.maj ? " à " + esc(joliHeure(sx.maj)) : ""}</div>`;
  if (heure >= lim) return `<div class="jligne tard" data-va="1">Il est plus de ${esc(lim)} et ta journée n'est pas remplie</div>`;
  return `<div class="jligne" data-va="1">Journée du ${esc(joliJour(jour))} · à remplir avant ${esc(lim)}</div>`;
}
function lignesJournee(cfg, dz, d) {
  const type = cfg.type || "fille";
  if (type === "gars") return [
    { k: "dms", label: "DMs envoyés", cible: +dz.principal.n || (cfg.plancher_dms || 200) },
    { k: "fu", label: "Follow-ups", cible: cfg.plancher_fu || 25 },
    { k: "reponses", label: "Réponses reçues", cible: 0 },
    { k: "redis", label: "Redirigés", cible: 0 },
    { k: "settes", label: "Settés", cible: 0 },
  ];
  if (type === "leader") return [
    { k: "vmens", label: "Ventes perso mensuelles", cible: 0 },
    { k: "v12", label: "Ventes perso 12 mois", cible: 0 },
    { k: "pts_b1", label: "Relevé branche 1", cible: 0 },
    { k: "pts_b2", label: "Relevé branche 2", cible: 0 },
  ];
  return [
    { k: "conversations", label: "Conversations ouvertes", cible: +dz.principal.n || 0 },
    { k: "leads", label: "Leads", cible: 0 },
    { k: "chauds", label: "Leads chauds", cible: 0 },
    { k: "contenus", label: "Contenus postés", cible: 0 },
  ];
}
function grapheJoursHTML(cfg, saisies, jour) {
  const type = cfg.type || "fille";
  const cle = type === "gars" ? "dms" : type === "leader" ? null : "conversations";
  const titre = type === "gars" ? "Tes DMs, jour par jour" : type === "leader" ? "Tes ventes perso, jour par jour" : "Tes conversations, jour par jour";
  const jours = [];
  const finJ = new Date(jour + "T12:00:00Z");
  for (let i = 13; i >= 0; i--) {
    const dd = new Date(finJ); dd.setUTCDate(finJ.getUTCDate() - i);
    const iso = dd.toISOString().slice(0, 10);
    if (iso >= "2026-08-25") jours.push(iso);
  }
  const valDe = (sx) => { const dx = (sx && sx.d) || {}; return cle ? (+dx[cle] || 0) : (+dx.vmens || 0) + (+dx.v12 || 0); };
  const vals = jours.map((j) => valDe(saisieDuJour(saisies, j)));
  const cible = type === "gars" ? (cfg.plancher_dms || 200) : 0;
  const max = Math.max(cible, ...vals, 1);
  const H = 86;
  const barres = jours.map((j, i) => `<div class="gj-col">
    <i style="height:${Math.max(2, Math.round((vals[i] / max) * H))}px"${cible && vals[i] >= cible ? ' class="full"' : ""}></i>
    <span>${j.slice(8)}</span></div>`).join("");
  const ligne = cible ? `<div class="gj-cible" style="bottom:${16 + Math.round((cible / max) * H)}px"></div>` : "";
  return `<div class="sec-t">14 derniers jours<span>${esc(titre.replace("Tes ", "").replace(", jour par jour", ""))}${cible ? " · ligne = plancher " + cible : ""}</span></div>
    <div class="gj">${ligne}${barres}</div>`;
}
function rendsJour(sec, id, cfg, saisies) {
  const { jour } = parisMaintenant();
  const dz = dose(cfg, saisies, jour);
  const sJ = saisieDuJour(saisies, jour);
  const d = Object.assign({}, (sJ && sJ.d) || {});
  const lignes = lignesJournee(cfg, dz, d);
  const fait = (l) => { const x = +d[l.k] || 0; return l.cible ? x >= l.cible : x > 0; };
  const pctJ = () => Math.round((lignes.filter(fait).length / lignes.length) * 100);
  const rows = lignes.map((l) => `
    <div class="todo${fait(l) ? " ok" : ""}" data-k="${l.k}">
      <span class="tcheck">✓</span>
      <div class="tlab">${esc(l.label)}${l.cible ? `<span class="tsub">objectif ${l.cible.toLocaleString("fr-FR")}</span>` : ""}</div>
      <div class="tnum"><button type="button" data-m="-1" aria-label="moins">−</button><input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${d[l.k] != null ? d[l.k] : ""}" placeholder="0" aria-label="${esc(l.label)}"><button type="button" data-m="1" aria-label="plus">+</button></div>
    </div>`).join("");
  const t = dz.t;
  const pctPts = Math.min(100, Math.round((t._pts / (cfg.cible_pts || 1)) * 100));
  const branches = cfg.type === "leader" ? `<div class="sec-t">Tes branches</div>
    <div class="pline"><b style="color:var(--accent)">${esc(dz.principal.n)}</b> ${esc(dz.principal.l)}</div>` : "";
  sec.innerHTML = `<div class="zen">
    ${bandeauZenHTML(id, saisies)}
    ${branches}
    <div class="sec-t">Aujourd'hui<span id="jPct">${pctJ()} %</span></div>
    <div class="tbar" id="jBar"><i style="width:${pctJ()}%"></i></div>
    <div class="tlist">${rows}</div>
    <button class="qbtn" id="allerSaisie">${sJ ? "Corriger ma journée (ventes + blocage)" : "Finir ma journée (ventes + blocage)"}</button>
    ${grapheJoursHTML(cfg, saisies, jour)}
    <div class="sec-t">Progression du mois<span class="eur" style="letter-spacing:0;text-transform:none;font-size:13px">${(cfg.objectif_eur || 0).toLocaleString("fr-FR")} €</span></div>
    <div class="pline"><b>${t._pts.toLocaleString("fr-FR")}</b> / ${(cfg.cible_pts || 0).toLocaleString("fr-FR")} points · ${pctPts} % · ${dz.jr} jour${dz.jr > 1 ? "s" : ""} restant${dz.jr > 1 ? "s" : ""}</div>
    <div class="tbar big"><i style="width:${pctPts}%"></i></div>
    <details class="regl" style="margin-top:26px"><summary>Le détail (semaine, ratios)</summary>
      <div class="stats" style="margin:14px 0 6px">` +
      dz.petits.map(([n, l]) => statHTML(l, esc(String(n)))).join("") +
      ((cfg.ventes_sem || 0) ? statHTML("Ventes cette semaine", `${ventesSemaine(saisies, jour)} <span class="sh">/ ${cfg.ventes_sem}</span>`) : "") +
      `</div>` + ratiosHTML(dz) + `</details>
    <div id="zoneNotifs"></div>
  </div>`;
  const b = $("#allerSaisie", sec);
  if (b) b.onclick = () => montre("saisie");
  const bv = $("[data-va]", sec);
  if (bv) bv.onclick = () => montre("saisie");
  etatNotifs().then((et) => { const z = $("#zoneNotifs", sec); if (z) { z.innerHTML = notifsCarteHTML(et); brancheNotifs(sec); } });
  let timer = null;
  const majTete = () => {
    const p = pctJ();
    const e1 = $("#jPct", sec); if (e1) e1.textContent = p + " %";
    const e2 = $("#jBar i", sec); if (e2) e2.style.width = p + "%";
  };
  const sauve = () => {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      try {
        const dd = {};
        for (const [k] of (CHAMPS_UI[cfg.type || "fille"] || CHAMPS_UI.fille)) {
          const n = parseInt(d[k], 10);
          if (!isNaN(n)) dd[k] = n;
        }
        await api({ action: "saisie", jour, d: dd, blocage: (sJ && sJ.blocage) || null });
        const ex = saisieDuJour(SAISIES, jour);
        if (ex) ex.d = dd;
        else SAISIES.unshift({ jour, d: dd, blocage: null, maj: new Date().toISOString(), membre_id: MOI.id });
        majStatut(true); majBadges();
      } catch (_) { majStatut(false); }
    }, 900);
  };
  for (const row of $$(".todo", sec)) {
    const l = lignes.find((x) => x.k === row.dataset.k);
    const inp = $("input", row);
    const change = () => { d[l.k] = inp.value; row.classList.toggle("ok", fait(l)); majTete(); sauve(); };
    inp.oninput = change;
    for (const bt of $$("button", row)) bt.onclick = () => {
      inp.value = Math.max(0, (parseInt(inp.value, 10) || 0) + parseInt(bt.dataset.m, 10));
      change();
    };
  }
}
const RARES = ["vmens", "v12", "autres_pts", "passages", "renouv_pts"];
function formHTML(cfg, s, jour, prefixe) {
  const type = cfg.type || "fille";
  const champs = CHAMPS_UI[type] || CHAMPS_UI.fille;
  const d = (s && s.d) || {};
  const paires = (liste) => {
    const rangs = [];
    for (let i = 0; i < liste.length; i += 2) {
      const paire = liste.slice(i, i + 2).map(([k, label, aide]) => `
      <div class="field"><label for="${prefixe}_${k}">${esc(label)}${aide ? ` — <span style="color:var(--muted)">${esc(aide)}</span>` : ""}</label>
      <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" id="${prefixe}_${k}" value="${d[k] != null ? d[k] : ""}" placeholder="0"></div>`).join("");
      rangs.push(`<div class="row2">${paire}</div>`);
    }
    return rangs.join("");
  };
  let corps;
  if (type === "leader") {
    corps = paires(champs);
  } else {
    const quotidiens = champs.filter(([k]) => !RARES.includes(k));
    const rares = champs.filter(([k]) => RARES.includes(k));
    const ouvert = rares.some(([k]) => +d[k] > 0);
    corps = paires(quotidiens) +
      `<details class="regl" id="${prefixe}_rares"${ouvert ? " open" : ""}><summary>Ventes, passages, renouvellements</summary>${paires(rares)}</details>`;
  }
  return `<form class="form" autocomplete="off" onsubmit="return false">
    <div class="field" style="max-width:200px"><label for="${prefixe}_jour">Jour</label>
      <input type="date" id="${prefixe}_jour" value="${jour}" min="2026-08-25" max="2026-12-31"></div>
    ${corps}
    <div class="field"><label for="${prefixe}_blocage">Ton blocage du jour — une phrase, Tony te répond avec l'axe du lendemain</label>
      <textarea id="${prefixe}_blocage" maxlength="500" placeholder="ex : plein de leads mais personne veut le call…">${esc((s && s.blocage) || "")}</textarea></div>
    <button type="button" class="submit" id="${prefixe}_save">Enregistrer ma journée</button>
  </form>`;
}
function brancheForm(cfg, prefixe, membreId, apres) {
  const btn = $("#" + prefixe + "_save");
  if (!btn) return;
  const type = cfg.type || "fille";
  $("#" + prefixe + "_jour").onchange = (e) => {
    const src = membreId ? saisiesDe(membreId) : SAISIES;
    const s = saisieDuJour(src, e.target.value);
    for (const [k] of (CHAMPS_UI[type] || CHAMPS_UI.fille)) $("#" + prefixe + "_" + k).value = s && s.d && s.d[k] != null ? s.d[k] : "";
    $("#" + prefixe + "_blocage").value = (s && s.blocage) || "";
    const det = $("#" + prefixe + "_rares");
    if (det) det.open = RARES.some((k) => { const e2 = $("#" + prefixe + "_" + k); return e2 && +e2.value > 0; });
  };
  btn.onclick = async () => {
    busy(btn, true);
    try {
      const d = {};
      for (const [k] of (CHAMPS_UI[type] || CHAMPS_UI.fille)) {
        const n = parseInt($("#" + prefixe + "_" + k).value, 10);
        if (!isNaN(n)) d[k] = n;
      }
      const corps = { action: "saisie", jour: $("#" + prefixe + "_jour").value, d, blocage: $("#" + prefixe + "_blocage").value };
      if (membreId) corps.membre_id = membreId;
      await api(corps);
      const p = ptsJour(d);
      toast("Journée enregistrée ✔" + (p > 0 ? " +" + p.toLocaleString("fr-FR") + " pts" : ""));
      try { navigator.clearAppBadge && navigator.clearAppBadge(); } catch (_) {}
      await chargeTout();
      apres();
    } catch (e) { toast("Erreur : " + e.message, true); busy(btn, false); }
  };
}
function rendsSaisie(sec, id, cfg, saisies) {
  rendsAssistant(sec, cfg, parisMaintenant().jour);
}
function etapesDe(type) {
  const champs = CHAMPS_UI[type] || CHAMPS_UI.fille;
  const quot = type === "leader" ? champs.filter(([k]) => k === "pts_b1" || k === "pts_b2") : champs.filter(([k]) => !RARES.includes(k));
  const rares = champs.filter(([k]) => RARES.includes(k));
  return { quot, rares };
}
function rendsAssistant(sec, cfg, jourInit) {
  const type = cfg.type || "fille";
  const { quot, rares } = etapesDe(type);
  const etapes = quot.map((c) => ({ genre: "num", c })).concat([{ genre: "ventes" }, { genre: "fin" }]);
  const total = etapes.length;
  let jour = jourInit, vals = {}, blocage = "", i = 0;
  const charge = () => {
    const sx = saisieDuJour(SAISIES, jour);
    vals = {}; blocage = (sx && sx.blocage) || "";
    if (sx && sx.d) for (const [k, v] of Object.entries(sx.d)) vals[k] = v;
  };
  charge();
  const rends = () => {
    const e = etapes[i];
    const nav = (avecSuivant) => `<div class="wiz-nav">
      ${i > 0 ? `<button type="button" class="abtn" id="wRetour">Retour</button>` : `<span></span>`}
      ${avecSuivant ? `<button type="button" class="abtn oui" id="wSuivant" style="padding:12px 26px">Suivant</button>` : ""}</div>`;
    let corps = "";
    if (e.genre === "num") {
      const [k, label, aide] = e.c;
      corps = `<div class="wiz-q">${esc(label)}</div>${aide ? `<div class="wiz-hint">${esc(aide)}</div>` : ""}
        <input class="wiz-in" id="wVal" type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" value="${vals[k] != null ? vals[k] : ""}" placeholder="0">
        <div class="wiz-pm">
          <button type="button" data-pm="-1">−1</button>
          <button type="button" data-pm="1">+1</button>
          <button type="button" data-pm="5">+5</button>
          <button type="button" data-pm="25">+25</button>
        </div>` + nav(true);
    } else if (e.genre === "ventes") {
      corps = `<div class="wiz-q">Des ventes aujourd'hui ?</div><div class="wiz-hint">Laisse vide si rien — ça compte dans tes points.</div>
        <div class="wiz-rares">` + rares.map(([k, label, aide]) => `
          <div class="field"><label for="w_${k}">${esc(label)}${aide ? ` — <span style="color:var(--muted)">${esc(aide)}</span>` : ""}</label>
          <input type="text" inputmode="numeric" pattern="[0-9]*" autocomplete="off" id="w_${k}" value="${vals[k] != null ? vals[k] : ""}" placeholder="0"></div>`).join("") + `</div>` + nav(true);
    } else {
      corps = `<div class="wiz-q">Un blocage aujourd'hui ?</div><div class="wiz-hint">Une phrase, Tony te répond avec l'axe du lendemain.</div>
        <div class="field" style="margin-top:14px"><textarea id="wBlocage" maxlength="500" placeholder="ex : plein de leads mais personne veut le call…">${esc(blocage)}</textarea></div>
        <button type="button" class="submit" id="wSave" style="margin-top:14px">Enregistrer ma journée</button>` + nav(false);
    }
    sec.innerHTML = `<div class="zen"><div class="wiz">
      <div class="wiz-top">
        <input type="date" id="wJour" value="${jour}" min="2026-08-25" max="2026-12-31" aria-label="Jour">
        <span class="wiz-count">${i + 1} / ${total}</span>
      </div>
      <div class="wiz-prog"><i style="width:${Math.round(((i + 1) / total) * 100)}%"></i></div>
      ${corps}</div></div>`;
    const garde = () => {
      const e2 = etapes[i];
      if (e2.genre === "num") { const el = $("#wVal", sec); if (el) vals[e2.c[0]] = el.value; }
      if (e2.genre === "ventes") for (const [k] of rares) { const el = $("#w_" + k, sec); if (el) vals[k] = el.value; }
      if (e2.genre === "fin") { const el = $("#wBlocage", sec); if (el) blocage = el.value; }
    };
    $("#wJour", sec).onchange = (ev) => { jour = ev.target.value; charge(); i = 0; rends(); };
    const back = $("#wRetour", sec); if (back) back.onclick = () => { garde(); i--; rends(); };
    const nx = $("#wSuivant", sec); if (nx) nx.onclick = () => { garde(); i++; rends(); };
    const inp = $("#wVal", sec);
    if (inp) {
      for (const b of $$(".wiz-pm button", sec)) b.onclick = () => {
        inp.value = Math.max(0, (parseInt(inp.value, 10) || 0) + parseInt(b.dataset.pm, 10));
      };
      inp.onkeydown = (ev) => { if (ev.key === "Enter") { ev.preventDefault(); if (nx) nx.onclick(); } };
    }
    const sv = $("#wSave", sec);
    if (sv) sv.onclick = async () => {
      garde();
      busy(sv, true);
      try {
        const d = {};
        for (const [k] of (CHAMPS_UI[type] || CHAMPS_UI.fille)) {
          const n = parseInt(vals[k], 10);
          if (!isNaN(n)) d[k] = n;
        }
        await api({ action: "saisie", jour, d, blocage });
        const p = ptsJour(d);
        toast("Journée enregistrée ✔" + (p > 0 ? " +" + p.toLocaleString("fr-FR") + " pts" : ""));
        try { navigator.clearAppBadge && navigator.clearAppBadge(); } catch (_) {}
        await chargeTout();
        montre("jour");
      } catch (err) { toast("Erreur : " + err.message, true); busy(sv, false); }
    };
  };
  rends();
}
function rendsHistorique(sec, cfg, saisies) {
  sec.innerHTML = histTableHTML(cfg, saisies);
}

/* ================== onglet KPI (prod perso + closing) ================== */
function joursEcoules() {
  const { jour } = parisMaintenant();
  const a = new Date("2026-08-25T12:00:00Z"), b = new Date(jour + "T12:00:00Z");
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
function rendsKpi(sec, cfg, saisies) {
  const seg = `<div class="agseg" style="display:inline-flex;margin-bottom:8px">
    <button data-sk="prod" class="${SOUS_KPI === "prod" ? "active" : ""}">Prod perso</button>
    <button data-sk="closing" class="${SOUS_KPI === "closing" ? "active" : ""}">Closing</button></div>`;
  sec.innerHTML = `<div class="zen">` + seg + (SOUS_KPI === "prod" ? prodPersoHTML(cfg, saisies) : closingHTML(cfg, saisies)) + `</div>`;
  for (const b of $$("[data-sk]", sec)) b.onclick = () => { SOUS_KPI = b.dataset.sk; rendsKpi(sec, cfg, saisies); };
}
function prodPersoHTML(cfg, saisies) {
  const t = totaux(saisies);
  const type = cfg.type || "fille";
  const jours = saisies.length;
  const volCle = type === "gars" ? ["dms", "DMs envoyés"] : ["conversations", "Conversations"];
  return `<div class="sec-t">Ce mois</div><div class="stats">` +
    statHTML("Points", `<span style="color:var(--accent)">${t._pts.toLocaleString("fr-FR")}</span>`, `/ ${(cfg.cible_pts || 0).toLocaleString("fr-FR")}`) +
    statHTML("Ventes", String(t._ventes)) +
    (type === "leader" ? statHTML("Points perso", t._pts.toLocaleString("fr-FR")) : statHTML(volCle[1], String(t[volCle[0]] || 0))) +
    statHTML("Régularité", `${jours}`, `/ ${joursEcoules()} jours`) +
    `</div><div class="sec-t">Jour par jour</div>` + histTableHTML(cfg, saisies);
}
function closingHTML(cfg, saisies) {
  const type = cfg.type || "fille";
  const t = totaux(saisies);
  if (type === "leader") {
    return `<div class="pline" style="margin-top:14px">Tes taux se mesurent dans tes branches. Ici : tes ventes perso, semaine par semaine.</div>
      <div class="sec-t">Semaine par semaine</div>` + semainesHTML(cfg, saisies);
  }
  const etapes = type === "gars" ? [
    ["DMs → réponses", t.dms, t.reponses, HYP.gars.rep],
    ["Réponses → redirigés", t.reponses, t.redis, HYP.gars.redi],
    ["Redirigés → settés", t.redis, t.settes, HYP.gars.set],
    ["Settés → ventes — TON CLOSING", t.settes, t._ventes, HYP.gars.close],
  ] : [
    ["Conversations → leads", t.conversations, t.leads, HYP.fille.lead],
    ["Leads → chauds", t.leads, t.chauds, HYP.fille.chaud],
    ["Chauds → ventes — TON CLOSING", t.chauds, t._ventes, HYP.fille.close],
  ];
  const lignes = etapes.map(([label, den, num, hyp]) => {
    const mesure = (den || 0) > 0 && (num || 0) > 0;
    const v = mesure ? num / den : hyp;
    return `<div style="padding:10px 0 2px">
      <div style="display:flex;justify-content:space-between;align-items:baseline;gap:10px">
        <div><div style="font-weight:650;font-size:14.5px">${esc(label)}</div>
        <div style="color:var(--muted);font-size:12.5px">${mesure ? `${num || 0} sur ${den || 0}` : "hypothèse de départ, pas encore assez de chiffres"}</div></div>
        <div style="font-size:22px;font-weight:750;color:${mesure ? "var(--accent)" : "var(--muted)"}">${Math.round(v * 100)} %</div>
      </div>
      <div class="gbar" style="margin-top:6px"><i style="width:${Math.min(100, Math.round(v * 100))}%"></i></div>
    </div>`;
  }).join("");
  const closeDen = type === "gars" ? (t.settes || 0) : (t.chauds || 0);
  const closeOk = closeDen > 0 && t._ventes > 0;
  const volTotal = type === "gars" ? (t.dms || 0) : (t.conversations || 0);
  const convOk = volTotal > 0 && t._ventes > 0;
  const global = `<div class="sec-t">Tes taux</div><div class="stats" style="margin-bottom:8px">` +
    statHTML("Taux de closing", closeOk ? `<span style="color:var(--accent)">${Math.round((t._ventes / closeDen) * 100)} %</span>` : "—",
      closeOk ? `${t._ventes} / ${closeDen} ${type === "gars" ? "settés" : "chauds"}` : "pas assez de chiffres") +
    statHTML("Conversion totale", convOk ? `${(Math.round((t._ventes / volTotal) * 1000) / 10).toLocaleString("fr-FR")} %` : "—",
      type === "gars" ? "des DMs à la vente" : "de la conv. à la vente") +
    `</div>`;
  return global + lignes + `<div class="sec-t">Semaine par semaine</div>` + semainesHTML(cfg, saisies);
}
function semainesHTML(cfg, saisies) {
  if (!saisies.length) return `<div class="empty"><b>Rien pour l'instant</b>Tes taux apparaîtront dès tes premières saisies.</div>`;
  const type = cfg.type || "fille";
  const sem = {};
  for (const s of saisies) {
    const d = new Date(s.jour + "T12:00:00Z");
    const lundi = new Date(d); lundi.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
    const cle = lundi.toISOString().slice(0, 10);
    (sem[cle] = sem[cle] || []).push(s);
  }
  const cols = type === "gars" ? [["dms", "DMs"], ["settes", "Settés"]]
    : type === "leader" ? [["vmens", "V. mens"], ["v12", "V. 12m"]]
    : [["conversations", "Conv."], ["chauds", "Chauds"]];
  const lignes = Object.keys(sem).sort().reverse().map((k) => {
    const t = totaux(sem[k]);
    const den = type === "gars" ? (t.settes || 0) : type === "leader" ? 0 : (t.chauds || 0);
    const taux = den > 0 && t._ventes > 0 ? Math.round((t._ventes / den) * 100) + " %" : "—";
    return `<tr><td><b>Sem. du ${esc(joliJour(k))}</b></td>${cols.map(([c]) => `<td class="num">${t[c] || 0}</td>`).join("")}
      <td class="num">${t._ventes}</td><td class="num">${t._pts.toLocaleString("fr-FR")}</td><td class="num"><b>${taux}</b></td></tr>`;
  }).join("");
  return `<div class="tscroll"><table><thead><tr><th>Semaine</th>${cols.map(([, l]) => `<th class="num">${esc(l)}</th>`).join("")}<th class="num">Ventes</th><th class="num">Pts</th><th class="num">Closing</th></tr></thead><tbody>${lignes}</tbody></table></div>`;
}

/* ================== partie IB (switch + placeholder) ================== */
function choisitPartie(p, sansNav) {
  PARTIE = p;
  document.body.classList.toggle("ib", p === "ib");
  for (const b of $$("#partieSwitch button")) b.classList.toggle("active", b.dataset.partie === p);
  montreNav();
  if (!sansNav) montre(p === "ib" ? "ib" : "jour");
}
function rendsIB(sec) {
  sec.innerHTML = `<div class="card ib-hero">
    <div class="logo-ib">PARTIE <span>IB</span></div>
    <div class="ib-dots"><i></i><i></i><i></i></div>
    <div style="color:var(--muted);font-size:15px;max-width:420px;margin:0 auto">On branche la nouvelle structure. Tes stats IB tomberont ici, même interface que le MLM.</div>
  </div>`;
}

/* ================== pages admin ================== */
function rendsEquipe(sec) {
  const { jour, heure } = parisMaintenant();
  const actifs = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin");
  const retard = [], attente = [], remplis = [];
  for (const m of actifs) {
    const s = saisieDuJour(saisiesDe(m.id), jour);
    if (s) remplis.push(m);
    else if (heure >= heureLimite(m.id)) retard.push(m);
    else attente.push(m);
  }
  let bandeau = "";
  if (retard.length) bandeau = `<div class="bandeau-retard">🔴 <b>Pas rempli après l'heure limite :</b> ${retard.map((m) => `<span data-fiche="${m.id}">${esc(m.prenom)}</span>`).join(" ")}</div>`;
  else if (!attente.length && actifs.length) bandeau = `<div class="toast" style="display:block;background:#0e2117;border-color:#1d4230;color:#86efac">Tout le monde a rempli sa journée ✔</div>`;

  const ptsReseau = actifs.reduce((a, m) => a + totaux(saisiesDe(m.id))._pts, 0);
  const ventesJourReseau = actifs.reduce((a, m) => { const s = saisieDuJour(saisiesDe(m.id), jour); return a + (s ? ventesJour(s.d || {}) : 0); }, 0);
  const strip = `<div class="grid3" style="margin-top:14px">
    ${kpiCarteHTML("Σ", "Points réseau (cumul)", ptsReseau.toLocaleString("fr-FR"), "toutes saisies confondues")}
    ${kpiCarteHTML("€", "Ventes du jour (réseau)", String(ventesJourReseau), "saisies d'aujourd'hui")}
    ${kpiCarteHTML("✓", "Remplis aujourd'hui", `${remplis.length}<span style="font-size:20px;color:var(--muted)"> / ${actifs.length}</span>`, retard.length ? retard.length + " en retard" : "", retard.length > 0)}
  </div>`;

  const cartes = actifs.map((m) => {
    const ss = saisiesDe(m.id);
    const s = saisieDuJour(ss, jour);
    const t = totaux(ss);
    const dz = dose(m.cfg, ss, jour);
    const pct = Math.min(100, Math.round((t._pts / (m.cfg.cible_pts || 1)) * 100));
    const lim = heureLimite(m.id);
    const etat = s ? `<span class="pill green">rempli ${esc(joliHeure(s.maj))}</span>` : (heure >= lim ? `<span class="pill red">pas rempli</span>` : `<span class="pill grey">avant ${esc(lim)}</span>`);
    return `<div class="kcard" data-fiche="${m.id}" style="padding:14px">
      <div style="display:flex;align-items:center;gap:9px">${aviHTML(m.id, m.prenom, 30)}
        <div style="flex:1;min-width:0"><div class="kn" style="font-size:15px">${esc(m.prenom)}</div>
        <div class="kc">${esc(m.cfg.sous_titre || "")}</div></div>${etat}</div>
      <div class="gbar"><i class="${pct >= 100 ? "ok" : ""}" style="width:${pct}%"></i></div>
      <div style="display:flex;justify-content:space-between;font-size:12.5px;color:var(--muted)">
        <span><b style="color:var(--ink)">${t._pts.toLocaleString("fr-FR")}</b> / ${(m.cfg.cible_pts || 0).toLocaleString("fr-FR")} pts</span>
        <span class="eur" style="font-weight:700">${(m.cfg.objectif_eur || 0).toLocaleString("fr-FR")} €</span></div>
      <div class="kc" style="margin-top:8px">Dose : <b style="color:var(--ink)">${esc(dz.principal.n)}</b> ${esc(String(dz.principal.l).split("(")[0].split("—")[0])}</div>
      ${s && s.blocage ? `<div class="ke" style="font-size:12px;margin-top:7px;color:var(--warn);font-style:italic">« ${esc(s.blocage)} »</div>` : ""}
    </div>`;
  }).join("");

  sec.innerHTML = bandeau + strip +
    `<h2>Les membres — tape pour ouvrir la fiche (ton support de call)</h2>
    <div class="kanban" style="grid-template-columns:repeat(auto-fill,minmax(255px,1fr))">${cartes}</div>`;
  for (const c of $$("[data-fiche]", sec)) c.onclick = () => ouvreFiche(c.dataset.fiche);
}
function ouvreFiche(id) {
  const m = (MEMBRES || []).find((x) => x.id === id);
  if (!m) return;
  const ss = saisiesDe(id);
  const { jour } = parisMaintenant();
  const dz = dose(m.cfg, ss, jour);
  const s = saisieDuJour(ss, jour);
  const ov = $("#ficheOverlay");
  ov.style.display = "block";
  ov.innerHTML = `<div style="max-width:820px;margin:0 auto">
    <div style="display:flex;align-items:center;gap:12px;margin-bottom:4px">
      ${aviHTML(m.id, m.prenom, 40)}
      <div style="flex:1"><h1 style="font-size:24px">${esc(m.prenom)}</h1>
      <div class="sub">${(m.cfg.objectif_eur || 0).toLocaleString("fr-FR")} € · ${esc(m.cfg.sous_titre || "")}</div></div>
      <button class="abtn" id="ficheFermer">Fermer ✕</button>
    </div>
    ${bandeauHTML(id, ss)}
    <div class="grid3" style="margin-top:14px">
      ${kpiCarteHTML(SVG.flamme, dz.type === "leader" ? "Ses branches" : "Sa dose du jour", `<span style="color:var(--accent)">${esc(dz.principal.n)}</span>`, esc(dz.principal.l))}
      ${dz.petits.slice(0, 2).map(([n, l]) => kpiCarteHTML("→", l, esc(String(n)), "")).join("")}
    </div>
    ${progressionHTML(m.cfg, dz.t, dz.jr)}
    ${ratiosHTML(dz)}
    <h2>Sa saisie ${s ? "(remplie — tu peux corriger)" : `(pas remplie — tu peux saisir pour ${esc(m.prenom)})`}</h2>
    <div class="card" style="max-width:640px">${formHTML(m.cfg, s, jour, "a")}</div>
    <h2>Son historique</h2>
    ${histTableHTML(m.cfg, ss)}
    <div style="height:30px"></div>
  </div>`;
  $("#ficheFermer").onclick = () => { ov.style.display = "none"; ov.innerHTML = ""; };
  brancheForm(m.cfg, "a", id, () => { ov.style.display = "none"; ov.innerHTML = ""; montre("equipe"); });
}
function rendsReglages(sec) {
  const h = PARAMS.heure_limite || { defaut: "21:00", par_membre: {} };
  const rp = PARAMS.rappel_heure || { defaut: "20:30", par_membre: {} };
  const actifs = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin");
  const lignes = (p, pref) => actifs.map((m) => `
    <div class="field" style="display:grid;grid-template-columns:1fr 130px;align-items:center;gap:10px;margin-bottom:8px">
      <label style="margin:0;display:flex;align-items:center;gap:8px;color:var(--ink);font-size:14px">${aviHTML(m.id, m.prenom, 24)}${esc(m.prenom)}</label>
      <input type="time" id="${pref}_${m.id}" value="${esc((p.par_membre || {})[m.id] || "")}">
    </div>`).join("");
  sec.innerHTML = `<div class="card" style="max-width:560px">
    <div class="chart-title">🔔 <b>Heure du rappel</b> — la notification « ta journée t'attend » part automatiquement à cette heure (heure française) si la journée n'est pas remplie.</div>
    <div class="field" style="display:grid;grid-template-columns:1fr 130px;align-items:center;gap:10px">
      <label style="margin:0;color:var(--ink);font-weight:650;font-size:14px">Rappel par défaut (tout le monde)</label>
      <input type="time" id="rp_defaut" value="${esc(rp.defaut)}"></div>
    <details class="regl" style="margin-top:8px"><summary>Personnaliser le rappel par personne</summary>${lignes(rp, "rp")}</details>
  </div>
  <div class="card" style="max-width:560px;margin-top:14px">
    <div class="chart-title">🔴 <b>Heure limite</b> — après cette heure, une journée non remplie passe en rouge (chez toi et chez la personne) et tu reçois le récap des retardataires.</div>
    <div class="field" style="display:grid;grid-template-columns:1fr 130px;align-items:center;gap:10px">
      <label style="margin:0;color:var(--ink);font-weight:650;font-size:14px">Limite par défaut (tout le monde)</label>
      <input type="time" id="hl_defaut" value="${esc(h.defaut)}"></div>
    <details class="regl" style="margin-top:8px"><summary>Personnaliser la limite par personne</summary>${lignes(h, "hl")}</details>
  </div>
  <div style="max-width:560px"><button class="submit" id="hl_save" style="margin-top:14px">Enregistrer les heures</button>
  <div id="zoneNotifs"></div></div>`;
  $("#hl_save").onclick = async () => {
    const btn = $("#hl_save"); busy(btn, true);
    try {
      const ram = (pref) => { const par_membre = {}; for (const m of actifs) { const v = $("#" + pref + "_" + m.id).value; if (v) par_membre[m.id] = v; } return par_membre; };
      await api({ action: "param_set", cle: "rappel_heure", valeur: { defaut: $("#rp_defaut").value || "20:30", par_membre: ram("rp") } });
      await api({ action: "param_set", cle: "heure_limite", valeur: { defaut: $("#hl_defaut").value || "21:00", par_membre: ram("hl") } });
      await chargeTout();
      toast("Heures enregistrées ✔"); montre("reglages");
    } catch (e) { toast("Erreur : " + e.message, true); busy(btn, false); }
  };
  etatNotifs().then((et) => { const z = $("#zoneNotifs", sec); if (z) { z.innerHTML = notifsCarteHTML(et); brancheNotifs(sec); } });
}
function rendsLiens(sec) {
  const base = location.origin + location.pathname;
  const lignes = (MEMBRES || []).filter((m) => m.actif).map((m) => {
    const lien = base + "?c=" + encodeURIComponent(m.code);
    return `<tr><td>${aviHTML(m.id, m.prenom, 24)}<b>${esc(m.prenom)}</b>${m.role === "admin" ? ' <span class="pill">toi</span>' : ""}</td>
      <td style="white-space:normal;word-break:break-all;font-size:12px;color:var(--muted)">${esc(lien)}</td>
      <td><button class="abtn" data-copie="${esc(lien)}">Copier</button></td></tr>`;
  }).join("");
  sec.innerHTML = `<div class="tscroll"><table>
    <thead><tr><th>Qui</th><th>Lien personnel</th><th></th></tr></thead><tbody>${lignes}</tbody></table></div>
    <div class="foot">Chaque personne ajoute son lien à l'écran d'accueil de son téléphone. Le lien vaut connexion : ne jamais le poster dans un groupe.</div>`;
  for (const b of $$("[data-copie]", sec)) b.onclick = async (e) => {
    e.stopPropagation();
    try { await navigator.clipboard.writeText(b.dataset.copie); toast("Lien copié ✔"); }
    catch { toast("Copie bloquée — sélectionne le lien à la main", true); }
  };
}

/* ================== routeur de rendu ================== */
function rendsPage(page) {
  JOUR_RENDU = parisMaintenant().jour;
  const sec = $("#page-" + page);
  if (!sec) return;
  if (MOI.role === "admin") {
    if (page === "equipe") rendsEquipe(sec);
    if (page === "reglages") rendsReglages(sec);
    if (page === "liens") rendsLiens(sec);
  } else {
    if (page === "jour") rendsJour(sec, MOI.id, MOI.cfg, SAISIES);
    if (page === "saisie") rendsSaisie(sec, MOI.id, MOI.cfg, SAISIES);
    if (page === "historique") rendsHistorique(sec, MOI.cfg, SAISIES);
    if (page === "kpi") rendsKpi(sec, MOI.cfg, SAISIES);
    if (page === "ib") rendsIB(sec);
  }
  $("#pageSub").textContent = page === "equipe" ? sousTitreEquipe() : (TITRES[page] || ["", ""])[1];
}

/* ================== chargement ================== */
async function chargeTout() {
  const [cfg, d] = await Promise.all([api({ action: "config" }), api({ action: "data" })]);
  MOI = cfg.moi; PARAMS = cfg.parametres || {}; MEMBRES = cfg.membres;
  SAISIES = MOI.role === "admin" ? (d.saisies || []) : (d.saisies || []).map((s) => ({ ...s, membre_id: MOI.id }));
  majStatut(true);
}
function brancheShell() {
  $("#burger").onclick = ouvreTiroir;
  $("#asideClose").onclick = fermeTiroir;
  $("#navOverlay").onclick = fermeTiroir;
  $("#bellBtn").onclick = () => { montre(MOI.role === "admin" ? "equipe" : "saisie"); fermeTiroir(); };
  $("#refresh").onclick = async () => {
    try { await chargeTout(); rendsPage(PAGE); majBadges(); toast("À jour ✔"); } catch { majStatut(false); }
  };
  // Rafraîchissement silencieux : retour au premier plan + toutes les 5 min.
  // Jamais sur les pages formulaire (saisie, réglages) ni fiche ouverte, pour ne pas écraser une frappe.
  const pagesSures = ["jour", "equipe", "historique", "liens"];
  const ficheOuverte = () => { const ov = $("#ficheOverlay"); return ov && ov.style.display !== "none"; };
  const rafraichis = async () => {
    if (document.visibilityState !== "visible") return;
    // Un jour est passé depuis le dernier rendu : re-render obligatoire même sur la saisie,
    // sinon le formulaire garde la date d'hier et écraserait la journée d'hier.
    const nouveauJour = JOUR_RENDU && parisMaintenant().jour !== JOUR_RENDU;
    if (!nouveauJour && (!pagesSures.includes(PAGE) || ficheOuverte())) return;
    const ac = document.activeElement;
    if (!nouveauJour && ac && (ac.tagName === "INPUT" || ac.tagName === "TEXTAREA")) return;
    try { await chargeTout(); } catch { majStatut(false); return; }
    // La situation a pu changer pendant le fetch : re-vérifier avant d'écraser le DOM.
    if (!nouveauJour && (!pagesSures.includes(PAGE) || ficheOuverte())) { majBadges(); return; }
    rendsPage(PAGE);
    majBadges();
  };
  document.addEventListener("visibilitychange", rafraichis);
  setInterval(rafraichis, 5 * 60 * 1000);
  setInterval(majBadges, 60 * 1000);
}
function montreVerrou(msg, retry) {
  $("#splash").style.display = "none";
  $("#app").style.display = "none";
  $("#lock").style.display = "block";
  if (msg) $("#lockMsg").textContent = msg;
  const r = $("#btnRetry"), f = $("#lockForm");
  if (r) { r.style.display = retry ? "block" : "none"; r.onclick = () => location.reload(); }
  if (f) f.style.display = retry ? "none" : "block";
  $("#btnCodeLock").onclick = () => {
    let v = $("#inCodeLock").value.trim();
    const m = v.match(/[?&]c=([^&\s]+)/); if (m) v = m[1];
    if (!v) return;
    localStorage.setItem(CLE_LS, v);
    location.href = location.pathname + "?c=" + encodeURIComponent(v);
  };
}
(async function boot() {
  const m = location.search.match(/[?&]c=([^&]+)/);
  CODE = m ? decodeURIComponent(m[1]) : localStorage.getItem(CLE_LS);
  if (!CODE) { montreVerrou(); return; }
  localStorage.setItem(CLE_LS, CODE);
  try {
    await chargeTout();
  } catch (e) {
    if (String(e.message).includes("code")) { montreVerrou("Ce lien n'est plus valide. Demande ton lien personnel à Tony."); return; }
    montreVerrou("Impossible de charger. Vérifie ta connexion puis réessaie.", true); return;
  }
  $("#splash").style.display = "none";
  $("#app").style.display = "flex";
  $("#hello").textContent = "Salut " + MOI.prenom + " 👋";
  $("#userbox").style.display = "flex";
  $("#uinit").textContent = initiale(MOI.prenom);
  $("#unom").textContent = MOI.prenom;
  $("#urole").textContent = MOI.role === "admin" ? "Admin" : "Membre";
  if (MOI.role === "admin") $("#footMotto").textContent = "Le rouge se règle le soir même, jamais le lendemain.";
  if (MOI.role !== "admin" && MOI.cfg && MOI.cfg.ib) {
    const sw = $("#partieSwitch");
    sw.style.display = "inline-flex";
    for (const b of $$("button", sw)) {
      b.classList.toggle("active", b.dataset.partie === "mlm");
      b.onclick = () => choisitPartie(b.dataset.partie);
    }
  }
  brancheShell();
  montreNav();
  const pm0 = parisMaintenant();
  const saisieDirecte = MOI.role !== "admin" && !saisieDuJour(SAISIES, pm0.jour) && pm0.heure >= heureRappel(MOI.id);
  montre(MOI.role === "admin" ? "equipe" : (saisieDirecte ? "saisie" : "jour"));
  try { navigator.clearAppBadge && navigator.clearAppBadge(); } catch (_) {}
})();
