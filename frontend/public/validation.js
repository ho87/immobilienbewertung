export function initValidation() {
  // List of all input fields with data-max to validate
  const inputSelectors = [
    { id: "size", min: 1 },
    { id: "purchasePrice", min: 1 },
    { id: "rentPerM2", min: 0.01 },
    { id: "hoa", min: 1 },
    { id: "equity", min: 1 },
    { id: "interestRate", min: 0.01 },
    { id: "repaymentRate", min: 0.01 },
  ];

  inputSelectors.forEach(({ id, min }) => {
    const input = document.getElementById(id);
    const warning = document.getElementById("warn-" + id);
    if (!input || !warning) return;

    const validateInput = (e) => {
      // Remove formatting (commas, dots) for parsing
      const rawValue = e.target.value.replace(/[.,]/g, "").replace(",", ".");
      const value = parseFloat(rawValue);
      const maxAttr = input.getAttribute("data-max");
      const max = maxAttr ? parseFloat(maxAttr) : undefined;

      if (isNaN(value)) {
        warning.textContent = "Bitte geben Sie eine gültige Zahl ein";
        warning.style.display = "block";
        e.target.setCustomValidity("Bitte geben Sie eine gültige Zahl ein");
      } else if (typeof max !== "undefined" && value > max) {
        warning.textContent = `Maximal erlaubt: ${max}`;
        warning.style.display = "block";
        e.target.setCustomValidity(
          `Bitte geben Sie einen Wert kleiner oder gleich ${max} ein`
        );
      } else if (typeof min !== "undefined" && value < min) {
        warning.textContent = `Bitte geben Sie einen Wert größer oder gleich ${min} ein`;
        warning.style.display = "block";
        e.target.setCustomValidity(`Der Wert muss mindestens ${min} sein`);
      } else {
        warning.textContent = "";
        warning.style.display = "none";
        e.target.setCustomValidity("");
      }
    };

    input.addEventListener("input", validateInput);
    input.addEventListener("change", validateInput);
    input.addEventListener("blur", validateInput);
  });

  // Add estimation handlers for ? inputs
  const estimationFields = [
    {
      id: "hoa",
      estimator: () => {
        const size = parseFloat(document.getElementById("size").value) || 0;
        return size * 3.5;
      },
      defaultVal: 0,
    },
    {
      id: "rentPerM2",
      estimator: () => 9,
      defaultVal: 9,
    },
    {
      id: "interestRate",
      estimator: () => 3.5,
      defaultVal: 3.5,
    },
    {
      id: "repaymentRate",
      estimator: () => 2,
      defaultVal: 2,
    },
  ];

  // Handle "?" inputs for text fields
  estimationFields.forEach(({ id, estimator, defaultVal }) => {
    const input = document.getElementById(id);
    if (!input) return;

    input.addEventListener("input", (e) => {
      if (e.target.value === "?") {
        const estimatedValue = estimator();
        if (estimatedValue || estimatedValue === 0) {
          e.target.value = estimatedValue.toString();
          // Trigger validation
          input.dispatchEvent(new Event("change"));
        }
      }
    });
  });

  // Handle "?" for energy class select
  const energyClass = document.getElementById("energyClass");
  if (energyClass) {
    energyClass.addEventListener("change", (e) => {
      if (e.target.value === "?") {
        e.target.value = "d"; // Set to "D" class
        energyClass.dispatchEvent(new Event("change"));
      }
    });

    // Add "?" option to energy class select if not present
    if (!Array.from(energyClass.options).some((opt) => opt.value === "?")) {
      const questionOption = document.createElement("option");
      questionOption.value = "?";
      questionOption.textContent = "?";
      // Insert after the first option (usually "Bitte auswählen")
      energyClass.insertBefore(questionOption, energyClass.options[1]);
    }
  }

  // Update the validation function to handle estimated values
  inputSelectors.forEach(({ id, min }) => {
    const input = document.getElementById(id);
    const warning = document.getElementById("warn-" + id);
    if (!input || !warning) return;

    const validateInput = (e) => {
      // Skip validation if the input is "?"
      if (e.target.value === "?") {
        warning.style.display = "none";
        e.target.setCustomValidity("");
        return;
      }

      // Remove formatting (commas, dots) for parsing
      const rawValue = e.target.value.replace(/[.,]/g, "").replace(",", ".");
      const value = parseFloat(rawValue);
      const maxAttr = input.getAttribute("data-max");
      const max = maxAttr ? parseFloat(maxAttr) : undefined;

      if (isNaN(value)) {
        warning.textContent = "Bitte geben Sie eine gültige Zahl ein";
        warning.style.display = "block";
        e.target.setCustomValidity("Bitte geben Sie eine gültige Zahl ein");
      } else if (typeof max !== "undefined" && value > max) {
        warning.textContent = `Maximal erlaubt: ${max}`;
        warning.style.display = "block";
        e.target.setCustomValidity(
          `Bitte geben Sie einen Wert kleiner oder gleich ${max} ein`
        );
      } else if (typeof min !== "undefined" && value < min) {
        warning.textContent = `Bitte geben Sie einen Wert größer oder gleich ${min} ein`;
        warning.style.display = "block";
        e.target.setCustomValidity(`Der Wert muss mindestens ${min} sein`);
      } else {
        warning.textContent = "";
        warning.style.display = "none";
        e.target.setCustomValidity("");
      }
    };

    input.addEventListener("input", validateInput);
    input.addEventListener("change", validateInput);
    input.addEventListener("blur", validateInput);
  });

  console.log("Validation module initialized with estimation handlers");
}
