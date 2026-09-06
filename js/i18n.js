(function () {
  // Load config data from localStorage preview override or portfolio-data.js global
  let data = null;

  // Auto-activate admin session preview when URL contains the preview query parameter
  if (new URLSearchParams(window.location.search).has('preview')) {
    sessionStorage.setItem('admin_logged_in', 'true');
  }

  const isPreviewMode = (sessionStorage.getItem('admin_logged_in') === 'true') || 
                        (window.location.pathname.indexOf('admin.html') !== -1);

  if (isPreviewMode) {
    const savedPreview = localStorage.getItem('portfolio_editor_preview');
    if (savedPreview) {
      try {
        data = JSON.parse(savedPreview);
        console.log('DOM populated dynamically with live local configurations.');
      } catch (e) {
        console.error('Failed to parse localStorage preview.', e);
      }
    }
  }
  if (!data) {
    data = window.PORTFOLIO_DATA || {
      name: "Krish",
      preloaderLogo: "K",
      preloaderFirst: "rish",
      preloaderLast: " Portfolio",
      email: "your.email@example.com",
      version: "V3.0",
      github: "https://github.com/",
      linkedin: "https://linkedin.com/",
      behance: "https://behance.net/",
      location: "India",
      status: "En recherche d'opportunités",
      statusEn: "Looking for opportunities",
      taglineFr: "Créatif discret, je donne vie aux idées,\nentre mouvement, détail et douceur.",
      taglineEn: "Quiet creator, bringing ideas to life,\nthrough motion, detail and softness.",
      aboutFr: "En tant que creative developer, je conçois des expériences web sur mesure, en mêlant précision technique et emotion.",
      aboutEn: "As a creative developer, I craft tailor-made web experiences, blending technical precision and emotion.",
      aboutSubFr: "Je m'appelle Krish. Créatif passionné, je suis étudiant en informatique, et je produis des expériences digitales mémorables, toujours à la recherche d'une symbiose entre l'art et l'information.",
      aboutSubEn: "My name is Krish. A passionate creator and computer science student, I build memorable digital experiences, always seeking the symbiosis between art and information.",
      skills: {
        frontend: ["HTML", "CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind", "GSAP", "Three.js"],
        animation: ["GSAP", "Lenis", "Three.js", "WebGL / GLSL", "Blender"],
        backend: ["Node.js", "Express.js", "Python", "Java", "PHP"],
        security: ["Linux", "Bash", "OWASP", "Docker", "Git"]
      },
      projects: []
    };
  }

  // Language check (Force English only)
  const lang = 'en';
  document.documentElement.lang = 'en';
  document.documentElement.dataset.lang = 'en';
  window.__I18N_LANG = 'en';
  window.PORTFOLIO_ACTIVE_DATA = data; // Share with other scripts

  // Dynamic profile avatar photo rendering
  const aboutPhoto = document.querySelector('.about-photo');
  if (aboutPhoto && data.avatar) {
    aboutPhoto.src = data.avatar;
  }
  const infoPhoto = document.querySelector('.info-photo');
  if (infoPhoto && data.avatar) {
    const fixPath = function(path) {
      if (!path) return '';
      if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0 || path.indexOf('data:') === 0 || path.indexOf('../') === 0) {
        return path;
      }
      return '../' + path;
    };
    infoPhoto.src = fixPath(data.avatar);
  }

  // Dynamic favicon render
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon && data.avatar) {
    const fixPath = function(path) {
      if (!path) return '';
      if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0 || path.indexOf('data:') === 0 || path.indexOf('../') === 0) {
        return path;
      }
      const isSub = window.location.pathname.indexOf('/works/') !== -1 ||
                    window.location.pathname.indexOf('/info/') !== -1 ||
                    window.location.pathname.indexOf('/contact/') !== -1;
      return (isSub ? '../' : '') + path;
    };
    favicon.href = fixPath(data.avatar);
  }

  // Customize preloader logo texts dynamically
  const pLogo = document.getElementById('preloader-logo');
  const pLuke = document.getElementById('preloader-luke');
  const pBaffait = document.getElementById('preloader-baffait');
  if (pLogo && pLuke && pBaffait) {
    pLogo.textContent = data.preloaderLogo || 'K';
    pLuke.textContent = data.preloaderFirst || 'rish';
    pBaffait.textContent = data.preloaderLast || ' Portfolio';
  }

  // Customize social href links dynamically
  document.querySelectorAll('a[href^="https://github.com/"]').forEach(a => a.href = data.github || 'https://github.com/');
  document.querySelectorAll('a[href^="https://linkedin.com/"]').forEach(a => a.href = data.linkedin || 'https://linkedin.com/');
  document.querySelectorAll('a[href^="https://behance.net/"]').forEach(a => a.href = data.behance || 'https://behance.net/');

  function applyDynamicEmail() {
    const userEmail = data.email || 'your.email@example.com';
    document.querySelectorAll('a[href^="mailto:"]').forEach(a => {
      a.href = 'mailto:' + userEmail;
      if (a.hasAttribute('data-chr-footer')) a.setAttribute('data-chr-footer', userEmail);
      if (a.hasAttribute('data-chr')) a.setAttribute('data-chr', userEmail);
      if (a.hasAttribute('data-chr-contact')) a.setAttribute('data-chr-contact', userEmail);

      if (a.id === 'contact-mail' || a.classList.contains('contact-mail') || a.textContent.includes('@') || a.textContent.trim() === 'your.email@example.com') {
        a.textContent = userEmail;
      }
    });

    document.querySelectorAll('#contact-mail, .contact-mail, .info-mail, .footer-mail').forEach(el => {
      if (el.tagName === 'A') el.href = 'mailto:' + userEmail;
      if (el.hasAttribute('data-chr-footer')) el.setAttribute('data-chr-footer', userEmail);
      if (el.hasAttribute('data-chr')) el.setAttribute('data-chr', userEmail);
      if (el.hasAttribute('data-chr-contact')) el.setAttribute('data-chr-contact', userEmail);
      if (el.id === 'contact-mail' || el.classList.contains('contact-mail')) {
        el.textContent = userEmail;
      }
    });
  }
  applyDynamicEmail();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyDynamicEmail);
  }

  // Dynamic homepage projects rendering
  const projectsList = document.getElementById('projects-list');
  if (projectsList && data.projects) {
    projectsList.innerHTML = data.projects.map(proj => 
      `<div class="proj-item" data-id="${proj.id}" data-img="${proj.cover}" data-date="${proj.date}">${proj.title}</div>`
    ).join('');
  }

  // Dynamic homepage circle-gallery rendering
  const circlePin = document.getElementById('circle-gallery-pin');
  if (circlePin && data.projects) {
    const phrase = document.getElementById('cg-phrase');
    const imagesHtml = data.projects.map(proj => 
      `<img class="cg-img" src="${proj.cover}" alt="${proj.title}" width="3000" height="2250">`
    ).join('');
    circlePin.innerHTML = imagesHtml + (phrase ? phrase.outerHTML : '');
  }

  // Dynamic skills listings
  if (data.skills) {
    const skillGroups = {
      frontend: document.querySelector('.skill-group[data-group="frontend"] .skill-body-inner'),
      animation: document.querySelector('.skill-group[data-group="animation"] .skill-body-inner'),
      experience: document.querySelector('.skill-group[data-group="experience"] .skill-body-inner')
    };
    
    Object.keys(skillGroups).forEach(key => {
      const el = skillGroups[key];
      if (el && data.skills[key]) {
        el.innerHTML = data.skills[key].map(s => `<li>${s}</li>`).join('');
      }
    });

    const resumeBtn = document.getElementById('btn-download-resume');
    if (resumeBtn && data.resume) {
      resumeBtn.href = data.resume;
      resumeBtn.style.display = 'inline-block';
    }

    // Info page skills
    const infoSkillsWrap = document.querySelector('.info-skills');
    if (infoSkillsWrap) {
      infoSkillsWrap.innerHTML = `
        <div class="skill-col">
          <div class="skill-col-title">Frontend</div>
          <ul>${(data.skills.frontend || []).map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="skill-col">
          <div class="skill-col-title">Softwares</div>
          <ul>${(data.skills.animation || []).map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div class="skill-col">
          <div class="skill-col-title">Experience</div>
          <ul>${(data.skills.experience || []).map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
      `;
    }
  }

  window.getCharHTML = function (ch) {
    if (ch === ' ') return '&nbsp;';
    if (ch === '🡲' || ch === '🡺') return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></svg>';
    if (ch === '🡼') return '<svg style="width: 1.25em; height: 1.25em; vertical-align: -0.25em;" viewBox="0 0 84 85" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><g transform="rotate(-135 42 42.5)"><path d="M11 38H54L37 21H51L73 43L51 65H37L54 48H11Z"/></g></svg>';
    if (ch === '🞣') return '<svg style="width: 0.9em; height: 0.9em; vertical-align: -0.1em; transform: translateY(-0.1em);" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C12 7.5 16.5 12 22 12C16.5 12 12 16.5 12 22C12 16.5 7.5 12 2 12C7.5 12 12 7.5 12 2Z"/></svg>';
    return ch;
  };

  // Translations (English Only)
  const T = {
    'meta.description': 'Creative developer specialized in web interfaces, animation and interactive design. Discover my projects and works.',

    'index.title': `${data.name}, Creative Developer`,
    'index.h1': `${data.name} — Creative Developer, student in computer science, specialized in web development, animation and interactive design.`,
    'index.hero.tagline': data.tagline || data.taglineEn || data.taglineFr || '',
    'index.reveal.phrase': data.revealPhrase || "Basically, I make websites.",
    'index.about.text': data.about || data.aboutEn || data.aboutFr || '',
    'index.about.sub': data.aboutSub || data.aboutSubEn || data.aboutSubFr || '',
    'index.cg.phrase': data.cgPhrase || "Every project is an opportunity to <span class=\"other-accent\">learn</span>, <span class=\"other-accent\">experiment</span> and push my limits.",
    'index.skills.subtitle': data.skillsSubtitle || 'Skills',
    'index.skills.text': data.skillsText || `Computer Science student, passionate about web development and interactive design.`,
    'index.skills.frontend': 'Frontend',
    'index.skills.animation': 'Animation & 3D',
    'index.skills.backend': 'Backend',
    'index.skills.database': 'Databases',
    'index.skills.devops': 'DevOps & Tools',
    'index.skills.security': 'System & Security',
    'index.skills.design': 'Design',
    'index.contact.title': 'Contact',
    'index.contact.dispo1': data.contactDispo1 || `Looking for an <span class="other-accent">opportunity</span>. Eager to join an innovative team and contribute to ambitious projects.`,
    'index.contact.dispo2': data.contactDispo2 || `I'm available for <span class="other-accent">freelance missions worldwide</span>, on <span class="other-accent">your ambitious projects</span>.`,
    'index.proj.label': 'Preview',
    'index.detail.back': '🡼BACK',

    'info.title': `Info, ${data.name}`,
    'info.eyebrow': 'About',
    'info.role': data.infoRole || 'Creative developer & computer science student, specialized in web development.',
    'info.desc': data.infoDesc || data.about || data.aboutEn || data.aboutFr || '',
    'info.meta.based': 'Based in',
    'info.meta.status': 'Status',
    'info.meta.based.value': data.location || 'India',
    'info.meta.status.value': data.status || data.statusEn || '',
    'info.skills.frontend': 'Frontend',
    'info.skills.animation': 'Animation & 3D',
    'info.skills.backend': 'Backend',
    'info.skills.security': 'Security & Tools',

    'contact.title': `Contact, ${data.name}`,
    'contact.panel.title': data.contactPanelTitle || "Let's talk about your project.",
    'contact.panel.copy': data.contactPanelCopy || "I respond quickly to apprenticeship requests, freelance missions and collaborations.",
    'contact.meta.base': 'Base',
    'contact.meta.status': 'Status',
    'contact.meta.delay': 'Avg. delay',
    'contact.meta.base.value': data.location || 'India',
    'contact.meta.status.value': data.status || "Student / Freelance",
    'contact.meta.delay.value': data.contactDelay || '24h',
    'contact.eyebrow': 'Contact',
    'contact.headline.title': data.contactHeadlineTitle || "Let's build together.",
    'contact.role': data.contactRole || 'Creative developer, focused on animation, interaction, and tailor-made experiences.',
    'contact.desc': data.contactDesc || "If you have a project in mind, an ambitious idea, I'd be glad to discuss it with you.",
    'contact.shortcuts': 'Shortcuts',
    'contact.brief': 'Brief format',
    'contact.maildirect': 'Direct mail',
    'contact.brief.product': 'Product goal',
    'contact.brief.deadline': 'Target deadline',
    'contact.brief.stack': 'Tech stack',
    'contact.brief.deliverables': 'Expected deliverables',

    'works.title': `Work, ${data.name}`,
    'works.h1': `Projects, ${data.name}, Creative Developer. Discover my work in web development, animation and interactive design.`,

    'common.aria.back': 'Back to home',
    'common.aria.menu': 'Main navigation',
    'common.aria.social': 'Social links',
    'common.aria.footer': 'Footer navigation',
  };

  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    const key = el.getAttribute('data-i18n');
    if (T[key] != null) el.innerHTML = T[key];
  });

  document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
    el.getAttribute('data-i18n-attr').split('|').forEach(function (pair) {
      const idx = pair.indexOf(':');
      if (idx < 0) return;
      const attr = pair.slice(0, idx).trim();
      const key = pair.slice(idx + 1).trim();
      if (T[key] != null) el.setAttribute(attr, T[key]);
    });
  });

  const titleKey = document.documentElement.getAttribute('data-i18n-title');
  if (titleKey && T[titleKey]) document.title = T[titleKey];

  const descMeta = document.querySelector('meta[name="description"]');
  if (descMeta && T['meta.description']) descMeta.setAttribute('content', T['meta.description']);

  window.__t = function (key) { return T[key]; };
})();
