/* =====================================================================
   TONO CORE · cuentas, base de datos, licencias y compra
   Compartido por la landing (index.html) y el estudio (app.html).
   - Con Firebase configurado: cuentas reales (correo + verificación, Google),
     datos en Firestore.
   - Sin Firebase: "modo demo" con datos en este navegador, para probar todo.
   ===================================================================== */
(function () {
  "use strict";
  const C = window.TONO_CONFIG || {};
  const FB = C.firebase || {};
  const CLOUD = !!(FB.apiKey && FB.projectId && FB.appId);
  const DEMO = !CLOUD && C.demo === true;      // solo para pruebas locales
  const ACCOUNTS = CLOUD || DEMO;              // sin Firebase y sin demo: web abierta, sin cuentas
  const LANGS = ["es", "en", "pt", "fr"];

  /* ---------------- textos ---------------- */
  const T = {
    es: { login: "Ingresar", signup: "Crear cuenta", google: "Continuar con Google", or: "o con tu correo", name: "Nombre", email: "Correo", password: "Contraseña (mínimo 8 caracteres)", forgot: "¿Olvidaste tu contraseña?", submitLogin: "Ingresar", submitSignup: "Crear mi cuenta", consent: 'Acepto los <a href="legal.html#terms" target="_blank">Términos</a>, la <a href="legal.html#privacy" target="_blank">Privacidad</a> y la <a href="legal.html#ai" target="_blank">Política de IA</a>.', marketing: "Quiero recibir novedades y consejos (máximo uno por semana).", verifyTitle: "Revisa tu correo", verifyBody: "Te enviamos un enlace para activar tu cuenta a <b>{email}</b>. Ábrelo y vuelve aquí. Si no lo ves, mira en spam o promociones.", resend: "Reenviar correo", verifiedCheck: "Ya lo activé", resetSent: "Te enviamos un correo para cambiar tu contraseña.", sent: "Enviado.", logout: "Cerrar sesión", studio: "Mi estudio", close: "Cerrar", demo: "Modo demo: las cuentas y datos se guardan solo en este navegador. Conecta Firebase en config.js para activar cuentas reales.", needConsent: "Para crear la cuenta acepta los términos.", notVerified: "Aún no vemos tu correo activado. Abre el enlace del correo y prueba de nuevo.", e: { "auth/invalid-email": "Ese correo no es válido.", "auth/missing-password": "Escribe tu contraseña.", "auth/weak-password": "La contraseña debe tener al menos 8 caracteres.", "auth/email-already-in-use": "Ese correo ya tiene cuenta. Ingresa o recupera tu contraseña.", "auth/invalid-credential": "Correo o contraseña incorrectos.", "auth/user-not-found": "No existe una cuenta con ese correo.", "auth/wrong-password": "Correo o contraseña incorrectos.", "auth/too-many-requests": "Demasiados intentos. Espera unos minutos.", "auth/popup-closed-by-user": "Cerraste la ventana de Google antes de terminar.", "auth/popup-blocked": "Tu navegador bloqueó la ventana de Google. Permite ventanas emergentes e inténtalo otra vez.", "auth/unauthorized-domain": "Este dominio aún no está autorizado en Firebase (Authentication > Settings > Authorized domains).", "auth/network-request-failed": "Sin conexión. Revisa tu internet.", generic: "Algo falló. Inténtalo de nuevo." } },
    en: { login: "Log in", signup: "Sign up", google: "Continue with Google", or: "or with your email", name: "Name", email: "Email", password: "Password (at least 8 characters)", forgot: "Forgot your password?", submitLogin: "Log in", submitSignup: "Create my account", consent: 'I accept the <a href="legal.html#terms" target="_blank">Terms</a>, <a href="legal.html#privacy" target="_blank">Privacy Policy</a> and <a href="legal.html#ai" target="_blank">AI Policy</a>.', marketing: "Send me news and tips (one email a week at most).", verifyTitle: "Check your inbox", verifyBody: "We sent an activation link to <b>{email}</b>. Open it and come back. Not there? Check spam or promotions.", resend: "Resend email", verifiedCheck: "I've activated it", resetSent: "We sent you an email to reset your password.", sent: "Sent.", logout: "Log out", studio: "My studio", close: "Close", demo: "Demo mode: accounts and data live only in this browser. Connect Firebase in config.js to enable real accounts.", needConsent: "Please accept the terms to create your account.", notVerified: "Your email isn't activated yet. Open the link in the email and try again.", e: { "auth/invalid-email": "That email isn't valid.", "auth/missing-password": "Enter your password.", "auth/weak-password": "Password must be at least 8 characters.", "auth/email-already-in-use": "That email already has an account. Log in or reset your password.", "auth/invalid-credential": "Wrong email or password.", "auth/user-not-found": "No account with that email.", "auth/wrong-password": "Wrong email or password.", "auth/too-many-requests": "Too many attempts. Wait a few minutes.", "auth/popup-closed-by-user": "You closed the Google window before finishing.", "auth/popup-blocked": "Your browser blocked the Google window. Allow pop-ups and try again.", "auth/unauthorized-domain": "This domain isn't authorized in Firebase yet (Authentication > Settings > Authorized domains).", "auth/network-request-failed": "You're offline. Check your connection.", generic: "Something went wrong. Try again." } },
    pt: { login: "Entrar", signup: "Criar conta", google: "Continuar com o Google", or: "ou com seu e-mail", name: "Nome", email: "E-mail", password: "Senha (mínimo 8 caracteres)", forgot: "Esqueceu a senha?", submitLogin: "Entrar", submitSignup: "Criar minha conta", consent: 'Aceito os <a href="legal.html#terms" target="_blank">Termos</a>, a <a href="legal.html#privacy" target="_blank">Privacidade</a> e a <a href="legal.html#ai" target="_blank">Política de IA</a>.', marketing: "Quero receber novidades e dicas (no máximo uma por semana).", verifyTitle: "Confira seu e-mail", verifyBody: "Enviamos um link de ativação para <b>{email}</b>. Abra e volte aqui. Não chegou? Veja spam ou promoções.", resend: "Reenviar e-mail", verifiedCheck: "Já ativei", resetSent: "Enviamos um e-mail para trocar sua senha.", sent: "Enviado.", logout: "Sair", studio: "Meu estúdio", close: "Fechar", demo: "Modo demo: contas e dados ficam só neste navegador. Conecte o Firebase no config.js para ativar contas reais.", needConsent: "Para criar a conta, aceite os termos.", notVerified: "Seu e-mail ainda não foi ativado. Abra o link do e-mail e tente de novo.", e: { "auth/invalid-email": "Esse e-mail não é válido.", "auth/missing-password": "Digite sua senha.", "auth/weak-password": "A senha precisa ter pelo menos 8 caracteres.", "auth/email-already-in-use": "Esse e-mail já tem conta. Entre ou recupere a senha.", "auth/invalid-credential": "E-mail ou senha incorretos.", "auth/user-not-found": "Não existe conta com esse e-mail.", "auth/wrong-password": "E-mail ou senha incorretos.", "auth/too-many-requests": "Muitas tentativas. Aguarde alguns minutos.", "auth/popup-closed-by-user": "Você fechou a janela do Google antes de terminar.", "auth/popup-blocked": "O navegador bloqueou a janela do Google. Permita pop-ups e tente de novo.", "auth/unauthorized-domain": "Este domínio ainda não está autorizado no Firebase (Authentication > Settings > Authorized domains).", "auth/network-request-failed": "Sem conexão. Verifique sua internet.", generic: "Algo deu errado. Tente de novo." } },
    fr: { login: "Se connecter", signup: "Créer un compte", google: "Continuer avec Google", or: "ou avec votre e-mail", name: "Nom", email: "E-mail", password: "Mot de passe (8 caractères minimum)", forgot: "Mot de passe oublié ?", submitLogin: "Se connecter", submitSignup: "Créer mon compte", consent: 'J’accepte les <a href="legal.html#terms" target="_blank">Conditions</a>, la <a href="legal.html#privacy" target="_blank">Confidentialité</a> et la <a href="legal.html#ai" target="_blank">Politique IA</a>.', marketing: "Je veux recevoir des nouvelles et des conseils (un e-mail par semaine maximum).", verifyTitle: "Vérifiez vos e-mails", verifyBody: "Nous avons envoyé un lien d’activation à <b>{email}</b>. Ouvrez-le puis revenez ici. Rien reçu ? Regardez dans les spams ou promotions.", resend: "Renvoyer l’e-mail", verifiedCheck: "C’est activé", resetSent: "Nous vous avons envoyé un e-mail pour changer votre mot de passe.", sent: "Envoyé.", logout: "Se déconnecter", studio: "Mon studio", close: "Fermer", demo: "Mode démo : comptes et données restent dans ce navigateur. Connectez Firebase dans config.js pour activer les vrais comptes.", needConsent: "Acceptez les conditions pour créer votre compte.", notVerified: "Votre e-mail n’est pas encore activé. Ouvrez le lien reçu puis réessayez.", e: { "auth/invalid-email": "Cet e-mail n’est pas valide.", "auth/missing-password": "Saisissez votre mot de passe.", "auth/weak-password": "Le mot de passe doit contenir au moins 8 caractères.", "auth/email-already-in-use": "Cet e-mail a déjà un compte. Connectez-vous ou réinitialisez le mot de passe.", "auth/invalid-credential": "E-mail ou mot de passe incorrect.", "auth/user-not-found": "Aucun compte avec cet e-mail.", "auth/wrong-password": "E-mail ou mot de passe incorrect.", "auth/too-many-requests": "Trop de tentatives. Patientez quelques minutes.", "auth/popup-closed-by-user": "Vous avez fermé la fenêtre Google avant la fin.", "auth/popup-blocked": "Le navigateur a bloqué la fenêtre Google. Autorisez les pop-ups et réessayez.", "auth/unauthorized-domain": "Ce domaine n’est pas encore autorisé dans Firebase (Authentication > Settings > Authorized domains).", "auth/network-request-failed": "Pas de connexion. Vérifiez internet.", generic: "Une erreur est survenue. Réessayez." } }
  };

  let lang = "es";
  const t = (k) => (T[lang] || T.es)[k];
  const err = (e) => { const c = (e && e.code) || ""; return (T[lang] || T.es).e[c] || (T[lang] || T.es).e.generic; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(s || "").trim());
  const LS = { get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} } };

  /* ---------------- backend: Firebase o demo ---------------- */
  let fb = null; // { auth, db, A (auth fns), F (firestore fns) }
  let current = null;
  const listeners = [];
  const emit = () => listeners.forEach((f) => { try { f(current); } catch (e) {} });
  const shape = (u) => u ? { uid: u.uid, email: u.email, name: u.displayName || (u.email || "").split("@")[0], verified: !!u.emailVerified, provider: (u.providerData && u.providerData[0] && u.providerData[0].providerId) || u.provider || "password" } : null;

  async function initCloud() {
    const v = C.firebaseVersion || "13.1.0";
    const base = `https://www.gstatic.com/firebasejs/${v}/`;
    const [appM, A, F] = await Promise.all([import(base + "firebase-app.js"), import(base + "firebase-auth.js"), import(base + "firebase-firestore.js")]);
    const app = appM.initializeApp(FB);
    const auth = A.getAuth(app);
    const db = F.getFirestore(app);
    fb = { auth, db, A, F };
    await new Promise((res) => { let first = true; A.onAuthStateChanged(auth, (u) => { current = shape(u); emit(); if (first) { first = false; res(); } }); });
  }

  /* demo: cuentas guardadas en el navegador (solo para probar) */
  const demo = {
    users() { return LS.get("tono_demo_users", {}); },
    save(u) { const all = demo.users(); all[u.email] = u; LS.set("tono_demo_users", all); },
    login(u) { current = { uid: u.uid, email: u.email, name: u.name, verified: !!u.verified, provider: u.provider || "password" }; LS.set("tono_demo_session", u.email); emit(); }
  };
  function initDemo() { const em = LS.get("tono_demo_session", null); const u = em && demo.users()[em]; if (u) current = { uid: u.uid, email: u.email, name: u.name, verified: !!u.verified, provider: u.provider || "password" }; }

  const ready = (async () => { try { if (CLOUD) await initCloud(); else if (DEMO) initDemo(); } catch (e) { console.error("Tono: Firebase no cargó", e); } emit(); })();

  const verifyUrl = () => { try { return new URL("app.html?verified=1#" + lang, location.href).href; } catch (e) { return undefined; } };

  const Auth = {
    async signUp({ email, password, name, marketing }) {
      email = String(email || "").trim().toLowerCase();
      if (!isEmail(email)) throw { code: "auth/invalid-email" };
      if (!password || password.length < 8) throw { code: "auth/weak-password" };
      if (fb) {
        fb.auth.languageCode = lang;
        const cred = await fb.A.createUserWithEmailAndPassword(fb.auth, email, password);
        if (name) await fb.A.updateProfile(cred.user, { displayName: name });
        try { await fb.A.sendEmailVerification(cred.user, { url: verifyUrl() }); } catch (e) { await fb.A.sendEmailVerification(cred.user); }
        await Data.saveProfile({ email, name: name || "", lang, marketing: !!marketing, consentAt: new Date().toISOString(), provider: "password" });
        current = shape(cred.user); emit(); return current;
      }
      if (demo.users()[email]) throw { code: "auth/email-already-in-use" };
      const u = { uid: "demo_" + Math.random().toString(36).slice(2, 10), email, name: name || email.split("@")[0], password, verified: false, marketing: !!marketing, provider: "password" };
      demo.save(u); demo.login(u); return current;
    },
    async signIn({ email, password }) {
      email = String(email || "").trim().toLowerCase();
      if (!isEmail(email)) throw { code: "auth/invalid-email" };
      if (!password) throw { code: "auth/missing-password" };
      if (fb) { const cred = await fb.A.signInWithEmailAndPassword(fb.auth, email, password); current = shape(cred.user); emit(); return current; }
      const u = demo.users()[email]; if (!u || u.password !== password) throw { code: "auth/invalid-credential" };
      demo.login(u); return current;
    },
    async google() {
      if (fb) {
        fb.auth.languageCode = lang;
        const p = new fb.A.GoogleAuthProvider(); p.setCustomParameters({ prompt: "select_account" });
        const cred = await fb.A.signInWithPopup(fb.auth, p);
        current = shape(cred.user); emit();
        const prof = await Data.getProfile();
        if (!prof || !prof.email) await Data.saveProfile({ email: current.email, name: current.name, lang, marketing: false, consentAt: new Date().toISOString(), provider: "google" });
        return current;
      }
      const email = "demo.google@gmail.com"; let u = demo.users()[email];
      if (!u) { u = { uid: "demo_google", email, name: "Demo Google", password: "-", verified: true, provider: "google.com" }; demo.save(u); }
      demo.login(u); return current;
    },
    async resend() { if (fb && fb.auth.currentUser) { fb.auth.languageCode = lang; await fb.A.sendEmailVerification(fb.auth.currentUser, { url: verifyUrl() }).catch(() => fb.A.sendEmailVerification(fb.auth.currentUser)); } },
    async refresh() {
      if (fb && fb.auth.currentUser) { await fb.auth.currentUser.reload(); current = shape(fb.auth.currentUser); emit(); return current; }
      if (current) { const u = demo.users()[current.email]; if (u) { u.verified = true; demo.save(u); demo.login(u); } } // en demo, "activar" funciona al instante
      return current;
    },
    async reset(email) { email = String(email || "").trim(); if (!isEmail(email)) throw { code: "auth/invalid-email" }; if (fb) { fb.auth.languageCode = lang; await fb.A.sendPasswordResetEmail(fb.auth, email); } },
    async signOut() { if (fb) await fb.A.signOut(fb.auth); LS.set("tono_demo_session", null); current = null; emit(); }
  };

  /* ---------------- datos ---------------- */
  const stamp = () => (fb ? fb.F.serverTimestamp() : new Date().toISOString());
  const SUBJ = { leads: "Tono · nuevo correo en la lista", contacts: "Tono · mensaje de contacto", pro_requests: "Tono · pedido de revisión Pro" };
  async function mail(col, data) {
    if (!C.notifyEmail) return false;
    const r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(C.notifyEmail), { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(Object.assign({ _subject: SUBJ[col] + (data.email ? " · " + data.email : ""), _template: "table" }, data)) });
    if (!r.ok) throw { code: "send/failed" };
    return true;
  }
  async function addTo(col, data) {
    if (fb) {
      await fb.F.addDoc(fb.F.collection(fb.db, col), Object.assign({}, data, { createdAt: stamp() }));
      try { await mail(col, data); } catch (e) {} // aviso por correo, opcional
      return;
    }
    if (DEMO) { const all = LS.get("tono_demo_" + col, []); all.push(Object.assign({}, data, { createdAt: stamp() })); LS.set("tono_demo_" + col, all); return; }
    if (!(await mail(col, data))) throw { code: "send/not_configured" }; // sin Firebase: llega a tu correo
  }
  const Data = {
    async saveLead({ email, role, source, consent }) {
      if (!isEmail(email)) throw { code: "auth/invalid-email" };
      await addTo("leads", { email: String(email).trim().toLowerCase(), role: String(role || "").slice(0, 120), source: String(source || "landing").slice(0, 60), lang, consent: !!consent, page: location.pathname.slice(0, 200) });
    },
    async saveContact({ name, email, topic, message }) {
      if (!isEmail(email)) throw { code: "auth/invalid-email" };
      const row = { name: String(name || "").slice(0, 120), email: String(email).trim().toLowerCase(), topic: String(topic || "").slice(0, 60), message: String(message || "").slice(0, 4900), lang, uid: current ? current.uid : "" };
      await addTo("contacts", row);
    },
    async getProfile() {
      if (!current) return null;
      if (fb) { const s = await fb.F.getDoc(fb.F.doc(fb.db, "users", current.uid)); return s.exists() ? s.data() : null; }
      return LS.get("tono_demo_profile_" + current.uid, null);
    },
    async saveProfile(patch) {
      if (!current && !(fb && fb.auth.currentUser)) return;
      const uid = current ? current.uid : fb.auth.currentUser.uid;
      const clean = JSON.parse(JSON.stringify(patch));
      if (fb) { await fb.F.setDoc(fb.F.doc(fb.db, "users", uid), Object.assign(clean, { updatedAt: stamp() }), { merge: true }); return; }
      LS.set("tono_demo_profile_" + uid, Object.assign(LS.get("tono_demo_profile_" + uid, {}), clean));
    },
    async listPacks() {
      if (!current) return [];
      if (fb) { const q = await fb.F.getDocs(fb.F.collection(fb.db, "users", current.uid, "packs")); return q.docs.map((d) => Object.assign({ id: d.id }, d.data())).sort((a, b) => String(b.savedAt || "").localeCompare(String(a.savedAt || ""))); }
      return LS.get("tono_demo_packs_" + current.uid, []);
    },
    async savePack(pack) {
      if (!current) throw { code: "auth/required" };
      const p = JSON.parse(JSON.stringify(pack)); p.savedAt = new Date().toISOString();
      if (fb) { const id = p.id || ("p_" + Date.now()); delete p.id; await fb.F.setDoc(fb.F.doc(fb.db, "users", current.uid, "packs", id), p); return id; }
      const all = LS.get("tono_demo_packs_" + current.uid, []); const id = p.id || ("p_" + Date.now()); p.id = id;
      const i = all.findIndex((x) => x.id === id); if (i > -1) all[i] = p; else all.unshift(p); LS.set("tono_demo_packs_" + current.uid, all); return id;
    },
    async deletePack(id) {
      if (!current) return;
      if (fb) { await fb.F.deleteDoc(fb.F.doc(fb.db, "users", current.uid, "packs", id)); return; }
      LS.set("tono_demo_packs_" + current.uid, LS.get("tono_demo_packs_" + current.uid, []).filter((x) => x.id !== id));
    },
    async adminList(col) {
      if (fb) {
        const q = fb.F.query(fb.F.collection(fb.db, col), fb.F.orderBy("createdAt", "desc"), fb.F.limit(1000));
        const snap = await fb.F.getDocs(q);
        return snap.docs.map((d) => { const x = d.data(); const c = x.createdAt && x.createdAt.toDate ? x.createdAt.toDate().toISOString() : (x.createdAt || ""); return Object.assign({ id: d.id }, x, { createdAt: c }); });
      }
      return LS.get("tono_demo_" + col, []).slice().reverse();
    },
    async saveProRequest(req) {
      if (!current && ACCOUNTS) throw { code: "auth/required" };
      const who = current ? { uid: current.uid, email: current.email } : { uid: "", email: req.email || "" };
      await addTo("pro_requests", Object.assign({}, JSON.parse(JSON.stringify(req)), who, { lang }));
    }
  };

  /* ---------------- licencias Polar ---------------- */
  const P = C.polar || {};
  const planFromBenefit = (bid) => { const b = P.benefits || {}; return Object.keys(b).find((k) => b[k] && b[k] === bid) || null; };
  const License = {
    configured() { return !!(P.organizationId && Object.values(P.benefits || {}).some(Boolean)); },
    async validate(key) {
      key = String(key || "").trim();
      if (!key) return { ok: false, error: "empty" };
      const m = /^TONO-DEMO-(PACK|PRO|AGENCY)$/i.exec(key);
      if (DEMO && m) return { ok: true, plan: m[1].toLowerCase(), status: "granted", email: current && current.email, demo: true };
      if (!License.configured()) return { ok: false, error: "not_configured" };
      const body = JSON.stringify({ key, organization_id: P.organizationId, sandbox: !!P.sandbox });
      let j = null;
      try { // 1) función propia (evita bloqueos del navegador)
        const r = await fetch("/api/license", { method: "POST", headers: { "Content-Type": "application/json" }, body });
        if (r.ok && (r.headers.get("content-type") || "").includes("json")) j = await r.json();
      } catch (e) {}
      if (!j) { // 2) directo a Polar
        try {
          const api = P.sandbox ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
          const r = await fetch(api + "/v1/customer-portal/license-keys/validate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ key, organization_id: P.organizationId }) });
          const d = await r.json().catch(() => ({}));
          j = r.ok ? { ok: true, data: d } : { ok: false, error: (d && (d.detail || d.type)) || r.status };
        } catch (e) { return { ok: false, error: "network" }; }
      }
      if (!j.ok) return { ok: false, error: typeof j.error === "string" ? j.error : "invalid" };
      const d = j.data || {};
      const plan = planFromBenefit(d.benefit_id);
      if (d.status !== "granted") return { ok: false, error: "status_" + d.status };
      if (!plan) return { ok: false, error: "unknown_product" };
      if (d.expires_at && new Date(d.expires_at) < new Date()) return { ok: false, error: "expired" };
      return { ok: true, plan, status: d.status, email: d.customer && d.customer.email, displayKey: d.display_key };
    }
  };

  /* ---------------- compra ---------------- */
  const Checkout = {
    url(plan, opts) {
      const base = (P.checkout || {})[plan]; if (!base) return null;
      const u = new URL(base);
      const em = (opts && opts.email) || (current && current.email);
      if (em) u.searchParams.set("customer_email", em);
      if (opts && opts.discount) u.searchParams.set("discount_code", opts.discount);
      u.searchParams.set("reference_id", (current ? current.uid : "anon") + "_" + plan);
      return u.href;
    },
    ready(plan) { return !!((P.checkout || {})[plan]); },
    go(plan, opts) { const u = Checkout.url(plan, opts); if (!u) { document.dispatchEvent(new CustomEvent("tono:soon", { detail: { plan } })); return false; } location.href = u; return true; }
  };

  /* ---------------- interfaz de cuenta ---------------- */
  const CSS = `
  .tn-modal{position:fixed;inset:0;z-index:100;display:none;align-items:center;justify-content:center;padding:16px;background:rgba(15,15,22,.55);backdrop-filter:blur(3px)}
  .tn-modal.on{display:flex}
  .tn-box{width:100%;max-width:420px;max-height:92vh;overflow:auto;background:var(--card,#fff);color:var(--fg,#17171C);border:1px solid var(--line,#DCDCE4);border-radius:14px;padding:26px;font-family:var(--sans,system-ui);box-shadow:0 20px 60px rgba(0,0,0,.25)}
  .tn-box h3{font-family:var(--serif,Georgia);font-weight:400;font-size:28px;margin:0 0 6px}
  .tn-tabs{display:flex;gap:4px;border:1px solid var(--line,#DCDCE4);border-radius:999px;padding:3px;margin:6px 0 18px}
  .tn-tabs button{flex:1;border:none;background:none;border-radius:999px;padding:8px;font:600 14px var(--sans,system-ui);color:var(--muted,#666);cursor:pointer}
  .tn-tabs button[aria-pressed="true"]{background:var(--fg,#17171C);color:var(--bg,#fff)}
  .tn-g{width:100%;display:flex;align-items:center;justify-content:center;gap:10px;border:1.5px solid var(--line,#DCDCE4);background:var(--bg,#fff);color:var(--fg,#17171C);border-radius:999px;padding:12px;font:600 15px var(--sans,system-ui);cursor:pointer}
  .tn-or{text-align:center;font-size:13px;color:var(--muted,#666);margin:14px 0}
  .tn-f label{display:block;font-size:13px;font-weight:600;margin:10px 0 4px}
  .tn-f input[type=text],.tn-f input[type=email],.tn-f input[type=password]{width:100%;box-sizing:border-box;border:1px solid var(--line,#DCDCE4);background:var(--bg,#fff);color:var(--fg,#17171C);border-radius:10px;padding:12px;font:16px var(--sans,system-ui)}
  .tn-chk{display:flex;gap:8px;align-items:flex-start;font-size:13px;margin-top:12px;line-height:1.4}
  .tn-chk input{margin-top:3px}
  .tn-chk a{color:var(--accent,#2337E6)}
  .tn-go{width:100%;margin-top:16px;border:none;border-radius:999px;padding:13px;font:600 15px var(--sans,system-ui);background:var(--cobalto,#2337E6);color:#fff;cursor:pointer}
  .tn-go:disabled{opacity:.5}
  .tn-msg{min-height:20px;font-size:13.5px;margin-top:10px;color:var(--tachon,#E5484D)}
  .tn-msg.ok{color:var(--ok,#1E8E5A)}
  .tn-link{border:none;background:none;color:var(--accent,#2337E6);font:13px var(--sans,system-ui);cursor:pointer;padding:0;margin-top:8px;text-decoration:underline}
  .tn-x{float:right;border:none;background:none;font-size:22px;cursor:pointer;color:var(--muted,#666)}
  .tn-demo{font-size:12.5px;background:color-mix(in srgb,var(--resaltador,#FFE14A) 35%,transparent);border-radius:8px;padding:8px 10px;margin-bottom:12px;line-height:1.4}
  .tn-acct{position:relative}
  .tn-av{width:38px;height:38px;border-radius:50%;border:none;background:var(--cobalto,#2337E6);color:#fff;font:700 15px var(--sans,system-ui);cursor:pointer}
  .tn-menu{position:absolute;right:0;top:46px;min-width:220px;background:var(--card,#fff);border:1px solid var(--line,#DCDCE4);border-radius:12px;padding:8px;box-shadow:0 10px 30px rgba(0,0,0,.15);display:none;z-index:60}
  .tn-menu.on{display:block}
  .tn-menu .who{font-size:13px;color:var(--muted,#666);padding:6px 8px 10px;border-bottom:1px solid var(--line,#DCDCE4);margin-bottom:6px;word-break:break-all}
  .tn-menu a,.tn-menu button{display:block;width:100%;text-align:left;border:none;background:none;padding:9px 8px;border-radius:8px;font:15px var(--sans,system-ui);color:var(--fg,#17171C);text-decoration:none;cursor:pointer}
  .tn-menu a:hover,.tn-menu button:hover{background:var(--soft,#EEEEF4)}`;

  let modal, mode = "login", afterAuth = null;
  function ensureModal() {
    if (modal) return modal;
    const st = document.createElement("style"); st.textContent = CSS; document.head.appendChild(st);
    modal = document.createElement("div"); modal.className = "tn-modal"; modal.setAttribute("role", "dialog"); modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("on")) close(); });
    document.body.appendChild(modal); return modal;
  }
  const gIcon = '<svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"/><path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/><path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z"/><path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 38.2 44 33 44 24c0-1.3-.1-2.4-.4-3.5z"/></svg>';
  function render() {
    ensureModal();
    if (mode === "verify") {
      modal.innerHTML = `<div class="tn-box"><button class="tn-x" data-tn="close" aria-label="${t("close")}">×</button><h3>${t("verifyTitle")}</h3><p style="font-size:15px;line-height:1.5">${t("verifyBody").replace("{email}", esc(current && current.email))}</p><button class="tn-go" data-tn="check">${t("verifiedCheck")}</button><button class="tn-link" data-tn="resend">${t("resend")}</button><div class="tn-msg" id="tnMsg" role="status"></div></div>`;
      return;
    }
    const su = mode === "signup";
    modal.innerHTML = `<div class="tn-box"><button class="tn-x" data-tn="close" aria-label="${t("close")}">×</button>
      ${DEMO ? `<div class="tn-demo">${t("demo")}</div>` : ""}
      <div class="tn-tabs"><button data-tn="mode-login" aria-pressed="${!su}">${t("login")}</button><button data-tn="mode-signup" aria-pressed="${su}">${t("signup")}</button></div>
      <button class="tn-g" data-tn="google">${gIcon}${t("google")}</button>
      <div class="tn-or">${t("or")}</div>
      <form class="tn-f" id="tnForm" novalidate>
        ${su ? `<label for="tnName">${t("name")}</label><input type="text" id="tnName" autocomplete="name">` : ""}
        <label for="tnEmail">${t("email")}</label><input type="email" id="tnEmail" autocomplete="email" required>
        <label for="tnPass">${t("password")}</label><input type="password" id="tnPass" autocomplete="${su ? "new-password" : "current-password"}" minlength="8" required>
        ${su ? `<label class="tn-chk"><input type="checkbox" id="tnConsent"><span>${t("consent")}</span></label><label class="tn-chk"><input type="checkbox" id="tnMkt"><span>${t("marketing")}</span></label>` : ""}
        <button class="tn-go" type="submit">${su ? t("submitSignup") : t("submitLogin")}</button>
        ${su ? "" : `<button type="button" class="tn-link" data-tn="forgot">${t("forgot")}</button>`}
        <div class="tn-msg" id="tnMsg" role="status"></div>
      </form></div>`;
    const f = modal.querySelector("#tnForm");
    f.addEventListener("submit", async (e) => {
      e.preventDefault(); const btn = f.querySelector(".tn-go"); const msg = modal.querySelector("#tnMsg"); msg.className = "tn-msg"; msg.textContent = "";
      const email = f.querySelector("#tnEmail").value, password = f.querySelector("#tnPass").value;
      try {
        btn.disabled = true;
        if (su) {
          if (!f.querySelector("#tnConsent").checked) { msg.textContent = t("needConsent"); return; }
          await Auth.signUp({ email, password, name: f.querySelector("#tnName").value.trim(), marketing: f.querySelector("#tnMkt").checked });
          mode = "verify"; render();
        } else { await Auth.signIn({ email, password }); done(); }
      } catch (er) { msg.textContent = err(er); } finally { btn.disabled = false; }
    });
    setTimeout(() => { const i = modal.querySelector(su ? "#tnName" : "#tnEmail"); i && i.focus(); }, 30);
  }
  function done() { close(); const f = afterAuth; afterAuth = null; if (current && current.provider === "password" && !current.verified) { open("verify", f); return; } f && f(current); }
  function open(m, cb) { ensureModal(); mode = m || "login"; if (cb) afterAuth = cb; render(); modal.classList.add("on"); }
  function close() { modal && modal.classList.remove("on"); }
  document.addEventListener("click", async (e) => {
    const b = e.target.closest("[data-tn]"); if (!b || !modal || !modal.contains(b)) return;
    const a = b.dataset.tn; const msg = modal.querySelector("#tnMsg");
    try {
      if (a === "close") close();
      else if (a === "mode-login") { mode = "login"; render(); }
      else if (a === "mode-signup") { mode = "signup"; render(); }
      else if (a === "google") { await Auth.google(); done(); }
      else if (a === "forgot") { await Auth.reset(modal.querySelector("#tnEmail").value); msg.className = "tn-msg ok"; msg.textContent = t("resetSent"); }
      else if (a === "resend") { await Auth.resend(); msg.className = "tn-msg ok"; msg.textContent = t("sent"); }
      else if (a === "check") { const u = await Auth.refresh(); if (u && u.verified) { close(); const f = afterAuth; afterAuth = null; f && f(u); } else { msg.className = "tn-msg"; msg.textContent = t("notVerified"); } }
    } catch (er) { if (msg) { msg.className = "tn-msg"; msg.textContent = err(er); } }
  });

  /* botón de cuenta para cabeceras: <div data-tono-account data-app="app.html"></div> */
  function mountAccount(el) {
    if (!el || !ACCOUNTS) return;
    const draw = () => {
      const app = el.dataset.app || "app.html";
      if (!current) { el.innerHTML = `<button class="btn btn-ghost tn-login" type="button">${t("login")}</button>`; el.querySelector("button").onclick = () => open("login", () => { if (el.dataset.redirect !== "0") location.href = app + "#" + lang; }); return; }
      const ini = (current.name || current.email || "?").trim().charAt(0).toUpperCase();
      el.innerHTML = `<div class="tn-acct"><button class="tn-av" type="button" aria-haspopup="true" title="${esc(current.email)}">${esc(ini)}</button><div class="tn-menu"><div class="who">${esc(current.email)}</div><a href="${app}#${lang}">${t("studio")}</a><button type="button" data-out>${t("logout")}</button></div></div>`;
      const menu = el.querySelector(".tn-menu");
      el.querySelector(".tn-av").onclick = (ev) => { ev.stopPropagation(); menu.classList.toggle("on"); };
      document.addEventListener("click", () => menu.classList.remove("on"));
      el.querySelector("[data-out]").onclick = () => Auth.signOut();
    };
    listeners.push(draw); draw();
  }

  window.Tono = {
    cloud: CLOUD, demo: DEMO, accounts: ACCOUNTS, config: C, ready, Auth, Data, License, Checkout, isEmail, esc,
    get user() { return current; },
    onUser(f) { listeners.push(f); f(current); },
    setLang(l) { if (LANGS.includes(l) && l !== lang) { lang = l; if (modal && modal.classList.contains("on")) render(); emit(); } },
    get lang() { return lang; },
    openAuth: open, closeAuth: close, mountAccount, t: (k) => t(k), errorText: err
  };
})();
