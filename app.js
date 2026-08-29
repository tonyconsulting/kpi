/* Kairós KPI — front v2 (shell Kairós complet). Lien secret ?c=CODE. */
"use strict";
const API = "https://gwococcxzrrtadtricnd.supabase.co/functions/v1/kpi";
const CLE_LS = "kpi_code";
const FIN_MOIS = "2026-09-30";
const PTS = { vmens: 300, v12: 660 };
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
  ],
  leader: [
    ["vmens", "Ventes perso mensuelles", "300 pts"],
    ["v12", "Ventes perso 12 mois", "compte double — 660 pts"],
    ["autres_pts", "Autres packs (en points)", ""],
    ["pts_b1", "Points branche 1 (relevé du jour)", "le total affiché dans ton back-office"],
    ["pts_b2", "Points branche 2 (relevé du jour)", ""],
  ],
};
const COLS_HIST = {
  fille: [["conversations", "Conv."], ["leads", "Leads"], ["chauds", "Chauds"], ["vmens", "V. mens"], ["v12", "V. 12m"], ["contenus", "Contenus"]],
  gars: [["dms", "DMs"], ["fu", "FU"], ["reponses", "Rép."], ["redis", "Redi"], ["settes", "Settés"], ["vmens", "V. mens"], ["v12", "V. 12m"]],
  leader: [["vmens", "V. mens"], ["v12", "V. 12m"], ["pts_b1", "Branche 1"], ["pts_b2", "Branche 2"]],
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

let CODE = null, MOI = null, PARAMS = {}, MEMBRES = null, SAISIES = [], PAGE = null;

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
function busy(btn, on) { if (btn) btn.classList.toggle("busy", !!on); }
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
function ptsJour(d) { return (+d.vmens || 0) * PTS.vmens + (+d.v12 || 0) * PTS.v12 + (+d.autres_pts || 0); }
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
    rep: t.dms > 0 ? (t.reponses || 0) / t.dms : HYP.gars.rep,
    redi: (t.reponses || 0) > 0 ? (t.redis || 0) / t.reponses : HYP.gars.redi,
    set: (t.redis || 0) > 0 ? (t.settes || 0) / t.redis : HYP.gars.set,
    close: (t.settes || 0) > 0 ? t._ventes / t.settes : HYP.gars.close,
    mesure: t.dms > 0,
  };
  return {
    lead: (t.conversations || 0) > 0 ? (t.leads || 0) / t.conversations : HYP.fille.lead,
    chaud: (t.leads || 0) > 0 ? (t.chauds || 0) / t.leads : HYP.fille.chaud,
    close: (t.chauds || 0) > 0 ? t._ventes / t.chauds : HYP.fille.close,
    mesure: (t.conversations || 0) > 0,
  };
}
function dose(cfg, saisies, jour) {
  const t = totaux(saisies);
  const restant = Math.max(0, (cfg.cible_pts || 0) - t._pts);
  const jr = joursRestants(jour);
  const vj = restant / PTS.vmens / jr;
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
      petits: [[arr1(reps), "réponses visées"], [arr1(redis), "redirigés visés"], [arr1(settes), "settés visés"], [arr1(vj), "ventes (équiv. mens.)"]] };
  }
  const chauds = vj / garde(r.close);
  const leads = chauds / garde(r.chaud);
  const conv = Math.ceil(leads / garde(r.lead));
  return { type, restant, jr, t, r,
    principal: { n: conv, l: "conversations à ouvrir aujourd'hui" },
    petits: [[arr1(leads), "leads visés"], [arr1(chauds), "leads chauds visés"], [arr1(vj), "ventes (équiv. mens.)"]] };
}
function arr1(x) { return Math.round(x * 10) / 10; }
function heureLimite(id) {
  const h = PARAMS.heure_limite || { defaut: "21:00", par_membre: {} };
  return (h.par_membre || {})[id] || h.defaut || "21:00";
}
function saisieDuJour(saisies, jour) { return saisies.find((s) => s.jour === jour); }
function ventesSemaine(saisies, jourISO) {
  const d = new Date(jourISO + "T12:00:00Z");
  const lundi = new Date(d); lundi.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7));
  const debut = lundi.toISOString().slice(0, 10);
  return saisies.filter((s) => s.jour >= debut && s.jour <= jourISO).reduce((a, s) => a + ventesJour(s.d || {}), 0);
}
function saisiesDe(id) { return SAISIES.filter((s) => s.membre_id === id); }

