const root = document.documentElement;

/* ---------- 主题切换 ---------- */
const themeToggle = document.getElementById('themeToggle');

function syncThemeLabel() {
  const dark = root.dataset.theme === 'dark';
  themeToggle.setAttribute('aria-label', dark ? '切换到浅色模式' : '切换到深色模式');
}

syncThemeLabel();

themeToggle.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('card-theme', root.dataset.theme);
  syncThemeLabel();
});

/* ---------- 移动端菜单 ---------- */
const nav = document.getElementById('nav');
const menuBtn = document.getElementById('menuBtn');

function closeMenu() {
  nav.classList.remove('is-open');
  menuBtn.setAttribute('aria-expanded', 'false');
  menuBtn.setAttribute('aria-label', '打开菜单');
}

menuBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  const open = nav.classList.toggle('is-open');
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? '关闭菜单' : '打开菜单');
});

document.addEventListener('click', (event) => {
  if (!nav.contains(event.target)) closeMenu();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

nav.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

/* ---------- 导航滚动状态 + 当前区块 ---------- */
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

function onScroll() {
  nav.classList.toggle('is-scrolled', window.scrollY > 8);
}

onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: '-45% 0px -50% 0px' }
);

sections.forEach((section) => sectionObserver.observe(section));

/* ---------- 滚动出现动画 ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

/* ---------- 轻提示 ---------- */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}

/* ---------- 复制 ---------- */
function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text);
  }

  return new Promise((resolve, reject) => {
    const area = document.createElement('textarea');
    area.value = text;
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand('copy');
      resolve();
    } catch (error) {
      reject(error);
    } finally {
      area.remove();
    }
  });
}

document.querySelectorAll('[data-copy]').forEach((button) => {
  button.addEventListener('click', () => {
    const text = button.dataset.copy;
    copyText(text)
      .then(() => showToast(`已复制：${text}`))
      .catch(() => showToast('复制失败，请手动选择文本'));
  });
});

document.getElementById('copyLinkBtn').addEventListener('click', () => {
  const link = window.location.href;
  copyText(link)
    .then(() => showToast('名片链接已复制'))
    .catch(() => showToast('复制失败，请手动复制地址栏链接'));
});

/* ---------- 下载 vCard 名片 ---------- */
function downloadVCard() {
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    'N:张;筱周;;;',
    'FN:张筱周',
    'ORG:示例大学 经济学院',
    'TITLE:数字经济专业学生',
    'EMAIL;TYPE=INTERNET:meredith.zhang@example.com',
    'URL:https://example.com',
    'NOTE:个人数字名片 · Vibe Coding 实践',
    'END:VCARD'
  ];
  const blob = new Blob([lines.join('\r\n')], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = '张筱周-名片.vcf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast('名片文件已开始下载');
}

document.getElementById('navDownload').addEventListener('click', downloadVCard);
document.getElementById('heroDownload').addEventListener('click', downloadVCard);

/* ---------- 作品详情弹窗 ---------- */
const workDialog = document.getElementById('workDialog');
const dlgIndex = document.getElementById('dlgIndex');
const dlgTitle = document.getElementById('dlgTitle');
const dlgDesc = document.getElementById('dlgDesc');
const dlgTech = document.getElementById('dlgTech');

document.querySelectorAll('.work-card').forEach((card, index) => {
  card.querySelector('.work-more').addEventListener('click', () => {
    dlgIndex.textContent = String(index + 1).padStart(2, '0');
    dlgTitle.textContent = card.dataset.title;
    dlgDesc.textContent = card.dataset.desc;
    dlgTech.innerHTML = '';
    card.dataset.tech.split(' / ').forEach((tech) => {
      const item = document.createElement('li');
      item.textContent = tech;
      dlgTech.appendChild(item);
    });
    workDialog.showModal();
  });
});

document.getElementById('dialogClose').addEventListener('click', () => workDialog.close());
document.getElementById('dlgContact').addEventListener('click', () => workDialog.close());
workDialog.addEventListener('click', (event) => {
  if (event.target === workDialog) workDialog.close();
});

/* ---------- 作品封面图片：加载失败时切换为默认背景 ---------- */
document.querySelectorAll('.work-cover-img').forEach((img) => {
  const showFallback = () => img.closest('.work-cover').classList.add('has-fallback');
  img.addEventListener('error', showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
});
