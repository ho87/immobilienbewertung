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

  console.log("Validation module initialized");
}
