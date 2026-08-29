/* Kairós KPI — app front. Un lien secret par personne (?c=CODE). */
"use strict";
const API = "https://gwococcxzrrtadtricnd.supabase.co/functions/v1/kpi";
const CLE_LS = "kpi_code";
const FIN_MOIS = "2026-09-30";
const PTS = { vmens: 300, v12: 660 };
const HYP = { fille: { lead: 0.5, chaud: 0.5, close: 1 / 3 }, gars: { rep: 0.34, redi: 0.42, set: 0.5, close: 1 / 3 } };

const CHAMPS_UI = {
  fille: [
    ["conversations", "Conversations ouvertes", "DMs, réponses stories, commentaires"],
    ["leads", "Leads", "des gens qui te répondent"],
    ["chauds", "Leads chauds", "de vraies questions d'intérêt"],
    ["vmens", "Ventes mensuelles", "packs 1 mois"],
    ["v12", "Ventes 12 mois", "compte double : 660 pts"],
    ["autres_pts", "Autres packs (points)", "Pro 150 · Premium 230 · Pro an 530 · Prem. an 600"],
    ["contenus", "Contenus postés", "stories + posts + vidéos"],
  ],
  gars: [
    ["dms", "DMs envoyés", "plancher : 200 / jour"],
    ["fu", "Follow-ups", "plancher : 25 / jour"],
    ["reponses", "Réponses reçues", ""],
    ["redis", "Redirigés", "amenés sur le compte / l'offre"],
    ["settes", "Settés", "rendez-vous posés"],
    ["vmens", "Ventes mensuelles", "packs 1 mois"],
    ["v12", "Ventes 12 mois", "compte double : 660 pts"],
    ["autres_pts", "Autres packs (points)", "Pro 150 · Premium 230 · Pro an 530 · Prem. an 600"],
  ],
  leader: [
    ["vmens", "Ventes perso mensuelles", ""],
    ["v12", "Ventes perso 12 mois", "compte double"],
    ["autres_pts", "Autres packs (points)", ""],
    ["pts_b1", "Points branche 1 (relevé)", "le total affiché dans ton back-office"],
    ["pts_b2", "Points branche 2 (relevé)", ""],
  ],
};

let CODE = null, MOI = null, PARAMS = {}, MEMBRES = null, SAISIES = [], FICHE = null, ONGLET = "equipe";

/* ---------- utilitaires ---------- */
const $ = (s, r) => (r || document).querySelector(s);
const esc = (t) => String(t == null ? "" : t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast"; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function parisMaintenant() {
  const f = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: false });
  const p = {};
  for (const x of f.formatToParts(new Date())) p[x.type] = x.value;
  return { jour: `${p.year}-${p.month}-${p.day}`, heure: `${p.hour}:${p.minute}` };
}
function joursRestants(depuis) {
  const a = new Date(depuis + "T12:00:00Z"), b = new Date(FIN_MOIS + "T12:00:00Z");
  return Math.max(1, Math.round((b - a) / 86400000) + 1);
}
function joliJour(iso) {
  const d = new Date(iso + "T12:00:00Z");
  return d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
}
function ptsJour(d) { return (+d.vmens || 0) * PTS.vmens + (+d.v12 || 0) * PTS.v12 + (+d.autres_pts || 0); }
function ventesJour(d) { return (+d.vmens || 0) + (+d.v12 || 0); }
async function api(corps) {
  const r = await fetch(API, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ code: CODE, ...corps }) });
  const j = await r.json().catch(() => ({ erreur: "réseau" }));
  if (!r.ok) throw new Error(j.erreur || "erreur");
  return j;
}

