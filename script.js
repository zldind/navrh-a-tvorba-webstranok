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
  const divider = comparison.querySelector(".compare-divider");
  let activePointerId = null;

  function setPosition(clientX) {
    const bounds = comparison.getBoundingClientRect();
    const position = Math.min(100, Math.max(0, ((clientX - bounds.left) / bounds.width) * 100));
    const roundedPosition = Math.round(position);

    comparison.style.setProperty("--compare-position", `${position}%`);
    divider.setAttribute("aria-valuenow", String(roundedPosition));
    divider.setAttribute("aria-valuetext", `Pred a po, ${roundedPosition} %`);
  }

  divider.setAttribute("role", "slider");
  divider.setAttribute("tabindex", "0");
  divider.removeAttribute("aria-hidden");
  divider.setAttribute("aria-label", "Posúvač porovnania Pred a Po");
  divider.setAttribute("aria-orientation", "horizontal");
  divider.setAttribute("aria-valuemin", "0");
  divider.setAttribute("aria-valuemax", "100");
  divider.setAttribute("aria-valuenow", "50");
  divider.setAttribute("aria-valuetext", "Pred a po, 50 %");
  comparison.style.setProperty("--compare-position", "50%");

  divider.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType === "mouse") return;
    event.preventDefault();
    activePointerId = event.pointerId;
    divider.setPointerCapture(event.pointerId);
    setPosition(event.clientX);
  });

  divider.addEventListener("pointermove", (event) => {
    if (event.pointerId === activePointerId) setPosition(event.clientX);
  });

  function stopDragging(event) {
    if (event.pointerId !== activePointerId) return;
    activePointerId = null;
    if (divider.hasPointerCapture(event.pointerId)) {
      divider.releasePointerCapture(event.pointerId);
    }
  }

  divider.addEventListener("pointerup", stopDragging);
  divider.addEventListener("pointercancel", stopDragging);
  divider.addEventListener("lostpointercapture", () => {
    activePointerId = null;
  });

  divider.addEventListener("keydown", (event) => {
    const currentPosition = Number(divider.getAttribute("aria-valuenow"));
    const step = event.shiftKey ? 10 : 1;
    let nextPosition;

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowDown":
        nextPosition = currentPosition - step;
        break;
      case "ArrowRight":
      case "ArrowUp":
        nextPosition = currentPosition + step;
        break;
      case "Home":
        nextPosition = 0;
        break;
      case "End":
        nextPosition = 100;
        break;
      default:
        return;
    }

    event.preventDefault();
    const bounds = comparison.getBoundingClientRect();
    setPosition(bounds.left + (Math.min(100, Math.max(0, nextPosition)) / 100) * bounds.width);
  });
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
