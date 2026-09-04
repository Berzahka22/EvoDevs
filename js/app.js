       const $ = (selector, context = document) => context.querySelector(selector);
      const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));
      const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* =========================================
         LOGIQUE INTRO / SPLASH SCREEN
         ========================================= */
      const introScreen = document.getElementById('intro-screen');
      const introStage = document.getElementById('intro-stage');
      const bodyTag = document.getElementById('body-tag');
      let siteInitialized = false;

      function startIntro() {
        introStage.classList.add('play');
      }

      function enterSite() {
        introScreen.classList.add('hidden-intro');
        bodyTag.classList.remove('overflow-hidden'); // Réactive le scroll
        
        // Initialise les animations du site principal SEULEMENT maintenant
        if (!siteInitialized) {
          initSiteAnimations();
          siteInitialized = true;
        }
        
        // Supprime l'intro du DOM après la transition pour libérer la mémoire
        setTimeout(() => {
          introScreen.remove();
        }, 800);
      }

      document.getElementById('discover-btn').addEventListener('click', enterSite);
      document.getElementById('skip-btn').addEventListener('click', enterSite);

      // Lance l'intro au chargement
      window.addEventListener('load', startIntro);


      /* =========================================
         LOGIQUE SITE PRINCIPAL
         ========================================= */
      function initSiteAnimations() {
        
        /* Thème */
        const themeToggle = $("#theme-toggle");
        const sunIcon = $("#sun-icon");
        const moonIcon = $("#moon-icon");
        function updateThemeUI() {
          const dark = document.documentElement.classList.contains("dark");
          themeToggle.setAttribute("aria-pressed", String(dark));
          sunIcon.classList.toggle("hidden", dark);
          moonIcon.classList.toggle("hidden", !dark);
        }
        themeToggle.addEventListener("click", () => {
          document.documentElement.classList.toggle("dark");
          localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
          updateThemeUI();
        });
        updateThemeUI();

        /* Header scroll */
        const siteHeader = $("#site-header");
        const headerClasses = ["bg-paper/85", "dark:bg-night-950/85", "shadow-sm", "border-slate-200/70", "dark:border-white/10", "glass"];
        function updateHeader() {
          if (window.scrollY > 20) siteHeader.classList.add(...headerClasses);
          else siteHeader.classList.remove(...headerClasses);
        }
        window.addEventListener("scroll", updateHeader, { passive: true });
        updateHeader();

        /* Menu mobile */
        const mobileMenuButton = $("#mobile-menu-button");
        const mobileMenu = $("#mobile-menu");
        const menuOpenIcon = $("#menu-open-icon");
        const menuCloseIcon = $("#menu-close-icon");
        function toggleMobileMenu(force) {
          const expanded = force ?? mobileMenuButton.getAttribute("aria-expanded") !== "true";
          mobileMenuButton.setAttribute("aria-expanded", String(expanded));
          mobileMenu.classList.toggle("hidden", !expanded);
          menuOpenIcon.classList.toggle("hidden", expanded);
          menuCloseIcon.classList.toggle("hidden", !expanded);
          document.body.classList.toggle("overflow-hidden", expanded);
        }
        mobileMenuButton.addEventListener("click", () => toggleMobileMenu());
        $$("#mobile-menu a").forEach((link) => link.addEventListener("click", () => toggleMobileMenu(false)));
        window.addEventListener("keydown", (event) => { if (event.key === "Escape" && !mobileMenu.classList.contains("hidden")) toggleMobileMenu(false); });

        /* Reveal au scroll */
        const revealObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); }
          });
        }, { threshold: 0.15 });
        $$("[data-reveal]").forEach((element) => {
          if (element.dataset.revealDelay) element.style.transitionDelay = `${element.dataset.revealDelay}ms`;
          revealObserver.observe(element);
        });

        /* Compteurs */
        const counterObserver = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const element = entry.target;
            const target = Number(element.dataset.counter);
            const suffix = element.dataset.suffix || "";
            const duration = 1600; const start = performance.now();
            function update(now) {
              const progress = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              element.textContent = `${Math.floor(eased * target)}${suffix}`;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
            counterObserver.unobserve(element);
          });
        }, { threshold: 0.5 });
        $$("[data-counter]").forEach((counter) => counterObserver.observe(counter));

        /* Équipe */
        const teamMembers = [
          { id: "BenYaAmiN", name: "Berzahka Bebdanne Benyaamin", role: "Directeur", image: "./img/ben.png", short: "Lead Front", location: "DOUALA, Cameroun", availability: "Disponible", portfolio: "https://example.com/sarah", email: "sarah.ben@evodevs.fr", phone: "+33 6 11 22 33 44", github: "https://github.com", linkedin: "https://linkedin.com", bio: "Benyaamin pilote la qualité frontend de l'équipe : interfaces rapides, accessibles et élégantes, avec une forte culture du détail et de la performance.", skills: ["React", "Next.js", "Tailwind", "TypeScript", "Accessibilité", "Design System"], experience: [{ period: "2022 — Aujourd'hui", role: "Lead Frontend", company: "EvoDevs", description: "Direction technique frontend, design systems et accompagnement des développeurs." }, { period: "2019 — 2022", role: "Développeuse Frontend Senior", company: "Nova Studio", description: "Applications SaaS complexes et optimisation des performances d'interfaces critiques." }] },
          { id: "mehdi", name: "Mehdi K.", role: "Lead Backend", image: " ", short: "Architecture backend, API sécurisées, bases de données et scalabilité.", location: "Lyon, France", availability: "Disponible", portfolio: "https://example.com/mehdi", email: "mehdi.k@evodevs.fr", phone: "+33 6 22 33 44 55", github: "https://github.com", linkedin: "https://linkedin.com", bio: "Mehdi conçoit des architectures backend fiables et scalables : API performantes, sécurité des données et systèmes maintenables dans le temps.", skills: ["Node.js", "PostgreSQL", "GraphQL", "NestJS", "MongoDB", "Sécurité"], experience: [{ period: "2021 — Aujourd'hui", role: "Lead Backend", company: "EvoDevs", description: "Conception d'API métier, qualité logicielle et bonnes pratiques DevOps." }, { period: "2018 — 2021", role: "Développeur Backend", company: "Finlyse", description: "Services financiers, fortes volumétries et données sensibles." }] },
          { id: "lea", name: "Léa Dubois", role: "Product Designer", image: " ", short: "Design d'interfaces élégantes, parcours utilisateurs et design systems cohérents.", location: "Bordeaux, France", availability: "Disponible", portfolio: "https://example.com/lea", email: "lea.dubois@evodevs.fr", phone: "+33 6 33 44 55 66", github: "https://github.com", linkedin: "https://linkedin.com", bio: "Léa transforme des besoins complexes en expériences simples et désirables, au croisement du design produit, de l'UX et du branding.", skills: ["Figma", "UX", "UI", "Design System", "Prototypage", "Accessibilité"], experience: [{ period: "2022 — Aujourd'hui", role: "Product Designer", company: "EvoDevs", description: "Design d'applications web et mobiles, design systems et tests utilisateurs." }, { period: "2019 — 2022", role: "UI/UX Designer", company: "Studio Nova", description: "Interfaces pour startups et scale-ups, focus conversion." }] },
          { id: "amine", name: "Amine T.", role: "DevOps Engineer", image: " ", short: "Automatisation, déploiement continu, monitoring et infrastructure cloud.", location: "Remote", availability: "Disponible", portfolio: "https://example.com/amine", email: "amine.t@evodevs.fr", phone: "+33 6 44 55 66 77", github: "https://github.com", linkedin: "https://linkedin.com", bio: "Amine garantit la fiabilité et la performance des déploiements : CI/CD, infrastructure cloud et monitoring pour livrer vite et sereinement.", skills: ["Docker", "CI/CD", "AWS", "GitHub Actions", "Monitoring", "Vercel"], experience: [{ period: "2021 — Aujourd'hui", role: "DevOps Engineer", company: "EvoDevs", description: "Pipelines CI/CD, infrastructure as code et supervision production." }, { period: "2018 — 2021", role: "Cloud Engineer", company: "TechFlow", description: "Migration cloud, haute disponibilité et optimisation des coûts." }] },
        ];

        const teamTrack = $("#team-track");
        const teamDots = $("#team-dots");
        let teamAutoplay = null;

        teamTrack.innerHTML = teamMembers.map((member) => `
          <button type="button" data-member-id="${member.id}" aria-haspopup="dialog" aria-label="Ouvrir le profil de ${member.name}" class="team-card group relative w-[280px] shrink-0 snap-start rounded-[2rem] border border-slate-200 bg-white p-3 text-left transition duration-500 hover:-translate-y-2 hover:border-brand-600/50 hover:shadow-2xl hover:shadow-brand-600/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-white/10 dark:bg-night-800 dark:hover:border-brand-400/50 dark:hover:shadow-brand-400/15 md:w-[320px]">
            <div class="relative h-[430px] overflow-hidden rounded-[1.65rem]">
              <img src="${member.image}" alt="Portrait de ${member.name}" loading="lazy" class="h-full w-full object-cover transition duration-700 group-hover:scale-110" />
              <div class="absolute inset-0 bg-gradient-to-t from-night-950 via-night-950/35 to-transparent opacity-90"></div>
              <div class="absolute left-4 top-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-night-950/70 px-3 py-1 text-xs font-semibold text-brand-300 backdrop-blur"><span class="h-2 w-2 animate-pulseSoft rounded-full bg-brand-400"></span>${member.availability}</div>
              <div class="absolute right-4 top-4 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-brand-500 text-white opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-5 w-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg></div>
              <div class="absolute inset-x-5 bottom-5">
                <p class="text-xs font-bold uppercase tracking-[0.24em] text-brand-300">${member.role}</p>
                <h3 class="mt-2 text-2xl font-extrabold text-white">${member.name}</h3>
                <p class="mt-3 text-sm leading-6 text-slate-300">${member.short}</p>
                <div class="mt-5 flex flex-wrap gap-2">${member.skills.slice(0, 3).map((skill) => `<span class="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">${skill}</span>`).join("")}</div>
                <p class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-300">Voir le profil détaillé<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="h-4 w-4 transition duration-300 group-hover:translate-x-1" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25 21 12l-3.75 3.75M21 12H3" /></svg></p>
              </div>
            </div>
          </button>`).join("");

        function teamStep() { const card = teamTrack.querySelector(".team-card"); return card ? card.offsetWidth + 24 : 320; }
        teamDots.innerHTML = teamMembers.map((_, index) => `<button type="button" data-dot-index="${index}" aria-label="Aller au membre ${index + 1}" class="h-2.5 w-2.5 rounded-full bg-slate-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-white/20"></button>`).join("");

        function updateTeamDots() {
          const activeIndex = Math.min(teamMembers.length - 1, Math.max(0, Math.round(teamTrack.scrollLeft / teamStep())));
          $$("#team-dots button").forEach((dot, index) => {
            const active = index === activeIndex;
            dot.classList.toggle("w-8", active); dot.classList.toggle("bg-brand-600", active); dot.classList.toggle("dark:bg-brand-400", active);
            dot.classList.toggle("w-2.5", !active); dot.classList.toggle("bg-slate-300", !active); dot.classList.toggle("dark:bg-white/20", !active);
          });
        }

        $("#team-prev").addEventListener("click", () => teamTrack.scrollBy({ left: -teamStep(), behavior: "smooth" }));
        $("#team-next").addEventListener("click", () => teamTrack.scrollBy({ left: teamStep(), behavior: "smooth" }));
        teamDots.addEventListener("click", (event) => { const dot = event.target.closest("[data-dot-index]"); if (!dot) return; teamTrack.scrollTo({ left: Number(dot.dataset.dotIndex) * teamStep(), behavior: "smooth" }); });
        teamTrack.addEventListener("scroll", updateTeamDots, { passive: true });
        window.addEventListener("resize", updateTeamDots);

        function startTeamAutoplay() { if (prefersReducedMotion) return; stopTeamAutoplay(); teamAutoplay = setInterval(() => { const max = teamTrack.scrollWidth - teamTrack.clientWidth; if (teamTrack.scrollLeft >= max - 10) teamTrack.scrollTo({ left: 0, behavior: "smooth" }); else teamTrack.scrollBy({ left: teamStep(), behavior: "smooth" }); }, 4500); }
        function stopTeamAutoplay() { clearInterval(teamAutoplay); }
        teamTrack.addEventListener("pointerenter", stopTeamAutoplay); teamTrack.addEventListener("pointerleave", startTeamAutoplay);
        teamTrack.addEventListener("focusin", stopTeamAutoplay); teamTrack.addEventListener("focusout", startTeamAutoplay);
        updateTeamDots(); startTeamAutoplay();

        /* Modal Équipe */
        const modal = $("#member-modal"); const modalBackdrop = $("#modal-backdrop"); const modalPanel = $("#modal-panel"); let lastFocused = null;
        function openModal(member) {
          lastFocused = document.activeElement;
          $("#modal-image").src = member.image; $("#modal-image").alt = `Portrait de ${member.name}`;
          $("#modal-availability").textContent = member.availability; $("#modal-role").textContent = member.role;
          $("#modal-name").textContent = member.name; $("#modal-location").textContent = member.location; $("#modal-bio").textContent = member.bio;
          $("#modal-skills").innerHTML = member.skills.map((skill) => `<span class="rounded-full border border-brand-600/20 bg-brand-600/10 px-4 py-2 text-sm font-semibold text-brand-700 dark:border-brand-400/20 dark:bg-brand-400/10 dark:text-brand-300">${skill}</span>`).join("");
          $("#modal-experience").innerHTML = member.experience.map((exp) => `<li class="rounded-2xl border border-slate-200 bg-paper p-5 dark:border-white/10 dark:bg-night-900"><p class="text-xs font-bold uppercase tracking-[0.22em] text-brand-600 dark:text-brand-300">${exp.period}</p><h4 class="mt-2 text-base font-bold text-ink dark:text-white">${exp.role} · ${exp.company}</h4><p class="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">${exp.description}</p></li>`).join("");
          $("#modal-portfolio").href = member.portfolio; $("#modal-email").href = `mailto:${member.email}`; $("#modal-email-label").textContent = member.email;
          $("#modal-phone").href = `tel:${member.phone.replace(/\s/g, "")}`; $("#modal-phone-label").textContent = member.phone;
          $("#modal-socials").innerHTML = `<a href="${member.github}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:text-brand-700 dark:border-white/10 dark:bg-night-900 dark:text-white dark:hover:text-brand-300">GitHub</a><a href="${member.linkedin}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:text-brand-700 dark:border-white/10 dark:bg-night-900 dark:text-white dark:hover:text-brand-300">LinkedIn</a>`;
          modal.classList.remove("hidden"); modal.classList.add("flex"); document.body.style.overflow = "hidden";
          requestAnimationFrame(() => { modalBackdrop.classList.remove("opacity-0"); modalBackdrop.classList.add("opacity-100"); modalPanel.classList.remove("opacity-0", "scale-95", "translate-y-6"); modalPanel.classList.add("opacity-100", "scale-100", "translate-y-0"); });
          $("#modal-close").focus(); document.addEventListener("keydown", onModalKeydown);
        }
        function closeModal() {
          modalBackdrop.classList.add("opacity-0"); modalBackdrop.classList.remove("opacity-100"); modalPanel.classList.add("opacity-0", "scale-95", "translate-y-6"); modalPanel.classList.remove("opacity-100", "scale-100", "translate-y-0");
          setTimeout(() => { modal.classList.add("hidden"); modal.classList.remove("flex"); document.body.style.overflow = ""; }, 250);
          document.removeEventListener("keydown", onModalKeydown); if (lastFocused) lastFocused.focus();
        }
        function onModalKeydown(event) {
          if (event.key === "Escape") return closeModal(); if (event.key !== "Tab") return;
          const focusables = Array.from(modalPanel.querySelectorAll('a[href], button:not([disabled])')); if (!focusables.length) return;
          const first = focusables[0]; const last = focusables[focusables.length - 1];
          if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
        teamTrack.addEventListener("click", (event) => { const card = event.target.closest("[data-member-id]"); if (!card) return; const member = teamMembers.find((item) => item.id === card.dataset.memberId); if (member) openModal(member); });
        $("#modal-close").addEventListener("click", closeModal); modalBackdrop.addEventListener("click", closeModal);

        /* Projets filtres */
        const filterButtons = $$(".filter-button"); const projectCards = $$(".project-card");
        const activeClasses = ["border-ink", "bg-ink", "text-white", "dark:border-white", "dark:bg-white", "dark:text-night-950"];
        const inactiveClasses = ["border-slate-200", "bg-white", "text-slate-700", "hover:border-brand-600/40", "hover:text-brand-700", "dark:border-white/10", "dark:bg-night-800", "dark:text-slate-300", "dark:hover:text-brand-300"];
        filterButtons.forEach((button) => {
          button.addEventListener("click", () => {
            filterButtons.forEach((btn) => { const isActive = btn === button; btn.classList.remove(...(isActive ? inactiveClasses : activeClasses)); btn.classList.add(...(isActive ? activeClasses : inactiveClasses)); btn.setAttribute("aria-pressed", String(isActive)); });
            const filter = button.dataset.filter;
            projectCards.forEach((card) => {
              const show = filter === "all" || card.dataset.category === filter;
              card.classList.toggle("hidden", !show);
              if (show) { card.classList.remove("animate-cardIn"); void card.offsetWidth; card.classList.add("animate-cardIn"); }
            });
          });
        });

        /* Témoignages */
        const testimonialTrack = $("#testimonial-track"); const testimonialSlides = testimonialTrack.children.length;
        const testimonialDots = $("#testimonial-dots"); const testimonialCounter = $("#testimonial-counter");
        let testimonialIndex = 0; let testimonialAutoplay = null;
        testimonialDots.innerHTML = Array.from({ length: testimonialSlides }).map((_, index) => `<button type="button" data-testimonial-dot="${index}" aria-label="Témoignage ${index + 1}" class="h-2.5 w-2.5 rounded-full bg-slate-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-white/20"></button>`).join("");
        function goToTestimonial(index) {
          testimonialIndex = (index + testimonialSlides) % testimonialSlides;
          testimonialTrack.style.transform = `translateX(-${testimonialIndex * 100}%)`;
          testimonialCounter.textContent = `0${testimonialIndex + 1} / 0${testimonialSlides}`;
          $$("#testimonial-dots button").forEach((dot, dotIndex) => {
            const active = dotIndex === testimonialIndex;
            dot.classList.toggle("w-8", active); dot.classList.toggle("bg-brand-600", active); dot.classList.toggle("dark:bg-brand-400", active);
            dot.classList.toggle("w-2.5", !active); dot.classList.toggle("bg-slate-300", !active); dot.classList.toggle("dark:bg-white/20", !active);
          });
        }
        $("#testimonial-prev").addEventListener("click", () => goToTestimonial(testimonialIndex - 1));
        $("#testimonial-next").addEventListener("click", () => goToTestimonial(testimonialIndex + 1));
        testimonialDots.addEventListener("click", (event) => { const dot = event.target.closest("[data-testimonial-dot]"); if (dot) goToTestimonial(Number(dot.dataset.testimonialDot)); });
        function startTestimonialAutoplay() { if (prefersReducedMotion) return; stopTestimonialAutoplay(); testimonialAutoplay = setInterval(() => goToTestimonial(testimonialIndex + 1), 6000); }
        function stopTestimonialAutoplay() { clearInterval(testimonialAutoplay); }
        testimonialTrack.parentElement.addEventListener("pointerenter", stopTestimonialAutoplay); testimonialTrack.parentElement.addEventListener("pointerleave", startTestimonialAutoplay);
        goToTestimonial(0); startTestimonialAutoplay();

        /* Technologies */
        const technologies = ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Nuxt", "Tailwind CSS", "Node.js", "NestJS", "PostgreSQL", "MongoDB", "Docker"];
        $("#marquee-track").innerHTML = [...technologies, ...technologies].map((tech) => `<span class="flex items-center gap-3 text-lg font-semibold text-slate-500 dark:text-slate-400"><span class="h-2 w-2 rounded-full bg-brand-500 dark:bg-brand-400"></span>${tech}</span>`).join("");
        $("#tech-grid").innerHTML = technologies.map((tech) => `<span class="cursor-default rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition duration-300 hover:-translate-y-1 hover:border-brand-600/50 hover:text-brand-700 hover:shadow-lg hover:shadow-brand-600/15 dark:border-white/10 dark:bg-night-800 dark:text-slate-300 dark:hover:border-brand-400/50 dark:hover:text-brand-300">${tech}</span>`).join("");

        /* Formulaire */
        const contactForm = $("#contact-form"); const formStatus = $("#form-status"); const submitButton = $("#submit-button");
        contactForm.addEventListener("submit", (event) => {
          event.preventDefault(); if (!contactForm.checkValidity()) return contactForm.reportValidity();
          submitButton.disabled = true; submitButton.textContent = "Envoi en cours...";
          setTimeout(() => { submitButton.disabled = false; submitButton.textContent = "Envoyer le message"; formStatus.textContent = "Merci ! Votre message a bien été envoyé. Nous revenons vers vous très vite."; formStatus.classList.remove("hidden"); contactForm.reset(); }, 900);
        });

        $("#year").textContent = new Date().getFullYear();

        /* =========================================
   BARRE DE PROGRESSION SCROLL
   ========================================= */
const progressBar = $("#scroll-progress-bar");
let ticking = false;
function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const percent = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
  progressBar.style.width = `${percent}%`;
  ticking = false;
}
window.addEventListener("scroll", () => {
  if (!ticking) { requestAnimationFrame(updateScrollProgress); ticking = true; }
}, { passive: true });
updateScrollProgress();

/* =========================================
   NAVIGATION MOBILE — INDICATEUR ACTIF
   ========================================= */
const mobileNavLinks = $$(".mobile-nav-link");
const navSections = mobileNavLinks.map(link => $(link.dataset.navTarget)).filter(Boolean);

const mobileNavObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = "#" + entry.target.id;
      mobileNavLinks.forEach(link => {
        link.classList.toggle("active", link.dataset.navTarget === id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });

navSections.forEach(section => mobileNavObserver.observe(section));

// Marque la page comme "prête" (déclenche l'apparition de la bottom nav)
requestAnimationFrame(() => {
  document.body.classList.add("site-ready");
});
      }
 
