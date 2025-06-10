export function initProgressBar() {
  // DOM elements
  const container = document.getElementById("progress-bar-container");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

  // Field weights (6.66% each for 15 fields)
  const FIELD_WEIGHT = 6.66;

  // Section bonus values
  const SECTION_BONUSES = {
    "section-inseratsdaten": 20,
    "section-immobiliendaten": 40,
    "section-finanzierung": 20,
    "section-gebaeude": 20,
  };

  // Field mapping
  const SECTION_FIELDS = {
    "section-inseratsdaten": ["listingUrl", "propertyType", "agentType"],
    "section-immobiliendaten": [
      "size",
      "rooms",
      "purchasePrice",
      "rentPerM2",
      "hoa",
      "location",
    ],
    "section-finanzierung": ["equity", "interestRate", "repaymentRate"],
    "section-gebaeude": ["yearBuilt", "energyClass", "condition"],
  };

  let isActive = false;

  function checkField(id) {
    const field = document.getElementById(id);
    if (!field) return false;
    return field.value && field.value.trim() !== "";
  }

  function isSectionComplete(sectionId) {
    return SECTION_FIELDS[sectionId].every(checkField);
  }

  function calculateProgress() {
    // Calculate base progress (6.66% per field)
    const filledFields = Object.values(SECTION_FIELDS)
      .flat()
      .filter(checkField).length;

    let progress = filledFields * FIELD_WEIGHT;

    // Add section bonuses
    Object.keys(SECTION_BONUSES).forEach((sectionId) => {
      if (isSectionComplete(sectionId)) {
        progress += SECTION_BONUSES[sectionId];
      }
    });

    return Math.min(Math.round(progress), 100);
  }

  function updateProgress() {
    const progress = calculateProgress();
    const header = document.querySelector(".site-header");

    // Get progress bar element
    const progressBar = document.getElementById("progress-bar");

    // Set color based on progress percentage
    if (progress <= 30) {
      progressBar.style.background = "var(--progress-one)";
    } else if (progress <= 60) {
      progressBar.style.background = "var(--progress-two)";
    } else {
      progressBar.style.background = "var(--progress-three)";
    }

    // Update width and text
    progressBar.style.width = `${progress}%`;
    text.textContent = `${progress}%`;

    // Show/hide progress bar
    if (progress > 0 && !isActive) {
      container.classList.add("active");
      header.classList.add("progress-active");
      isActive = true;
    } else if (progress === 0) {
      container.classList.remove("active");
      header.classList.remove("progress-active");
      isActive = false;
    }
  }

  // Add listeners to all form fields
  Object.values(SECTION_FIELDS)
    .flat()
    .forEach((id) => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener("input", updateProgress);
        field.addEventListener("change", updateProgress);
      }
    });

  // Initial update
  updateProgress();
}
