'use strict';
(() => {
  const settings = window.PATCH_SITE || {};
  const download = document.getElementById('download-link');
  const release = document.getElementById('release-link');
  const status = document.getElementById('download-status');
  const validName = value => typeof value === 'string' && /^[A-Za-z0-9_.-]+$/.test(value);
  if (settings.published === true && validName(settings.owner) && validName(settings.repository) && validName(settings.asset)) {
    const base = `https://github.com/${encodeURIComponent(settings.owner)}/${encodeURIComponent(settings.repository)}/releases`;
    download.href = `${base}/latest/download/${encodeURIComponent(settings.asset)}`;
    download.textContent = '한글패치 다운로드';
    download.removeAttribute('aria-disabled');
    download.removeAttribute('role');
    status.textContent = 'ZIP 파일을 받은 뒤 모두 압축 해제하세요.';
    release.href = `${base}/latest`;
    release.hidden = false;
  }
  download.addEventListener('click', event => {
    if (download.getAttribute('aria-disabled') === 'true') event.preventDefault();
  });
  const dialog = document.getElementById('image-dialog');
  const dialogImage = document.getElementById('dialog-image');
  const caption = document.getElementById('dialog-caption');
  if (typeof dialog.showModal === 'function') {
    document.querySelectorAll('.shot').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        dialogImage.src = link.href;
        dialogImage.alt = link.querySelector('img').alt;
        caption.textContent = link.dataset.caption;
        dialog.showModal();
        document.body.classList.add('modal-open');
      });
    });
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => document.body.classList.remove('modal-open'));
    dialog.addEventListener('click', event => {
      const box = dialog.getBoundingClientRect();
      if (event.target === dialog && (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom)) dialog.close();
    });
  }
  const copyButton = document.getElementById('copy-hash');
  const feedback = document.getElementById('copy-status');
  copyButton.addEventListener('click', async () => {
    const hash = document.getElementById('archive-hash').textContent.trim();
    try {
      if (!navigator.clipboard || !window.isSecureContext) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(hash);
      copyButton.textContent = '복사 완료';
      feedback.textContent = 'SHA-256 해시를 복사했습니다.';
    } catch {
      const range = document.createRange();
      range.selectNodeContents(document.getElementById('archive-hash'));
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      copyButton.textContent = '해시 선택됨';
      feedback.textContent = '자동 복사를 사용할 수 없습니다. 선택된 해시를 복사해 주세요.';
    }
  });
})();
