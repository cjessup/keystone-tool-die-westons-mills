(function () {
  var nav = document.getElementById("site-nav");
  var toggle = document.querySelector(".nav-toggle");
  var subToggles = document.querySelectorAll(".sub-toggle");

  function closeNav() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  subToggles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var open = item.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    var item = btn.parentElement;
    item.addEventListener("mouseleave", function () {
      if (!window.matchMedia("(min-width: 960px)").matches) return;
      item.classList.remove("is-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeNav();
      closeLightbox();
    }
  });

  if (nav) {
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 959px)").matches) closeNav();
      });
    });
  }

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var revealNodes = document.querySelectorAll(".reveal");

  if (!reduce) {
    document.documentElement.classList.add("js");
    if ("IntersectionObserver" in window) {
      document.querySelectorAll("[data-stagger]").forEach(function (group) {
        var items = group.querySelectorAll(".reveal");
        items.forEach(function (node, index) {
          node.style.transitionDelay = Math.min(index, 8) * 55 + "ms";
        });
      });
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
      revealNodes.forEach(function (node) { observer.observe(node); });
    } else {
      revealNodes.forEach(function (node) { node.classList.add("is-in"); });
    }
  }

  document.querySelectorAll("[data-slider]").forEach(function (slider) {
    var frames = slider.querySelectorAll(".slider-frame img");
    if (!frames.length) return;
    var index = 0;
    var active = slider.querySelector(".slider-frame img.is-active");
    if (!active) frames[0].classList.add("is-active");
    if (reduce) slider.classList.add("is-swap");
    else slider.classList.add("is-ready");

    function show(next) {
      index = (next + frames.length) % frames.length;
      frames.forEach(function (img, i) {
        img.classList.toggle("is-active", i === index);
      });
    }

    var prev = slider.querySelector("[data-prev]");
    var nextBtn = slider.querySelector("[data-next]");
    if (prev) prev.addEventListener("click", function () { show(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { show(index + 1); });

    if (!reduce && frames.length > 1) {
      var timer;
      function startAuto() {
        clearInterval(timer);
        timer = setInterval(function () { show(index + 1); }, 6500);
      }
      slider.addEventListener("mouseenter", function () { clearInterval(timer); });
      slider.addEventListener("mouseleave", startAuto);
      slider.addEventListener("focusin", function () { clearInterval(timer); });
      slider.addEventListener("focusout", startAuto);
      startAuto();
    }
  });

  var lightbox = document.querySelector(".lightbox");
  var lightboxImg = lightbox ? lightbox.querySelector("img") : null;
  var galleryLinks = [];
  var galleryIndex = 0;

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;
    galleryIndex = index;
    var link = galleryLinks[galleryIndex];
    if (!reduce) lightboxImg.style.opacity = "0";
    var paint = function () {
      lightboxImg.src = link.getAttribute("href");
      lightboxImg.alt = link.querySelector("img") ? link.querySelector("img").alt : "";
      if (!reduce) {
        window.requestAnimationFrame(function () { lightboxImg.style.opacity = "1"; });
      } else {
        lightboxImg.style.opacity = "1";
      }
    };
    paint();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  document.querySelectorAll(".gallery a").forEach(function (link) {
    galleryLinks.push(link);
    var index = galleryLinks.length - 1;
    link.addEventListener("click", function (event) {
      event.preventDefault();
      openLightbox(index);
    });
  });

  if (lightbox) {
    lightbox.querySelector(".lb-close").addEventListener("click", closeLightbox);
    lightbox.querySelector("[data-lb-prev]").addEventListener("click", function () {
      if (!galleryLinks.length) return;
      openLightbox((galleryIndex - 1 + galleryLinks.length) % galleryLinks.length);
    });
    lightbox.querySelector("[data-lb-next]").addEventListener("click", function () {
      if (!galleryLinks.length) return;
      openLightbox((galleryIndex + 1) % galleryLinks.length);
    });
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
  }

  document.querySelectorAll("form.demo-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      var status = form.querySelector(".form-status");
      if (status) {
        status.hidden = false;
        status.textContent = "This is a demo form. Nothing was sent.";
      }
    });
  });
})();
