// ============================================================
// James E. Coleman Jr. — Portfolio interactivity
// Mobile nav toggle · skills slideshow · contact modal + form
// ============================================================

document.addEventListener("DOMContentLoaded", function () {
  initYear();
  initNavToggle();
  initSlideshow();
  initContactModal();
});

/* ---------- Footer year ---------- */
function initYear() {
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

/* ---------- Mobile nav ---------- */
function initNavToggle() {
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");
  if (!nav || !toggle) return;

  toggle.addEventListener("click", function () {
    var isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Close mobile menu after choosing a link
  nav.querySelectorAll(".nav-links a").forEach(function (link) {
    link.addEventListener("click", function () {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Skills slideshow ---------- */
function initSlideshow() {
  var slides = Array.prototype.slice.call(document.querySelectorAll("#slideTrack .slide"));
  var dotsWrap = document.getElementById("slideDots");
  var prevBtn = document.getElementById("prevSlide");
  var nextBtn = document.getElementById("nextSlide");
  if (!slides.length || !dotsWrap) return;

  var current = 0;

  // Build dots
  slides.forEach(function (_, i) {
    var dot = document.createElement("button");
    dot.className = "slide-dot" + (i === 0 ? " is-active" : "");
    dot.type = "button";
    dot.setAttribute("aria-label", "Go to skill " + (i + 1));
    dot.addEventListener("click", function () { goTo(i); });
    dotsWrap.appendChild(dot);
  });
  var dots = Array.prototype.slice.call(dotsWrap.children);

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current].classList.add("is-active");
  }

  prevBtn.addEventListener("click", function () { goTo(current - 1); });
  nextBtn.addEventListener("click", function () { goTo(current + 1); });

  // Auto-advance, pausing on hover/focus
  var track = document.getElementById("slideTrack");
  var timer = setInterval(function () { goTo(current + 1); }, 6000);
  [track, prevBtn, nextBtn].forEach(function (el) {
    el.addEventListener("mouseenter", function () { clearInterval(timer); });
    el.addEventListener("mouseleave", function () {
      timer = setInterval(function () { goTo(current + 1); }, 6000);
    });
  });
}

/* ---------- Contact modal ---------- */
function initContactModal() {
  var modal = document.getElementById("contactModal");
  var openBtns = [document.getElementById("openContactBtn"), document.getElementById("heroContactBtn")];
  var closeBtn = document.getElementById("closeContactBtn");
  var form = document.getElementById("contactForm");
  var status = document.getElementById("formStatus");
  if (!modal) return;

  function openModal() {
    modal.classList.add("is-open");
    var firstField = document.getElementById("name");
    if (firstField) firstField.focus();
  }

  function closeModal() {
    modal.classList.remove("is-open");
  }

  openBtns.forEach(function (btn) {
    if (btn) btn.addEventListener("click", openModal);
  });

  if (closeBtn) closeBtn.addEventListener("click", closeModal);

  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var message = form.message.value.trim();
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        status.textContent = "Please fill in every field before sending.";
        status.className = "form-status err";
        return;
      }
      if (!emailPattern.test(email)) {
        status.textContent = "That email address doesn't look right.";
        status.className = "form-status err";
        return;
      }

      // No backend is wired up yet — confirm locally and open the
      // user's mail client as a fallback so the message still gets sent.
      status.textContent = "Thanks, " + name.split(" ")[0] + " — opening your email client now.";
      status.className = "form-status ok";

      var subject = encodeURIComponent("Portfolio contact from " + name);
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      window.location.href = "mailto:colemanjamie80@gmail.com?subject=" + subject + "&body=" + body;

      form.reset();
    });
  }
}
