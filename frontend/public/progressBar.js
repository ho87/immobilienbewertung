export function initProgressBar() {
  // Constants for progress calculation
  const TOTAL_FIELDS = 15;  // Total number of form fields
  const PERCENT_PER_FIELD = (100 / TOTAL_FIELDS); // ~6.66%
  const DECIMAL_PLACES = 1;
  const DECIMAL_MULTIPLIER = 10 ** DECIMAL_PLACES;
  const MAX_PROGRESS = 100;
  const ALMOST_COMPLETE = 99.9;

  // Progress thresholds for colors
  const PROGRESS_THRESHOLD_1 = 30;
  const PROGRESS_THRESHOLD_2 = 60;

  // DOM elements
  const container = document.getElementById("progress-bar-container");
  const bar = document.getElementById("progress-bar");
  const text = document.getElementById("progress-text");

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
  let hideTimeout = null;

  function checkField(id) {
    const field = document.getElementById(id);
    if (!field) return false;
    return field.value && field.value.trim() !== "";
  }

  function calculateProgress() {
    // Define required fields
    const REQUIRED_FIELDS = [
      "propertyType",      // Required
      "size",             // Required
      "purchasePrice",    // Required
      "equity",           // Required
      "interestRate",     // Required
      "repaymentRate",    // Required
      "yearBuilt"         // Required
    ];

    // Count total filled fields
    const filledFields = Object.values(SECTION_FIELDS)
      .flat()
      .filter(checkField)
      .length;

    // Calculate base progress
    let progress = filledFields * PERCENT_PER_FIELD;

    // Check if all fields are filled
    const allFieldsFilled = Object.values(SECTION_FIELDS)
      .flat()
      .every(checkField);

    if (allFieldsFilled) {
      // Set to exactly 100% when all fields are filled
      progress = MAX_PROGRESS;
    } else {
      // Cap at 99.9% if not all fields are filled
      progress = Math.min(progress, ALMOST_COMPLETE);
    }

    // Round to one decimal place
    return Math.round(progress * DECIMAL_MULTIPLIER) / DECIMAL_MULTIPLIER;
  }

  function getActiveSection(event) {
    if (!event || !event.target) return null;
    
    // Find which section contains the active element
    const activeElement = event.target;
    return Object.keys(SECTION_FIELDS).find(sectionId => {
      const section = document.getElementById(sectionId);
      return section && section.contains(activeElement);
    });
  }

  function updateProgressBarPosition(activeSection) {
    if (!activeSection) return;

    const section = document.getElementById(activeSection);
    if (!section) return;

    // Get section's position and dimensions
    const sectionRect = section.getBoundingClientRect();
    
    // Position the progress bar at the bottom of the section
    container.style.position = 'fixed';
    container.style.top = `${sectionRect.bottom}px`;
    container.style.width = `${sectionRect.width}px`;
    container.style.left = `${sectionRect.left}px`;
  }

  // Add marker constants
  const MARKER_POSITIONS = [33, 66];
  
  // Create markers in container
  function createMarkers() {
    MARKER_POSITIONS.forEach(position => {
      const marker = document.createElement('div');
      marker.className = `progress-marker progress-marker-${position}`;
      container.appendChild(marker);
    });
  }

  function updateMarkers(progress) {
    const markers = container.querySelectorAll('.progress-marker');
    markers.forEach(marker => {
      const position = parseInt(marker.className.match(/\d+/)[0]);
      // Activate marker when progress is within 5% of marker position
      if (Math.abs(progress - position) <= 5) {
        marker.classList.add('active');
      } else {
        marker.classList.remove('active');
      }
    });
  }

  function updateProgress(event = null) {
    const progress = calculateProgress();
    let progressColor;

    // Clear any existing timeout when progress changes
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }

    // Set color based on progress thresholds
    if (progress <= PROGRESS_THRESHOLD_1) {
      progressColor = 'var(--progress-one)';
    } else if (progress <= PROGRESS_THRESHOLD_2) {
      progressColor = 'var(--progress-two)';
    } else {
      progressColor = 'var(--progress-three)';
    }

    // Apply colors and update markers
    bar.style.background = progressColor;
    container.style.borderColor = progressColor;
    updateMarkers(progress);

    // Update width and text
    bar.style.width = `${progress}%`;
    text.textContent = `${progress}%`;

    // Show/hide progress bar
    if (progress > 0 && !isActive) {
      container.classList.add("active");
      isActive = true;
    } else if (progress === 0) {
      container.classList.remove("active");
      isActive = false;
    }

    // Hide progress bar after 5 seconds when reaching 100%
    if (progress === MAX_PROGRESS) {
      hideTimeout = setTimeout(() => {
        container.classList.remove("active");
        isActive = false;
        hideTimeout = null;
      }, 5000);
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

  function findActiveSection() {
    const activeElement = document.activeElement;
    return Object.keys(SECTION_FIELDS).find(sectionId => {
      const section = document.getElementById(sectionId);
      return section && section.contains(activeElement);
    });
  }

  // Add scroll event listener to update position when scrolling
  window.addEventListener('scroll', () => {
    const activeSection = findActiveSection();
    if (activeSection) {
      updateProgressBarPosition(activeSection);
    }
  });

  // Add resize listener to handle window resizing
  window.addEventListener('resize', () => {
    const activeSection = findActiveSection();
    if (activeSection) {
      updateProgressBarPosition(activeSection);
    }
  });

  // Initialize markers
  createMarkers();

  // Initial update
  updateProgress();
}
