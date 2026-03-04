/**
 * 株式会社小瀬 - 共通スクリプト
 */

/* ============================================================
   1. Header: スクロール時にシャドウ付与
   ============================================================ */
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}, { passive: true });

/* ============================================================
   2. モバイルナビゲーション トグル
   ============================================================ */
const navToggle = document.getElementById('navToggle');
const nav       = document.getElementById('nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    // スクロール制御
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // ナビリンクをクリックしたらメニューを閉じる
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.setAttribute('aria-label', 'メニューを開く');
      document.body.style.overflow = '';
    });
  });
}

/* ============================================================
   3. スクロールアニメーション（.fade-in 要素）
   ============================================================ */
const fadeEls = document.querySelectorAll('.fade-in');

if (fadeEls.length > 0) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  fadeEls.forEach(el => observer.observe(el));
}

/* ============================================================
   4. お問い合わせフォーム バリデーション & 送信処理
   ============================================================ */
const contactForm = document.getElementById('contactForm');

if (contactForm) {
  const fields = {
    name:     { el: document.getElementById('name'),     err: document.getElementById('nameError'),     validate: v => v.trim().length >= 1 },
    company:  { el: document.getElementById('company'),  err: document.getElementById('companyError'),  validate: v => v.trim().length >= 1 },
    email:    { el: document.getElementById('email'),    err: document.getElementById('emailError'),    validate: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) },
    category: { el: document.getElementById('category'), err: document.getElementById('categoryError'), validate: v => v !== '' },
    message:  { el: document.getElementById('message'),  err: document.getElementById('messageError'),  validate: v => v.trim().length >= 10 },
  };

  const privacyEl  = document.getElementById('privacy');
  const privacyErr = document.getElementById('privacyError');

  // リアルタイムバリデーション（入力後にエラーをクリア）
  Object.values(fields).forEach(({ el, err, validate }) => {
    if (!el) return;
    const eventType = el.tagName === 'SELECT' ? 'change' : 'input';
    el.addEventListener(eventType, () => {
      if (validate(el.value)) {
        el.classList.remove('error');
        err.classList.remove('visible');
      }
    });
  });

  if (privacyEl) {
    privacyEl.addEventListener('change', () => {
      if (privacyEl.checked) {
        privacyErr.classList.remove('visible');
      }
    });
  }

  // 送信処理
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // 各フィールドのバリデーション
    Object.values(fields).forEach(({ el, err, validate }) => {
      if (!el) return;
      if (validate(el.value)) {
        el.classList.remove('error');
        err.classList.remove('visible');
      } else {
        el.classList.add('error');
        err.classList.add('visible');
        isValid = false;
      }
    });

    // プライバシーポリシー確認
    if (privacyEl && !privacyEl.checked) {
      privacyErr.classList.add('visible');
      isValid = false;
    }

    if (!isValid) {
      // 最初のエラーフィールドへスクロール
      const firstError = contactForm.querySelector('.form-input.error, .form-select.error, .form-textarea.error');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstError.focus();
      }
      return;
    }

    // バリデーション成功 → 送信処理（静的サイトのためシミュレーション）
    const submitBtn = document.getElementById('submitBtn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = '送信中...';
    }

    // 送信シミュレーション（実際の実装ではここでAPIコールなどを行う）
    setTimeout(() => {
      contactForm.style.display = 'none';
      const successEl = document.getElementById('formSuccess');
      if (successEl) {
        successEl.classList.add('visible');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 800);
  });
}

/* ============================================================
   5. スムーズスクロール（アンカーリンク）
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (!target) return;

    e.preventDefault();
    const headerH = header ? header.offsetHeight : 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
