/* Renders content.js into the page and runs the interactions. */
(() => {
  "use strict";

  const S = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v = "") =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const ext = (url) => (/^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "");
  const ul = (cls, points = []) =>
    points.length ? `<ul class="${cls}">${points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : "";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Render ---------------- */
  const name = (S.name || "Your Name").trim();
  const words = name.split(/\s+/);
  $("#wm-a").textContent = words[0];
  $("#wm-b").textContent = words.slice(1).join("");
  $("#foot-text").textContent = `© ${new Date().getFullYear()} ${name}`;

  // Hero
  const rest = esc(words.slice(1).join(" "));
  $("#hero-role").textContent = [S.role, S.location].filter(Boolean).join(" · ");
  $("#hero-name").innerHTML = `${esc(words[0])}${rest ? ` <span class="tik">${rest}</span>` : ""}`;
  $("#hero-summary").textContent = S.summary || "";

  // About
  const a = S.about || {};
  $("#about-kicker").textContent = a.kicker || "";
  $("#about-body").innerHTML = `
    <figure class="fig reveal">
      <div class="fig__canvas">${
        a.photo ? `<img src="${esc(a.photo)}" alt="${esc(name)}" loading="lazy">` : `<span class="fig__ph">Your photo goes here<br>photo: "images/me.jpg"</span>`
      }</div>
      <figcaption><span>FIG. 1</span>${esc(a.caption || name)}</figcaption>
    </figure>
    <div class="about__text">
      ${(a.paragraphs || []).map((p, n) => `<p class="reveal${n ? "" : " lead"}" style="--d:${n * 0.08}s">${esc(p)}</p>`).join("")}
      <table class="meta-table reveal" style="--d:.16s"><tbody>
        ${(a.facts || [])
          .map(
            (f) =>
              `<tr><th scope="row">${esc(f.label)}</th><td>${(f.lines || [])
                .map((l, n) => (n ? `<small>${esc(l)}</small>` : esc(l)))
                .join("")}</td></tr>`
          )
          .join("")}
      </tbody></table>
    </div>`;

  // Skills
  const K = S.skills || {};
  $("#skills-note").textContent = K.note || "";
  $("#tiles").innerHTML = (K.items || [])
    .map(
      (s, n) => `<div class="skill-tile reveal" style="--d:${n * 0.05}s">${
        s.icon
          ? `<img src="${esc(s.icon)}" alt="" loading="lazy">`
          : `<span class="mono-ic c-${esc(s.color || "blue")}" aria-hidden="true">${esc(s.mono || s.name.slice(0, 2))}</span>`
      }<span>${esc(s.name)}</span></div>`
    )
    .join("");

  // Work (tabs)
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const duration = (dates = "") => {
    const marks = [...dates.matchAll(/([A-Za-z]{3})[a-z]*\.?\s+(\d{4})/g)]
      .map((m) => ({ mo: MONTHS.indexOf(m[1].toLowerCase()), yr: +m[2] }))
      .filter((d) => d.mo >= 0)
      .map((d) => d.yr * 12 + d.mo);
    if (/present/i.test(dates)) {
      const now = new Date();
      marks.push(now.getFullYear() * 12 + now.getMonth());
    }
    if (marks.length < 2) return "";
    const n = marks[marks.length - 1] - marks[0] + 1;
    if (n < 1) return "";
    const y = Math.floor(n / 12), m = n % 12;
    return [y && `${y} yr${y > 1 ? "s" : ""}`, m && `${m} mo${m > 1 ? "s" : ""}`].filter(Boolean).join(" ");
  };
  const W = S.work || [];
  $("#xp").innerHTML = `
    <div class="xp__tabs" role="tablist" aria-label="Roles">
      <span class="xp__ind" aria-hidden="true"></span>
      ${W.map(
        (j, n) => `<button class="xp__tab" type="button" role="tab" id="xp-tab-${n}" aria-controls="xp-panel-${n}" aria-selected="${!n}" tabindex="${n ? -1 : 0}">
          <span class="xp__logo c-${esc(j.color || "blue")}" aria-hidden="true">${esc(j.mono || (j.short || j.org || "").slice(0, 2))}</span>
          <span class="xp__label"><span class="xp__name">${esc(j.short || j.org)}</span><span class="xp__when">${esc(j.dates)}</span></span>
        </button>`
      ).join("")}
    </div>
    <div class="xp__right">
      <div class="xp__panels">
        ${W.map((j, n) => {
          const dur = duration(j.dates);
          return `<div class="xp__panel${n ? "" : " on"}" role="tabpanel" id="xp-panel-${n}" aria-labelledby="xp-tab-${n}">
            <h3 class="xp__role">${esc(j.role)}</h3>
            <p class="xp__org">${esc(j.org)}</p>
            <p class="xp__meta"><span>${esc(j.dates)}</span>${dur ? `<span class="dur">${dur}</span>` : ""}${j.place ? `<span>${esc(j.place)}</span>` : ""}</p>
            ${j.summary ? `<p class="xp__sum">${esc(j.summary)}</p>` : ""}
            ${ul("check", j.points)}
            ${(j.tags || []).length ? `<ul class="chips xp__tags">${j.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
          </div>`;
        }).join("")}
      </div>
      <div class="xp__foot">
        <span class="xp__count"><b id="xp-at">01</b> / ${pad(W.length)}</span>
        <span class="xp__arrows">
          <button class="xp__btn" type="button" data-step="-1" aria-label="Previous role">←</button>
          <button class="xp__btn" type="button" data-step="1" aria-label="Next role">→</button>
        </span>
      </div>
    </div>`;

  // Projects (case studies)
  $("#cards").innerHTML = (S.projects || [])
    .map((p, n) => {
      const facts = [
        ["Dates", p.dates],
        ["Context", p.context],
        ["Role", p.role],
        ["Tools", (p.tools || []).join(", ")],
      ].filter(([, v]) => v);
      return `<article class="case reveal">
        <header class="case__head">
          <span class="case__no">${pad(n + 1)}</span>
          <h3>${esc(p.title)}</h3>
          ${p.summary ? `<p class="case__sum">${esc(p.summary)}</p>` : ""}
        </header>
        <aside class="case__facts">
          <dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
        </aside>
        <div class="case__body">
          ${p.image ? `<figure class="case__media${p.fit === "contain" ? " is-contain" : ""}"><img src="${esc(p.image)}" alt="${esc(p.alt || p.title)}" loading="lazy"></figure>` : ""}
          ${ul("case__list", p.points)}
          ${p.link && p.link.url ? `<a class="case__link" href="${esc(p.link.url)}"${ext(p.link.url)}>${esc(p.link.label || "View")} ↗</a>` : ""}
        </div>
      </article>`;
    })
    .join("");

  // Volunteering
  const vol = S.volunteering || [];
  $("#volunteering").hidden = !vol.length;
  $("#volunteering-list").innerHTML = vol
    .map(
      (e) => `<article class="entry reveal">
        <p class="entry__dates">${esc(e.dates)}</p>
        <div>
          <h3>${esc(e.title)}</h3>
          <p class="entry__org"><b>${esc(e.org)}</b>${e.place ? ` · ${esc(e.place)}` : ""}</p>
          ${ul("list", e.points)}
        </div>
      </article>`
    )
    .join("");

  // Contact
  const C = S.contact || {};
  $("#contact-body").innerHTML = `
    ${C.text ? `<p>${esc(C.text)}</p>` : ""}
    ${C.email ? `<a class="contact__mail" href="mailto:${esc(C.email)}">${esc(C.email)}</a>` : ""}
    <div class="cta-row">${(C.links || [])
      .map((l) => `<a class="btn btn-ghost" href="${esc(l.url)}"${ext(l.url)}>${esc(l.label)} →</a>`)
      .join("")}</div>`;

  /* ---------------- Entrance + scroll reveal ---------------- */
  const play = () => document.documentElement.classList.add("play");
  const fallback = setTimeout(play, 1000);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => (clearTimeout(fallback), play()));

  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      }),
    { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
  );
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------------- Navbar: active link + mobile menu ---------------- */
  const navbar = $(".navbar");
  const toggle = $(".nav-toggle");
  const navLinks = $$(".nav-links a");
  const setMenu = (open) => {
    navbar.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };
  toggle.addEventListener("click", () => setMenu(!navbar.classList.contains("open")));
  navLinks.forEach((l) => l.addEventListener("click", () => setMenu(false)));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  const spy = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = e.target.id === "volunteering" ? "projects" : e.target.id; // no menu item of its own
        navLinks.forEach((l) => l.classList.toggle("on", l.getAttribute("href") === `#${id}`));
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  $$("main section[id]").forEach((s) => spy.observe(s));

  /* ---------------- Work tabs: click, arrow keys, buttons, swipe ---------------- */
  const xp = $("#xp");
  const tabsEl = $(".xp__tabs", xp);
  const tabs = $$(".xp__tab", xp);
  const panels = $$(".xp__panel", xp);
  const ind = $(".xp__ind", xp);
  let at = 0;
  const moveInd = (animate = true) => {
    const t = tabs[at];
    if (!t) return;
    if (!animate) ind.style.transition = "none";
    ind.style.width = `${t.offsetWidth}px`;
    ind.style.height = `${t.offsetHeight}px`;
    ind.style.transform = `translate(${t.offsetLeft}px, ${t.offsetTop}px)`;
    if (!animate) {
      void ind.offsetWidth; // apply the jump before turning the transition back on
      ind.style.transition = "";
    }
  };
  const select = (n, focus = false) => {
    if (!tabs.length) return;
    n = (n + tabs.length) % tabs.length;
    if (n !== at) xp.style.setProperty("--dir", n > at ? 1 : -1);
    at = n;
    tabs.forEach((t, k) => {
      t.setAttribute("aria-selected", String(k === n));
      t.tabIndex = k === n ? 0 : -1;
    });
    panels.forEach((p, k) => p.classList.toggle("on", k === n));
    $("#xp-at").textContent = pad(n + 1);
    moveInd();
    if (focus) tabs[n].focus({ preventScroll: true });
    if (tabsEl.scrollWidth > tabsEl.clientWidth) {
      tabsEl.scrollTo({ left: tabs[n].offsetLeft - 24, behavior: reduce ? "auto" : "smooth" });
    }
  };
  tabs.forEach((t, k) => t.addEventListener("click", () => select(k)));
  tabsEl.addEventListener("keydown", (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (step) select(at + step, true);
    else if (e.key === "Home") select(0, true);
    else if (e.key === "End") select(tabs.length - 1, true);
    else return;
    e.preventDefault();
  });
  $$(".xp__btn", xp).forEach((b) => b.addEventListener("click", () => select(at + +b.dataset.step)));
  const panelsEl = $(".xp__panels", xp);
  let sx = 0, sy = 0;
  panelsEl.addEventListener("touchstart", (e) => { sx = e.touches[0].clientX; sy = e.touches[0].clientY; }, { passive: true });
  panelsEl.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) select(at + (dx < 0 ? 1 : -1));
  }, { passive: true });
  moveInd(false);
  if ("ResizeObserver" in window) new ResizeObserver(() => moveInd(false)).observe(tabsEl);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => moveInd(false));
})();