/* ================== shell ================== */
function pagesPour(role) {
  if (role === "admin") return [
    ["equipe", "Équipe", SVG.equipe], ["reglages", "Réglages", SVG.reglages], ["liens", "Liens", SVG.lien],
  ];
  return [["jour", "Ma journée", SVG.jour], ["saisie", "Ma saisie", SVG.saisie], ["historique", "Historique", SVG.histo]];
}
const TITRES = {
  jour: ["Ma journée", "Ta dose du jour, calculée sur TES chiffres"],
  saisie: ["Ma saisie du soir", "30 secondes chaque soir, c'est le moteur du mois"],
  historique: ["Historique", "Toutes tes journées de septembre"],
  equipe: ["L'équipe", ""],
  reglages: ["Réglages", "L'heure limite du soir, par défaut et par personne"],
  liens: ["Liens personnels", "À distribuer en privé, chacun ne voit que son KPI"],
};
function montreNav() {
  const nav = $("#nav");
  nav.innerHTML = pagesPour(MOI.role).map(([p, label, svg]) =>
    `<button data-page="${p}"><span class="nlab">${svg}${esc(label)}</span> <span class="badge red" id="badge-${p}" style="display:none"></span></button>`).join("");
  for (const b of $$("#nav button")) b.onclick = () => { montre(b.dataset.page); fermeTiroir(); };
}
function montre(page) {
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
  if (heure >= lim) return `<div class="toast" style="display:block;background:#2a0f12;border-color:#7f1d1d;color:#fca5a5">⚠️ Il est plus de ${esc(lim)} et ta journée n'est pas remplie. Vas-y maintenant, 30 secondes.</div>`;
  return `<div class="toast" style="display:block;background:var(--raise);border-color:var(--line);color:var(--muted);font-weight:500">Journée du ${esc(joliJour(jour))} à remplir avant ${esc(lim)}.</div>`;
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
function rendsJour(sec, id, cfg, saisies) {
  const { jour } = parisMaintenant();
  const dz = dose(cfg, saisies, jour);
  const vs = ventesSemaine(saisies, jour);
  const cibleSem = cfg.ventes_sem || 0;
  const cartes =
    kpiCarteHTML(SVG.flamme, dz.type === "leader" ? "Tes branches" : "Ta dose du jour",
      `<span style="color:var(--accent)">${esc(dz.principal.n)}</span>`, esc(dz.principal.l)) +
    dz.petits.slice(0, 2).map(([n, l]) => kpiCarteHTML("→", l, esc(String(n)), "")).join("") +
    (cibleSem ? kpiCarteHTML("🎯", "Ventes cette semaine", `${vs}<span style="font-size:20px;color:var(--muted)"> / ${cibleSem}</span>`, vs >= cibleSem ? "objectif de la semaine atteint ✔" : "l'objectif se joue là", vs < cibleSem) : "");
  sec.innerHTML = bandeauHTML(id, saisies) +
    `<div class="grid3" style="margin-top:14px">${cartes}</div>` +
    progressionHTML(cfg, dz.t, dz.jr) +
    `<div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="abtn oui" id="allerSaisie">Remplir ma journée</button>
    </div>` + ratiosHTML(dz);
  const b = $("#allerSaisie", sec);
  if (b) b.onclick = () => montre("saisie");
}
function formHTML(cfg, s, jour, prefixe) {
  const type = cfg.type || "fille";
  const champs = CHAMPS_UI[type] || CHAMPS_UI.fille;
  const d = (s && s.d) || {};
  const moitie = Math.ceil(champs.length / 2);
  const rangs = [];
  for (let i = 0; i < champs.length; i += 2) {
    const paire = champs.slice(i, i + 2).map(([k, label, aide]) => `
      <div class="field"><label>${esc(label)}${aide ? ` — <span style="color:var(--muted)">${esc(aide)}</span>` : ""}</label>
      <input type="number" inputmode="decimal" min="0" step="1" id="${prefixe}_${k}" value="${d[k] != null ? d[k] : ""}" placeholder="0"></div>`).join("");
    rangs.push(`<div class="row2">${paire}</div>`);
  }
  return `<form class="form" autocomplete="off" onsubmit="return false">
    <div class="field" style="max-width:200px"><label>Jour</label>
      <input type="date" id="${prefixe}_jour" value="${jour}" min="2026-08-25" max="2026-12-31"></div>
    ${rangs.join("")}
    <div class="field"><label>Ton blocage du jour — une phrase, Tony te répond avec l'axe du lendemain</label>
      <textarea id="${prefixe}_blocage" maxlength="500" placeholder="ex : plein de leads mais personne veut le call…">${esc((s && s.blocage) || "")}</textarea></div>
    <button class="submit" id="${prefixe}_save">Enregistrer ma journée</button>
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
  };
  btn.onclick = async () => {
    busy(btn, true);
    try {
      const d = {};
      for (const [k] of (CHAMPS_UI[type] || CHAMPS_UI.fille)) {
        const v = $("#" + prefixe + "_" + k).value;
        if (v !== "") d[k] = +v;
      }
      const corps = { action: "saisie", jour: $("#" + prefixe + "_jour").value, d, blocage: $("#" + prefixe + "_blocage").value };
      if (membreId) corps.membre_id = membreId;
      await api(corps);
      toast("Journée enregistrée ✔");
      await chargeTout();
      apres();
    } catch (e) { toast("Erreur : " + e.message, true); busy(btn, false); }
  };
}
function rendsSaisie(sec, id, cfg, saisies) {
  const { jour } = parisMaintenant();
  const s = saisieDuJour(saisies, jour);
  sec.innerHTML = bandeauHTML(id, saisies) + `<div class="card" style="margin-top:14px;max-width:640px">` + formHTML(cfg, s, jour, "f") + `</div>`;
  brancheForm(cfg, "f", null, () => montre("jour"));
}
function rendsHistorique(sec, cfg, saisies) {
  sec.innerHTML = histTableHTML(cfg, saisies);
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
  const actifs = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin");
  const lignes = actifs.map((m) => `
    <div class="field" style="display:grid;grid-template-columns:1fr 130px;align-items:center;gap:10px;margin-bottom:8px">
      <label style="margin:0;display:flex;align-items:center;gap:8px;color:var(--ink);font-size:14px">${aviHTML(m.id, m.prenom, 24)}${esc(m.prenom)}</label>
      <input type="time" id="hl_${m.id}" value="${esc((h.par_membre || {})[m.id] || "")}">
    </div>`).join("");
  sec.innerHTML = `<div class="card" style="max-width:560px">
    <div class="chart-title">Après cette heure (heure française), une journée non remplie passe en <b style="color:var(--bad)">rouge</b> — chez toi et chez la personne.</div>
    <div class="field" style="display:grid;grid-template-columns:1fr 130px;align-items:center;gap:10px">
      <label style="margin:0;color:var(--ink);font-weight:650;font-size:14px">Heure par défaut (tout le monde)</label>
      <input type="time" id="hl_defaut" value="${esc(h.defaut)}"></div>
    <div style="border-top:1px solid var(--line);margin:12px 0;padding-top:12px;color:var(--muted);font-size:12.5px">Personnaliser par personne (vide = heure par défaut)</div>
    ${lignes}
    <button class="submit" id="hl_save">Enregistrer les heures</button>
  </div>`;
  $("#hl_save").onclick = async () => {
    const btn = $("#hl_save"); busy(btn, true);
    try {
      const par_membre = {};
      for (const m of actifs) { const v = $("#hl_" + m.id).value; if (v) par_membre[m.id] = v; }
      await api({ action: "param_set", cle: "heure_limite", valeur: { defaut: $("#hl_defaut").value || "21:00", par_membre } });
      await chargeTout();
      toast("Heures enregistrées ✔"); montre("reglages");
    } catch (e) { toast("Erreur : " + e.message, true); busy(btn, false); }
  };
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
  }
  $("#pageSub").textContent = page === "equipe" ? sousTitreEquipe() : (TITRES[page] || ["", ""])[1];
}

/* ================== chargement ================== */
async function chargeTout() {
  const cfg = await api({ action: "config" });
  MOI = cfg.moi; PARAMS = cfg.parametres || {}; MEMBRES = cfg.membres;
  const d = await api({ action: "data" });
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
}
function montreVerrou(msg) {
  $("#splash").style.display = "none";
  $("#app").style.display = "none";
  $("#lock").style.display = "block";
  if (msg) $("#lockMsg").textContent = msg;
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
    montreVerrou("Impossible de charger. Vérifie ta connexion et recharge la page."); return;
  }
  $("#splash").style.display = "none";
  $("#app").style.display = "flex";
  $("#hello").textContent = "Salut " + MOI.prenom + " 👋";
  $("#userbox").style.display = "flex";
  $("#uinit").textContent = initiale(MOI.prenom);
  $("#unom").textContent = MOI.prenom;
  $("#urole").textContent = MOI.role === "admin" ? "Admin" : "Membre";
  if (MOI.role === "admin") $("#footMotto").textContent = "Le rouge se règle le soir même, jamais le lendemain.";
  brancheShell();
  montreNav();
  montre(MOI.role === "admin" ? "equipe" : "jour");
  setInterval(async () => { try { await chargeTout(); rendsPage(PAGE); majBadges(); } catch { majStatut(false); } }, 5 * 60 * 1000);
  setInterval(majBadges, 60 * 1000);
})();
