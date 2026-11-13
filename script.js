// Srinivasan E. — Portfolio interactions
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];

const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
});
$$('#navLinks a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Light/dark theme. The preference is stored in this browser.
const themeToggle = $('#themeToggle');
const savedTheme = localStorage.getItem('srini-theme');
if (savedTheme) document.documentElement.dataset.theme = savedTheme;
themeToggle.textContent = document.documentElement.dataset.theme === 'light' ? '☾' : '☼';
themeToggle.addEventListener('click', () => {
  const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  if (next === 'dark') delete document.documentElement.dataset.theme;
  else document.documentElement.dataset.theme = next;
  localStorage.setItem('srini-theme', next);
  themeToggle.textContent = next === 'light' ? '☾' : '☼';
});

// Typing effect for the hero role.
const roleEl = $('#typedRole');
const roles = ['AI & Data Science', 'Technology Enthusiast', 'Future Problem Solver'];
let roleIndex = 0, charIndex = roles[0].length, deleting = false;
function typeRole() {
  const current = roles[roleIndex];
  if (!deleting) {
    charIndex++;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex >= current.length) { deleting = true; setTimeout(typeRole, 1500); return; }
  } else {
    charIndex--;
    roleEl.textContent = current.slice(0, charIndex);
    if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
  }
  setTimeout(typeRole, deleting ? 45 : 75);
}
setTimeout(typeRole, 1800);

// Reveal elements as they enter the viewport.
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Project category filters.
$$('.filter-btn').forEach(button => button.addEventListener('click', () => {
  $$('.filter-btn').forEach(btn => btn.classList.toggle('active', btn === button));
  const filter = button.dataset.filter;
  $$('.project-card').forEach(card => {
    card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
  });
}));

// Copy email address.
$('#copyEmail').addEventListener('click', async () => {
  const feedback = $('#copyFeedback');
  try {
    await navigator.clipboard.writeText('srini.tech46@gmail.com');
    feedback.textContent = 'Email address copied!';
  } catch {
    feedback.textContent = 'Please copy: srini.tech46@gmail.com';
  }
});

// Reading progress and footer year.
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  $('#progress').style.width = `${max > 0 ? (window.scrollY / max) * 100 : 0}%`;
}, { passive: true });
$('#year').textContent = new Date().getFullYear();
