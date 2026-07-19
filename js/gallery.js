(function () {
  const galleryEl = document.getElementById("gallery");
  const filtersEl = document.getElementById("filters");
  const lightbox = document.getElementById("lightbox");
  const lightboxBody = document.getElementById("lightbox-body");

  let activeFilter = "all";
  let currentList = [];
  let currentIndex = 0;

  function sortedArtworks() {
    return [...ARTWORKS].sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  function uniqueAges() {
    const ages = [...new Set(ARTWORKS.map((a) => a.age))];
    return ages.sort((a, b) => a - b);
  }

  function buildFilters() {
    const ages = uniqueAges();
    const buttons = [{ label: "All", value: "all" }].concat(
      ages.map((age) => ({ label: `Age ${age}`, value: String(age) }))
    );

    filtersEl.innerHTML = "";
    buttons.forEach((btn) => {
      const el = document.createElement("button");
      el.className = "filter-btn" + (btn.value === activeFilter ? " active" : "");
      el.textContent = btn.label;
      el.addEventListener("click", () => {
        activeFilter = btn.value;
        buildFilters();
        renderGallery();
      });
      filtersEl.appendChild(el);
    });
  }

  function thumbHtml(art, isLightbox) {
    if (art.image) {
      const cls = isLightbox ? "" : "thumb";
      return `<img class="${cls}" src="${art.image}" alt="${escapeHtml(art.title)}">`;
    }
    const cls = "thumb placeholder";
    return `<div class="${cls}" style="background:${art.placeholderColor || "#ccc"}">${escapeHtml(art.title)}</div>`;
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { year: "numeric", month: "short" });
  }

  function renderGallery() {
    const all = sortedArtworks();
    currentList = activeFilter === "all" ? all : all.filter((a) => String(a.age) === activeFilter);

    galleryEl.innerHTML = "";

    if (currentList.length === 0) {
      galleryEl.innerHTML = `<p class="empty-state">No artwork here yet — add some in js/artworks-data.js!</p>`;
      return;
    }

    currentList.forEach((art, index) => {
      const card = document.createElement("div");
      card.className = "art-card";
      card.innerHTML = `
        ${thumbHtml(art, false)}
        <h3>${escapeHtml(art.title)}</h3>
        <div class="meta">
          <span>${formatDate(art.date)}</span>
          <span class="age-badge">Age ${art.age}</span>
        </div>
      `;
      card.addEventListener("click", () => openLightbox(index));
      galleryEl.appendChild(card);
    });
  }

  function openLightbox(index) {
    currentIndex = index;
    renderLightbox();
    lightbox.classList.add("open");
  }

  function renderLightbox() {
    const art = currentList[currentIndex];
    lightboxBody.innerHTML = `
      <button class="lightbox-close" aria-label="Close">&times;</button>
      <button class="lightbox-nav prev" aria-label="Previous">&larr;</button>
      <button class="lightbox-nav next" aria-label="Next">&rarr;</button>
      ${thumbHtml(art, true)}
      <h3 class="lightbox-title">${escapeHtml(art.title)}</h3>
      <div class="meta">
        <span>${formatDate(art.date)} &middot; ${escapeHtml(art.medium || "")}</span>
        <span class="age-badge">Age ${art.age}</span>
      </div>
      <p class="lightbox-desc">${escapeHtml(art.description || "")}</p>
    `;
    lightboxBody.querySelector(".lightbox-close").addEventListener("click", closeLightbox);
    lightboxBody.querySelector(".lightbox-nav.prev").addEventListener("click", () => navigate(-1));
    lightboxBody.querySelector(".lightbox-nav.next").addEventListener("click", () => navigate(1));
  }

  function navigate(delta) {
    currentIndex = (currentIndex + delta + currentList.length) % currentList.length;
    renderLightbox();
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
  }

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") navigate(-1);
    if (e.key === "ArrowRight") navigate(1);
  });

  buildFilters();
  renderGallery();
})();