/* ---------- calculs ---------- */
function totaux(saisies) {
  const t = {};
  for (const s of saisies) for (const [k, v] of Object.entries(s.d || {})) t[k] = (t[k] || 0) + (+v || 0);
  t._pts = saisies.reduce((a, s) => a + ptsJour(s.d || {}), 0);
  t._ventes = saisies.reduce((a, s) => a + ventesJour(s.d || {}), 0);
  return t;
}
function ratios(type, t) {
  if (type === "gars") {
    return {
      rep: t.dms > 0 ? (t.reponses || 0) / t.dms : HYP.gars.rep,
      redi: (t.reponses || 0) > 0 ? (t.redis || 0) / t.reponses : HYP.gars.redi,
      set: (t.redis || 0) > 0 ? (t.settes || 0) / t.redis : HYP.gars.set,
      close: (t.settes || 0) > 0 ? t._ventes / t.settes : HYP.gars.close,
      mesure: t.dms > 0,
    };
  }
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
    return { type, restant, jr, principal: { n: `${Math.max(0, 16000 - b1)} · ${Math.max(0, 16000 - b2)}`, l: "points restants — branche 1 · branche 2" },
      petits: [[b1, "relevé branche 1"], [b2, "relevé branche 2"], [t._pts, "points perso faits"]], r };
  }
  if (type === "gars") {
    const settes = vj / garde(r.close);
    const redis = settes / garde(r.set);
    const reps = redis / garde(r.redi);
    const dms = Math.max(cfg.plancher_dms || 200, Math.ceil(reps / garde(r.rep)));
    return { type, restant, jr, principal: { n: dms, l: `DMs aujourd'hui  (+ ${cfg.plancher_fu || 25} follow-ups, ton plancher)` },
      petits: [[Math.ceil(reps * 10) / 10, "réponses visées"], [Math.ceil(redis * 10) / 10, "redirigés visés"], [Math.ceil(settes * 10) / 10, "settés visés"], [Math.ceil(vj * 10) / 10, "ventes (équiv. mens.)"]], r };
  }
  const chauds = vj / garde(r.close);
  const leads = chauds / garde(r.chaud);
  const conv = Math.ceil(leads / garde(r.lead));
  return { type, restant, jr, principal: { n: conv, l: "conversations à ouvrir aujourd'hui" },
    petits: [[Math.ceil(leads * 10) / 10, "leads visés"], [Math.ceil(chauds * 10) / 10, "leads chauds visés"], [Math.ceil(vj * 10) / 10, "ventes (équiv. mens.)"]], r };
}
function heureLimite(id) {
  const h = PARAMS.heure_limite || { defaut: "21:00", par_membre: {} };
  return (h.par_membre || {})[id] || h.defaut || "21:00";
}
function saisieDuJour(saisies, jour) { return saisies.find((s) => s.jour === jour); }

/* ---------- rendus ---------- */
function rends() {
  const rac = $("#racine");
  if (!MOI) { rendsVerrou(rac); return; }
  if (MOI.role === "admin") rendsAdmin(rac);
  else rendsMembre(rac, MOI.id, MOI.cfg, SAISIES, false);
}

function rendsVerrou(rac) {
  rac.innerHTML = `
  <div class="lock">
    <div class="logo">KAIRÓ<span>Σ</span></div>
    <div class="logosub">NEW ERA — KPI</div>
    <p>Lien invalide ou manquant.<br>Colle ton lien personnel (ou juste ton code) :</p>
    <input id="vcode" placeholder="ton code" autocomplete="off">
    <button class="btn" id="vgo">Entrer</button>
    <p style="font-size:12px">Pas de code ? Demande ton lien personnel à Tony.</p>
  </div>`;
  $("#vgo").onclick = () => {
    let v = $("#vcode").value.trim();
    const m = v.match(/[?&]c=([^&\s]+)/); if (m) v = m[1];
    if (!v) return;
    localStorage.setItem(CLE_LS, v);
    location.search = "?c=" + encodeURIComponent(v);
  };
}

function enteteHTML(titre, sousTitre) {
  return `
  <div class="top">
    <div><div class="logo">KAIRÓ<span>Σ</span></div><div class="logosub">NEW ERA — KPI</div></div>
    <div class="hello">${esc(titre)}</div>
  </div>
  <h1>${esc(titre)}</h1>
  <div class="sub">${esc(sousTitre)}</div>`;
}

function formSaisieHTML(cfg, s, jour, prefixe) {
  const type = cfg.type || "fille";
  const champs = CHAMPS_UI[type] || CHAMPS_UI.fille;
  const d = (s && s.d) || {};
  const lignes = champs.map(([k, label, aide]) => `
    <div class="ligne">
      <label>${esc(label)}${aide ? `<small>${esc(aide)}</small>` : ""}</label>
      <input type="number" inputmode="decimal" min="0" step="1" id="${prefixe}_${k}" value="${d[k] != null ? d[k] : ""}" placeholder="0">
    </div>`).join("");
  return `
    <div class="ligne"><label>Jour</label><input type="date" id="${prefixe}_jour" value="${jour}" min="2026-08-25" max="2026-12-31" style="width:150px"></div>
    ${lignes}
    <label style="display:block;margin-top:10px;font-size:14px">Ton blocage du jour <small style="color:var(--muted)">(une phrase, Tony te répond avec l'axe du lendemain)</small></label>
    <textarea id="${prefixe}_blocage" maxlength="500" placeholder="ex : plein de leads mais personne veut le call...">${esc((s && s.blocage) || "")}</textarea>
    <button class="btn" id="${prefixe}_save">Enregistrer ma journée</button>`;
}

