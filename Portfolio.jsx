'use client';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { D } from '../lib/i18n';

gsap.registerPlugin(ScrollTrigger);
const LANGS = ['en', 'ar', 'es', 'it'];
const Lang = createContext('en');
const tr = (l, k) => { const i = LANGS.indexOf(l) - 1; return i < 0 || !D[k] ? k : D[k][i]; };
const X = ({ k, as: E = 'span', ...p }) => {
  const l = useContext(Lang);
  return <E {...p} dangerouslySetInnerHTML={{ __html: tr(l, k) }} />;
};

const GH = 'https://github.com/DEVVOLTX';
const PROJECTS = [
  ['Andermagic', 'A challenging 2D platformer built for precision and skill. Every level is hand-crafted. All mechanics, levels and artwork designed solo in Godot 4.6 with GDScript.', ['GODOT 4.6', 'GDSCRIPT', '2D PLATFORMER'], 'Game Dev'],
  ['Hide and Sink', 'A multiplayer game of strategy and deception where players outwit each other with misdirection and timing. Co-developed with a partner, live on Itch.io.', ['MULTIPLAYER', 'CO-DEV', 'ITCH.IO'], 'Game Dev'],
  ['Car-Wash Booking', 'A full-stack reservation system: customers book slots, staff manage schedules from a full admin panel.', ['PHP', 'JAVASCRIPT', 'MYSQL', 'HTML/CSS'], 'Full-Stack Web'],
];
const CERTS = [
  ['TOFAS / SPRIX INC. & HIROSHIMA UNIVERSITY', 'JavaScript Level 1', 'April 2026', 'https://result.egy.programming-testing.com/certificate-check/0019d4b64cc2f9ed1c2452c78adbd1f23', 'ID: 0019d4b64cc2f9ed1c2452c78adbd1f23'],
  ['TOFAS / SPRIX INC. & HIROSHIMA UNIVERSITY', 'JavaScript Level 2', 'June 2026', 'https://result.egy.programming-testing.com/certificate-check/0019f0d371ef7f9e586b0ad84890bae40', 'ID: 0019f0d371ef7f9e586b0ad84890bae40'],
  ['CISCO NETWORKING ACADEMY', 'Networking Basics', 'May 2026', 'https://www.netacad.com/', ''],
  ['EF EDUCATION FIRST', 'EF SET English Certificate', 'June 2026 · Score 50/100 · B1 Intermediate (CEFR) · Reading C2 · Writing B2', 'https://cert.efset.org/9oACW4', ''],
];
const SKILLS = [['G', 'Godot', '#478cbf'], ['⎇', 'Git', '#f05133'], ['$_', 'Linux', '#fcc624'], ['K', 'Kali Linux', '#557c94'], ['Py', 'Python', '#3776ab'], ['JS', 'JavaScript', '#f7df1e'], ['PHP', 'PHP', '#777bb4'], ['DB', 'MySQL', '#00a3d9'], ['5', 'HTML/CSS', '#e34f26'], ['N', 'Nmap', '#4e9bcd'], ['B', 'Burp Suite', '#ff6633'], ['M', 'Metasploit', '#e60026']];
const CARS = ['BMW M4 Competition', 'Lamborghini Revuelto', 'BMW M5', 'Bugatti Tourbillon', 'Porsche 911 GT3 RS', 'Pagani Huayra Roadster BC', 'McLaren 750S', 'Koenigsegg Jesko Attack'];
const WORDS = ['Full-Stack Developer', 'Game Developer', 'Cybersecurity Enthusiast', 'Graphic Designer'];
const SOCIAL = [['GitHub', GH], ['Gmail', 'mailto:amrt6509@gmail.com'], ['Instagram', 'https://www.instagram.com/3am_our1430'], ['TikTok', 'https://www.tiktok.com/@amr_taha62'], ['X', 'https://x.com/Amr2043275'], ['Discord', 'https://discord.com/users/amr_taha62']];

