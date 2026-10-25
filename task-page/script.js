const descWrap = document.querySelector('.desc-wrap');
const descToggle = document.getElementById('descToggle');
const descLabel = descToggle.querySelector('span');

descToggle.addEventListener('click', () => {
  const collapsed = descWrap.classList.toggle('is-collapsed');
  descLabel.textContent = collapsed ? '展开' : '收起';
  descToggle.setAttribute('aria-expanded', String(!collapsed));
});

/* 作答记录展开 */
const stepRecordToggle = document.getElementById('stepRecordToggle');
const stepRecordList = document.getElementById('stepRecordList');

stepRecordToggle.addEventListener('click', () => {
  const open = stepRecordList.classList.toggle('is-open');
  stepRecordToggle.setAttribute('aria-expanded', String(open));
});

/* 选择文件 */
const fileInput = document.getElementById('fileInput');
const chooseFileBtn = document.getElementById('chooseFileBtn');
const fileList = document.getElementById('fileList');
const fileCount = document.getElementById('fileCount');
const fileIcon = '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8.5" cy="8.5" r="1.6"/><path d="M21 16l-5-5L5 21"/></svg>';

chooseFileBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', () => {
  const files = Array.from(fileInput.files || []);
  fileList.innerHTML = '';

  files.forEach((file) => {
    const chip = document.createElement('div');
    chip.className = 'file-chip';
    chip.innerHTML = fileIcon;
    const name = document.createElement('span');
    name.textContent = file.name;
    chip.appendChild(name);
    fileList.appendChild(chip);
  });

  fileCount.textContent = files.length > 0 ? String(files.length) : '1';
});

/* 右侧栏收起 / 展开 */
const grid = document.getElementById('grid');
const collapseFab = document.getElementById('collapseFab');

collapseFab.addEventListener('click', () => {
  const collapsed = grid.classList.toggle('is-collapsed');
  collapseFab.setAttribute('aria-expanded', String(!collapsed));
  collapseFab.setAttribute('aria-label', collapsed ? '展开侧栏' : '收起侧栏');
});

/* 轻提示 */
const toast = document.getElementById('toast');
let toastTimer = null;

function showToast(text) {
  toast.textContent = text;
  toast.classList.add('is-show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-show'), 2200);
}

document.getElementById('feedbackBtn').addEventListener('click', () => {
  showToast('问题反馈入口：请联系课程助教');
});

document.getElementById('recordBtn').addEventListener('click', () => {
  showToast('暂无更多作答记录');
});
