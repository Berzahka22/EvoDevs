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

      function enterSite(instant) {
        if (instant) introScreen.style.transition = 'none';
        introScreen.classList.add('hidden-intro');
        bodyTag.classList.remove('overflow-hidden'); // Réactive le scroll
        sessionStorage.setItem('evodevs_intro_seen', '1');

        // Initialise les animations du site principal SEULEMENT maintenant
        if (!siteInitialized) {
          initSiteAnimations();
          siteInitialized = true;
        }
        
        // Supprime l'intro du DOM après la transition pour libérer la mémoire
        setTimeout(() => {
          introScreen.remove();
        }, instant ? 0 : 800);
      }

      document.getElementById('discover-btn').addEventListener('click', () => enterSite(false));
      document.getElementById('skip-btn').addEventListener('click', () => enterSite(false));

      // Lance l'intro complète (~9s) uniquement à la première visite de la
      // session. Les visites suivantes (navigation, retour sur le site)
      // passent directement au site : rendu perçu bien plus rapide, sans
      // perdre l'effet "wahou" pour un nouveau visiteur.
      if (sessionStorage.getItem('evodevs_intro_seen')) {
        window.addEventListener('load', () => enterSite(true));
      } else {
        window.addEventListener('load', startIntro);
      }


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
{
    id: "benyaamin",
    name: "Berzahka Bebdanne Benyaamin",
    role: "Directeur",
    image: "./img/ben.png",

    short: "Direction technique, développement frontend et conception de solutions web modernes, performantes et évolutives.",

    location: "Douala, Cameroun",
    availability: "Disponible",

    portfolio: "https://example.com/benyaamin",
    email: "benyaamin@evodevs.fr",
    phone: "+237 6 XX XX XX XX",
    github: "https://github.com/Berzahka22",
    linkedin: "https://linkedin.com",

    bio: "Berzahka Bebdanne Benyaamin pilote la vision technique et le développement des solutions web d'EvoDevs. Spécialisé dans le développement frontend et full-stack, il conçoit des interfaces modernes, performantes et responsives tout en veillant à la qualité de l'architecture et de l'expérience utilisateur. Il intervient également sur le développement backend avec PHP et Laravel, ainsi que sur la conception et l'intégration d'APIs. En tant que Directeur, il coordonne les choix techniques, accompagne les développeurs et veille à la cohérence globale des projets.",

    skills: [
        "HTML5",
        "CSS3",
        "JavaScript",
        "TypeScript",
        "React",
        "Next.js",
        "Tailwind CSS",
        "Bootstrap",
        "PHP",
        "Laravel",
        "MySQL",
        "REST API",
        "Git & GitHub",
        "UI/UX",
        "Responsive Design",
        "Performance Web",
        "Architecture Frontend",
        "Design System"
    ],

    experience: [
        {
            period: "2022 — Aujourd'hui",
            role: "Directeur & Lead Frontend",
            company: "EvoDevs",
            description: "Direction technique des projets web, définition des architectures frontend, conception d'interfaces modernes et accompagnement des développeurs. Supervision de la qualité du code, des performances, de l'expérience utilisateur et de la cohérence des solutions développées."
        },
        {
            period: "2024 — 2026",
            role: "Développeur Full-Stack",
            company: "Freelance & Projets personnels",
            description: "Conception et développement d'applications web avec React, Next.js, PHP et Laravel. Développement d'interfaces responsives, intégration d'APIs, gestion de bases de données MySQL et mise en production de solutions web."
        },
        {
            period: "2022 — 2024",
            role: "Développeur Frontend",
            company: "Projets Web",
            description: "Création d'interfaces web modernes avec HTML, CSS, JavaScript, Tailwind CSS et Bootstrap. Développement de composants réutilisables, optimisation responsive et amélioration des performances frontend."
        }
    ]
},
{
    id: "yongsi",
    name: "ing.Yongssi Gildas",
    role: "Lead Backend",
    image: "./img/yongsi.png",
    short: "Architecture backend, API sécurisées, systèmes distribués, bases de données et développement PHP/Node.js.",

    location: "Yaoundé, Cameroun",
    availability: "Disponible",

    portfolio: "https://example.com/yongsi",
    email: "yongsi@evodevs.fr",
    phone: "+237 6 XX XX XX XX",
    github: "https://github.com",
    linkedin: "https://linkedin.com",

    bio: "Yongssi conçoit des architectures backend robustes, sécurisées et évolutives pour des applications web et des systèmes métier. Il maîtrise aussi bien l'écosystème Node.js que PHP, avec une expertise particulière dans la conception d'API, l'architecture logicielle, les bases de données et le développement avec Laravel. En tant que Lead Backend, il veille à la qualité du code, aux performances, à la sécurité des données et à la maintenabilité des applications.",

    skills: [
        "PHP",
        "Laravel",
        "Symfony",
        "Node.js",
        "NestJS",
        "Express.js",
        "JavaScript",
        "TypeScript",
        "PostgreSQL",
        "MySQL",
        "MongoDB",
        "REST API",
        "GraphQL",
        "API Security",
        "Docker",
        "Git"
    ],

    experience: [
        {
            period: "2021 — Aujourd'hui",
            role: "Lead Backend",
            company: "EvoDevs",
            description: "Conception d'architectures backend, développement d'APIs REST et GraphQL, supervision de la qualité logicielle, gestion des bases de données et mise en place de solutions sécurisées et scalables avec Node.js, NestJS, PHP et Laravel."
        },
        {
            period: "2024 — 2026",
            role: "Développeur Backend",
            company: "Finlyse",
            description: "Développement de services backend pour des applications financières, gestion de données sensibles, conception d'APIs sécurisées et optimisation des performances avec PHP/Laravel et Node.js."
        },
        {
            period: "2022 — 2024",
            role: "Développeur PHP & Node.js",
            company: "EvoDevs",
            description: "Développement d'applications web métier, conception d'APIs, intégration de bases de données MySQL et PostgreSQL et mise en place de services backend avec Laravel, Express.js et Node.js."
        }
    ]
},
{
    id: "yang",
    name: "Yang Damakoa Caleb",
    role: "Lead Backend & Expert Bots",
    image: "./img/yang.png",

    short: "Architecture backend, développement d'APIs, conception de bots intelligents et intégration de services automatisés.",

    location: "Yaoundé, Cameroun",
    availability: "Disponible",

    portfolio: "https://example.com/yang",
    email: "yang@evodevs.fr",
    phone: "+237 6 XX XX XX XX",
    github: "https://github.com",
    linkedin: "https://linkedin.com",

    bio: "Yang Damakoa Caleb est spécialisé dans le développement backend, la conception d'APIs et la création de bots et services automatisés. Il conçoit des architectures robustes permettant de connecter applications, bases de données et services externes. Son expertise couvre le développement de services backend, l'intégration d'APIs, l'automatisation de tâches et la conception de bots intelligents capables d'interagir avec les utilisateurs et différents systèmes. Au sein d'EvoDevs, il intervient sur la conception des architectures backend et le développement de solutions automatisées et évolutives.",

    skills: [
        "Node.js",
        "Python",
        "JavaScript",
        "TypeScript",
        "PHP",
        "Laravel",
        "Express.js",
        "NestJS",
        "REST API",
        "GraphQL",
        "Webhooks",
        "Bots & Chatbots",
        "Bot Automation",
        "API Integration",
        "Intelligence Artificielle",
        "MySQL",
        "PostgreSQL",
        "MongoDB",
        "Redis",
        "Docker",
        "Git & GitHub",
        "Authentication",
        "Backend Architecture"
    ],

    experience: [
        {
            period: "2022 — Aujourd'hui",
            role: "Lead Backend & Expert Bots",
            company: "EvoDevs",
            description: "Conception d'architectures backend, développement d'APIs et création de bots et services automatisés. Intégration de services externes, gestion des bases de données et mise en place de solutions backend fiables et évolutives."
        },
        {
            period: "2024 — 2026",
            role: "Backend Developer & Bot Engineer",
            company: "Projets & Solutions Digitales",
            description: "Développement de services backend avec Node.js, Python et PHP, conception d'APIs REST, intégration de services tiers et développement de bots destinés à automatiser différentes tâches et interactions."
        },
        {
            period: "2022 — 2024",
            role: "Développeur Backend",
            company: "Projets Web",
            description: "Développement d'applications backend, gestion des bases de données, création d'APIs et intégration de fonctionnalités automatisées dans des applications web et services numériques."
        }
    ]
},
{
    id: "tejona",
    name: "ing.Tedjona Kenfack Axel O.",
    role: "Lead Automatisation N8N",
    image: "./img/tejona.png",
    short: "Conception d'automatisations intelligentes, workflows n8n et intégrations API pour optimiser les processus métier.",
    location: "Ngaoundéré, Cameroun",
    availability: "Disponible",
    portfolio: "https://example.com/tejona",
    email: "tedjona@evodevs.fr",
    phone: "+237 6 XX XX XX XX",
    github: "https://github.com",
    linkedin: "https://linkedin.com",

    bio: "Tedjona conçoit et déploie des automatisations intelligentes avec n8n afin de connecter les outils, simplifier les processus métier et réduire les tâches répétitives. Il intervient sur la conception de workflows complexes, les intégrations API, les automatisations basées sur l'IA et l'optimisation des flux de données.",

    skills: [
        "n8n",
        "Automatisation",
        "Workflow Design",
        "API REST",
        "Webhooks",
        "JavaScript",
        "Node.js",
        "Intégration IA",
        "Bases de données",
        "Docker"
    ],

    experience: [
        {
            period: "2024 — Aujourd'hui",
            role: "Lead Automatisation N8N",
            company: "EvoDevs",
            description: "Conception et pilotage de workflows n8n, automatisation des processus internes, intégration d'APIs et de services tiers, mise en place d'agents et de workflows assistés par l'IA."
        },
        {
            period: "2022 — 2024",
            role: "Automation & Integration Developer",
            company: "EvoDevs",
            description: "Développement de workflows automatisés, connexion de services via APIs et webhooks, traitement des données et automatisation des tâches répétitives pour différents projets web."
        }
    ]
},          
{
    id: "feumba",
    name: "Feumba Rudy",
    role: "DevOps & Sécurité Réseaux et Télécommunications",
    image: "./img/feumba.png",

    short: "Infrastructure cloud, automatisation DevOps, cybersécurité et administration des réseaux et systèmes.",

    location: "Yaounde, Cameroun",
    availability: "Disponible",

    portfolio: "https://example.com/feumba",
    email: "feumba@evodevs.fr",
    phone: "+237 6 XX XX XX XX",
    github: "https://github.com",
    linkedin: "https://linkedin.com",

    bio: "Feumba Rudy est spécialisé dans l'administration des infrastructures, le DevOps, la cybersécurité et les réseaux et télécommunications. Il conçoit, déploie et maintient des infrastructures fiables et sécurisées tout en automatisant les processus de déploiement et d'exploitation. Son expertise couvre la configuration des réseaux, la supervision des systèmes, la sécurisation des infrastructures, la virtualisation et la mise en place de pipelines CI/CD. Au sein d'EvoDevs, il contribue à garantir la disponibilité, la sécurité et la performance des environnements techniques.",

    skills: [
        "Linux",
        "Windows Server",
        "Docker",
        "Git & GitHub",
        "CI/CD",
        "Nginx",
        "SQL",
        "Cloud Computing",
        "Virtualisation",
        "Cybersécurité",
        "Firewall",
        "VPN",
        "TCP/IP",
        "DNS",
        "DHCP",
        "Routage",
        "Switching",
        "Wi-Fi & Réseaux",
        "Supervision Réseau",
        "Télécommunications",
        "Sécurité des Systèmes",
        "Bash / Shell"
    ],

    experience: [
        {
            period: "2022 — Aujourd'hui",
            role: "DevOps & Sécurité Réseaux",
            company: "EvoDevs",
            description: "Gestion et sécurisation des infrastructures techniques, déploiement des applications, automatisation des environnements avec Docker et CI/CD, administration des systèmes Linux et supervision des services et réseaux."
        },
        {
            period: "2024 — 2026",
            role: "Ingénieur Réseaux & Systèmes",
            company: "Projets & Infrastructure",
            description: "Administration des infrastructures réseaux et systèmes, configuration des équipements réseau, gestion des services DNS et DHCP, mise en place de solutions VPN et renforcement de la sécurité des environnements informatiques."
        },
        {
            period: "2022 — 2024",
            role: "Technicien Réseaux & Télécommunications",
            company: "Projets Techniques",
            description: "Installation, configuration et maintenance des infrastructures réseaux et télécoms. Diagnostic des incidents, supervision des équipements et intervention sur les systèmes de communication et de connectivité."
        }
    ]
},

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

        /* Technologies — stack combinée de toute l'équipe (compétences individuelles agrégées) */
        const technologies = [...new Set(teamMembers.flatMap((member) => member.skills))];

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
  /* Curseur cible personnalisé (desktop uniquement) */
