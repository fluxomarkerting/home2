/* ==========================================================================
   FRAMEWORK MESTRE — JavaScript Principal
   Arquivo único compartilhado por todas as páginas.
   Organizado por módulos comentados (Módulos 16 e 22).
   Vanilla JS puro — sem bibliotecas externas.
   ========================================================================== */

(function () {
  'use strict';

  /* ========================================================================
     1. MENU MOBILE
     ======================================================================== */
  const MenuMobile = {
    init: function () {
      this.toggle = document.querySelector('.nav-toggle');
      this.drawer = document.querySelector('.mobile-nav');
      this.closeBtn = document.querySelector('.mobile-nav-close');
      this.overlay = document.querySelector('.overlay');

      if (!this.toggle || !this.drawer) return;

      this.toggle.addEventListener('click', this.toggleMenu.bind(this));
      if (this.closeBtn) this.closeBtn.addEventListener('click', this.closeMenu.bind(this));
      if (this.overlay) this.overlay.addEventListener('click', this.closeMenu.bind(this));

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') this.closeMenu();
      }.bind(this));
    },

    toggleMenu: function () {
      const isOpen = this.drawer.classList.contains('is-open');
      if (isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    },

    openMenu: function () {
      this.drawer.classList.add('is-open');
      this.toggle.setAttribute('aria-expanded', 'true');
      if (this.overlay) this.overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    },

    closeMenu: function () {
      this.drawer.classList.remove('is-open');
      this.toggle.setAttribute('aria-expanded', 'false');
      if (this.overlay) this.overlay.classList.remove('is-open');
      document.body.style.overflow = '';
    }
  };

  /* ========================================================================
     2. HEADER INTELIGENTE (SCROLL)
     ======================================================================== */
  const HeaderInteligente = {
    init: function () {
      this.header = document.querySelector('.site-header');
      if (!this.header) return;

      let lastScroll = 0;
      const threshold = 80;

      window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;

        if (currentScroll > threshold) {
          this.header.classList.add('is-scrolled');
        } else {
          this.header.classList.remove('is-scrolled');
        }

        lastScroll = currentScroll;
      }.bind(this), { passive: true });
    }
  };

  /* ========================================================================
     3. SCROLL SUAVE PARA ÂNCORAS
     ======================================================================== */
  const ScrollSuave = {
    init: function () {
      document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
          const href = link.getAttribute('href');
          if (href === '#' || href === '#!') return;

          const target = document.querySelector(href);
          if (!target) return;

          e.preventDefault();
          const headerHeight = 80;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        });
      });
    }
  };

  /* ========================================================================
     4. BOTÃO VOLTAR AO TOPO
     ======================================================================== */
  const BackToTop = {
    init: function () {
      this.btn = document.querySelector('.back-to-top');
      if (!this.btn) return;

      window.addEventListener('scroll', function () {
        if (window.pageYOffset > 400) {
          this.btn.classList.add('is-visible');
        } else {
          this.btn.classList.remove('is-visible');
        }
      }.bind(this), { passive: true });

      this.btn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  };

  /* ========================================================================
     5. FAQ EXPANSÍVEL
     ======================================================================== */
  const FAQ = {
    init: function () {
      const items = document.querySelectorAll('.faq-item');
      if (!items.length) return;

      items.forEach(function (item) {
        const question = item.querySelector('.faq-question');
        if (!question) return;

        question.addEventListener('click', function () {
          const isOpen = item.classList.contains('is-open');
          const answer = item.querySelector('.faq-answer');

          items.forEach(function (otherItem) {
            otherItem.classList.remove('is-open');
            const otherBtn = otherItem.querySelector('.faq-question');
            if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          });

          if (!isOpen) {
            item.classList.add('is-open');
            question.setAttribute('aria-expanded', 'true');
          } else {
            question.setAttribute('aria-expanded', 'false');
          }
        });
      });
    }
  };

  /* ========================================================================
     6. FORMULÁRIOS (VALIDAÇÃO)
     ======================================================================== */
  const Formularios = {
    init: function () {
      const forms = document.querySelectorAll('form[data-validate]');
      if (!forms.length) return;

      forms.forEach(function (form) {
        form.addEventListener('submit', function (e) {
          e.preventDefault();
          if (this.validate(form)) {
            this.showSuccess(form);
          }
        }.bind(this));
      }.bind(this));
    },

    validate: function (form) {
      let isValid = true;
      const fields = form.querySelectorAll('[required]');

      fields.forEach(function (field) {
        const errorEl = field.parentElement.querySelector('.form-error');
        field.classList.remove('is-invalid');
        if (errorEl) errorEl.classList.remove('is-visible');

        if (!field.value.trim()) {
          this.markError(field, errorEl, 'Este campo é obrigatório.');
          isValid = false;
        } else if (field.type === 'email' && !this.isValidEmail(field.value)) {
          this.markError(field, errorEl, 'Informe um e-mail válido.');
          isValid = false;
        } else if (field.type === 'checkbox' && !field.checked) {
          this.markError(field, errorEl, 'Você precisa concordar para continuar.');
          isValid = false;
        }
      }.bind(this));

      return isValid;
    },

    markError: function (field, errorEl, message) {
      field.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('is-visible');
      }
    },

    isValidEmail: function (email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    showSuccess: function (form) {
      const successEl = form.querySelector('.form-success');
      form.reset();
      if (successEl) {
        successEl.classList.add('is-visible');
        setTimeout(function () {
          successEl.classList.remove('is-visible');
        }, 5000);
      }
    }
  };

  /* ========================================================================
     7. WHATSAPP (LINKS E EVENTOS)
     ======================================================================== */
  const WhatsApp = {
    init: function () {
      const links = document.querySelectorAll('[data-whatsapp]');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              event: 'whatsapp_click',
              action: 'click',
              category: 'engagement',
              label: link.getAttribute('data-label') || 'whatsapp'
            });
          }
        });
      });
    }
  };

  /* ========================================================================
     8. CTA (EVENTOS DE CLIQUE)
     ======================================================================== */
  const CTA = {
    init: function () {
      const ctas = document.querySelectorAll('[data-cta]');
      ctas.forEach(function (cta) {
        cta.addEventListener('click', function () {
          if (typeof dataLayer !== 'undefined') {
            dataLayer.push({
              event: 'cta_click',
              action: 'click',
              category: 'conversion',
              label: cta.getAttribute('data-label') || 'cta'
            });
          }
        });
      });
    }
  };

  /* ========================================================================
     9. MODAIS ACESSÍVEIS
     ======================================================================== */
  const Modais = {
    init: function () {
      const triggers = document.querySelectorAll('[data-modal-trigger]');
      triggers.forEach(function (trigger) {
        trigger.addEventListener('click', function (e) {
          e.preventDefault();
          const modalId = trigger.getAttribute('data-modal-trigger');
          const modal = document.getElementById(modalId);
          if (modal) this.open(modal);
        }.bind(this));
      }.bind(this));

      document.querySelectorAll('[data-modal-close]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const modal = btn.closest('.modal');
          if (modal) this.close(modal);
        }.bind(this));
      }.bind(this));

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
          document.querySelectorAll('.modal.is-open').forEach(function (modal) {
            this.close(modal);
          }.bind(this));
        }
      }.bind(this));
    },

    open: function (modal) {
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      const focusable = modal.querySelector('button, [href], input, [tabindex]:not([tabindex="-1"])');
      if (focusable) focusable.focus();
    },

    close: function (modal) {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  /* ========================================================================
     10. TABS
     ======================================================================== */
  const Tabs = {
    init: function () {
      const tabContainers = document.querySelectorAll('[data-tabs]');
      tabContainers.forEach(function (container) {
        const tabs = container.querySelectorAll('[data-tab]');
        const panels = container.querySelectorAll('[data-panel]');

        tabs.forEach(function (tab) {
          tab.addEventListener('click', function () {
            const target = tab.getAttribute('data-tab');

            tabs.forEach(function (t) {
              t.classList.remove('is-active');
              t.setAttribute('aria-selected', 'false');
            });
            panels.forEach(function (p) {
              p.classList.remove('is-active');
              p.hidden = true;
            });

            tab.classList.add('is-active');
            tab.setAttribute('aria-selected', 'true');
            const panel = container.querySelector('[data-panel="' + target + '"]');
            if (panel) {
              panel.classList.add('is-active');
              panel.hidden = false;
            }
          });
        });
      });
    }
  };

  /* ========================================================================
     11. CARROSSÉIS
     ======================================================================== */
  const Carrosseis = {
    init: function () {
      const carousels = document.querySelectorAll('[data-carousel]');
      carousels.forEach(function (carousel) {
        const track = carousel.querySelector('.carousel-track');
        const prev = carousel.querySelector('[data-carousel-prev]');
        const next = carousel.querySelector('[data-carousel-next]');
        if (!track) return;

        let index = 0;
        const items = track.children;
        const total = items.length;

        function update() {
          track.style.transform = 'translateX(-' + (index * 100) + '%)';
        }

        if (next) next.addEventListener('click', function () {
          index = (index + 1) % total;
          update();
        });

        if (prev) prev.addEventListener('click', function () {
          index = (index - 1 + total) % total;
          update();
        });
      });
    }
  };

  /* ========================================================================
     12. CONTADORES ANIMADOS
     ======================================================================== */
  const Contadores = {
    init: function () {
      const counters = document.querySelectorAll('[data-counter]');
      if (!counters.length) return;

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = 'true';
            this.animate(entry.target);
          }
        }.bind(this));
      }.bind(this), { threshold: 0.5 });

      counters.forEach(function (c) { observer.observe(c); });
    },

    animate: function (el) {
      const target = parseInt(el.getAttribute('data-counter'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const startTime = performance.now();

      function step(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        el.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target + suffix;
      }

      requestAnimationFrame(step);
    }
  };

  /* ========================================================================
     13. ANIMAÇÃO ON SCROLL
     ======================================================================== */
  const AnimateOnScroll = {
    init: function () {
      const elements = document.querySelectorAll('.animate-on-scroll');
      if (!elements.length) return;

      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

      elements.forEach(function (el) { observer.observe(el); });
    }
  };

  /* ========================================================================
     14. BANNER DE COOKIES (LGPD)
     ======================================================================== */
  const CookieBanner = {
    init: function () {
      this.banner = document.querySelector('.cookie-banner');
      if (!this.banner) return;

      const consent = localStorage.getItem('cookieConsent');
      if (!consent) {
        setTimeout(function () {
          this.banner.classList.add('is-visible');
        }.bind(this), 1500);
      }

      const acceptBtn = this.banner.querySelector('[data-cookie-accept]');
      const rejectBtn = this.banner.querySelector('[data-cookie-reject]');

      if (acceptBtn) acceptBtn.addEventListener('click', this.accept.bind(this));
      if (rejectBtn) rejectBtn.addEventListener('click', this.reject.bind(this));
    },

    accept: function () {
      localStorage.setItem('cookieConsent', 'accepted');
      this.banner.classList.remove('is-visible');
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ event: 'cookie_consent_accept' });
      }
    },

    reject: function () {
      localStorage.setItem('cookieConsent', 'rejected');
      this.banner.classList.remove('is-visible');
      if (typeof dataLayer !== 'undefined') {
        dataLayer.push({ event: 'cookie_consent_reject' });
      }
    }
  };

  /* ========================================================================
     15. RASTREAMENTO GTM (DATA LAYER PREPARATION)
     ======================================================================== */
  const RastreamentoGTM = {
    init: function () {
      window.dataLayer = window.dataLayer || [];

      /* Track clicks em links internos */
      document.querySelectorAll('a[href]').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

        link.addEventListener('click', function () {
          window.dataLayer.push({
            event: 'link_click',
            action: 'click',
            category: 'navigation',
            label: href
          });
        });
      });

      /* Track cliques em telefone */
      document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
        link.addEventListener('click', function () {
          window.dataLayer.push({
            event: 'phone_click',
            action: 'click',
            category: 'engagement',
            label: link.getAttribute('href')
          });
        });
      });

      /* Track cliques em e-mail */
      document.querySelectorAll('a[href^="mailto:"]').forEach(function (link) {
        link.addEventListener('click', function () {
          window.dataLayer.push({
            event: 'email_click',
            action: 'click',
            category: 'engagement',
            label: link.getAttribute('href')
          });
        });
      });
    }
  };

  /* ========================================================================
     16. GOOGLE ANALYTICS 4 (SCROLL DEPTH)
     ======================================================================== */
  const GA4Scroll = {
    init: function () {
      const milestones = [25, 50, 75, 100];
      const reached = {};

      window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const percent = Math.round((scrollTop / docHeight) * 100);

        milestones.forEach(function (m) {
          if (percent >= m && !reached[m]) {
            reached[m] = true;
            if (typeof dataLayer !== 'undefined') {
              dataLayer.push({
                event: 'scroll_depth',
                action: 'scroll',
                category: 'engagement',
                label: m + '%'
              });
            }
          }
        });
      }, { passive: true });
    }
  };

  /* ========================================================================
     17. META PIXEL (EVENTOS PREPARADOS)
     ======================================================================== */
  const MetaPixel = {
    init: function () {
      /* Eventos preparados para integração futura com Meta Pixel.
         Os disparadores usam atributos data-* padronizados.
         Para ativar, configure o ID do Pixel no GTM. */
      document.querySelectorAll('[data-fb-event]').forEach(function (el) {
        el.addEventListener('click', function () {
          const eventName = el.getAttribute('data-fb-event');
          if (typeof fbq !== 'undefined') {
            fbq('trackCustom', eventName);
          }
        });
      });
    }
  };

  /* ========================================================================
     18. UTILIDADES
     ======================================================================== */
  const Utilidades = {
    init: function () {
      /* Set aria-current em links da página atual */
      const currentPath = window.location.pathname;
      document.querySelectorAll('a[href]').forEach(function (link) {
        const href = link.getAttribute('href');
        if (href === currentPath || href === './' + currentPath) {
          link.setAttribute('aria-current', 'page');
        }
      });

      /* Lazy loading fallback para navegadores sem suporte nativo */
      if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        lazyImages.forEach(function (img) {
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
        });
      }
    }
  };

  /* ========================================================================
     INICIALIZAÇÃO
     ======================================================================== */
  function init() {
    MenuMobile.init();
    HeaderInteligente.init();
    ScrollSuave.init();
    BackToTop.init();
    FAQ.init();
    Formularios.init();
    WhatsApp.init();
    CTA.init();
    Modais.init();
    Tabs.init();
    Carrosseis.init();
    Contadores.init();
    AnimateOnScroll.init();
    CookieBanner.init();
    RastreamentoGTM.init();
    GA4Scroll.init();
    MetaPixel.init();
    Utilidades.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
