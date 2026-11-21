import './main.css';
import profileData from './generated/profile.json';

const app = document.querySelector('#app');
const {
  profile = {},
  bio = [],
  expertise = [],
  projects = [],
  blogs = [],
  socials = []
} = profileData;

// Base-path aware image resolver
const baseUrl = import.meta.env.BASE_URL || '/';

function resolveImagePath(rawPath) {
  if (!rawPath) return '';
  if (rawPath.startsWith('http://') || rawPath.startsWith('https://')) {
    return rawPath;
  }
  const cleanPath = rawPath.replace(/^\.?\//, '');
  return `${baseUrl.replace(/\/?$/, '/')}${cleanPath}`;
}

const portraitSrc = resolveImagePath(profile.portrait);

app.innerHTML = `
  <div class="scroll-progress" aria-hidden="true"></div>
  <div class="custom-cursor-dot" aria-hidden="true"></div>
  <div class="custom-cursor-ring" aria-hidden="true"></div>

  <header>
    <div style="display: flex; align-items: center; gap: 1rem;">
      ${profile.name ? `<div class="brand">${profile.name}</div>` : ''}
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span>Open to Opportunities</span>
      </div>
    </div>
    ${profile.location ? `<div class="location-tag">${profile.location}</div>` : ''}
  </header>

  <main>
    <section class="hero reveal-item">
      <div class="hero-inner">
        <div>
          ${profile.role ? `<div class="hero-role">${profile.role}</div>` : ''}
          <h1 class="hero-title">Creating meaningful connections through content, communication, and digital experiences.</h1>
          ${profile.tagline ? `<p class="hero-tagline">${profile.tagline}</p>` : ''}
        </div>
        ${portraitSrc ? `
          <div class="portrait-frame">
            <img class="portrait-img" src="${portraitSrc}" alt="${profile.name || 'Swathika Janakiraman'} portrait" />
          </div>
        ` : ''}
      </div>
    </section>

    ${bio.length ? `
      <section class="bio-section reveal-item">
        <div class="section-meta">
          <span class="section-index">01</span>
          <h2 class="section-label">About &amp; Perspective</h2>
        </div>
        <div class="bio-content">
          ${bio.map(paragraph => `<p>${paragraph}</p>`).join('')}
        </div>
      </section>
    ` : ''}

    ${expertise.length ? `
      <section class="work-section">
        <div class="section-header-row reveal-item">
          <div class="section-meta">
            <span class="section-index">02</span>
            <h2 class="section-label">Digital Marketing Focus</h2>
          </div>
        </div>
        <div class="expertise-grid">
          ${expertise.map((item, index) => `
            <article class="expertise-card reveal-item" style="transition-delay: ${index * 80}ms;">
              <h3 class="expertise-title">${item.title}</h3>
              <p class="expertise-summary">${item.summary}</p>
              ${item.focus && item.focus.length ? `
                <div class="project-tags">
                  ${item.focus.map(focus => `<span class="tag">${focus}</span>`).join('')}
                </div>
              ` : ''}
            </article>
          `).join('')}
        </div>
      </section>
    ` : ''}

    ${projects.length ? `
      <section class="work-section">
        <div class="section-header-row reveal-item">
          <div class="section-meta">
            <span class="section-index">03</span>
            <h2 class="section-label">Creative Work &amp; Campaigns</h2>
          </div>
        </div>
        <div class="projects-grid">
          ${projects.map((proj, index) => {
            const imgSrc = resolveImagePath(proj.image);
            const badgeText = proj.metric || '';
            const delayMs = index * 90;
            return `
              <article class="project-card reveal-item" style="transition-delay: ${delayMs}ms;">
                ${imgSrc ? `
                  <div class="project-img-wrapper">
                    <img class="project-img" src="${imgSrc}" alt="${proj.title}" />
                    ${badgeText ? `<span class="metric-badge">${badgeText}</span>` : ''}
                  </div>
                ` : ''}
                <div class="project-body">
                  <h3 class="project-title">${proj.title}</h3>
                  <p class="project-desc">${proj.description}</p>
                  ${proj.tags && proj.tags.length ? `
                    <div class="project-tags">
                      ${proj.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                    </div>
                  ` : ''}
                  ${proj.url ? `<a href="${proj.url}" target="_blank" rel="noopener noreferrer" class="project-link">View Focus on LinkedIn &rarr;</a>` : ''}
                </div>
              </article>
            `;
          }).join('')}
        </div>
      </section>
    ` : ''}

    ${blogs.length ? `
      <section class="work-section">
        <div class="section-header-row reveal-item">
          <div class="section-meta">
            <span class="section-index">04</span>
            <h2 class="section-label">Thought Leadership &amp; Insights</h2>
          </div>
        </div>
        <div class="blogs-grid">
          ${blogs.map((post, index) => `
            <article class="blog-card reveal-item" style="transition-delay: ${(index % 3) * 70}ms;">
              ${post.tag ? `<span class="tag">${post.tag}</span>` : ''}
              <h3 class="blog-title">${post.title}</h3>
              <p class="blog-summary">${post.summary}</p>
              ${post.url ? `<a href="${post.url}" target="_blank" rel="noopener noreferrer" class="project-link">Read on LinkedIn &rarr;</a>` : ''}
            </article>
          `).join('')}
        </div>
      </section>
    ` : ''}

    <section class="contact-section reveal-item">
      <div>
        <div class="section-meta">
          <span class="section-index">05</span>
          <h2 class="section-label">Let's Connect</h2>
        </div>
        <p class="contact-copy">Interested in exploring ideas, discussing digital trends, or collaborating on content, branding, and digital marketing.</p>
        ${profile.email ? `
          <p><a href="mailto:${profile.email}" class="project-link">${profile.email}</a></p>
        ` : ''}
      </div>
      ${socials.length ? `
        <div>
          <div class="section-label">Profiles</div>
          <div class="social-links">
            ${socials.map(s => `<a href="${s.url}" target="_blank" rel="noopener noreferrer">${s.label}</a>`).join('')}
          </div>
        </div>
      ` : ''}
    </section>

    <footer class="editorial-footer reveal-item">
      <span>Swathika Janakiraman &copy; 2026</span>
      <span>People &middot; Digital Marketing &middot; Content &amp; Engagement</span>
    </footer>
  </main>

  <button class="back-to-top-btn" aria-label="Back to top">
    <span>&uarr; Top</span>
  </button>
`;

const portraitImage = app.querySelector('.portrait-img');
if (portraitImage) {
  portraitImage.addEventListener('error', () => {
    portraitImage.parentElement.hidden = true;
  }, { once: true });
}

const progressBar = document.querySelector('.scroll-progress');
const revealElements = document.querySelectorAll('.reveal-item');
const backToTopBtn = document.querySelector('.back-to-top-btn');
const cursorDot = document.querySelector('.custom-cursor-dot');
const cursorRing = document.querySelector('.custom-cursor-ring');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const supportsIntersectionObserver = 'IntersectionObserver' in window;

function updateScrollFeatures() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const ratio = docHeight > 0 ? Math.min(Math.max(window.scrollY / docHeight, 0), 1) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${ratio})`;

  if (backToTopBtn) {
    backToTopBtn.classList.toggle('is-active', window.scrollY > 380);
  }
}

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    if (prefersReducedMotion) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
}

if (cursorDot && cursorRing && !prefersReducedMotion && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', event => {
    cursorDot.style.left = `${event.clientX}px`;
    cursorDot.style.top = `${event.clientY}px`;
    cursorRing.style.left = `${event.clientX}px`;
    cursorRing.style.top = `${event.clientY}px`;
  }, { passive: true });

  const interactiveElements = document.querySelectorAll(
    'a, button, .project-card, .expertise-card, .blog-card, .portrait-frame'
  );
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

function revealVisibleElements() {
  const triggerBottom = window.innerHeight * 0.96;
  revealElements.forEach(el => {
    if (el.classList.contains('is-visible')) return;
    if (el.getBoundingClientRect().top <= triggerBottom) {
      el.classList.add('is-visible');
    }
  });
}

if (prefersReducedMotion || !supportsIntersectionObserver) {
  revealElements.forEach(el => el.classList.add('is-visible'));
} else {
  document.documentElement.classList.add('anim-ready');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.02, rootMargin: '0px 0px 40px 0px' }
  );

  revealElements.forEach(el => observer.observe(el));
  requestAnimationFrame(revealVisibleElements);
}

function handleScrollOrResize() {
  updateScrollFeatures();
  if (!prefersReducedMotion && supportsIntersectionObserver) {
    revealVisibleElements();
  }
}

window.addEventListener('scroll', handleScrollOrResize, { passive: true });
window.addEventListener('resize', handleScrollOrResize, { passive: true });
updateScrollFeatures();