const supportsFinePointer = window.matchMedia("(pointer: fine)").matches;
const cursorReticle = $("#cursor-reticle");

if (supportsFinePointer && cursorReticle && !prefersReducedMotion) {
  let targetX = window.innerWidth / 2, targetY = window.innerHeight / 2;
  let renderX = targetX, renderY = targetY;
  let hasPosition = false;
  let rafId = null;

  // Bascule le curseur visible/actif. Appelée à chaque mousemove ET à chaque
  // ré-entrée dans la fenêtre : c'est ce qui manquait avant (le curseur ne
  // réapparaissait jamais après un alt-tab, un survol d'onglet, un blur...).
  function showCursor() {
    document.body.classList.add("custom-cursor-active");
    cursorReticle.classList.add("is-active");
  }
  function hideCursor() {
    cursorReticle.classList.remove("is-active", "is-hovering", "is-clicking");
  }

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    if (!hasPosition) {
      // Évite le "vol" depuis le centre de l'écran au tout premier mouvement
      renderX = targetX;
      renderY = targetY;
      hasPosition = true;
    }
    showCursor();
  }, { passive: true });

  // Le curseur redevient invisible seulement quand la souris quitte VRAIMENT
  // la fenêtre du navigateur, et redevient visible dès qu'elle revient
  // (mouseenter + mousemove), plutôt que de rester bloqué invisible.
  document.addEventListener("mouseleave", hideCursor);
  document.addEventListener("mouseenter", showCursor);
  window.addEventListener("blur", hideCursor);
  window.addEventListener("focus", () => { if (hasPosition) showCursor(); });

  function renderCursor() {
    // Lissage plus réactif (0.35 au lieu de 0.22) + translate3d pour un
    // rendu GPU stable, sans à-coups ni décalage perceptible.
    renderX += (targetX - renderX) * 0.35;
    renderY += (targetY - renderY) * 0.35;
    cursorReticle.style.transform = `translate3d(${renderX}px, ${renderY}px, 0)`;
    rafId = requestAnimationFrame(renderCursor);
  }
  rafId = requestAnimationFrame(renderCursor);

  const cursorHoverSelector = "a, button, input, textarea, select, [role='button'], .team-card, .project-card";
  document.addEventListener("mouseover", (event) => { if (event.target.closest(cursorHoverSelector)) cursorReticle.classList.add("is-hovering"); });
  document.addEventListener("mouseout", (event) => { if (event.target.closest(cursorHoverSelector)) cursorReticle.classList.remove("is-hovering"); });
  window.addEventListener("mousedown", () => cursorReticle.classList.add("is-clicking"));
  window.addEventListener("mouseup", () => cursorReticle.classList.remove("is-clicking"));

  // Coupe la boucle si l'onglet devient invisible, pour ne pas gaspiller de ressources.
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) hideCursor();
  });
}