function Fig({ src, cap, onOpen }) {
  return (
    <figure onClick={() => onOpen(src)}>
      <img loading="lazy" src={src} alt={cap} />
      {cap && <figcaption>{cap}</figcaption>}
    </figure>
  );
}

function ContactForm() {
  const l = useContext(Lang);
  const [st, setSt] = useState('idle');
  async function submit(e) {
    e.preventDefault();
    const f = e.currentTarget, fd = new FormData(f);
    setSt('sending');
    try {
      const r = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(fd)) });
      if (!r.ok) throw new Error((await r.json()).error);
      f.reset(); setSt('ok');
    } catch { setSt('err'); }
  }
  return (
    <form className="form" onSubmit={submit}>
      <input name="name" required minLength={2} maxLength={80} placeholder={tr(l, 'Your name')} aria-label={tr(l, 'Your name')} />
      <input name="email" type="email" required maxLength={254} placeholder={tr(l, 'Your email')} aria-label={tr(l, 'Your email')} />
      <textarea name="message" required minLength={10} maxLength={2000} rows={4} placeholder={tr(l, 'Your message')} aria-label={tr(l, 'Your message')} />
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn" disabled={st === 'sending'}>{tr(l, st === 'sending' ? 'Sending...' : 'Send message')}</button>
      <p className="msg" role="status">{st === 'ok' && tr(l, 'Message sent. Thank you!')}{st === 'err' && tr(l, 'Something went wrong. Try again.')}</p>
    </form>
  );
}

