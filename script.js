document.documentElement.classList.add("js");

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");

function closeMenu() {
  menuToggle.setAttribute("aria-expanded", "false");
  mainNav.classList.remove("is-open");
}

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  mainNav.classList.toggle("is-open", !isExpanded);
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

document.querySelectorAll(".filter-button").forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    document.querySelectorAll(".filter-button").forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });

    document.querySelectorAll(".work-card").forEach((card) => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll(".work-image").forEach((comparison) => {
  const range = comparison.querySelector(".compare-range");

  function updateComparison() {
    comparison.style.setProperty("--compare-position", `${range.value}%`);
  }

  range.addEventListener("input", updateComparison);
  updateComparison();
});

const photosInput = document.querySelector("#photos");
const fileList = document.querySelector("#file-list");
const formFeedback = document.querySelector("#form-feedback");

photosInput.addEventListener("change", () => {
  const files = Array.from(photosInput.files);
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  const invalidFile = files.find((file) => !allowedTypes.includes(file.type));
  const oversizedFile = files.find((file) => file.size > 10 * 1024 * 1024);

  if (files.length > 3 || invalidFile || oversizedFile) {
    photosInput.value = "";
    fileList.textContent = files.length > 3
      ? "Vyberte najviac 3 fotografie."
      : invalidFile
        ? "Použite súbory JPG, PNG alebo WebP."
        : "Každá fotografia môže mať najviac 10 MB.";
    fileList.classList.add("has-error");
    return;
  }

  fileList.classList.remove("has-error");
  fileList.textContent = files.length
    ? files.map((file) => file.name).join(" · ")
    : "Bez fotografií";
  formFeedback.textContent = "";
});

document.querySelectorAll("[data-request]").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelector("#request-type").value = link.dataset.request;
  });
});

document.querySelector("#quote-form").addEventListener("submit", (event) => {
  event.preventDefault();
  formFeedback.textContent = "Údaje sú skontrolované, ale zatiaľ sa nikam neposielajú. Na odosielanie treba formulár napojiť na e-mail alebo formulárovú službu.";
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