function brancheSaisie(cfg, saisies, prefixe, membreId, apres) {
  $("#" + prefixe + "_save").onclick = async (ev) => {
    ev.target.disabled = true;
    try {
      const type = cfg.type || "fille";
      const d = {};
      for (const [k] of (CHAMPS_UI[type] || CHAMPS_UI.fille)) {
        const v = $("#" + prefixe + "_" + k).value;
        if (v !== "") d[k] = +v;
      }
      const jour = $("#" + prefixe + "_jour").value;
      const blocage = $("#" + prefixe + "_blocage").value;
      const corps = { action: "saisie", jour, d, blocage };
      if (membreId) corps.membre_id = membreId;
      await api(corps);
      toast("Journée enregistrée ✔");
      await chargeTout();
      apres();
    } catch (e) { toast("Erreur : " + e.message); ev.target.disabled = false; }
  };
}

function vueMembreHTML(id, cfg, saisies, prefixe, admin) {
  const { jour, heure } = parisMaintenant();
  const s = saisieDuJour(saisies, jour);
  const dz = dose(cfg, saisies, jour);
  const t = totaux(saisies);
  const limite = heureLimite(id);
  const enRetard = !s && heure >= limite;
  const pct = Math.min(100, Math.round((t._pts / (cfg.cible_pts || 1)) * 100));

  let bandeau = "";
  if (s) bandeau = `<div class="bandeau vert">Journée du ${esc(joliJour(jour))} remplie ✔${s.blocage ? " — blocage noté" : ""}</div>`;
  else if (enRetard) bandeau = `<div class="bandeau rouge">⚠️ Ta journée n'est pas remplie et il est plus de ${esc(limite)}. Remplis-la maintenant.</div>`;
  else bandeau = `<div class="bandeau neutre">Journée du ${esc(joliJour(jour))} à remplir avant ${esc(limite)}.</div>`;

  const petits = dz.petits.map(([n, l]) => `<div class="petit"><div class="n">${esc(n)}</div><div class="l">${esc(l)}</div></div>`).join("");

  let ratiosHTML = "";
  const r = dz.r;
  const pcent = (x) => Math.round(x * 100) + " %";
  if (dz.type === "gars") ratiosHTML = `Réponses ${pcent(r.rep)} · Redirigés ${pcent(r.redi)} · Settés ${pcent(r.set)} · Close ${pcent(r.close)}`;
  else if (dz.type === "fille") ratiosHTML = `Leads ${pcent(r.lead)} · Chauds ${pcent(r.chaud)} · Close ${pcent(r.close)}`;
  const mesure = r.mesure ? "tes vrais taux" : "hypothèses de départ (remplacées par tes vrais chiffres dès tes premières saisies)";

  const type = cfg.type || "fille";
  const colonnes = (CHAMPS_UI[type] || CHAMPS_UI.fille).map(([k, l]) => [k, l]);
  const lignesHist = saisies.slice(0, 31).map((x) => `
    <tr><td><b>${esc(joliJour(x.jour))}</b></td>
    ${colonnes.map(([k]) => `<td>${x.d && x.d[k] != null ? esc(x.d[k]) : "·"}</td>`).join("")}
    <td><b>${ptsJour(x.d || {})}</b></td>
    <td style="white-space:normal;min-width:140px;color:var(--warn)">${esc(x.blocage || "")}</td></tr>`).join("");

  return `
  ${bandeau}
  <div class="card">
    <h2>Ta dose du jour — recalculée avec ${r.mesure ? "TES chiffres" : "les hypothèses de départ"}</h2>
    <div class="dose">
      <div class="gros"><div class="n">${esc(dz.principal.n)}</div><div class="l">${esc(dz.principal.l)}</div></div>
      ${petits}
    </div>
    <div class="barre"><div style="width:${pct}%"></div></div>
    <div class="barreinfo"><span><b>${t._pts}</b> / ${cfg.cible_pts} points</span><span><b>${dz.jr}</b> jours restants</span><span>objectif <b style="color:var(--gold)">${cfg.objectif_eur} €</b></span></div>
  </div>
  <div class="card">
    <h2>Ta saisie du soir</h2>
    <form onsubmit="return false">${formSaisieHTML(cfg, s, jour, prefixe)}</form>
  </div>
  ${ratiosHTML ? `<div class="card"><h2>Tes ratios (${esc(mesure)})</h2><div style="font-size:14px">${ratiosHTML}</div></div>` : ""}
  <div class="card">
    <h2>Ton historique</h2>
    <div class="tscroll"><table>
      <tr><th>Jour</th>${colonnes.map(([, l]) => `<th>${esc(l.split(" ")[0])}</th>`).join("")}<th>Pts</th><th>Blocage</th></tr>
      ${lignesHist || `<tr><td colspan="12" style="color:var(--muted)">Aucune saisie pour l'instant.</td></tr>`}
    </table></div>
  </div>`;
}

function rendsMembre(rac, id, cfg, saisies, admin) {
  rac.innerHTML = enteteHTML(`KPI — ${MOI.prenom}`, `${cfg.objectif_eur} € en septembre · ${cfg.sous_titre || ""}`) +
    vueMembreHTML(id, cfg, saisies, "f", false);
  brancheSaisie(cfg, saisies, "f", null, rends);
}

/* ---------- admin ---------- */
function rendsAdmin(rac) {
  const { jour, heure } = parisMaintenant();
  const actifs = (MEMBRES || []).filter((m) => m.actif && m.role !== "admin");
  const parMembre = {};
  for (const m of actifs) parMembre[m.id] = SAISIES.filter((s) => s.membre_id === m.id);

  const retardataires = actifs.filter((m) => !saisieDuJour(parMembre[m.id], jour) && heure >= heureLimite(m.id));
  const enAttente = actifs.filter((m) => !saisieDuJour(parMembre[m.id], jour) && heure < heureLimite(m.id));
  let bandeau = "";
  if (retardataires.length) bandeau = `<div class="bandeau rouge">🔴 PAS REMPLI après l'heure limite : <b>${retardataires.map((m) => esc(m.prenom)).join(", ")}</b></div>`;
  else if (enAttente.length === 0 && actifs.length) bandeau = `<div class="bandeau vert">Tout le monde a rempli sa journée ✔</div>`;
  else bandeau = `<div class="bandeau neutre">En attente avant l'heure limite : ${enAttente.map((m) => esc(m.prenom)).join(", ") || "personne"}</div>`;

  let contenu = "";
  if (ONGLET === "equipe") {
    const cartes = actifs.map((m) => {
      const ss = parMembre[m.id];
      const s = saisieDuJour(ss, jour);
      const t = totaux(ss);
      const dz = dose(m.cfg, ss, jour);
      const pct = Math.min(100, Math.round((t._pts / (m.cfg.cible_pts || 1)) * 100));
      const limite = heureLimite(m.id);
      const etat = s ? `<span class="pill ok">rempli</span>` : (heure >= limite ? `<span class="pill non">pas rempli</span>` : `<span class="pill att">avant ${esc(limite)}</span>`);
      return `<div class="mcard" data-id="${m.id}">
        <div class="tete"><span class="nom">${esc(m.prenom)}</span>${etat}</div>
        <div class="obj">${t._pts} / ${m.cfg.cible_pts} pts · ${m.cfg.objectif_eur} €</div>
        <div class="barre"><div style="width:${pct}%"></div></div>
        <div class="doseinfo">Dose du jour : <b>${esc(dz.principal.n)}</b> ${esc(String(dz.principal.l).split("(")[0])}</div>
        ${s && s.blocage ? `<div class="bloc">« ${esc(s.blocage)} »</div>` : ""}
      </div>`;
    }).join("");
    contenu = `<div class="grille">${cartes}</div>
      <div class="note">Tape sur une carte pour ouvrir la fiche complète (celle que la personne voit) — c'est ton support de call.</div>`;
  }
  if (ONGLET === "reglages") {
    const h = PARAMS.heure_limite || { defaut: "21:00", par_membre: {} };
    const lignes = actifs.map((m) => `
      <div class="ligne"><label>${esc(m.prenom)}</label>
      <input type="time" id="hl_${m.id}" value="${esc((h.par_membre || {})[m.id] || "")}" placeholder="défaut"></div>`).join("");
    contenu = `<div class="card regl">
      <h2>Heure limite du soir (heure française)</h2>
      <div class="ligne"><label><b>Heure par défaut (tout le monde)</b></label><input type="time" id="hl_defaut" value="${esc(h.defaut)}"></div>
      ${lignes}
      <div class="note">Une case vide = la personne suit l'heure par défaut. Après cette heure, une journée non remplie passe en rouge (chez toi ET chez elle).</div>
      <button class="btn" id="hl_save">Enregistrer les heures</button>
    </div>`;
  }
  if (ONGLET === "liens") {
    const lignes = (MEMBRES || []).filter((m) => m.actif).map((m) => {
      const lien = location.origin + location.pathname + "?c=" + encodeURIComponent(m.code);
      return `<tr><td><b>${esc(m.prenom)}</b>${m.role === "admin" ? " (toi)" : ""}</td>
        <td style="white-space:normal;word-break:break-all;font-size:12px;color:var(--muted)">${esc(lien)}</td>
        <td><button data-copie="${esc(lien)}">Copier</button></td></tr>`;
    }).join("");
    contenu = `<div class="card liens"><h2>Les liens personnels (à distribuer EN PRIVÉ)</h2>
      <div class="tscroll"><table><tr><th>Qui</th><th>Lien</th><th></th></tr>${lignes}</table></div></div>`;
  }

  rac.innerHTML = enteteHTML("KPI — Équipe", "Septembre · " + actifs.length + " membres") + bandeau + `
    <div class="onglets">
      <button data-o="equipe" class="${ONGLET === "equipe" ? "active" : ""}">Équipe</button>
      <button data-o="reglages" class="${ONGLET === "reglages" ? "active" : ""}">Réglages</button>
      <button data-o="liens" class="${ONGLET === "liens" ? "active" : ""}">Liens</button>
      <button data-o="refresh">↻</button>
    </div>` + contenu;

  for (const b of rac.querySelectorAll(".onglets button")) {
    b.onclick = async () => {
      if (b.dataset.o === "refresh") { await chargeTout(); rends(); toast("À jour"); return; }
      ONGLET = b.dataset.o; rends();
    };
  }
  for (const c of rac.querySelectorAll(".mcard")) c.onclick = () => ouvreFiche(c.dataset.id);
  const hs = $("#hl_save");
  if (hs) hs.onclick = async () => {
    try {
      const par_membre = {};
      for (const m of actifs) { const v = $("#hl_" + m.id).value; if (v) par_membre[m.id] = v; }
      await api({ action: "param_set", cle: "heure_limite", valeur: { defaut: $("#hl_defaut").value || "21:00", par_membre } });
      await chargeTout(); toast("Heures enregistrées ✔"); rends();
    } catch (e) { toast("Erreur : " + e.message); }
  };
  for (const b of rac.querySelectorAll("[data-copie]")) b.onclick = async () => {
    try { await navigator.clipboard.writeText(b.dataset.copie); toast("Lien copié"); }
    catch { prompt("Copie le lien :", b.dataset.copie); }
  };
}