export default function Portfolio() {
  const [l, setL] = useState('en');
  const [open, setOpen] = useState(false);
  const [lb, setLb] = useState(null);
  const [ready, setReady] = useState(false);
  const typed = useRef(null);

  useEffect(() => { try { const s = localStorage.getItem('lang'); if (LANGS.includes(s)) setL(s); } catch {} }, []);
  useEffect(() => {
    document.documentElement.lang = l; document.documentElement.dir = l === 'ar' ? 'rtl' : 'ltr';
    try { localStorage.setItem('lang', l); } catch {}
    ScrollTrigger.refresh();
  }, [l]);

  /* typing effect starts after the intro */
  useEffect(() => {
    if (!ready) return;
    let wi = 0, ci = 0, del = false, id;
    const step = () => {
      const w = WORDS[wi]; ci += del ? -1 : 1;
      if (typed.current) typed.current.textContent = w.slice(0, ci);
      let d = del ? 35 : 80;
      if (!del && ci === w.length) { del = true; d = 1400; } else if (del && ci === 0) { del = false; wi = (wi + 1) % WORDS.length; d = 300; }
      id = setTimeout(step, d);
    };
    step(); return () => clearTimeout(id);
  }, [ready]);

  /* all GSAP + Lenis animation */
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { document.getElementById('intro')?.classList.add('done'); setReady(true); document.querySelectorAll('[data-n]').forEach((c) => (c.textContent = c.dataset.n)); return; }
    const lenis = new Lenis({ lerp: 0.09 });
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick); gsap.ticker.lagSmoothing(0);
    const onClick = (e) => { const a = e.target.closest('a[href^="#"]'); if (a) { e.preventDefault(); lenis.scrollTo(a.getAttribute('href'), { offset: -80 }); } };
    document.addEventListener('click', onClick);
    lenis.stop();

    const ctx = gsap.context(() => {
      /* intro: glitch logo + progress, then hero reveal */
      const o = { v: 0 };
      gsap.to('.intro-logo', { x: () => gsap.utils.random(-6, 6), skewX: () => gsap.utils.random(-10, 10), duration: 0.08, repeat: 18, yoyo: true, ease: 'none' });
      gsap.to(o, { v: 100, duration: 2.2, ease: 'power2.inOut',
        onUpdate: () => { document.getElementById('p').textContent = Math.round(o.v); document.querySelector('.bar i').style.width = o.v + '%'; },
        onComplete: () => {
          gsap.to('#intro', { autoAlpha: 0, duration: 0.8 }); lenis.start(); setReady(true);
          gsap.timeline({ defaults: { ease: 'power4.out' } })
            .fromTo('.photo .frame', { opacity: 0, scale: 0.2, rotate: 8, filter: 'blur(30px)', clipPath: 'circle(0% at 50% 50%)' },
              { opacity: 1, scale: 1, rotate: 0, filter: 'blur(0px)', clipPath: 'circle(150% at 50% 50%)', duration: 1.8, ease: 'expo.out' })
            .from('.hero > div:first-child > *', { y: 30, opacity: 0, filter: 'blur(10px)', stagger: 0.12, duration: 1 }, '-=1.3');
          gsap.to('.photo', { y: 10, duration: 4, repeat: -1, yoyo: true, ease: 'sine.inOut' });
        } });
      gsap.to('.photo', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: '.hero', scrub: true } });

      /* generic section reveals */
      gsap.utils.toArray('section .rv > *').forEach((el) =>
        gsap.from(el, { y: 40, opacity: 0, filter: 'blur(8px)', duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
      ScrollTrigger.batch('.card,.tile,.gal figure', { start: 'top 90%', once: true,
        onEnter: (b) => gsap.from(b, { y: 30, opacity: 0, scale: 0.94, stagger: 0.08, duration: 0.9, ease: 'power3.out', overwrite: true }) });
      gsap.utils.toArray('[data-n]').forEach((c) => { const n = { v: 0 };
        gsap.to(n, { v: +c.dataset.n, duration: 1.6, ease: 'power1.out', onUpdate: () => (c.textContent = Math.round(n.v)), scrollTrigger: { trigger: c, start: 'top 92%', once: true } }); });

      /* showcase: scroll-scrubbed title wipes, core pulse, chart draw, steps */
      gsap.utils.toArray('.xl').forEach((el) =>
        gsap.fromTo(el, { clipPath: 'inset(0 100% 0 0)', x: -60, opacity: 0.2 }, { clipPath: 'inset(0 0% 0 0)', x: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 50%', scrub: 1 } }));
      gsap.fromTo('.core', { scale: 0.4, rotate: -90, opacity: 0 }, { scale: 1, rotate: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '.core', start: 'top 92%', end: 'top 55%', scrub: 1 } });
      gsap.fromTo('.dash path', { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.dash', start: 'top 80%', end: 'bottom 60%', scrub: 1 } });
      gsap.from('.steps div', { y: 40, opacity: 0, stagger: 0.18, duration: 0.9, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.steps', start: 'top 88%', once: true } });

      /* cursor */
      const dx = gsap.quickTo('#cd', 'x', { duration: 0.05 }), dy = gsap.quickTo('#cd', 'y', { duration: 0.05 });
      const rx = gsap.quickTo('#cr', 'x', { duration: 0.35 }), ry = gsap.quickTo('#cr', 'y', { duration: 0.35 });
      window.__mm = (e) => { gsap.set(['#cd', '#cr'], { opacity: 1 }); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); document.getElementById('cr').classList.toggle('hv', !!e.target.closest('a,button,.card,figure,.tile')); };
      window.addEventListener('mousemove', window.__mm);
    });
    return () => { ctx.revert(); lenis.destroy(); gsap.ticker.remove(tick); document.removeEventListener('click', onClick); window.removeEventListener('mousemove', window.__mm); };
  }, []);

  useEffect(() => { const k = (e) => e.key === 'Escape' && setLb(null); addEventListener('keydown', k); return () => removeEventListener('keydown', k); }, []);

  return (
    <Lang.Provider value={l}>
      <div id="intro"><div className="intro-in"><div className="intro-logo">A.ESSAM</div><div className="bar"><i /></div><div className="pct">Initializing... <span id="p">0</span>%</div></div></div>
      <div className="fx grid" /><div className="fx stars" /><div className="orb" /><div className="fx noise" /><div className="fx vig" />
      <div id="cd" /><div id="cr" />
      {lb && <div id="lb" className="on" onClick={() => setLb(null)}><img src={lb} alt="" /></div>}

      <header>
        <nav className={`nav${open ? ' open' : ''}`}>
          <a href="#home" className="brand">A.ESSAM</a>
          <div className="links" onClick={() => setOpen(false)}>
            {[['about', 'ABOUT'], ['projects', 'PROJECTS'], ['skills', 'SKILLS'], ['certs', 'CERTS'], ['design', 'DESIGN'], ['contact', 'CONTACT']].map(([id, k]) => <a key={id} href={`#${id}`}><X k={k} /></a>)}
          </div>
          <select id="lang" aria-label="Language" value={l} onChange={(e) => setL(e.target.value)}>
            {LANGS.map((c) => <option key={c} value={c}>{c.toUpperCase()}</option>)}
          </select>
          <a className="btn" href="/amr_essam_cv.pdf" download>CV ↓</a>
          <button className="burger" onClick={() => setOpen(!open)} aria-label="Menu">MENU</button>
        </nav>
      </header>

      <main>
        <section className="hero" id="home">
          <div>
            <X k="SOFTWARE ENGINEER &amp; CREATIVE DEVELOPER" as="div" className="tag" />
            <h1 className="shiny">AMR<br />ESSAM</h1>
            <div className="typed" ref={typed} />
            <X k="Software Engineering student based in Kafr El Dawar, Egypt. I build immersive games, secure systems, and creative visual projects." as="p" className="lead" />
            <div className="cta"><a className="btn" href="#projects"><X k="VIEW WORK" /></a><a className="btn ghost" href="/amr_essam_cv.pdf" download><X k="DOWNLOAD CV" /></a></div>
          </div>
          <div className="photo"><div className="frame"><img src="/images/avatar.png" alt="Amr Essam profile photo" /></div><b className="t" /><b className="r" /><b className="bm" /><b className="l" /></div>
        </section>
        <div className="marquee"><div>{'FULL-STACK • CYBERSECURITY • GODOT ENGINE • GAME DEV • GRAPHIC DESIGN • PYTHON • JAVASCRIPT • '.repeat(4)}</div></div>

        <section id="about"><div className="rv">
          <X k="Building robust systems, crafting immersive games, and breaking digital fortresses." as="h2" />
          <X k="My expertise spans the entire stack, from frontend interfaces to backend architecture and game engines. I treat engineering as a medium for interactive experiences and secure infrastructure." as="p" className="sub" />
          <div className="g2">
            <div className="card"><X k="Education" as="h3" /><X k="Salah Salem High School<br>General Secondary Education<br>2026 — 2028" as="p" /></div>
            <div className="card stats" style={{ gridTemplateColumns: 'repeat(2,1fr)' }}>
              {[[3, 'PROJECTS'], [4, 'CERTIFICATES'], [6, 'LOGOS'], [8, 'CAR POSTERS']].map(([n, k]) => <div key={k}><strong data-n={n}>0</strong><X k={k} /></div>)}
            </div>
          </div>
        </div></section>

        <section id="projects"><div className="rv">
          <X k="Selected projects" as="h2" /><X k="Games and full-stack systems, built solo or with a partner." as="p" className="sub" />
          <div className="g3">
            {PROJECTS.map(([n, d, tags, type]) => (
              <div className="card" key={n}><h3>{n}</h3><X k={d} as="p" />
                <div className="pills">{tags.map((t) => <span key={t}>{t}</span>)}</div>
                <div className="meta"><div><X k="YEAR" /><b>2024</b></div><div><X k="TYPE" /><b><X k={type} /></b></div></div>
                <a className="link" href={GH} target="_blank" rel="noopener noreferrer"><X k="View on GitHub" /></a></div>
            ))}
          </div>
        </div></section>

        <section id="skills"><div className="rv">
          <X k="My Skills" as="h2" /><X k="Tools, engines and security tooling I work with." as="p" className="sub" />
          <div className="tiles">{SKILLS.map(([m, n, c]) => <div className="tile" key={n} style={{ color: c }}><b>{m}</b>{n}</div>)}</div>
        </div></section>

        <section id="certs"><div className="rv">
          <X k="Certificates" as="h2" /><X k="Verified credentials, each with a public check link." as="p" className="sub" />
          <div className="g2">
            {CERTS.map(([org, t, date, url, id]) => (
              <div className="card cert" key={t}><small>{org}</small><h3>{t}</h3><p>{date}</p>{id && <p className="id">{id}</p>}
                <a className="link" href={url} target="_blank" rel="noopener noreferrer"><X k="View certificate" /></a></div>
            ))}
          </div>
        </div></section>

        <div className="sh"><div className="core">CORE</div><X k="SYSTEMS" as="h3" className="xl" /><X k="Games and sites are only one layer. <b>I connect interfaces, data, logic and security</b> into one coherent system." as="p" /></div>
        <div className="sh"><small><X k="01 / DIGITAL EXPERIENCE" /></small><X k="WEB<em>SITES</em>" as="h3" className="xl" /><X k="Interfaces built to communicate, <b>hold attention</b>, and make a product feel as strong as the technology behind it." as="p" /></div>
        <div className="sh"><small><X k="02 / APPLICATION" /></small><X k="<em>WEB</em> APPS" as="h3" className="xl" /><X k="From dashboards to complex workflows, <b>every interaction is designed around a real user action</b>." as="p" />
          <div className="dash"><header><span><b>BOOKING</b>SYSTEM</span><i>● ONLINE</i></header>
            <div className="tl">{[['BOOK', 'Slots'], ['SCHEDULE', 'Staff'], ['MANAGE', 'Admin']].map(([k, v]) => <div key={k}><X k={k} /><strong>{v}</strong></div>)}</div>
            <svg viewBox="0 0 400 110" preserveAspectRatio="none"><path pathLength="1" d="M0 95 C60 85,90 62,140 64 S220 42,280 40 S340 22,400 10" /></svg>
            <footer>Customer booking • Staff schedule • Admin panel</footer></div></div>
        <div className="sh"><small><X k="PROCESS / DELIVERY" /></small><X k="IDEAS <em>→</em> CODE" as="h3" className="xl" /><X k="I turn ideas into clean structure and working code. <b>Every decision has a purpose.</b>" as="p" />
          <div className="steps">{[['◇', 'CONCEPT'], ['</>', 'BUILD'], ['↗', 'SHIP']].map(([i, k]) => <div key={k}><span>{i}</span><X k={k} /></div>)}</div></div>

        <section id="design"><div className="rv">
          <X k="Logo projects" as="h2" /><X k="Brand marks designed from scratch." as="p" className="sub" />
          <div className="gal">{[1, 2, 3, 4, 5, 6].map((i) => <Fig key={i} src={`/images/logo${i}.jpg`} cap="" onOpen={setLb} />)}</div>
          <X k="Car posters" as="h2" style={{ marginTop: 80 }} /><X k="Cinematic poster edits of hypercars and sports cars." as="p" className="sub" />
          <div className="gal tall">{CARS.map((c, i) => <Fig key={c} src={`/images/car${i + 1}.jpg`} cap={c} onOpen={setLb} />)}</div>
          <X k="Client work" as="h2" style={{ marginTop: 80 }} /><X k="Branding and photo editing for real clients." as="p" className="sub" />
          <div className="gal tall"><Fig src="/images/client1.jpg" cap="Hamo Samy — personal branding poster" onOpen={setLb} /><Fig src="/images/client2.jpg" cap="Mohammed — cinematic neon edit" onOpen={setLb} /></div>
        </div></section>

        <section id="contact"><div className="rv">
          <X k="LET'S BUILD<br>THE FUTURE" as="div" className="big shiny" />
          <ContactForm />
          <div className="soc">{SOCIAL.map(([n, u]) => <a key={n} href={u} target="_blank" rel="noopener noreferrer">{n}</a>)}</div>
        </div></section>
      </main>
      <footer>© 2026 AMR ESSAM · KAFR EL DAWAR, EGYPT</footer>
    </Lang.Provider>
  );
}
