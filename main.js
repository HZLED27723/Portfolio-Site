/* Renders content.js into the page and runs the interactions. */
(() => {
  "use strict";

  const S = window.SITE || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (v = "") =>
    String(v).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
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

  // Projects: carousel cards (details open in a window, see "Projects carousel" below)
  const PR = S.projects || [];
  const yearOf = (p) => ((p.dates || "").match(/\d{4}(?!.*\d{4})/) || [""])[0];
  const cover = (p, n) =>
    p.image
      ? `<img src="${esc(p.image)}" alt="" draggable="false"${p.fit === "contain" ? ' class="is-contain"' : ""}>`
      : `<span class="pcard__cover" aria-hidden="true"><i>${esc([p.context, yearOf(p)].filter(Boolean).join(" · "))}</i><b>${pad(n + 1)}</b></span>`;
  // with only a few projects, repeat them so the ring looks full (repeats are hidden from screen readers)
  const copies = PR.length >= 3 ? Math.ceil(6 / PR.length) : 1;
  const slots = [];
  for (let c = 0; c < copies; c++) PR.forEach((p, n) => slots.push({ p, n, copy: c }));
  $("#cards").innerHTML = PR.length
    ? `<div class="ring__stage" id="ring-stage">
        ${slots
          .map(
            (s, i) => `<button class="pcard" type="button" data-n="${s.n}" data-i="${i}"${
              s.copy ? ' aria-hidden="true" tabindex="-1"' : ` aria-label="${esc(s.p.title)}: view details"`
            }>
              <span class="pcard__img">${cover(s.p, s.n)}</span>
              <span class="pcard__body">
                <span class="pcard__meta"><b>${pad(s.n + 1)}</b><span>${esc(s.p.kind || "Project")}</span></span>
                <span class="pcard__title">${esc(s.p.title)}</span>
                <span class="pcard__open">View details <span aria-hidden="true">→</span></span>
              </span>
            </button>`
          )
          .join("")}
      </div>
      <div class="ring__nav">
        <button class="ring__btn" type="button" data-step="-1" aria-label="Previous project">←</button>
        <span class="ring__count">Projects <b id="ring-at">01</b> / ${pad(PR.length)}</span>
        <button class="ring__btn" type="button" data-step="1" aria-label="Next project">→</button>
      </div>`
    : "";

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

  /* ---------------- Projects carousel ---------------- */
  const ring = $("#cards");
  const stage = $("#ring-stage");
  const pcards = stage ? $$(".pcard", stage) : [];
  const NS = pcards.length;
  let pos = 0, target = 0, spin = 0, lastT = 0, drag = null, hovering = false, focusInside = false, ringOn = false, modalOpen = false, quietFocus = false;
  const wrapD = (d) => {
    d = ((d % NS) + NS) % NS;
    return d > NS / 2 ? d - NS : d;
  };
  const front = () => (((Math.round(target) % NS) + NS) % NS);
  const layoutRing = () => {
    if (!NS) return;
    const w = pcards[0].offsetWidth;
    const narrow = ring.clientWidth < 640;
    const gap = w * (narrow ? 0.84 : 0.96);
    const tilt = narrow ? 16 : 24;
    const depth = narrow ? 70 : 110;
    pcards.forEach((c, i) => {
      const d = wrapD(i - pos);
      const a = Math.abs(d);
      c.style.transform = `translateX(-50%) translateX(${(d * gap).toFixed(1)}px) translateZ(${(-a * depth).toFixed(1)}px) rotateY(${(d * tilt).toFixed(2)}deg)`;
      c.style.opacity = clamp(2.6 - a, 0, 1).toFixed(3);
      c.style.zIndex = String(100 - Math.round(a * 10));
      c.style.pointerEvents = a > 2.1 ? "none" : "";
      c.classList.toggle("is-front", a < 0.5);
    });
    stage.style.height = `${pcards[0].offsetHeight + 34}px`;
    $("#ring-at").textContent = pad((+pcards[front()].dataset.n || 0) + 1);
    return gap;
  };
  const animateRing = (t) => {
    const dt = lastT ? Math.min((t - lastT) / 1000, 0.05) : 0.016;
    lastT = t;
    if (!drag) pos += (target - pos) * (1 - Math.exp(-dt * (reduce ? 60 : 7)));
    layoutRing();
    if (drag || Math.abs(target - pos) > 0.001) spin = requestAnimationFrame(animateRing);
    else {
      pos = target;
      layoutRing();
      spin = 0;
      lastT = 0;
    }
  };
  const kick = () => {
    if (!spin) spin = requestAnimationFrame(animateRing);
  };
  const goRing = (step) => {
    target = Math.round(target) + step;
    kick();
  };
  const toSlot = (i) => {
    target = Math.round(target) + wrapD(i - Math.round(target));
    kick();
  };
  // nearest slot showing project n
  const slotFor = (n) => {
    let best = 0, bestD = Infinity;
    pcards.forEach((c, i) => {
      const d = Math.abs(wrapD(i - Math.round(target)));
      if (+c.dataset.n === n && d < bestD) (best = i), (bestD = d);
    });
    return best;
  };

  if (NS) {
    layoutRing();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layoutRing);
    addEventListener("resize", layoutRing, { passive: true });

    $$(".ring__btn", ring).forEach((b) => b.addEventListener("click", () => goRing(+b.dataset.step)));
    ring.addEventListener("keydown", (e) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      e.preventDefault();
      goRing(e.key === "ArrowRight" ? 1 : -1);
      const f = pcards.find((c, i) => c.tabIndex === 0 && +c.dataset.n === +pcards[front()].dataset.n && !c.hasAttribute("aria-hidden"));
      if (f) f.focus({ preventScroll: true });
    });
    pcards.forEach((c, i) => c.addEventListener("focus", () => !drag && !quietFocus && toSlot(i)));

    // drag or swipe sideways; a tap opens the front card or turns a side card to the front
    stage.addEventListener("pointerdown", (e) => {
      if (e.button) return;
      drag = { x: e.clientX, y: e.clientY, start: pos, moved: false, card: e.target.closest(".pcard"), gap: layoutRing(), id: e.pointerId };
      kick();
    });
    stage.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 7 && Math.abs(dx) > Math.abs(e.clientY - drag.y)) {
        drag.moved = true;
        try {
          stage.setPointerCapture(e.pointerId);
        } catch (err) {
          /* pointer already gone */
        }
        stage.classList.add("is-dragging");
      }
      if (drag.moved) pos = drag.start - dx / drag.gap;
    });
    const release = (e) => {
      if (!drag) return;
      const d = drag;
      drag = null;
      stage.classList.remove("is-dragging");
      if (d.moved) {
        target = Math.round(pos);
      } else if (d.card && e.type === "pointerup") {
        const i = +d.card.dataset.i;
        if (Math.abs(wrapD(i - pos)) < 0.5) openProject(+d.card.dataset.n);
        else toSlot(i);
      }
      kick();
    };
    stage.addEventListener("pointerup", release);
    stage.addEventListener("pointercancel", release);
    // keyboard Enter / Space on a card
    stage.addEventListener("click", (e) => {
      const c = e.target.closest(".pcard");
      if (c && e.detail === 0) openProject(+c.dataset.n);
    });
    stage.addEventListener("dragstart", (e) => e.preventDefault());

    // turn on its own every few seconds while on screen
    ring.addEventListener("pointerenter", (e) => e.pointerType === "mouse" && (hovering = true));
    ring.addEventListener("pointerleave", (e) => e.pointerType === "mouse" && (hovering = false));
    ring.addEventListener("focusin", () => (focusInside = true));
    ring.addEventListener("focusout", () => (focusInside = false));
    new IntersectionObserver(([e]) => (ringOn = e.isIntersecting), { threshold: 0.35 }).observe(ring);
    if (!reduce && PR.length > 1) {
      setInterval(() => {
        if (ringOn && !hovering && !focusInside && !drag && !modalOpen && !document.hidden) goRing(1);
      }, 4200);
    }
  }

  /* ---------------- Project details window ---------------- */
  const pd = $("#pd");
  const pdBody = $("#pd-body");
  const pdPrev = $("#pd-prev");
  const pdNext = $("#pd-next");
  let pdAt = -1, closingTimer = 0;
  const fillProject = (n, dir) => {
    const p = PR[n];
    pdBody.style.setProperty("--dir", dir);
    const facts = [
      ["Dates", p.dates],
      ["Context", p.context],
      ["Role", p.role],
      ["Tools", (p.tools || []).join(", ")],
    ].filter(([, v]) => v);
    pdBody.innerHTML = `
      <span class="case__no">${pad(n + 1)} · ${esc(p.kind || "Project")}</span>
      <h3 id="pd-title">${esc(p.title)}</h3>
      ${p.summary ? `<p class="case__sum">${esc(p.summary)}</p>` : ""}
      ${p.image ? `<figure class="case__media${p.fit === "contain" ? " is-contain" : ""}"><img src="${esc(p.image)}" alt="${esc(p.alt || p.title)}"></figure>` : ""}
      ${facts.length ? `<dl class="facts">${facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>` : ""}
      ${(p.points || []).length ? `<h4>What I did</h4>${ul("case__list", p.points)}` : ""}
      ${p.link && p.link.url ? `<a class="case__link" href="${esc(p.link.url)}"${ext(p.link.url)}>${esc(p.link.label || "View")} ↗</a>` : ""}`;
    pdBody.scrollTop = 0;
    $("b", pdPrev).textContent = PR[(n - 1 + PR.length) % PR.length].title;
    $("b", pdNext).textContent = PR[(n + 1) % PR.length].title;
    pdPrev.hidden = pdNext.hidden = PR.length < 2;
    history.replaceState(null, "", `#project-${n + 1}`);
  };
  function openProject(n, dir = 1) {
    if (!pd || !PR[n]) return;
    clearTimeout(closingTimer);
    pd.classList.remove("is-closing");
    fillProject(n, dir);
    pdAt = n;
    if (NS) toSlot(slotFor(n));
    if (!pd.open) {
      if (typeof pd.showModal === "function") pd.showModal();
      else pd.setAttribute("open", "");
      modalOpen = true;
      $(".pd__close", pd).focus({ preventScroll: true });
    }
  }
  const closeProject = () => {
    if (!pd || !pd.open || pd.classList.contains("is-closing")) return;
    pd.classList.add("is-closing");
    closingTimer = setTimeout(() => {
      pd.classList.remove("is-closing");
      if (typeof pd.close === "function") pd.close();
      else pd.removeAttribute("open");
    }, reduce ? 0 : 190);
  };
  if (pd) {
    pd.addEventListener("close", () => {
      const n = pdAt;
      modalOpen = false;
      pdAt = -1;
      history.replaceState(null, "", location.pathname + location.search);
      // hand focus back to that project's card without turning the carousel
      const c = pcards.find((el) => +el.dataset.n === n && !el.hasAttribute("aria-hidden"));
      if (c) {
        quietFocus = true;
        c.focus({ preventScroll: true });
        quietFocus = false;
      }
    });
    pd.addEventListener("cancel", (e) => {
      e.preventDefault(); // Esc: close with the animation
      closeProject();
    });
    pd.addEventListener("click", (e) => {
      if (e.target.closest("[data-close]")) return closeProject();
      if (e.target === pd) {
        // a click on the dimmed backdrop lands on the dialog itself, outside its box
        const r = pd.getBoundingClientRect();
        if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) closeProject();
      }
    });
    const stepProject = (d) => pdAt >= 0 && openProject((pdAt + d + PR.length) % PR.length, d);
    pdPrev.addEventListener("click", () => stepProject(-1));
    pdNext.addEventListener("click", () => stepProject(1));
    pd.addEventListener("keydown", (e) => {
      if ((e.key === "ArrowLeft" || e.key === "ArrowRight") && !e.target.closest("a")) stepProject(e.key === "ArrowRight" ? 1 : -1);
    });
    // a link like .../#project-2 opens that project straight away
    const m = location.hash.match(/^#project-(\d+)$/);
    if (m && PR[+m[1] - 1]) {
      $("#projects").scrollIntoView();
      openProject(+m[1] - 1);
    }
  }
})();