function ouvreFiche(id) {
  const m = (MEMBRES || []).find((x) => x.id === id);
  if (!m) return;
  const ss = SAISIES.filter((s) => s.membre_id === id);
  const ov = document.createElement("div");
  ov.className = "overlay";
  ov.innerHTML = `<div class="ofiche">
    <button class="fermer">✕</button>
    <h1>${esc(m.prenom)}</h1>
    <div class="sub">${m.cfg.objectif_eur} € · ${esc(m.cfg.sous_titre || "")}</div>
    ${vueMembreHTML(id, m.cfg, ss, "a", true)}
  </div>`;
  document.body.appendChild(ov);
  ov.querySelector(".fermer").onclick = () => ov.remove();
  ov.onclick = (e) => { if (e.target === ov) ov.remove(); };
  brancheSaisie(m.cfg, ss, "a", id, () => { ov.remove(); rends(); });
}

/* ---------- chargement ---------- */
async function chargeTout() {
  const cfg = await api({ action: "config" });
  MOI = cfg.moi; PARAMS = cfg.parametres || {}; MEMBRES = cfg.membres;
  const d = await api({ action: "data" });
  SAISIES = MOI.role === "admin"
    ? (d.saisies || [])
    : (d.saisies || []).map((s) => ({ ...s, membre_id: MOI.id }));
}
(async function boot() {
  const m = location.search.match(/[?&]c=([^&]+)/);
  CODE = m ? decodeURIComponent(m[1]) : localStorage.getItem(CLE_LS);
  if (!CODE) { rends(); return; }
  localStorage.setItem(CLE_LS, CODE);
  try { await chargeTout(); } catch { MOI = null; }
  rends();
  setInterval(async () => { try { await chargeTout(); rends(); } catch {} }, 5 * 60 * 1000);
})();
