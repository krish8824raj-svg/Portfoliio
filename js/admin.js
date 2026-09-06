(function() {
  // Authentication credentials
  const AUTH_USER = "krish.raj47";
  const AUTH_PASS = "krishak47";

  function isVideoPath(src) {
    if (!src) return false;
    if (src.indexOf('data:video/') === 0) return true;
    var ext = src.split('.').pop().split('?')[0].toLowerCase();
    return ['mp4', 'webm', 'ogg', 'mov', 'm4v'].indexOf(ext) !== -1;
  }

  // Dashboard Editor Logic State
  let workingData = null;

  function runAdmin() {
    const loginWrapper = document.getElementById('login-wrapper');
    const dashboardWrapper = document.getElementById('dashboard-wrapper');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const btnLogout = document.getElementById('btn-logout');

    function checkSession() {
      if (sessionStorage.getItem('admin_logged_in') === 'true') {
        if (loginWrapper) loginWrapper.style.display = 'none';
        if (dashboardWrapper) dashboardWrapper.style.display = 'flex';
        initDashboard();
      }
    }

    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const userEl = document.getElementById('username');
        const passEl = document.getElementById('password');
        const userInput = userEl ? userEl.value.trim() : '';
        const passInput = passEl ? passEl.value : '';

        if (userInput === AUTH_USER && passInput === AUTH_PASS) {
          sessionStorage.setItem('admin_logged_in', 'true');
          if (loginError) loginError.style.display = 'none';
          if (loginWrapper) loginWrapper.style.display = 'none';
          if (dashboardWrapper) dashboardWrapper.style.display = 'flex';
          initDashboard();
        } else {
          if (loginError) loginError.style.display = 'block';
        }
      });
    }

    if (btnLogout) {
      btnLogout.addEventListener('click', function(e) {
        e.preventDefault();
        sessionStorage.removeItem('admin_logged_in');
        window.location.reload();
      });
    }

    checkSession();
  }

  // Helper for setting element value safely
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = (val != null ? val : '');
  }

  // Helper for getting element value safely
  function getVal(id, fallback = '') {
    const el = document.getElementById(id);
    return el ? el.value : fallback;
  }

  function initDashboard() {
    // Check if we have dynamic preview data saved in localStorage
    const savedPreview = localStorage.getItem('portfolio_editor_preview');
    if (savedPreview) {
      try {
        workingData = JSON.parse(savedPreview);
        console.log('Loaded working configurations from localStorage preview.');
      } catch (err) {
        console.error('Failed to parse localStorage preview, falling back to default.', err);
      }
    }

    if (!workingData) {
      // Fallback to the globally loaded portfolio-data.js config
      workingData = JSON.parse(JSON.stringify(window.PORTFOLIO_DATA || {}));
    }

    // Populate Tab Contents safely
    populateGeneralForm();
    populateProjectsAccordion();
    populateSkillsForm();
    setupTabNavigation();
    setupActionButtons();
    setupImageUploaders();
    setupAddProjectBtn();
  }

  // Tabs navigation setup
  function setupTabNavigation() {
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');

    tabLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.dataset.tab;
        tabLinks.forEach(l => l.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));

        this.classList.add('active');
        const targetEl = document.getElementById(`tab-${target}`);
        if (targetEl) targetEl.classList.add('active');
      });
    });
  }

  // Populate general & text info inputs
  function populateGeneralForm() {
    setVal('client-name', workingData.name);
    setVal('client-avatar', workingData.avatar);
    setVal('client-logo', workingData.preloaderLogo);
    setVal('client-first', workingData.preloaderFirst);
    setVal('client-last', workingData.preloaderLast);
    setVal('client-email', workingData.email);
    setVal('client-version', workingData.version);
    setVal('client-location', workingData.location);
    setVal('client-status', workingData.status || workingData.statusEn);
    setVal('client-github', workingData.github);
    setVal('client-linkedin', workingData.linkedin);
    setVal('client-behance', workingData.behance);

    // Show avatar preview if it exists
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarPreviewWrap = document.getElementById('avatar-preview-wrap');
    if (avatarPreview && workingData.avatar) {
      avatarPreview.src = workingData.avatar;
      if (avatarPreviewWrap) avatarPreviewWrap.style.display = 'flex';
    } else {
      if (avatarPreviewWrap) avatarPreviewWrap.style.display = 'none';
    }

    // Homepage text fields
    setVal('tagline-en', workingData.tagline || workingData.taglineEn || workingData.taglineFr);
    setVal('reveal-phrase-text', workingData.revealPhrase || 'Basically, I make websites.');
    setVal('about-en', workingData.about || workingData.aboutEn || workingData.aboutFr);
    setVal('about-sub-en', workingData.aboutSub || workingData.aboutSubEn || workingData.aboutSubFr);
    setVal('cg-phrase-text', workingData.cgPhrase || "Chaque projet est une occasion d'apprendre, d'expérimenter et de repousser mes limites.");
    setVal('skills-subtitle', workingData.skillsSubtitle || 'Skills');
    setVal('skills-text', workingData.skillsText || 'Computer Science student, passionate about web development and interactive design.');
    setVal('contact-dispo1-text', workingData.contactDispo1 || "À la recherche d'une opportunité. Motivé à rejoindre une équipe innovante et à contribuer à des projets ambitieux.");
    setVal('contact-dispo2-text', workingData.contactDispo2 || "Je suis disponible pour des missions en freelance partout dans le monde, sur vos projets ambitieux.");

    // Subpages text fields
    setVal('info-role-text', workingData.infoRole || 'Creative developer & computer science student, specialized in web development.');
    setVal('info-desc-text', workingData.infoDesc || workingData.about);
    setVal('contact-panel-title-text', workingData.contactPanelTitle || "Let's talk about your project.");
    setVal('contact-panel-copy-text', workingData.contactPanelCopy || "I respond quickly to apprenticeship requests, freelance missions and collaborations.");
    setVal('contact-headline-title-text', workingData.contactHeadlineTitle || "Let's build together.");
    setVal('contact-role-text', workingData.contactRole || 'Creative developer, focused on animation, interaction, and tailor-made experiences.');
    setVal('contact-desc-text', workingData.contactDesc || "If you have a project in mind, an ambitious idea, I'd be glad to discuss it with you.");
    setVal('contact-delay-text', workingData.contactDelay || '24h');
  }

  // Populate skills lists
  function populateSkillsForm() {
    const skills = workingData.skills || {};
    setVal('skills-frontend', (skills.frontend || []).join(', '));
    setVal('skills-animation', (skills.animation || []).join(', '));
    setVal('skills-experience', (skills.experience || []).join(', '));
    setVal('client-resume', workingData.resume || '');
  }

  // Helper for project list container
  function getProjectsListContainer() {
    return document.getElementById('projects-list-container');
  }

  // Populate projects accordion list
  function populateProjectsAccordion() {
    setVal('projects-heading', workingData.projectsHeading || 'Work');
    const listContainer = getProjectsListContainer();
    if (!listContainer) return;

    listContainer.innerHTML = '';
    const projects = workingData.projects || [];

    projects.forEach((proj, idx) => {
      createProjectAccordionItem(proj, idx);
    });
  }

  function renderVisualGallery(idx) {
    const grid = document.getElementById(`gallery-grid-${idx}`);
    if (!grid) return;

    const proj = workingData.projects[idx];
    if (!proj) return;
    const images = proj.images || [];

    if (images.length === 0) {
      grid.innerHTML = `<span style="font-size: 0.8rem; color: rgba(255,255,255,0.4); padding: 10px; width: 100%; text-align: center; font-family: var(--font-family);">No media files added yet. Upload files or enter a URL below.</span>`;
      return;
    }

    grid.innerHTML = images.map((img, imgIdx) => {
      const isVid = isVideoPath(img);
      return `
        <div class="gallery-thumb-card" data-img-index="${imgIdx}" style="position: relative; width: 80px; height: 80px; border-radius: 6px; border: 1px solid var(--border-color); overflow: hidden; background: #000; box-shadow: 0 4px 10px rgba(0,0,0,0.3); transition: all 0.2s ease;">
          ${isVid ? 
            `<video src="${img}" style="width: 100%; height: 100%; object-fit: cover; pointer-events: none;"></video>` : 
            `<img src="${img}" alt="" style="width: 100%; height: 100%; object-fit: cover;">`
          }
          <span style="position: absolute; bottom: 3px; left: 3px; font-size: 6px; background: rgba(0,0,0,0.8); color: ${isVid ? '#ff1e00' : '#00e676'}; padding: 1px 3px; border-radius: 2px; font-weight: bold; border: 1px solid rgba(255,255,255,0.1);">
            ${isVid ? 'VIDEO' : 'IMAGE'}
          </span>
          <button type="button" class="btn-delete-gallery-item" data-project-index="${idx}" data-image-index="${imgIdx}" style="position: absolute; top: 3px; right: 3px; width: 16px; height: 16px; border-radius: 50%; border: none; background: rgba(255, 30, 0, 0.95); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; cursor: pointer; padding: 0; box-shadow: 0 2px 4px rgba(0,0,0,0.5); transition: background 0.2s;" title="Remove media">×</button>
        </div>
      `;
    }).join('');
  }

  function createProjectAccordionItem(proj, idx) {
    const listContainer = getProjectsListContainer();
    if (!listContainer) return;

    const item = document.createElement('div');
    item.className = 'project-card-item';
    item.dataset.index = idx;

    item.innerHTML = `
      <div class="project-card-header">
        <div class="proj-header-left">
          <span class="proj-title-txt">${proj.title || 'Untitled Project'}</span>
          <span class="proj-year-badge">${proj.year || 'N/A'}</span>
        </div>
        <span class="badge">Expand</span>
      </div>
      <div class="project-card-body">
        <div class="form-row">
          <div class="form-group col-6">
            <label>Project ID (Unique name)</label>
            <input type="text" class="proj-input" data-field="id" value="${proj.id || ''}" placeholder="e.g. cyberdiag">
          </div>
          <div class="form-group col-6">
            <label>Project Title</label>
            <input type="text" class="proj-input" data-field="title" value="${proj.title || ''}" placeholder="e.g. CyberDiag app">
          </div>
        </div>
        <div class="form-row">
          <div class="form-group col-4">
            <label>Mockup Date String</label>
            <input type="text" class="proj-input" data-field="date" value="${proj.date || ''}" placeholder="e.g. 01 2026">
          </div>
          <div class="form-group col-4">
            <label>Year</label>
            <input type="text" class="proj-input" data-field="year" value="${proj.year || ''}" placeholder="e.g. 2026">
          </div>
          <div class="form-group col-4">
            <label>Cover Image Path or Base64</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
              <input type="text" class="proj-input" data-field="cover" id="proj-cover-${idx}" value="${proj.cover || ''}" placeholder="e.g. assets/images/covers/cover.jpg">
              <input type="file" id="upload-cover-${idx}" accept="image/*" style="display: none;" class="cover-file-input" data-index="${idx}">
              <button type="button" class="btn btn-secondary upload-cover-trigger" data-target="upload-cover-${idx}" style="padding: 0.6em 1em; font-size: 0.75rem;">Upload</button>
            </div>
            <div id="cover-preview-wrap-${idx}" style="margin-top: 5px; display: ${proj.cover ? 'block' : 'none'};">
              <img id="cover-preview-${idx}" src="${proj.cover || ''}" alt="Cover Preview" style="max-height: 40px; border-radius: 3px; border: 1px solid var(--border-color); background: #000; object-fit: contain; width: 60px; height: 40px;">
            </div>
          </div>
        </div>
        <div class="form-group">
          <label>Category</label>
          <input type="text" class="proj-input" data-field="category" value="${proj.category || proj.categoryEn || proj.categoryFr || ''}" placeholder="e.g. Website">
        </div>
        <div class="form-group">
          <label>Live Website URL</label>
          <input type="url" class="proj-input" data-field="liveUrl" value="${proj.liveUrl || ''}" placeholder="e.g. https://google.com">
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea rows="3" class="proj-input" data-field="desc" placeholder="Project details description...">${proj.desc || proj.descEn || proj.descFr || ''}</textarea>
        </div>
        <div class="form-group">
          <label>Tags (Comma Separated)</label>
          <input type="text" class="proj-input" data-field="tags" value="${(proj.tags || []).join(', ')}" placeholder="Gsap, Three.js, React...">
        </div>
        <div class="form-group" style="border: 1px solid var(--border-color); padding: 1.2rem; border-radius: 8px; background: rgba(255, 255, 255, 0.02); margin-top: 1rem;">
          <label style="font-weight: 600; font-size: 0.8rem; margin-bottom: 0.8rem; display: block; color: var(--primary-color);">Project Detail Page Gallery (Images & Videos)</label>
          
          <!-- Hidden Textarea to maintain compatibility with data compile scripts -->
          <textarea class="proj-input" id="proj-images-${idx}" data-field="images" style="display: none;">${(proj.images || []).join('\n')}</textarea>
          
          <!-- Modern interactive visual gallery grid -->
          <div id="gallery-grid-${idx}" class="visual-gallery-grid" style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 1.2rem; min-height: 80px; align-items: center; border: 1px dashed rgba(255,255,255,0.1); padding: 10px; border-radius: 6px; background: rgba(0,0,0,0.2);">
            <!-- Rendered dynamically by renderVisualGallery(idx) -->
          </div>

          <!-- Gallery Add Controls -->
          <div class="gallery-controls" style="display: flex; flex-direction: column; gap: 0.8rem;">
            <div style="display: flex; gap: 0.5rem; align-items: center; flex-wrap: wrap;">
              <input type="file" id="upload-gallery-${idx}" accept="image/*,video/*" multiple style="display: none;" class="gallery-file-input" data-index="${idx}">
              <button type="button" class="btn btn-secondary upload-gallery-trigger" data-target="upload-gallery-${idx}" style="padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 6px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle;"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                Upload Media File(s) (Base64)
              </button>
            </div>
            
            <div style="display: flex; gap: 0.5rem; align-items: center; width: 100%;">
              <input type="text" id="add-gallery-path-${idx}" placeholder="Or paste local path (e.g. assets/images/...) or external URL" style="flex: 1; padding: 0.5rem 0.75rem; font-size: 0.8rem; border: 1px solid var(--border-color); border-radius: 4px; background: rgba(255,255,255,0.05); color: #fff;">
              <button type="button" class="btn btn-primary btn-add-gallery-path" data-index="${idx}" style="padding: 0.5rem 1rem; font-size: 0.8rem; font-weight: 600; white-space: nowrap;">+ Add URL/Path</button>
            </div>
          </div>
        </div>
        <div class="project-actions">
          <button class="btn btn-secondary btn-sm btn-delete-project" data-index="${idx}">Delete Project</button>
        </div>
      </div>
    `;

    // Toggle accordion
    const header = item.querySelector('.project-card-header');
    if (header) {
      header.addEventListener('click', function() {
        item.classList.toggle('open');
        const badge = item.querySelector('.project-card-header .badge');
        if (badge) badge.textContent = item.classList.contains('open') ? 'Collapse' : 'Expand';
      });
    }

    // Handle field inputs to update workingData
    item.querySelectorAll('.proj-input').forEach(input => {
      input.addEventListener('change', function() {
        const field = this.dataset.field;
        let value = this.value;

        if (field === 'tags') {
          value = value.split(',').map(t => t.trim()).filter(t => t.length > 0);
        } else if (field === 'images') {
          value = value.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        }

        if (workingData.projects[idx]) {
          workingData.projects[idx][field] = value;
        }
        
        // Update header visual text
        if (field === 'title') {
          const txt = item.querySelector('.proj-title-txt');
          if (txt) txt.textContent = value || 'Untitled Project';
        } else if (field === 'year') {
          const bdg = item.querySelector('.proj-year-badge');
          if (bdg) bdg.textContent = value || 'N/A';
        }

        // Update inline preview images if typed/changed manually
        if (field === 'cover') {
          const imgPreview = document.getElementById(`cover-preview-${idx}`);
          const previewWrap = document.getElementById(`cover-preview-wrap-${idx}`);
          if (imgPreview) {
            imgPreview.src = value;
            if (previewWrap) previewWrap.style.display = value ? 'block' : 'none';
          }
        } else if (field === 'images') {
          renderVisualGallery(idx);
        }
      });
    });

    // Delete project handler
    const delBtn = item.querySelector('.btn-delete-project');
    if (delBtn) {
      delBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to delete this project?')) {
          workingData.projects.splice(idx, 1);
          populateProjectsAccordion();
        }
      });
    }

    listContainer.appendChild(item);
    renderVisualGallery(idx);
  }

  // Add new project button listener
  function setupAddProjectBtn() {
    const btnAdd = document.getElementById('btn-add-project');
    if (!btnAdd) return;

    btnAdd.addEventListener('click', function(e) {
      e.preventDefault();
      const newProj = {
        id: "new-project-" + Date.now(),
        title: "New Project",
        date: "01 2026",
        year: "2026",
        category: "Website",
        desc: "Project description...",
        tags: ["Gsap", "Lenis"],
        cover: "assets/images/projects/Covers/cyberDiag_web.avif",
        images: [
          "assets/images/projects/Covers/cyberDiag_web.avif",
          "assets/images/projects/Covers/Anima.avif"
        ]
      };
      if (!workingData.projects) workingData.projects = [];
      workingData.projects.push(newProj);
      populateProjectsAccordion();

      // Expand the newly added project card
      const listContainer = getProjectsListContainer();
      const lastItem = listContainer ? listContainer.lastChild : null;
      if (lastItem) {
        lastItem.classList.add('open');
        const badge = lastItem.querySelector('.badge');
        if (badge) badge.textContent = 'Collapse';
        lastItem.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Action Buttons
  function setupActionButtons() {
    const btnSave = document.getElementById('btn-save');
    if (btnSave) {
      btnSave.addEventListener('click', function(e) {
        e.preventDefault();
        compileWorkingData();
        localStorage.setItem('portfolio_editor_preview', JSON.stringify(workingData));
        if (confirm('Configurations saved successfully!\n\nWould you like to open your live preview home page in a new tab?')) {
          window.open('index.html?preview=true', '_blank');
        }
      });
    }

    const btnDownload = document.getElementById('btn-download');
    if (btnDownload) {
      btnDownload.addEventListener('click', function(e) {
        e.preventDefault();
        compileWorkingData();
        const codeString = `window.PORTFOLIO_DATA = ${JSON.stringify(workingData, null, 2)};\n`;
        
        // Populate modal textarea
        const modal = document.getElementById('export-modal');
        const textarea = document.getElementById('export-code-area');
        if (textarea) textarea.value = codeString;
        if (modal) modal.style.display = 'flex';

        // Safe download as .txt (browser does not restrict .txt files!)
        const blob = new Blob([codeString], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio-data.js.txt';
        document.body.appendChild(a);
        a.click();
        
        setTimeout(function() {
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }, 150);
      });
    }

    // Close Modal Handler
    const closeModalBtn = document.getElementById('btn-close-modal');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = document.getElementById('export-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    // Copy Code Handler
    const copyCodeBtn = document.getElementById('btn-copy-code');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const textarea = document.getElementById('export-code-area');
        if (textarea) {
          navigator.clipboard.writeText(textarea.value).then(function() {
            const originalText = copyCodeBtn.textContent;
            copyCodeBtn.textContent = 'Copied!';
            copyCodeBtn.style.background = '#00c853';
            setTimeout(function() {
              copyCodeBtn.textContent = originalText;
              copyCodeBtn.style.background = '';
            }, 1500);
          }).catch(function(err) {
            alert('Failed to copy code. Please select the text inside the box and copy manually!');
          });
        }
      });
    }

    // Reset settings
    const btnReset = document.getElementById('btn-reset');
    if (btnReset) {
      btnReset.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('Are you sure you want to discard all changes and revert back to template defaults?')) {
          localStorage.removeItem('portfolio_editor_preview');
          window.location.reload();
        }
      });
    }
  }

  // Compile general & skills forms back to workingData model
  function compileWorkingData() {
    if (!workingData) workingData = {};

    workingData.name = getVal('client-name', workingData.name);
    workingData.avatar = getVal('client-avatar', workingData.avatar);
    workingData.preloaderLogo = getVal('client-logo', workingData.preloaderLogo);
    workingData.preloaderFirst = getVal('client-first', workingData.preloaderFirst);
    workingData.preloaderLast = getVal('client-last', workingData.preloaderLast);
    workingData.email = getVal('client-email', workingData.email);
    workingData.version = getVal('client-version', workingData.version);
    workingData.location = getVal('client-location', workingData.location);
    workingData.status = getVal('client-status', workingData.status);
    workingData.statusEn = workingData.status;
    workingData.github = getVal('client-github', workingData.github);
    workingData.linkedin = getVal('client-linkedin', workingData.linkedin);
    workingData.behance = getVal('client-behance', workingData.behance);

    workingData.tagline = getVal('tagline-en', workingData.tagline);
    workingData.taglineEn = workingData.tagline;
    workingData.taglineFr = workingData.tagline;

    workingData.revealPhrase = getVal('reveal-phrase-text', workingData.revealPhrase);

    workingData.about = getVal('about-en', workingData.about);
    workingData.aboutEn = workingData.about;
    workingData.aboutFr = workingData.about;

    workingData.aboutSub = getVal('about-sub-en', workingData.aboutSub);
    workingData.aboutSubEn = workingData.aboutSub;
    workingData.aboutSubFr = workingData.aboutSub;

    workingData.cgPhrase = getVal('cg-phrase-text', workingData.cgPhrase);
    workingData.skillsSubtitle = getVal('skills-subtitle', workingData.skillsSubtitle);
    workingData.skillsText = getVal('skills-text', workingData.skillsText);
    workingData.contactDispo1 = getVal('contact-dispo1-text', workingData.contactDispo1);
    workingData.contactDispo2 = getVal('contact-dispo2-text', workingData.contactDispo2);

    workingData.infoRole = getVal('info-role-text', workingData.infoRole);
    workingData.infoDesc = getVal('info-desc-text', workingData.infoDesc);
    workingData.contactPanelTitle = getVal('contact-panel-title-text', workingData.contactPanelTitle);
    workingData.contactPanelCopy = getVal('contact-panel-copy-text', workingData.contactPanelCopy);
    workingData.contactHeadlineTitle = getVal('contact-headline-title-text', workingData.contactHeadlineTitle);
    workingData.contactRole = getVal('contact-role-text', workingData.contactRole);
    workingData.contactDesc = getVal('contact-desc-text', workingData.contactDesc);
    workingData.contactDelay = getVal('contact-delay-text', workingData.contactDelay);

    // Compile skills
    workingData.skills = {
      frontend: getVal('skills-frontend').split(',').map(s => s.trim()).filter(s => s.length > 0),
      animation: getVal('skills-animation').split(',').map(s => s.trim()).filter(s => s.length > 0),
      experience: getVal('skills-experience').split(',').map(s => s.trim()).filter(s => s.length > 0)
    };
    
    workingData.resume = getVal('client-resume', workingData.resume);
    workingData.projectsHeading = getVal('projects-heading', 'Work');
  }

  // Set up Base64 file uploaders
  function setupImageUploaders() {
    // 1. Avatar Uploader
    const uploadAvatarBtn = document.querySelector('.btn-upload-trigger[data-target="upload-avatar"]');
    const uploadAvatarInput = document.getElementById('upload-avatar');
    const clientAvatarInput = document.getElementById('client-avatar');
    const avatarPreview = document.getElementById('avatar-preview');
    const avatarPreviewWrap = document.getElementById('avatar-preview-wrap');

    if (uploadAvatarBtn && uploadAvatarInput) {
      uploadAvatarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        uploadAvatarInput.click();
      });
    }

    if (uploadAvatarInput && clientAvatarInput) {
      uploadAvatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
          const base64 = evt.target.result;
          clientAvatarInput.value = base64;
          workingData.avatar = base64;
          
          if (avatarPreview) {
            avatarPreview.src = base64;
            if (avatarPreviewWrap) avatarPreviewWrap.style.display = 'flex';
          }
        };
        reader.readAsDataURL(file);
      });
    }

    if (clientAvatarInput) {
      clientAvatarInput.addEventListener('input', function() {
        const val = this.value.trim();
        workingData.avatar = val;
        if (avatarPreview) {
          if (val) {
            avatarPreview.src = val;
            if (avatarPreviewWrap) avatarPreviewWrap.style.display = 'flex';
          } else {
            if (avatarPreviewWrap) avatarPreviewWrap.style.display = 'none';
          }
        }
      });
    }

    // Resume Uploader
    const uploadResumeBtn = document.querySelector('.btn-upload-trigger[data-target="upload-resume"]');
    const uploadResumeInput = document.getElementById('upload-resume');
    const clientResumeInput = document.getElementById('client-resume');

    if (uploadResumeBtn && uploadResumeInput) {
      uploadResumeBtn.addEventListener('click', function(e) {
        e.preventDefault();
        uploadResumeInput.click();
      });
    }

    if (uploadResumeInput && clientResumeInput) {
      uploadResumeInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(evt) {
          const base64 = evt.target.result;
          clientResumeInput.value = base64;
          workingData.resume = base64;
        };
        reader.readAsDataURL(file);
      });
    }

    // 2. Event Delegation for Project Cover & Gallery Uploads & Manual Add / Delete
    const listContainer = getProjectsListContainer();
    if (listContainer) {
      listContainer.addEventListener('click', function(e) {
        // A. Trigger click on file inputs
        const trigger = e.target.closest('.upload-cover-trigger, .upload-gallery-trigger');
        if (trigger) {
          e.preventDefault();
          const targetId = trigger.dataset.target;
          const fileInput = document.getElementById(targetId);
          if (fileInput) {
            fileInput.click();
          }
          return;
        }

        // B. Add new image/video via URL path
        const addPathBtn = e.target.closest('.btn-add-gallery-path');
        if (addPathBtn) {
          e.preventDefault();
          const idx = parseInt(addPathBtn.dataset.index);
          const input = document.getElementById(`add-gallery-path-${idx}`);
          const val = input ? input.value.trim() : '';
          if (val && workingData.projects[idx]) {
            if (!workingData.projects[idx].images) {
              workingData.projects[idx].images = [];
            }
            workingData.projects[idx].images.push(val);
            
            const textarea = document.getElementById(`proj-images-${idx}`);
            if (textarea) {
              textarea.value = workingData.projects[idx].images.join('\n');
            }
            
            if (input) input.value = '';
            renderVisualGallery(idx);
          }
          return;
        }

        // C. Delete image/video item
        const deleteItemBtn = e.target.closest('.btn-delete-gallery-item');
        if (deleteItemBtn) {
          e.preventDefault();
          const idx = parseInt(deleteItemBtn.dataset.projectIndex);
          const imgIdx = parseInt(deleteItemBtn.dataset.imageIndex);
          
          if (workingData.projects[idx] && confirm('Are you sure you want to remove this media item from the gallery?')) {
            workingData.projects[idx].images.splice(imgIdx, 1);
            
            const textarea = document.getElementById(`proj-images-${idx}`);
            if (textarea) {
              textarea.value = workingData.projects[idx].images.join('\n');
            }
            
            renderVisualGallery(idx);
          }
          return;
        }
      });

      // File Input change handlers
      listContainer.addEventListener('change', function(e) {
        // Project Cover Image Upload
        if (e.target.classList.contains('cover-file-input')) {
          const idx = parseInt(e.target.dataset.index);
          const file = e.target.files[0];
          if (!file || !workingData.projects[idx]) return;

          const reader = new FileReader();
          reader.onload = function(evt) {
            const base64 = evt.target.result;
            
            const txtInput = document.getElementById(`proj-cover-${idx}`);
            if (txtInput) txtInput.value = base64;

            workingData.projects[idx].cover = base64;

            const imgPreview = document.getElementById(`cover-preview-${idx}`);
            const previewWrap = document.getElementById(`cover-preview-wrap-${idx}`);
            if (imgPreview) {
              imgPreview.src = base64;
              if (previewWrap) previewWrap.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }

        // Project Gallery Images Upload (Multiple)
        if (e.target.classList.contains('gallery-file-input')) {
          const idx = parseInt(e.target.dataset.index);
          const files = e.target.files;
          if (files.length === 0 || !workingData.projects[idx]) return;

          let processed = 0;
          const newImages = [];
          const count = files.length;

          for (let i = 0; i < count; i++) {
            const file = files[i];
            const reader = new FileReader();
            reader.onload = function(evt) {
              newImages.push(evt.target.result);
              processed++;

              if (processed === count) {
                if (!workingData.projects[idx].images) {
                  workingData.projects[idx].images = [];
                }
                workingData.projects[idx].images = workingData.projects[idx].images.concat(newImages);

                const textarea = document.getElementById(`proj-images-${idx}`);
                if (textarea) {
                  textarea.value = workingData.projects[idx].images.join('\n');
                }

                renderVisualGallery(idx);
              }
            };
            reader.readAsDataURL(file);
          }
        }
      });
    }
  }

  // Initialize Admin when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runAdmin);
  } else {
    runAdmin();
  }

})();