/* =========================================
   NUMÉRO WHATSAPP DE L'ÉQUIPE
   Utilisé à la fois par le widget de chat et par le formulaire de devis.
   Remplace-le par le vrai numéro (format international, sans "+" ni espaces).
   ========================================= */
const EVODEVS_WHATSAPP_NUMBER = "237600000000";

/* =========================================
   FORMULAIRE DE DEVIS — champs ajustables selon le budget
   ========================================= */
(function () {
  const openers = document.querySelectorAll("[data-open-quote]");
  const modal = document.getElementById("quote-modal");
  if (!openers.length || !modal) return;

  const backdrop = document.getElementById("quote-modal-backdrop");
  const panel = document.getElementById("quote-modal-panel");
  const closeBtn = document.getElementById("quote-modal-close");
  const form = document.getElementById("quote-form");
  const typeSelect = document.getElementById("quote-type");
  const budgetInput = document.getElementById("quote-budget");
  const budgetValue = document.getElementById("quote-budget-value");
  const featuresContainer = document.getElementById("quote-features");
  const statusEl = document.getElementById("quote-status");
  const submitBtn = document.getElementById("quote-submit");
  let lastFocused = null;

  // Fonctionnalités disponibles par palier de budget (en milliers de Xaf).
  const FEATURES = [
    { id: "pages5", label: "Jusqu'à 5 pages", min: 0 },
    { id: "responsive", label: "Design responsive", min: 0 },
    { id: "contactForm", label: "Formulaire de contact", min: 0 },
    { id: "seo", label: "SEO de base", min: 0 },
    { id: "hosting", label: "Hébergement & déploiement", min: 0 },
    { id: "cms", label: "Blog / CMS", min: 100 },
    { id: "multilang", label: "Multilingue", min: 100 },
    { id: "unlimitedPages", label: "Pages illimitées", min: 100 },
    { id: "backendApi", label: "Backend & API sur mesure", min: 180 },
    { id: "admin", label: "Panel d'administration", min: 180 },
    { id: "database", label: "Base de données dédiée", min: 180 },
    { id: "mobileApp", label: "Application mobile iOS & Android", min: 250 },
    { id: "push", label: "Notifications push", min: 250 },
    { id: "biometric", label: "Authentification biométrique", min: 250 },
    { id: "bots", label: "Automatisation / Bots intégrés", min: 320 },
    { id: "analytics", label: "Analytics & tableaux de bord avancés", min: 320 },
    { id: "maintenance", label: "Maintenance étendue", min: 320 },
  ];

  function formatXaf(thousands) {
    const value = thousands * 1000;
    return `${value.toLocaleString("fr-FR")} Xaf${thousands >= 400 ? "+" : ""}`;
  }

  function renderFeatures(budget) {
    featuresContainer.innerHTML = FEATURES.map((feature) => {
      const unlocked = budget >= feature.min;
      return `
        <label class="quote-feature ${unlocked ? "is-unlocked" : "is-locked"}">
          <input type="checkbox" name="quote-feature" value="${feature.label}" data-min="${feature.min}" ${unlocked ? "" : "disabled"} />
          <span>
            <span class="quote-feature-label text-ink dark:text-white">${feature.label}</span>
            ${unlocked ? "" : `<span class="quote-feature-hint">Disponible dès ${formatXaf(feature.min)}</span>`}
          </span>
        </label>`;
    }).join("");
  }

  function updateBudgetUI() {
    const budget = Number(budgetInput.value);
    budgetValue.textContent = formatXaf(budget);
    const min = Number(budgetInput.min);
    const max = Number(budgetInput.max);
    const percent = ((budget - min) / (max - min)) * 100;
    budgetInput.style.setProperty("--quote-range-fill", `${percent}%`);
    renderFeatures(budget);
  }

  budgetInput.addEventListener("input", updateBudgetUI);

  function openQuoteModal(trigger) {
    lastFocused = document.activeElement;
    const type = trigger?.dataset.quoteType;
    const budget = trigger?.dataset.quoteBudget;
    if (type) typeSelect.value = type;
    budgetInput.value = budget && !Number.isNaN(Number(budget)) ? budget : 100;
    updateBudgetUI();
    statusEl.classList.add("hidden");
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      backdrop.classList.remove("opacity-0");
      backdrop.classList.add("opacity-100");
      panel.classList.remove("opacity-0", "scale-95", "translate-y-6");
      panel.classList.add("opacity-100", "scale-100", "translate-y-0");
    });
    document.getElementById("quote-name").focus();
    document.addEventListener("keydown", onQuoteKeydown);
  }

  function closeQuoteModal() {
    backdrop.classList.add("opacity-0");
    backdrop.classList.remove("opacity-100");
    panel.classList.add("opacity-0", "scale-95", "translate-y-6");
    panel.classList.remove("opacity-100", "scale-100", "translate-y-0");
    setTimeout(() => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
      document.body.style.overflow = "";
    }, 250);
    document.removeEventListener("keydown", onQuoteKeydown);
    if (lastFocused) lastFocused.focus();
  }

  function onQuoteKeydown(event) {
    if (event.key === "Escape") return closeQuoteModal();
    if (event.key !== "Tab") return;
    const focusables = Array.from(panel.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select, textarea'));
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  openers.forEach((btn) => btn.addEventListener("click", () => openQuoteModal(btn)));
  closeBtn.addEventListener("click", closeQuoteModal);
  backdrop.addEventListener("click", closeQuoteModal);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) return form.reportValidity();

    const name = document.getElementById("quote-name").value.trim();
    const contact = document.getElementById("quote-contact").value.trim();
    const type = typeSelect.value;
    const delay = document.getElementById("quote-delay").value;
    const budget = formatXaf(Number(budgetInput.value));
    const message = document.getElementById("quote-message").value.trim();
    const features = Array.from(form.querySelectorAll('input[name="quote-feature"]:checked')).map((el) => el.value);

    const lines = [
      "Bonjour EvoDevs, je souhaite obtenir un devis :",
      `• Nom : ${name}`,
      `• Contact : ${contact}`,
      `• Type de projet : ${type}`,
      `• Budget estimé : ${budget}`,
      `• Délai souhaité : ${delay}`,
    ];
    if (features.length) lines.push(`• Fonctionnalités : ${features.join(", ")}`);
    if (message) lines.push(`• Description : ${message}`);

    submitBtn.disabled = true;
    const originalLabel = submitBtn.innerHTML;
    submitBtn.innerHTML = "Envoi en cours...";

    setTimeout(() => {
      const url = `https://wa.me/${EVODEVS_WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
      window.open(url, "_blank", "noopener,noreferrer");
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalLabel;
      statusEl.textContent = "Votre demande a été préparée et envoyée vers WhatsApp. Notre équipe vous répond sous 48h.";
      statusEl.classList.remove("hidden");
      form.reset();
      updateBudgetUI();
    }, 700);
  });
})();

/* =========================================
   WIDGET WHATSAPP — panneau de chat dépliable
   ========================================= */
(function () {
  const WHATSAPP_NUMBER = EVODEVS_WHATSAPP_NUMBER;

  const fab = document.getElementById("whatsapp-fab");
  const panel = document.getElementById("whatsapp-panel");
  const closeBtn = document.getElementById("whatsapp-panel-close");
  if (!fab || !panel) return;

  function openWhatsAppChat(message) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function openPanel() {
    panel.classList.add("is-open");
    fab.classList.add("panel-open");
    fab.setAttribute("aria-expanded", "true");
  }
  function closePanel() {
    panel.classList.remove("is-open");
    fab.classList.remove("panel-open");
    fab.setAttribute("aria-expanded", "false");
  }
  function togglePanel() {
    panel.classList.contains("is-open") ? closePanel() : openPanel();
  }

  fab.addEventListener("click", togglePanel);
  closeBtn.addEventListener("click", closePanel);

  document.querySelectorAll(".wa-quick-reply").forEach((btn) => {
    btn.addEventListener("click", () => {
      openWhatsAppChat(btn.dataset.waMessage || "Bonjour EvoDevs !");
      closePanel();
    });
  });

  // Ferme le panneau si on clique en dehors, ou avec la touche Échap.
  document.addEventListener("click", (event) => {
    if (!panel.classList.contains("is-open")) return;
    if (!panel.contains(event.target) && !fab.contains(event.target)) closePanel();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closePanel();
  });
})();
