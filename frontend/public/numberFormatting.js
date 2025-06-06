// Number formatting utilities
const formatNumber = (number) => {
  if (!number) return "";
  return new Intl.NumberFormat("en-US").format(number); // Format with commas
};

const unformatNumber = (formattedString) => {
  if (!formattedString) return "";
  return parseFloat(formattedString.replace(/,/g, "")); // Remove commas and parse
};

// Input and output fields configuration
const fields = [
  { id: "size", max: 99999 },
  { id: "purchasePrice", max: 99999999 },
  { id: "rentPerM2", max: 99999 },
  { id: "hoa", max: 99999 },
  { id: "equity", max: 9999999 },
  { id: "output-qmPreis", max: 99999 },
  { id: "output-annualRent", max: 9999999 },
  { id: "output-effPurchasePrice", max: 99999999 },
  { id: "output-addCosts", max: 999999 },
  { id: "output-loanPayment", max: 999999 },
  { id: "output-renoCost", max: 99999999 },
];

export function initNumberFormatting() {
  fields.forEach(({ id, max }) => {
    const element = document.getElementById(id);
    if (!element) return;

    // Create an error message container
    let errorMessage = document.createElement("span");
    errorMessage.className = "error-message";
    errorMessage.style.color = "red";
    errorMessage.style.fontSize = "0.9em";
    errorMessage.style.display = "none";
    element.parentNode.appendChild(errorMessage);

    // Function to validate and format input
    const validateAndFormat = (e) => {
      const rawValue = unformatNumber(
        e.target.dataset.rawValue || e.target.value
      );
      if (isNaN(rawValue)) {
        errorMessage.textContent = "Bitte geben Sie eine gültige Zahl ein.";
        errorMessage.style.display = "block";
        e.target.setCustomValidity("Ungültige Eingabe.");
        return;
      }

      if (rawValue > max) {
        errorMessage.textContent = `Maximal erlaubter Wert: ${formatNumber(
          max
        )}`;
        errorMessage.style.display = "block";
        e.target.setCustomValidity(
          `Wert darf nicht größer als ${formatNumber(max)} sein.`
        );
        return;
      }

      errorMessage.style.display = "none";
      e.target.setCustomValidity("");
      e.target.dataset.rawValue = rawValue; // Store raw value
      e.target.value = formatNumber(rawValue); // Display formatted value
    };

    // Handle input events
    element.addEventListener("input", (e) => {
      const rawValue = unformatNumber(e.target.value);
      if (!isNaN(rawValue) && rawValue <= max) {
        e.target.dataset.rawValue = rawValue; // Store raw value
        e.target.value = rawValue; // Show raw value while typing
      }
    });

    // Handle focus (show raw value)
    element.addEventListener("focus", (e) => {
      const rawValue = e.target.dataset.rawValue;
      if (rawValue) {
        e.target.value = rawValue; // Show unformatted value on focus
      }
    });

    // Handle blur (validate and format)
    element.addEventListener("blur", validateAndFormat);

    // Initial format if the field has a value
    if (element.value) {
      element.dataset.rawValue = unformatNumber(element.value);
      element.value = formatNumber(element.dataset.rawValue);
    }
  });
}

// Export utilities for use in other modules
export { formatNumber, unformatNumber };
